/// <mls shortName="libCompile" project="100554" enhancement="_blank" />

// typescript new file

export const getDependenciesByHtml = (mfile: mls.l2.editor.IMFile, html: string, withCss: boolean = false): Promise<IJSONDependence> => {
    return new Promise<IJSONDependence>(async (resolve, reject) => {
        try {
            resolve(await getDependencies(mfile, 'byHtml', html, withCss))
        } catch (e) {
            reject(e);
        }
    });
}

export const getDependenciesByMFile = (mfile: mls.l2.editor.IMFile, withCss: boolean = false): Promise<IJSONDependence> => {
    return new Promise<IJSONDependence>(async (resolve, reject) => {
        try {
            if (mfile.storFile.extension !== '.ts') throw new Error('Only myfile .ts');
            const tag = convertFileNameToTag(`_${mfile.storFile.project}_${mfile.storFile.shortName}`);
            resolve(await getDependencies(mfile, tag, `<${tag}></${tag}>`, withCss))
        } catch (e) {
            reject(e);
        }
    });
}

async function getTagsInTypescript(mfile: mls.l2.editor.IMFile, tags: string[]): Promise<string[]> {
    const tagsInTypescript = getAllWebComponentsInSource(mfile.model.getValue());
    for (const tagTs of tagsInTypescript) {
        if (!tags.includes(tagTs)) {
            const fileName = convertTagToFileName(tagTs);
            const mfile = mls.l2.editor.mfiles[fileName];
            if (mfile) {
                await getTagsInTypescript(mfile, tags);
                tags.push(tagTs);
            }
        }
    }
    return tags;
}

async function getDependencies(mfile: mls.l2.editor.IMFile, filename: string, html: string, withCss: boolean = false) {

    const myImportsMap: string[] = [];
    const myImports: string[] = [];
    const myCss: string[] = [];
    let myTokens: string[] = [];
    const myErrors: { tag: string, error: string }[] = [];
    const myModules = {};
    let tags = extrairTagsCustomizadas(html);

    const tag = convertFileNameToTag(`_${mfile.storFile.project}_${mfile.storFile.shortName}`);
    if (!tags.includes(tag)) tags.push(tag);

    tags = await getTagsInTypescript(mfile, tags)

    await loadMyNeedsToCompile(
        tags,
        myImportsMap,
        myImports,
        myCss,
        myTokens,
        myErrors,
        myModules,
        withCss
    );

    return {
        file: filename,
        wcComponents: tags,
        importsMap: myImportsMap,
        importsJs: myImports,
        css: myCss,
        tokens: myTokens,
        errors: myErrors
    }
}

function extrairTagsCustomizadas(html: string): string[] {

    const regex = /<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi;
    const customTags: string[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        const tag: string = match[1];
        if (tag.indexOf('-') >= 0
            && !customTags.includes(tag)
            && !['mls-showexamplecode-100529', 'mls-usecaseadd-100529', 'mls-head'].includes(tag.replace('<', '').replace('>', ''))) {
            customTags.push(tag.replace('<', '').replace('>', ''));
        }
    }
    return customTags;

}

async function loadMyNeedsToCompile(
    tags: string[],
    myImportsMap: string[],
    myImports: string[],
    myCss: string[],
    myTokens: string[],
    myErrors: { tag: string, error: string }[],
    myModules: any,
    compileCss: boolean) {

    try {

        if (tags.length <= 0) return;
        const name = convertTagToFileName(tags[0]);

        mls.actual[0].setFullName(name);
        const { project, path } = mls.actual[0];
        if (!project || !path) return;
        const mfile = mls.l2.editor.get({ project, shortName: path });
        if (!mfile) throw new Error('not found');

        if (!mfile.compilerResults || !mfile.compilerResults.prodJS || !(mfile.compilerResults as any).tripleSlashMLS) {

            if (mfile.compilerResults) mfile.compilerResults.modelNeedCompile = true;
            await mls.l2.editor.getCompilerResultTS(mfile, true);

        }

        const enhacementName = (mfile.compilerResults as any).tripleSlashMLS.variables.enhancement;
        if (!enhacementName) throw new Error('enhacementName not valid');


        if (!myModules[enhacementName]) {

            const mModule = await mls.l2.enhancement.getEnhancementInstance(mfile);
            myModules[enhacementName] = {
                jsMap: false,
                mModule
            };

        }

        tags = await addRequeries(enhacementName, mfile, tags, myModules);
        await getJSImporMap(myImportsMap, enhacementName, mfile, myModules);
        await getJS(myImports, enhacementName, mfile, myModules);
        if (compileCss) {
            await getCss(myCss, name, mfile);
        }
        await getTokens(myTokens, mfile);


    } catch (e: any) {

        if (tags.length <= 0) return;
        myErrors.push({ tag: tags[0], error: e.message })

    } finally {

        tags.shift();
        if (tags.length > 0) {
            await loadMyNeedsToCompile(
                tags,
                myImportsMap,
                myImports,
                myCss,
                myTokens,
                myErrors,
                myModules,
                compileCss
            );
        }

    }

}

async function addRequeries(enhacementName: string, mfile: mls.l2.editor.IMFile, array: string[], myModules: any) {

    if (!myModules[enhacementName]) {
        throw new Error('Enhacement not found ');
    }

    if (!myModules[enhacementName].mModule || !myModules[enhacementName].mModule.getDesignDetails) return array;

    const obj = await myModules[enhacementName].mModule.getDesignDetails(mfile);
    if (!obj || !obj.webComponentDependencies) return array;

    for (let i of obj.webComponentDependencies) {

        const tag = convertFileNameToTag(i);
        if (!array.includes(tag)) {
            array.push(tag);
        }

    }

    return array;

}

async function getJSImporMap(myImportsMap: string[], enhacementName: string, mfile: mls.l2.editor.IMFile, myModules: any) {

    if (!myModules[enhacementName]) {
        throw new Error('Enhacement not found ');
    }

    if (myModules[enhacementName].jsMap) return;

    myModules[enhacementName].jsMap = true;
    const mmodule = myModules[enhacementName].mModule as mls.l2.enhancement.IEnhancementInstance;

    if (!mmodule || !mmodule.requires) return;

    const aRequire = mmodule.requires;

    aRequire.forEach((i) => {

        if (i.type !== 'cdn') return;

        myImportsMap.push(`"${i.name}": "${i.ref}"`);

    });

}

async function getJS(myImports: string[], enhacementName: string, mfile: mls.l2.editor.IMFile, myModules: any) {

    if (!myModules[enhacementName]) {
        throw new Error('Enhacement not found ');
    }

    if (mfile.compilerResults && mfile.compilerResults.imports && mfile.compilerResults.imports.length > 0) {

        mfile.compilerResults.imports.forEach((n: string) => {

            const name = n.replace('./', '/');
            if (!myImports.includes(name) && n.startsWith('./')) {
                myImports.push(name);

            }
            //myImports = verifyMyImportsNeedImport(myImports, name);

        });

    }

    if (myImports.includes(`/_${mfile.project}_${mfile.shortName}`)) return;

    myImports.push(`/_${mfile.project}_${mfile.shortName}`);

}

function verifyMyImportsNeedImport(myImports: string[], name: string): string[] {

    name = name.replace('.', '').replace('/', '');
    const { project, path } = mls.actual[0].setFullName(name);
    const key = mls.l2.editor.getKey({ project: project as number, shortName: path as string });

    const mfile = mls.l2.editor.mfiles[key];
    if (!mfile) return myImports;

    if (mfile.compilerResults && mfile.compilerResults.imports && mfile.compilerResults.imports.length > 0) {

        mfile.compilerResults.imports.forEach((n: string) => {

            const name = n.replace('./', '/');
            if (!myImports.includes(name) && n.startsWith('./')) {
                myImports.push(name);
            }


        });

    }

    return myImports;

};

async function getCss(myCss: string[], fullName: string, mfile: mls.l2.editor.IMFile) {

    try {

        const dsindex = mls.actual[3].mode ? mls.actual[3].mode : 0;
        const ds = mls.l3.getDSInstance(mfile.project, dsindex);
        if (!ds) return;
        const css = await ds.components.getCSS(fullName)
        myCss.push(css);

    } catch (e: any) {

        if (e.message.indexOf('dont exists') < 0) throw new Error(e.message);

    }


}

async function getTokens(myTokens: string[], mfile: mls.l2.editor.IMFile) {
    try {
        const dsindex = mls.actual[3].mode ? mls.actual[3].mode : 0;
        const ds = mls.l3.getDSInstance(mfile.project, dsindex);
        if (!ds) return;
        const tokens = await (ds.tokens as any)['getTokensCss']();
        myTokens.push(tokens);
    } catch (e: any) {

        if (e.message.indexOf('dont exists') < 0) throw new Error(e.message);

    }
}

function getAllWebComponentsInSource(source: string): string[] {
    const regex = /<([a-z0-9]+-[a-z0-9-]*)(?=\s|>|\/|$)/g;
    const matches = source.match(regex) || [];
    const componentNames = matches.map(tag => tag.slice(1));
    return [...new Set(componentNames)];
}

function convertFileNameToTag(widget: string) {
    const regex = /_([0-9]+)_?(.*)/;
    const match = widget.match(regex);
    if (match) {
        const [, number, rest] = match;
        const convertedSrc = rest.replace(/([A-Z])/g, '-$1').toLowerCase();
        widget = `${convertedSrc}-${number}`;
    }
    return widget;
}

function convertTagToFileName(tag: string) {
    const regex = /(.+)-(\d+)/;
    const match = tag.match(regex);
    if (match) {
        const [, rest, number] = match;
        const convertedSrc = rest.replace(/-(.)/g, (_, letter) => letter.toUpperCase());
        tag = `_${number}_${convertedSrc}`;
    }
    return tag;
}

export interface IJSONDependence {
    file: string,
    wcComponents: string[],
    importsMap: string[],
    importsJs: string[],
    css: string[],
    tokens: string[],
    errors: { tag: string, error: string }[]
}
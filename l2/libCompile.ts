/// <mls shortName="libCompile" project="100554" enhancement="_blank" />

import { getDSInstance } from './_100554_libDesignSystem'
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';

export const getDependenciesByHtml = (models: mls.editor.IModels, html: string, theme: string, withCss: boolean = false): Promise<IJSONDependence> => {
    return new Promise<IJSONDependence>(async (resolve, reject) => {
        try {
            const ret = await getDependencies(models, 'byHtml', html, theme, withCss);
            resolve(ret)
        } catch (e) {
            reject(e);
        }
    });
}

export const getDependenciesByMFile = (models: mls.editor.IModels, withCss: boolean = false): Promise<IJSONDependence> => {
    if (!models.ts) throw new Error('getDependenciesByMFile: Invalid model ts');
    const { project, shortName, extension } = models.ts.storFile;
    return new Promise<IJSONDependence>(async (resolve, reject) => {
        try {
            if (extension !== '.ts') throw new Error('Only myfile .ts');
            const tag = convertFileNameToTag(`_${project}_${shortName}`);
            resolve(await getDependencies(models, tag, `<${tag}></${tag}>`, 'Default', withCss))
        } catch (e) {
            reject(e);
        }
    });
}

async function getTagsInTypescript(modelTS: mls.editor.IModelTS, tags: string[]): Promise<string[]> {
    if (!modelTS.model) throw new Error('getTagsInTypescript: Invalid model ts');
    const tagsInTypescript = getAllWebComponentsInSource(modelTS.model.getValue());
    for (const tagTs of tagsInTypescript) {
        if (!tags.includes(tagTs)) {
            const fileName = convertTagToFileName(tagTs);
            const mmodels = mls.editor.models[fileName];
            if (mmodels && mmodels.ts) {
                await getTagsInTypescript(mmodels.ts, tags);
                tags.push(tagTs);
            }
        }
    }
    return tags;
}

async function getDependencies(models: mls.editor.IModels, filename: string, html: string, theme: string, withCss: boolean = false) {

    if (!models.ts) throw new Error('getDependencies: Invalid model ts');
    const { project, shortName } = models.ts.storFile;

    const myImportsMap: string[] = [];
    const myImports: string[] = [];
    const myCss: string[] = [];
    let myTokens: string[] = [];
    const myErrors: { tag: string, error: string }[] = [];
    const myModules = {};
    let tags = extrairTagsCustomizadas(html);

    const tag = convertFileNameToTag(`_${project}_${shortName}`);
    if (!tags.includes(tag)) tags.push(tag);
    tags = await getTagsInTypescript(models.ts, tags);

    await loadMyNeedsToCompile(
        tags,
        myImportsMap,
        myImports,
        myCss,
        myTokens,
        myErrors,
        myModules,
        withCss,
        theme
    );

    return {
        file: filename,
        wcComponents: tags,
        importsMap: myImportsMap,
        importsJs: myImports,
        css: myCss,
        globalCss: '',
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
    compileCss: boolean,
    theme: string) {

    try {

        if (tags.length <= 0) return;
        const name = convertTagToFileName(tags[0]);
        mls.actual[0].setFullName(name);
        const { project, path } = mls.actual[0];
        if (!project || !path) return;

        const ipath = { project, shortName: path };
        const enhacementName = await getEnhancementFromFetch(ipath);
        if (!enhacementName) throw new Error('enhacementName not valid');
        if (enhacementName === '_blank') return;

        if (!myModules[enhacementName]) {

            mls.actual[0].setFullName(enhacementName);
            const ipathenhacement = { project: mls.actual[0].project || 0, shortName: mls.actual[0].path || '' };

            const mModule = await mls.l2.enhancement.getEnhancementModule(ipathenhacement);

            myModules[enhacementName] = {
                jsMap: false,
                mModule
            };

        }

        await getJSImporMap(myImportsMap, enhacementName, myModules);
        await getJS(myImports, enhacementName, ipath, myModules);
        await getTokens(myTokens, ipath, theme);

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
                compileCss,
                theme
            );
        }

    }

}

function getEnhacementName(file: { project: number, shortName: string }): string {
    const key = mls.l2.getKey({ project: file.project, shortName: file.shortName });
    const mmodel = mls.editor.models[key];
    if (!mmodel || !mmodel.ts) throw new Error('model invalid');
    if (!mmodel.ts.compilerResults) throw new Error('model ts not compiled yet');
    const enhacementName = mmodel.ts.compilerResults.tripleSlashMLS?.variables.enhancement
    if (!enhacementName) throw new Error('enhacementName not valid');
    return enhacementName;
}

async function getEnhancementFromFetch(file: { project: number, shortName: string }) {


    const cacheName = 'mls-v2';
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const url = `/local/_${file.project}_${file.shortName}.js`;

    console.info(`Get cache: ${url}`);

    const match = keys.filter((request) => request.url.includes(url));
    if (!match || match.length === 0) {
        console.info(`Code not found in cache : _${file.project}_${file.shortName}`);
        throw new Error(`Code not found in cache : _${file.project}_${file.shortName}`)
    }

    const response = await cache.match(match[match.length - 1]);
    const txt = await response?.text();
    console.info(`Get cache txt : ${txt}`);

    if (!txt) throw new Error(`Not found tag <mls> in ${url}`);
    const lines = txt.replace(/\r\n/g, '\n').split('\n');
    const mlsLine = lines.find(line => line.trim().startsWith('/// <mls '));

    if (!mlsLine) throw new Error(`Not found tag <mls> in ${url}`);
    const enhancementMatch = mlsLine.match(/enhancement="([^"]+)"/);
    if (!enhancementMatch) throw new Error('Not found attr "enhancement" in ' + url);
    console.info(`enhancementName for url ${url} = ${enhancementMatch[1]}`)
    return enhancementMatch[1];


    // const url = `/_${file.project}_${file.shortName}?t=${Date.now()}`;
    // const response = await fetch(url);
    // if (!response.ok) {
    //     throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    // }
    // const txt = await response.text();
    // const lines = txt.replace(/\r\n/g, '\n').split('\n');
    // const mlsLine = lines.find(line => line.trim().startsWith('/// <mls '));;

    // if (!mlsLine) {
    //     throw new Error(`Not found tag <mls> in ${url}`);
    // }

    // // Regex para capturar o valor do atributo enhancement
    // const enhancementMatch = mlsLine.match(/enhancement="([^"]+)"/);

    // if (!enhancementMatch) {
    //     throw new Error('Not found attr "enhancement" in ' + url);
    // }

    // // Retorna o valor do atributo enhancement
    // return enhancementMatch[1];

}

async function getJSImporMap(myImportsMap: string[], enhacementName: string, myModules: any) {

    if (!myModules[enhacementName]) throw new Error('Enhacement not found ');

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

async function getJS(myImports: string[], enhacementName: string, mfile: mls.cbe.IPath, myModules: any) {
    if (!myModules[enhacementName]) throw new Error('Enhacement not found ');
    if (myImports.includes(`/_${mfile.project}_${mfile.shortName}`)) return;
    myImports.push(`/_${mfile.project}_${mfile.shortName}`);
    const keyTestFile = mls.stor.getKeyToFiles(mfile.project, 2, mfile.shortName, '', '.test.ts');
    const storFileTest = mls.stor.files[keyTestFile];
    if (storFileTest) myImports.push(`/_${mfile.project}_${mfile.shortName}.test.js`);
}


async function getTokens(myTokens: string[], mfile: mls.cbe.IPath, theme: string) {
    try {
        const ds = await getDSInstance(mfile.project, 0);
        if (!ds || !ds.tokens) return;
        const tokens = await ds.tokens.getTokensCss(theme);
        myTokens.push(tokens);
    } catch (e: any) {
        if (e.message.indexOf('dont exists') < 0) throw new Error(e.message);
    }
}

export function getAllWebComponentsInSource(source: string): string[] {
    const regex = /<([a-z0-9]+-[a-z0-9-]*)(?=\s|>|\/|$)/g;
    const matches = source.match(regex) || [];
    const componentNames = matches.map(tag => tag.slice(1));
    return [...new Set(componentNames)];
}


export interface IJSONDependence {
    file: string,
    wcComponents: string[],
    importsMap: string[],
    importsJs: string[],
    css: string[],
    globalCss: string | undefined,
    tokens: string[],
    errors: { tag: string, error: string }[]
}

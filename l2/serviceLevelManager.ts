/// <mls shortName="serviceLevelManager" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

@customElement('service-level-manager-100554')
export class ServiceManager100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }


    public details: IService = {
        icon: '&#xf5b8',
        name: 'Manager',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Manager',
        className: undefined,
        tags: [],
        levels: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {

    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
        },
        icons: {
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: '',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    onServiceClick(visible: boolean, reinit: boolean) {
        if (visible && this.menu.setIconActive) {

        }
    }

    render() {
        return html``;
    }

    //----------- EVENTS-------------

    private setEvents() {

        mls.events.addEventListener(
            [2],
            ['ProjectLoaded'],
            (ev) => this.onProjectLoadedEvents(ev)
        );

    }

    private getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html'): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
    }

    private code = {
        '.ts': 'typescript',
        '.html': 'html',
    }

    private async onProjectLoadedEvents(ev: mls.events.IEvent): Promise<void> {

        try {

            const projectLoadedInfo = JSON.parse(ev.desc as any) as mls.events.IProjectLoaded;
            await this.readAllProjectTypescriptAndCompile(projectLoadedInfo.project, '', projectLoadedInfo.needCompile);

        } catch (e) {
            console.error('Error on serviceSource_onProjectLoadedEvents: ', e);
        }

    }

    private projectsLoaded: number[] = [];
    private async readAllProjectTypescriptAndCompile(project: number, shortName: string, needCompile: boolean = true): Promise<void> {

        // load all typescripts dependencies of project , except shortName
        if (this.projectsLoaded.includes(project)) return;

        if (mls.istrace) console.log('loading files from project ' + project);

        this.projectsLoaded.push(project);

        const promises: Promise<mls.l2.editor.IMFile>[] = [];

        const keys: string[] = Object.keys(mls.stor.files);
        for (const key of keys) {

            const storFile = mls.stor.files[key];
            if (storFile.project === project
                && storFile.level === 2
                && storFile.shortName !== shortName) {
                promises.push(this.createModel(storFile, false, false));
            }
        }

        await Promise.all(promises);

        if (needCompile) await mls.l2.editor.compileAllProjectIfNeed(project, true);
    }

    private async createModel(storFile: mls.stor.IFileInfo, activedModel: boolean, compile: boolean): Promise<mls.l2.editor.IMFile> {

        // load source from repository
        const { project, shortName, extension } = storFile;

        let model1 = mls.l2.editor.get({ project, shortName });
        if (model1) return model1;

        const info: mls.stor.IFileInfoValue | null = storFile.getValueInfo ? await storFile.getValueInfo() : null;

        const haveInfo: boolean = (info && !!info.content) || (info !== null && !!info.content);

        const src: string | Blob | null = haveInfo && info !== null ? info.content : await storFile.getContent();

        if (src instanceof Blob || src === null) throw new Error('ts file must be string');

        const originalCRC = haveInfo && info !== null ? info.originalCRC : mls.common.crc.crc32(src).toString(16);

        const originalProject: number | undefined = haveInfo && info !== null ? info.originalProject : undefined;

        const originalShortName: string | undefined = haveInfo && info !== null ? info.originalShortName : undefined;

        const ftype = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : storFile.extension;

        const uri = this.getUri(`_${project}_${shortName}`, ftype as any);


        const model = monaco.editor.createModel(src, (this.code as any)[storFile.extension], uri);

        model1 = {
            changed: false, // not changed in this section, but storFile.changed is about all sections
            error: false,
            project,
            shortName: storFile.extension !== '.ts' ? shortName + extension : shortName,
            extension,
            model,
            storFile,
            originalCRC,
            originalProject,
            originalShortName,
            codeLens: [],
        };

        mls.l2.editor.add(model1);

        this.addEventsModelTS(storFile, model1);

        if (compile) {
            await this.updateModelStatus(model1, false);
        }

        return model1;
    }

    private addEventsModelTS(storFile: mls.stor.IFileInfo, model1: mls.l2.editor.IMFile): void {

        storFile.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(storFile);

        storFile.getValueInfo = () => this.getValueInfo(model1);

        model1.model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelChange(e, model1, storFile));
    }

    private async afterUpdate(storFile: mls.stor.IFileInfo) {

        let { project, shortName } = storFile;

        shortName = storFile.extension !== '.ts' ? shortName + storFile.extension : shortName;

        if (!project || !shortName) return;

        const mmodel: mls.l2.editor.IMFile | undefined = mls.l2.editor.get({ project, shortName });

        if (!mmodel) return;

        if (storFile.status === 'deleted') {
            this.deleteFile(storFile);
            return;
        }

        if (storFile.status === 'renamed') {
            mmodel.originalProject = undefined;
            mmodel.originalShortName = undefined;
            mmodel.originalCRC = mls.common.crc.crc32(mmodel.model.getValue()).toString(16);
        }

        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

        storFile.status = 'nochange';
    }

    private async getValueInfo(activeModel: mls.l2.editor.IMFile): Promise<mls.stor.IFileInfoValue> {

        const rc: mls.stor.IFileInfoValue = {
            content: activeModel.model.getValue(),
            contentType: 'string',
            originalShortName: activeModel.originalShortName,
            originalProject: activeModel.originalProject,
            originalCRC: activeModel.originalCRC
        };
        return rc;
    }

    private _onChangedContent: number = -1;
    private onModelChange = (e: monaco.editor.IModelContentChangedEvent, activeModel: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo): void => {
        // some changes is to simulate changes to force compile
        clearTimeout(this._onChangedContent);
        this._onChangedContent = window.setTimeout(async () => {

            if (storFile.extension === '.ts') {

                await this.updateModelStatus(activeModel, true);

                const ignoreChanges = (e.changes.length === 1 && e.changes[0].range.startLineNumber === 1 && e.changes[0].range.endLineNumber === 1 && e.changes[0].range.endColumn <= 2);
                if (ignoreChanges) return;

            } else {

                await this.changeStatusFile(activeModel, storFile, {}, false);

            }


            //mls.events.fireFileAction('changed', storFile, 'left');
            //mls.events.fireFileAction('changed', storFile, 'right');

        }, 400);
    };



    private async updateModelStatus(model1: mls.l2.editor.IMFile, changed: boolean): Promise<void> {

        if (model1.project === 0) changed = true; // always in localstorage
        model1.changed = changed;

        const cr: mls.l2.editor.ICompilerResult = await mls.l2.editor.getCompilerResultTS({ project: model1.project, shortName: model1.shortName }, true);

        let hasError = cr.errors.length > 0;
        model1.error = hasError;

        const key = mls.stor.getKeyToFiles(model1.project, model1.storFile.level, model1.shortName, '', model1.extension);

        const storFile: mls.stor.IFileInfo = mls.stor.files[key];


        if (!hasError) {
            const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementInstance(model1).catch((e) => undefined);
            if (enhancementInstance) await enhancementInstance.onAfterChange(model1);
            hasError = storFile.hasError;
        }
        await this.changeStatusFile(model1, storFile, cr.tripleSlashMLS?.variables, hasError);
    }

    private async changeStatusFile(model1: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables, hasError: boolean): Promise<void> {

        if (!storFile) return; // new file dont have storFile ???

        const oldStatus = storFile.status;
        storFile.hasError = hasError;

        const sameContent: boolean = model1.originalCRC === mls.common.crc.crc32(model1.model.getValue()).toString(16);

        if (sameContent) {
            if (storFile.status !== 'new') storFile.status = 'nochange';
            await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
        } else {
            if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
            await mls.stor.localStor.setContent(storFile, await this.getValueInfo(model1));
        }
        if (oldStatus !== storFile.status) {
            mls.events.fireFileAction('statusOrErrorChanged', storFile, 'left');
            mls.events.fireFileAction('statusOrErrorChanged', storFile, 'right');
        }
    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {

        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

        mls.l2.editor.remove(storFile);

        this.removeEventsModelTS(storFile);

        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);

        delete mls.stor.files[keyFiles];

    }

    private removeEventsModelTS(storFile: mls.stor.IFileInfo): void {
        storFile.onAction = undefined;
        storFile.getValueInfo = undefined;
    }

}

/// <mls shortName="serviceSource" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-source-100554')
export class ServiceSource100554 extends ServiceBase {

    private activeModel: monaco.editor.ITextModel | undefined;
    private activeModelHTML: monaco.editor.ITextModel | undefined;

    get confE() { return `l${this.level}_${this.position}`; };

    @property() error: string = '';

    private myEditors: IMyEditors = {
        ts: undefined,
        html: undefined
    };

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf121',
        name: 'Source 2',
        mode: 'B',
        position: 'all',
        readOnly: true,
        tooltip: 'Source 2',
        className: undefined,
        tags: [],
        levels: [2, 4]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        if (op === 'icTs') this.initTS();
        if (op === 'icHTML') this.initHTML();
    }


    public menu: IMenu = {
        title: 'L2 - widget1',
        actions: {
        },
        icons: {
            icTs: 'Typescript;f121',
            icHTML: 'HTML;f1c9'
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icTs',
        setMode: undefined, // child will set this
        updateTitle: undefined, // child will set this
        getLastMode: undefined, // child will set this
        lastIcon: undefined, // child will set this
        setIconActive: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    createRenderRoot() {
        return this;
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && reinit) {

        }

    }

    //--------------- EVENTS ---------------

    private setEvents(): void {

        mls.events.addListener(2, 'FileAction', this.onFileAction.bind(this));

    }

    private onFileAction: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.level !== +this.level || (ev.type !== 'FileAction')) return;

        const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

        if (fileAction.position !== this.position || !['open'].includes(fileAction.action)) return;

        const keyFiles = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, fileAction.extension);

        const storFile = mls.stor.files[keyFiles];

        if (!storFile) {
            this.error = 'Error on open, mls.stor.files dont exists, key:' + keyFiles;
            return;
        }

        const fileModel = mls.l2.editor.get(storFile);
        const fileModelHTml = mls.l2.editor.get({ project: storFile.project, shortName: storFile.shortName + '.html' });
        
        if (!fileModel) {

            this.error = 'Not found filemodel' + keyFiles;
            return;

        }

        if (!fileModel.model) {
            this.error = 'Not found model' + keyFiles;
            return;
        }

        this.activeModel = fileModel.model
        this.activeModelHTML = fileModelHTml ? fileModelHTml.model : undefined;

        this.initTS();
        if (mls.istrace) console.timeEnd('onAction_' + fileAction.action + '_' + fileAction.position);
    }


    // ------------- COMPONENTE-------------

    connectedCallback() {
        super.connectedCallback();
    }

    render() {

        if (this.error && this.error !== '') {
            return html`<h3 style="color:red">${this.error}</h3>`
        }

        return html``;
    }



    //-------------- IMPLEMENTS-------------

    private async initTS() {

        const fc = async () => {

            if (!mls.actual[2].project || !this.activeModel) {
                this.error = 'Please, select a file!';
                return;
            }

            if (!this.myEditors.ts) {
                const div = document.createElement('div');
                const editor = monaco.editor.create(div, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
                div.style.cssText = 'width: 100%; height: 100%;';
                this.myEditors.ts = {
                    el: div,
                    editor
                }
            }

            if (this.menu.setMode) this.menu.setMode('page', this.myEditors.ts.el);

            this.myEditors.ts.editor.setModel(this.activeModel);
            this.myEditors.ts.editor.layout();

        }

        fc();

        return true;

    }

    private async initHTML() {

        const fc = async () => {

            if (!mls.actual[2].project || !this.activeModelHTML) {
                this.error = 'Please, select a file!';
                return;
            }

            if (!this.myEditors.html) {
                const div = document.createElement('div');
                const editor = monaco.editor.create(div, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
                div.style.cssText = 'width: 100%; height: 100%;';
                this.myEditors.html = {
                    el: div,
                    editor
                }
            }

            if (this.menu.setMode) this.menu.setMode('page', this.myEditors.html.el);

            this.myEditors.html.editor.setModel(this.activeModelHTML);
            this.myEditors.html.editor.layout();

        }

        fc();

        return true;

    }



    private showLoader(show: boolean): void {

        this.loading = show;

    }

}

interface IMyEditors {
    ts: IMyEditor | undefined,
    html: IMyEditor | undefined
}

interface IMyEditor {
    el: HTMLElement,
    editor: monaco.editor.IStandaloneCodeEditor
}

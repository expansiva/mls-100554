/// <mls shortName="editorQuillDocs" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('editor-quill-docs-100554')
export class EditorQuillDocs100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;
    
    @property({ type: String, reflect: true })
    private value: string = "Teste";

    @query('.editor-quill-docs-container')
    containerEditor: HTMLElement | undefined

    set cbFinishEdit(fc: Function) {
        this.cbFinishFc = fc;
    }

    get text() { return this.editor.root.innerHTML || '' ; }

    set text(src: string) {
        if (!this.editor) return;
        this.editor.deleteText(0, this.text.length);
        this.editor.pasteHTML(0, src);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'opened' && oldValue) this.onOpenedChanged(newValue === 'true');
        if (name === 'mode' && oldValue !== newValue) this.onEditOnChanged(newValue);
    }

    firstUpdated(changedProperties:any) {
        super.firstUpdated(changedProperties);
        this.initEditor(this.options);
    }

    private cbFinishFc: Function | undefined;

    private toolbarOpt: any = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] },
        { background: [] }],
        [{ align: [] }],
        ['clean'],
    ]

    private options = {
        modules: {
            toolbar: {
                container: this.toolbarOpt,
                handlers: {}
            },
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    };

    private openedToolbar: boolean = false;

    public id: string = '';

    private configObj: IQuillConfigOptions = {} as IQuillConfigOptions;

    public quill: any;

    public editor: any;

    private initEditor(opt: any, cb?: Function, withHistories?: boolean): void {
        this.quill = (window as any)['Quill'];
        if (withHistories) this.configObj.withHistories = withHistories;
        this._initEditor(opt, cb);
        this.text = this.value;
    }
    
    private onOpenedChanged(value: boolean) {
        this.openedToolbar = value;
        const divEditor = this.containerEditor?.querySelector('.doc-section-editor') as HTMLDivElement;
        const toolbar = divEditor.querySelector('.ql-toolbar') as HTMLElement;
        const editor = divEditor.querySelector('.ql-editor') as HTMLElement;;
        this.classList.toggle('ql-closed', !this.openedToolbar);
        toolbar.classList.toggle('d-none', !this.openedToolbar);
        editor.setAttribute('contenteditable', !this.openedToolbar ? 'false' : 'true');
    }

    private onEditOnChanged(value: string) {

        const divIcons = this.querySelector('.doc-section-icons') as HTMLDivElement;
        divIcons.style.display = value === 'Edit' ? 'block' : 'none';

    }

    private _initEditor(options?: any, cb?: Function): void {

        if (this.configObj.withHistories) {
            this.implementsHistories(options);
        }

        const modeInitial = 'Edit';
        const divSectionDoc = document.createElement('div');
        divSectionDoc.className = 'doc-section';

        const divSectionEditor = document.createElement('div');
        divSectionEditor.className = 'doc-section-editor';

        const divEditor = document.createElement('div');
        divSectionEditor.appendChild(divEditor);

        const divSectionDocIcons = document.createElement('div');
        divSectionDocIcons.className = 'doc-section-icons';
        divSectionDocIcons.style.display = modeInitial === 'Edit' ? 'block' : 'none';
        const iconFinish = document.createElement('i');
        iconFinish.className = 'fa fa-check';
        const iconEdit = document.createElement('i');
        iconEdit.className = 'fa fa-pencil';

        if (this.getAttribute('opened') === 'true') iconEdit.style.display = 'none';
        else iconFinish.style.display = 'none';

        iconEdit.onclick = () => {

            iconFinish.style.display = '';
            iconEdit.style.display = 'none';
            this.setAttribute('opened', 'true');

        };

        iconFinish.onclick = () => {

            iconEdit.style.display = '';
            iconFinish.style.display = 'none';
            this.setAttribute('opened', 'false');
            if (this.cbFinishFc) this.cbFinishFc(this.text);

        };

        divSectionDocIcons.appendChild(iconFinish);
        divSectionDocIcons.appendChild(iconEdit);
        divSectionDoc.appendChild(divSectionDocIcons);
        divSectionDoc.appendChild(divSectionEditor);

        this.containerEditor?.appendChild(divSectionDoc);
        this.editor = new this.quill(divEditor, options);
        this.onOpenedChanged(this.getAttribute('opened') === 'true');

        if (cb) cb();

    }

    private implementsHistories(options: any): {} {

        const arraysEqual = (a: any, b: any) => {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;

            // If you don't care about the order of the elements inside
            // the array, you should sort both arrays here.
            // Please note that calling sort on an array will modify that array.
            // you might want to clone your array first.

            for (let i = 0; i < a.length; ++i) {
                if (a[i] !== b[i]) return false;
            }
            return true;

        };

        if (!options.modules) options.modules = {};

        if (!options.modules.history) {

            options.modules.history = {
                delay: 2500,
                userOnly: true
            };

        }

        if (!options.modules.toolbar) options.modules.toolbar = {};
        if (!options.modules.toolbar.container) options.modules.toolbar.container = [];

        if (!options.modules.toolbar.container.find((item: any) => arraysEqual(item, ['undo', 'redo']))) {

            options.modules.toolbar.container.push(['undo', 'redo']);

        }

        if (!options.modules.toolbar.handlers) options.modules.toolbar.handlers = {};

        const icons = this.quill.import('ui/icons');
        icons['undo'] = `<svg viewbox="0 0 18 18">
			<polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
			<path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
			</svg>`;
        icons['redo'] = `<svg viewbox="0 0 18 18">
			<polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
			<path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path>
			</svg>`;

        const myUndo = () => this.editor.history.undo();
        const myRedo = () => this.editor.history.redo();
        options.modules.toolbar.handlers.undo = myUndo;
        options.modules.toolbar.handlers.redo = myRedo;

        return options;

    }

    render() {
        return html`
            <div class="editor-quill-docs-container"></div>
        `;
    }
}

interface IQuillConfigOptions {
    create: boolean,
    strJson: string,
    withHistories: boolean;
    placeholder: string;
    theme: string,
}

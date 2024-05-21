/// <mls shortName="aimActionAddLanguage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer, getInfoMyService } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { initAimSelectWidget100554 } from './_100554_aimSelectWidget';
import { initAimSelectLanguage100554 } from './_100554_aimSelectLanguage';
import { ICollabLanguage } from './_100554_collabLanguages';
import { getDataInternationalization, IInternationalizationsDetails } from './_100554_aimTaskGetSourceLanguageTypescript';

const myName = '_100554_aimActionAddLanguage';

/// **collab_i18n_start**
const message_pt = {
    "action_title": "verificar e adicionar uma nova linguagem",
    "btn_cancel": "Cancelar",
    "btn_confirm": "Confirmar",
    "filesSelected": "arquivos selecionado",
    "languagesSelected": "linguagens selecionadas",
    "anchorSelectWidget": "selecionar arquivos...",
    "anchorSelectLanguage": "selecionar linguagens...",
    "file": "Arquivo:",
    "language": "Linguagem:",
    "label_checkbox": "Somente criar action se não existir a linguagem selecionada.",
    "message_error_1": "Por favor, selecione um widget para continuar",
    "message_error_2": "Por favor, selecione uma linguagem para continuar",
}

const message_en = {
    "action_title": "check and add new language",
    "btn_cancel": "Cancel",
    "btn_confirm": "Confirm",
    "filesSelected": "files selected.",
    "languagesSelected": "languages selected.",
    "anchorSelectWidget": "select files...",
    "anchorSelectLanguage": "select languages...",
    "file": "File:",
    "language": "Language:",
    "label_checkbox": "Only create the action if the selected language does not exist.",
    "message_error_1": "Please select a widget first!",
    "message_error_2": "Please select a language first!",

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-add-language-100554')
export class AimActionAddLanguage extends AimActionBase {

    constructor() {
        super();
        initAimSelectWidget100554();
        initAimSelectLanguage100554();
    }

    @property({ type: String }) currentScenario: IScenaries = 'main';
    @property({ type: Number }) level: number = 0;
    @property({ type: Array }) widgets: string[] = [];
    @property({ type: Array }) languages: ICollabLanguage[] = [];
    @property({ type: Boolean }) onlyLanguageDontConfigured: boolean = false;


    private msg: MessageType = messages['en'];

    public getRules(): AimActionRules {
        return {
            levels: [2, 5],
            tags: ["*serviceSource*", "*servicePlugins*"]
        }
    }
    public assistant = "gpt3_typescript";
    public title = "Add Language";

    private info: { level: number, position: string, actServiceOp: any } | undefined;

    render() {
        this.info = getInfoMyService(this);
        this.level = this.info?.level || 0;
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return super.render();
    }

    language = 'english';

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private changeScenario(ev: MouseEvent, s: IScenaries) {
        ev.preventDefault();
        this.currentScenario = s;
    }

    private handleSelectLanguageConfirm(e: CustomEvent) {
        const languages: ICollabLanguage[] = e.detail;
        this.languages = [...languages];
        this.handleCancel2();
    }

    private handleSelectWidgetConfirm(e: CustomEvent) {
        const widgets: string[] = e.detail;
        this.widgets = [...widgets];
        this.handleCancel2();
    }

    private handleCancel2() {
        this.currentScenario = 'main';
    }

    private handleCheckConfig(e: MouseEvent) {
        const inp = e.target as HTMLInputElement;
        this.onlyLanguageDontConfigured = inp.checked;
    }

    private allElementsPresent(arrayA: string[], arrayB: string[]): boolean {
        for (const element of arrayA) {
            if (!arrayB.includes(element)) {
                return false;
            }
        }
        return true;
    }

    private async handleAdd() {

        if (this.level === 2) {
            if (!this.info || (this.info.actServiceOp && this.info.actServiceOp.tagName !== 'SERVICE-SOURCE-100554')) {
                throw new Error('Invalid service opposite side');
            }
            const position = this.info.position === 'left' ? 'right' : 'left';
            if (!(mls.actual[2] as any)[position]) throw new Error('Invalid File in mls.actual[2]')
            const { shortName } = (mls.actual[2] as any)[position];
            this.widgets = [shortName];
        }

        if (this.widgets.length === 0) {
            window.collabMessages.add(this.msg.message_error_1, 'error');
            return;
        }

        if (this.languages.length === 0) {
            window.collabMessages.add(this.msg.message_error_2, 'error');
            return;
        }

        const { project } = mls.actual[5];
        if (!project) throw new Error('Invalid project');

        for (const widget of this.widgets) {
            this.prepareInfoFile(project, widget).then((infoFile) => {
                this.addTask(infoFile);
            });
        }

    }

    private async prepareInfoFile(project: number, widget: string) {

        const fileName = `_${project}_${widget}`
        const infoFile: ITaskFileInfo = {
            fileName,
            checkHtml: false,
            checkTs: true,
            languages: this.languages,
            html: '',
            detailsi18n: undefined
        };

        const mfile = mls.l2.editor.mfiles[fileName];
        if (!mfile) infoFile.checkTs = false;
        const valueTs = mfile.model.getValue() || '';
        if (!valueTs) infoFile.checkTs = false;

        const details = getDataInternationalization(valueTs);
        if (!details.internationalization || !details.internationalization.source || details.internationalization.languages.length === 0) infoFile.checkTs = false;
        if (this.onlyLanguageDontConfigured && this.allElementsPresent(this.languages.map((lang) => lang.code), details.internationalization?.languages || [])) infoFile.checkTs = false;

        infoFile.detailsi18n = details.internationalization;
        return infoFile;
    }


    addTask(infoFile: ITaskFileInfo) {

        if (!infoFile.checkHtml && !infoFile.checkTs) {
            this.dispatchEvent(new CustomEvent('finished-add-task-root', {
                detail: undefined, bubbles: true, composed: true
            }));
            return;
        }

        const taskRoot: cbe.ITaskRoot = {
            mode: 'initializing',
            title: this.msg.action_title,
            widget: myName,
            children: [],
            args: JSON.stringify(infoFile),
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(taskRoot);

        if (infoFile.checkTs) this.prepareTaskPromptTs(taskRoot);
        else {//TODO Task Html
        }

        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: taskRoot, bubbles: true, composed: true
        }));
    }

    renderAdd(): TemplateResult { // from abstract

        if (!this.info) throw new Error('Invalid Service Info');
        if (![2, 5].includes(this.level)) throw new Error('Invalid level');

        return html`
                ${this.currentScenario === 'main' ? html`
                    <p> ${this.msg.action_title}</p>
                    <hr>
                    <div style="display:flex;">
                        <input id="check-config" type="checkbox" ?checked=${this.onlyLanguageDontConfigured} @change=${this.handleCheckConfig}></input>
                        <label for="check-config">${this.msg.label_checkbox}</label>
                    </div>
                    <div>
                        <div style=${this.level === 2 ? 'display:none;' : 'display:block;'}>
                            <span>${this.msg.file} ${this.widgets.length === 1 ? this.widgets[0] : this.widgets.length + ' ' + this.msg.filesSelected}</span>
                            <a href="#" @click=${(e: MouseEvent) => this.changeScenario(e, 'selectWidget')}> ${this.msg.anchorSelectWidget} </a>
                        </div>
                        <div>
                            <span>${this.msg.language} ${this.languages.length === 1 ? this.languages[0].name + '(' + this.languages[0].code + ')' : this.languages.length + ' ' + this.msg.languagesSelected}</span>
                            <a href="#" @click=${(e: MouseEvent) => this.changeScenario(e, 'selectLanguage')} > ${this.msg.anchorSelectLanguage} </a>
                        </div>
                    </div>
                `: ''}

                ${this.currentScenario === 'selectLanguage' ? html`
                    <div>
                        <aim-select-language-100554
                            .defaultValue=${this.languages}
                            @select-language-confirm=${this.handleSelectLanguageConfirm} 
                            @select-language-cancel=${this.handleCancel2}>
                        </aim-select-language-100554>
                    </div>
                `: ''}
    

                ${this.currentScenario === 'selectWidget' ? html`
                    <aim-select-widget-100554
                        .defaultValue=${this.widgets}
                        @select-widget-confirm=${this.handleSelectWidgetConfirm} 
                        @select-widget-cancel=${this.handleCancel2}>
                    </aim-select-widget-100554>
                `: ''}
                
                <div class="buttonGroup">
                    <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
                    <button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>
                </div>
    `;
    }

    getPromptTs(source: string, languages: ICollabLanguage[]) {

        const langs = languages.map((lang) => `${lang.name}(${lang.code})`);
        const prompt = `adicionar as linguagens: ${langs.join(';')}  no código abaixo. Manter as linguagens existentes. Não retornar explicações. Retornar um único bloco \`\`\`typescript

${source}
 `;
        return prompt;
    }


    prepareTaskPromptTs(taskRoot: cbe.ITaskRoot): void {

        this.mode = taskRoot.mode = 'in progress';
        if (!taskRoot.args) throw new Error('Invalid taskroot args');
        const infoFile: ITaskFileInfo = JSON.parse(taskRoot.args);

        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            ref: infoFile.fileName + '.ts',
            agent: this.assistant,
            prompt: this.getPromptTs(infoFile.detailsi18n?.source as string, infoFile.languages),
            trace: [],
            nextStep: this.prepareTaskResultTs.name // danger, loop
        });
    }

    prepareTaskResultTs(taskFinishResult: ITaskFinish): void {

        const child = taskFinishResult.taskChild;
        const result: string = child.result || '';

        if (taskFinishResult.status === 'error') {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }
        if (!taskFinishResult.taskRoot.args) {
            child.trace.push(new Date().toISOString() + ': taskroot args is missing');
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            this.requestUpdate();
            return;
        }
        if (!child.result) {
            child.trace.push(new Date().toISOString() + ': no result in task');
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            this.requestUpdate();
            return;
        }

        const infoFile: ITaskFileInfo = JSON.parse(taskFinishResult.taskRoot.args);
        child.mode = 'processed';

        const nextStep = infoFile.checkHtml ? this.prepareTaskPromptHTML.name : this.endTasks.name;
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'add language in typescript source',
            widget: '_100554_aimTaskResultLanguageTypescript',
            ref: infoFile.fileName + '.ts',
            trace: [],
            _tempResult: result,
            nextStep
        });

    }

    prepareTaskPromptHTML(taskRoot: cbe.ITaskRoot): void {

    }

    prepareTaskResultHTML(taskRoot: cbe.ITaskRoot, infoFile: ITaskFileInfo): void {

    }

    endTasks(taskFinishResult: ITaskFinish): void {
        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') child.mode = 'error';
        else child.mode = 'processed';
        this.mode = taskFinishResult.taskRoot.mode = child.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

}

type IScenaries = 'main' | 'selectLanguage' | 'selectWidget';

export interface ITaskRootArgs {
    fileName: string
}

export interface ITaskFileInfo {
    fileName: string,
    checkHtml: boolean,
    checkTs: boolean,
    detailsi18n: IInternationalizationsDetails | undefined,
    html: string,
    languages: ICollabLanguage[]
}

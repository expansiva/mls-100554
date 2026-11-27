/// <mls fileReference="_100554_/l2/serviceSave2.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IServiceMenu } from '/_102027_/l2/serviceBase.js';
import { undoFile, removeNewStorFilesWithTemplateDefault } from '/_102027_/l2/libStor.js';
import { readProjectTypescriptAndCompile } from '/_102027_/l2/libModel.js';
import { getGitProvider, getGitDriver, getGitRepoKeys, registerGitDriverLoader } from '/_102029_/l2/libGitProject.js';
import '/_100554_/l2/pluginCreateProjectLocalToDriver.js';

//Drivers reais do GitHub/GitLab para o save e para o plugin de pull requests (no VM o slot só lê).
registerGitDriverLoader('github', async () => new (await import('/_100554_/l2/driverGithub.js')).DriverGitHub());
registerGitDriverLoader('gitlab', async () => new (await import('/_100554_/l2/driverGitlab.js')).DriverGitLab());

/// **collab_i18n_start**
const message_pt = {
    needComment: 'Escreva um comentário para o pull request',
    comments: 'Comentário',
    commentPlaceholder: 'Descreva o que mudou',
    update: 'Salvar',
    fileChanges: 'Alterações',
    noItemsToSave: 'Nada para salvar.',
    noItemsHint: 'Quando você alterar arquivos de um projeto com repositório, eles aparecem aqui.',
    pullrequestOk: 'Pull request realizado com sucesso',
    msgAllSynced: 'Tudo já está sincronizado — pull request desnecessário (os arquivos deletados já não existem no repositório remoto).',
    errorVerify: 'Foi encontrado arquivos com erros',
    obsVerify: 'Há arquivos com erro; ao salvar será pedida confirmação.',
    msgErrorFilesSelected: 'Arquivos com erro foram selecionados, deseja realmente continuar?',
    select: 'Selecionar',
    selected: 'Selecionado',
    selectProjectToSave: 'Selecione o projeto que deseja salvar',
    saving: 'Salvando projeto',
    otherProjects: 'Outros projetos com alterações locais',
    files: 'arquivos',
    history: 'Histórico',
    undo: 'Desfazer',
    undone: 'desfeito',
    stEdited: 'Editado',
    stNew: 'Novo',
    stDeleted: 'Deletado',
    stRenamed: 'Renomeado',
    stError: 'Com erro',
    errNotInDb: 'O arquivo não existe no banco local',
    errModel: 'O model está inválido',
    forkNameMismatch: 'Seu fork de [origin] se chama [fork], não [login]/[repo]. Renomeie ou apague esse fork no GitHub para salvar.',
    repoNotFork: 'Já existe [login]/[repo] na sua conta, mas ele não é fork de [origin]. Apague ou renomeie esse repositório no GitHub para o save criar o fork.'
}
const message_en = {
    needComment: 'Need a comment for the pull request',
    comments: 'Comment',
    commentPlaceholder: 'Describe what changed',
    update: 'Save',
    fileChanges: 'Changes',
    noItemsToSave: 'Nothing to save.',
    noItemsHint: 'Files you change in a project with a repository show up here.',
    pullrequestOk: 'Pull request completed successfully',
    msgAllSynced: 'Everything is already in sync — pull request not needed (the deleted files no longer exist in the remote repository).',
    errorVerify: 'Files with errors were found',
    obsVerify: 'Some files have errors; saving will ask for confirmation.',
    msgErrorFilesSelected: 'Files with errors are selected, do you really want to continue?',
    select: 'Select',
    selected: 'Selected',
    selectProjectToSave: 'Select the project you want to save',
    saving: 'Saving project',
    otherProjects: 'Other projects with local changes',
    files: 'files',
    history: 'History',
    undo: 'Undo',
    undone: 'undone',
    stEdited: 'Edited',
    stNew: 'New',
    stDeleted: 'Deleted',
    stRenamed: 'Renamed',
    stError: 'Has errors',
    errNotInDb: 'The file does not exist in the local database',
    errModel: 'The model is invalid',
    forkNameMismatch: 'Your fork of [origin] is named [fork], not [login]/[repo]. Rename or delete that fork on GitHub to save.',
    repoNotFork: '[login]/[repo] already exists in your account, but it is not a fork of [origin]. Delete or rename that repository on GitHub so the save can create the fork.'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

const WIDGET = '_100554_serviceSave2';

const ICON_CHEVRON = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;
const ICON_HISTORY = html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`;
const ICON_UNDO = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>`;
const ICON_REPO = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/></svg>`;
const ICON_BRANCH = html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="5.5" r="2"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7.5v9"/><path d="M18 10c0 4-6 3-11.2 7"/></svg>`;
const ICON_EMPTY = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`;

type TStatus = mls.stor.IFileInfo['status'];

//O save só trabalha com projetos do driver GitHub; os demais nunca aparecem aqui.
const isGithubProject = (prj: number): boolean => getGitProvider(prj) === 'github';

@customElement('service-save2-100554')
export class ServiceSave2 extends ServiceBase {

    private myMessage: MessageType = messages['en'];
    private owner: string = '';
    private repo: string = '';
    private branch: string = '';

    @property() selectedProject: number | undefined = undefined;
    //Projeto escolhido na lista para salvar; o owner/repo/branch do cabeçalho são dele.
    @state() saveProject: number | undefined = undefined;
    @state() itens: IDefItem | undefined = undefined;
    @state() otherProjects: Record<string, Record<string, string[]>> = {};
    @state() error: string = '';
    @state() private selected: Set<string> = new Set();
    @state() private undone: Set<string> = new Set();
    @state() private openNodes: Map<string, boolean> = new Map();
    @state() private commitMsg: string = '';
    @state() private otherOpen: boolean = false;
    @state() private inSaving: boolean = false;
    @state() private saveLog: string[] = [];

    private errorTimer: number = 0;
    private arrayRollback: mls.stor.IFileInfo[] = [];
    private saveDriver: mls.stor.others.DriverIOBase | undefined = undefined;

    createRenderRoot() {
        return this;
    }

    get currentProject(): number | undefined {
        return this.selectedProject !== undefined ? this.selectedProject : mls.actualProject;
    }

    private get projectInSave(): number | undefined {
        return this.saveProject !== undefined ? this.saveProject : this.currentProject;
    }

    constructor() {
        super();
        readProjectTypescriptAndCompile(this.currentProject as number, '', true);
        this.setEvents();
        this.setError('');
    }

    //---------SERVICE-------------
    public details: IService = {
        icon: '&#xf0c7',
        state: 'background',
        position: 'left',
        tooltip: 'Save',
        visible: true,
        widget: '_100554_serviceSave2', // literal: o nav-1 lê este bloco do .js com eval, sem as constantes do arquivo
        level: [5]
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: undefined,
        tools: {},
        onClickMain: () => { if (this.menu.setMode) this.menu.setMode('initial'); },
    }

    onServiceClick(visible: boolean, reinit: boolean) {
        if (!visible) return;
        setTimeout(() => this.setError(''), 500);
        this.updateList();
    }

    // -------------- EVENTS -------------------
    private setEvents() {
        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(3, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(5, 'ProjectSelected', () => { this.init(); });
        mls.events.addListener(5, 'ProjectCompilationComplete', this.onCompilationComplete.bind(this));
        mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['LevelChanged'] as unknown as mls.events.TypeEvent[], this.onLevelchange.bind(this));
    }

    private onLevelchange: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (!ev.desc) return;
        const data: { to: number, from: number } = JSON.parse(ev.desc);
        if (data.to === 5) this.verifyExitFileChanged();
    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (ev.type !== 'FileAction') return;
        const fileAction = JSON.parse(ev.desc as string) as mls.events.IFileAction;
        if (!['changed', 'delete', 'new', 'rename'].includes(fileAction.action)) return;
        if (this.visible === 'true') this.init();
        this.toogleBadge(true, WIDGET);
    }

    private onCompilationComplete: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (ev.type !== ('ProjectCompilationComplete' as mls.events.TypeEvent)) return;
        const v = JSON.parse(ev.desc as string);
        if (v.tsFree === false || v.lessFree === false) this.setError(this.myMessage.errorVerify);
    }

    private verifyExitFileChanged(): void {
        if (!mls.stor.files) return;
        const exist = Object.values(mls.stor.files).some((f) => f && isGithubProject(f.project) && f.status !== 'nochange');
        if (exist) this.toogleBadge(true, WIDGET);
    }

    // ------------- WEBCOMPONENT -------------
    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('inSaving')) {
            this.classList.toggle('saving', this.inSaving);
            if (this.inSaving) this.scrollTop = 0;
        }
        if (changedProperties.has('saveLog')) {
            const log = this.querySelector('.ss2-progress-log');
            if (log) log.scrollTop = log.scrollHeight;
        }
        if (changedProperties.has('error') && this.error) {
            clearTimeout(this.errorTimer);
            this.errorTimer = window.setTimeout(() => this.error = '', 3000);
        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.myMessage = messages[lang];

        if (this.currentProject === mls.stor.LOCALPROJECTNUMBER) {
            return html`<plugin-create-project-local-to-driver-100554 @project-local-created=${() => { this.init(); }}></plugin-create-project-local-to-driver-100554>`;
        }

        const hasOthers = Object.keys(this.otherProjects).length > 0;
        return html`
            <div class="ss2">
                ${this.error ? html`<div class="ss2-error" role="alert">${unsafeHTML(this.error)}</div>` : ''}
                ${this.itens ? html`
                    ${this.renderRepo()}
                    <div class="ss2-body">
                        <div class="ss2-section-title">${this.myMessage.fileChanges}</div>
                        ${this.saveProject === undefined ? html`<div class="ss2-hint">${this.myMessage.selectProjectToSave}</div>` : ''}
                        ${repeat(Object.keys(this.itens), (k) => k, (k) => this.renderProject(+k))}
                        ${hasOthers ? this.renderOthersProjects() : ''}
                    </div>
                    ${this.renderFooter()}
                ` : html`
                    ${this.renderEmpty()}
                    ${hasOthers ? html`<div class="ss2-body">${this.renderOthersProjects()}</div>` : ''}
                `}
            </div>
            ${this.inSaving ? this.renderSaveProgress() : ''}
        `;
    }

    //Tela do próprio service durante o save: bloqueia os cliques e mostra cada etapa.
    private renderSaveProgress() {
        return html`
            <div class="ss2-progress">
                <div class="ss2-progress-box">
                    <div class="ss2-progress-head">
                        <span class="ss2-spinner"></span>
                        <h4>${this.myMessage.saving}${this.saveProject ? ` ${this.saveProject}` : ''}…</h4>
                    </div>
                    <ul class="ss2-progress-log">
                        ${repeat(this.saveLog, (_item, i) => i, (item) => html`<li>${item}</li>`)}
                    </ul>
                </div>
            </div>
        `;
    }

    private renderEmpty() {
        return html`
            <div class="ss2-empty">
                <div class="ss2-empty-icon">${ICON_EMPTY}</div>
                <div class="ss2-empty-title">${this.myMessage.noItemsToSave}</div>
                <div class="ss2-empty-hint">${this.myMessage.noItemsHint}</div>
            </div>
        `;
    }

    private renderRepo() {
        if (this.saveProject === undefined) return '';
        return html`
            <div class="ss2-repo">
                <div class="ss2-repo-info">
                    <div class="ss2-repo-name" title="${this.owner}/${this.repo}">
                        ${ICON_REPO}<span>${this.owner ? html`<span class="muted">${this.owner}/</span>${this.repo}` : this.saveProject}</span>
                    </div>
                    ${this.branch ? html`<div class="ss2-repo-branch" title="Branch">${ICON_BRANCH}<span>${this.branch}</span></div>` : ''}
                </div>
            </div>
        `;
    }

    private renderFooter() {
        const count = this.getFilesToSave().length;
        const hasError = this.saveProject !== undefined && this.getProjectItems(this.saveProject).some((i) => i.hasError);
        const disabled = this.saveProject === undefined || count === 0 || this.inSaving;
        return html`
            <div class="ss2-footer">
                <label class="ss2-label" for="ss2-msg">${this.myMessage.comments}</label>
                <textarea id="ss2-msg" rows="2" maxlength="50" placeholder="${this.myMessage.commentPlaceholder}"
                    .value=${this.commitMsg}
                    @input=${(e: InputEvent) => { this.commitMsg = (e.target as HTMLTextAreaElement).value; }}
                    @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !disabled) this.onSave(); }}></textarea>
                <div class="ss2-footer-row">
                    <span class="ss2-counter">${this.commitMsg.length}/50</span>
                    <button class="ss2-btn-primary" ?disabled=${disabled} @click=${() => this.onSave()}>
                        ${this.myMessage.update}${count ? html`<span class="ss2-count">${count}</span>` : ''}
                    </button>
                </div>
                ${hasError ? html`<div class="ss2-warn">${this.myMessage.obsVerify}</div>` : ''}
            </div>
        `;
    }

    // ---------- tree ----------
    private isOpen(key: string, def: boolean): boolean {
        const v = this.openNodes.get(key);
        return v === undefined ? def : v;
    }

    private toggleOpen(e: Event, key: string, def: boolean) {
        e.stopPropagation();
        const m = new Map(this.openNodes);
        m.set(key, !this.isOpen(key, def));
        this.openNodes = m;
    }

    private renderCheck(items: Iitem[], disabled: boolean) {
        const selectable = items.filter((i) => this.isSelectable(i, true));
        const n = selectable.filter((i) => this.selected.has(this.itemKey(i))).length;
        const all = n > 0 && n === selectable.length;
        return html`<input type="checkbox" class="ss2-check"
            .checked=${all} .indeterminate=${n > 0 && !all}
            ?disabled=${disabled || selectable.length === 0}
            @click=${(e: MouseEvent) => { e.stopPropagation(); this.toggleItems(selectable, !all); }}>`;
    }

    private renderProject(project: number) {
        if (!this.itens) return '';
        const levels = this.itens[project];
        const key = 'p' + project;
        const open = this.isOpen(key, true);
        const items = this.getProjectItems(project);
        const isSave = this.saveProject === project;
        return html`
            <div class="ss2-project ${isSave ? 'active' : ''}">
                <div class="ss2-row ss2-project-head" @click=${(e: Event) => this.toggleOpen(e, key, true)}>
                    <span class="ss2-chev ${open ? 'open' : ''}">${ICON_CHEVRON}</span>
                    ${this.renderCheck(items, !isSave)}
                    <span class="ss2-project-name">${project}</span>
                    <span class="ss2-badge">${items.length} ${this.myMessage.files}</span>
                    <button class="ss2-pill ${isSave ? 'on' : ''}" @click=${(e: MouseEvent) => this.selectSaveProject(e, project)}>
                        ${isSave ? this.myMessage.selected : this.myMessage.select}
                    </button>
                </div>
                ${open ? repeat(Object.keys(levels), (l) => l, (l) => this.renderLevel(project, +l, !isSave)) : ''}
            </div>
        `;
    }

    private renderLevel(project: number, level: number, disabled: boolean) {
        if (!this.itens) return '';
        const groups = this.itens[project][level];
        const key = `p${project}_l${level}`;
        const open = this.isOpen(key, true);
        const items = Object.values(groups).flat();
        return html`
            <div class="ss2-level">
                <div class="ss2-row ss2-level-head" @click=${(e: Event) => this.toggleOpen(e, key, true)}>
                    <span class="ss2-chev ${open ? 'open' : ''}">${ICON_CHEVRON}</span>
                    ${this.renderCheck(items, disabled)}
                    <span class="ss2-level-name">L${level}</span>
                    <span class="ss2-badge">${items.length}</span>
                </div>
                ${open ? html`<ul class="ss2-groups">
                    ${repeat(Object.keys(groups).sort((a, b) => a.localeCompare(b)), (g) => g, (g) => this.renderGroup(project, level, g, groups[g], disabled))}
                </ul>` : ''}
            </div>
        `;
    }

    private renderGroup(project: number, level: number, name: string, list: Iitem[], disabled: boolean) {
        const key = `p${project}_l${level}_${name}`;
        const open = this.isOpen(key, false);
        const items = [...list].sort((a, b) => a.text.localeCompare(b.text));
        const idx = name.lastIndexOf('/');
        const folder = idx >= 0 ? name.slice(0, idx) : '';
        const short = idx >= 0 ? name.slice(idx + 1) : name;
        return html`
            <li class="ss2-group">
                <div class="ss2-row ss2-group-head" @click=${(e: Event) => this.toggleOpen(e, key, false)}>
                    <span class="ss2-chev ${open ? 'open' : ''}">${ICON_CHEVRON}</span>
                    ${this.renderCheck(items, disabled)}
                    <span class="ss2-name" title="${name}">${short}${folder ? html`<span class="ss2-folder">${folder}</span>` : ''}</span>
                    <span class="ss2-exts">
                        ${items.map((i) => html`<span class="ss2-ext st-${this.statusClass(i)}" title="${this.statusTitle(i)}">${this.extLabel(i.file.extension)}</span>`)}
                    </span>
                </div>
                ${open ? html`<ul class="ss2-items">${items.map((i) => this.renderItem(i))}</ul>` : ''}
            </li>
        `;
    }

    private renderItem(item: Iitem) {
        const key = this.itemKey(item);
        const isUndone = this.undone.has(key);
        const invalid = item.errorLocal || item.modelIsDispose;
        const canCheck = this.isSelectable(item, false);
        const st = this.statusClass(item);
        return html`
            <li class="ss2-item ${invalid || isUndone ? 'invalid' : ''}">
                <input type="checkbox" class="ss2-check" .checked=${this.selected.has(key)} ?disabled=${!canCheck}
                    @click=${(e: MouseEvent) => { e.stopPropagation(); this.toggleItems([item], (e.target as HTMLInputElement).checked); }}>
                <span class="ss2-status st-${st}" title="${this.statusTitle(item)}">${this.statusLetter(item)}</span>
                <span class="ss2-item-text" title="${item.text}">${item.text}</span>
                ${isUndone ? html`<span class="ss2-note">${this.myMessage.undone}</span>`
                : item.errorLocal ? html`<span class="ss2-note err">${this.myMessage.errNotInDb}</span>`
                    : item.modelIsDispose ? html`<span class="ss2-note err">${this.myMessage.errModel}</span>`
                        : html`
                    <span class="ss2-actions">
                        ${['new', 'renamed'].includes(item.file.status) ? '' : html`
                            <button class="ss2-icon-btn" title="${this.myMessage.history}" @click=${(e: MouseEvent) => this.clickHistory(e, item)}>${ICON_HISTORY}</button>`}
                        <button class="ss2-icon-btn" title="${this.myMessage.undo}" @click=${(e: MouseEvent) => this.clickUndo(e, item)}>${ICON_UNDO}</button>
                    </span>`}
            </li>
        `;
    }

    private renderOthersProjects() {
        const deps = this.getActualProjectDependencies();
        return html`
            <div class="ss2-others">
                <button class="ss2-row ss2-others-head" @click=${() => { this.otherOpen = !this.otherOpen; }}>
                    <span class="ss2-chev ${this.otherOpen ? 'open' : ''}">${ICON_CHEVRON}</span>
                    <span>${this.myMessage.otherProjects}</span>
                    <span class="ss2-badge">${Object.keys(this.otherProjects).length}</span>
                </button>
                ${this.otherOpen ? repeat(Object.keys(this.otherProjects), (k) => k, (k) => {
            const project = +k;
            const files = this.otherProjects[k];
            const key = 'o' + k;
            const open = this.isOpen(key, false);
            return html`
                        <div class="ss2-project readonly">
                            <div class="ss2-row ss2-project-head" @click=${(e: Event) => this.toggleOpen(e, key, false)}>
                                <span class="ss2-chev ${open ? 'open' : ''}">${ICON_CHEVRON}</span>
                                <span class="ss2-project-name">${project}</span>
                                <span class="ss2-badge">${Object.keys(files).length} ${this.myMessage.files}</span>
                                ${deps.includes(project) ? html`
                                    <button class="ss2-pill ${this.selectedProject === project ? 'on' : ''}" @click=${(e: MouseEvent) => this.selectProject(e, project)}>
                                        ${this.selectedProject === project ? this.myMessage.selected : this.myMessage.select}
                                    </button>` : ''}
                            </div>
                            ${open ? html`<ul class="ss2-groups">
                                ${Object.keys(files).sort().map((name) => html`
                                    <li class="ss2-row ss2-other-file">
                                        <span class="ss2-name" title="${name}">${name}</span>
                                        <span class="ss2-exts">${files[name].map((ext) => html`<span class="ss2-ext">${this.extLabel(ext)}</span>`)}</span>
                                    </li>`)}
                            </ul>` : ''}
                        </div>
                    `;
        }) : ''}
            </div>
        `;
    }

    // ---------- status helpers ----------
    private statusClass(item: Iitem): string {
        if (item.errorLocal || item.modelIsDispose || (item.hasError && item.file.status !== 'deleted')) return 'error';
        return item.file.status === 'nochange' ? 'changed' : item.file.status;
    }

    private statusLetter(item: Iitem): string {
        const map: Record<TStatus, string> = { nochange: 'M', changed: 'M', renamed: 'R', deleted: 'D', new: 'N' };
        return map[item.file.status] || 'M';
    }

    private statusTitle(item: Iitem): string {
        if (item.hasError && item.file.status !== 'deleted') return this.myMessage.stError;
        const map: Record<TStatus, string> = {
            nochange: this.myMessage.stEdited, changed: this.myMessage.stEdited,
            renamed: this.myMessage.stRenamed, deleted: this.myMessage.stDeleted, new: this.myMessage.stNew
        };
        return map[item.file.status] || '';
    }

    private extLabel(ext: string): string {
        return ext.replace(/^\./, '');
    }

    // ---------- selection ----------
    private itemKey(item: Iitem): string {
        const f = item.file;
        return `${f.project}_${f.level}_${f.folder}_${f.shortName}${f.extension}`;
    }

    //Renomeado só vai junto com o grupo (viaParent), como no serviceSave.
    private isSelectable(item: Iitem, viaParent: boolean): boolean {
        if (item.errorLocal || item.modelIsDispose) return false;
        if (item.file.project !== this.saveProject) return false;
        if (this.undone.has(this.itemKey(item))) return false;
        if (item.disabled) return viaParent && item.onlyFather;
        return true;
    }

    private toggleItems(items: Iitem[], on: boolean) {
        const s = new Set(this.selected);
        items.forEach((i) => on ? s.add(this.itemKey(i)) : s.delete(this.itemKey(i)));
        this.selected = s;
    }

    private getProjectItems(project: number): Iitem[] {
        const levels = this.itens?.[project];
        if (!levels) return [];
        return (Object.values(levels) as Ifile[]).flatMap((g) => Object.values(g).flat());
    }

    private getFilesToSave(): mls.stor.IFileInfo[] {
        if (this.saveProject === undefined) return [];
        const ar: mls.stor.IFileInfo[] = [];
        this.getProjectItems(this.saveProject).forEach((item) => {
            if (!this.selected.has(this.itemKey(item))) return;
            ar.push(item.file);
            const info = item.file;
            if (info.extension === '.ts' && info.status === 'deleted') {
                const key = mls.stor.getKeyToFiles(info.project, info.level, info.shortName, info.folder, '.html');
                const fl = mls.stor.files[key];
                if (!fl || fl.status === 'new') return;
                fl.status = 'deleted';
                ar.push(fl);
            }
        });
        return Array.from(new Map(ar.map((i) => [`${i.project}_${i.shortName}_${i.folder}_${i.extension}`, i])).values());
    }

    private clearSelection() {
        this.selected = new Set();
    }

    //-------- IMPLEMENTATION --------
    private async clickHistory(e: MouseEvent, item: Iitem) {
        e.stopPropagation();
        try {
            mls.events.fire([5], 'HistoriesSelected' as mls.events.TypeEvent, JSON.stringify({ action: "loader", position: 'left', }), 0);
            const f = item.file;
            const h = await f.getHistory();
            if (!h || h.length <= 0) return;
            const obj = {
                project: f.project,
                shortName: f.shortName,
                extension: f.extension,
                position: 'left',
                level: f.level,
                folder: f.folder,
                hashOriginal: h[0].ref,
                hashModified: 'local',
                renderSideBySide: true,
            }
            mls.events.fire([5], 'HistoriesSelected' as mls.events.TypeEvent, JSON.stringify(obj), 0);
        } catch (err: any) {
            this.setError(err.message);
        }
    }

    private async clickUndo(e: MouseEvent, item: Iitem) {
        e.stopPropagation();
        try {
            await undoFile(item.file);
            const key = this.itemKey(item);
            this.undone = new Set(this.undone).add(key);
            this.toggleItems([item], false);
        } catch (err: any) {
            this.error = err.message;
            this.setError(err.message);
        }
    }

    // Legacy Save (pull request) drops untouched template files. A project whose
    // driver is the VM keeps them. One gate here covers every init caller.
    private async templateSweepApplies(): Promise<boolean> {
        // Same prefix as isVmDriver (studioDraft.ts:44). Local: this file does not import 102033.
        const VM_DRIVER_PREFIX = '1.0.0-vm';
        const project = mls.actualProject;
        if (typeof project !== 'number') return true;
        const others = mls.stor.others;
        if (typeof others?.getDefaultDriver !== 'function') {
            console.error('[serviceSave2] getDefaultDriver is missing; template sweep skipped');
            return false;
        }
        try {
            const driver = await others.getDefaultDriver(project);
            const version = driver?.driverVersion;
            return !(typeof version === 'string' && version.startsWith(VM_DRIVER_PREFIX));
        } catch (err) {
            const detail = err instanceof Error ? err.message : String(err);
            console.error('[serviceSave2] getDefaultDriver failed; template sweep skipped: ' + detail);
            return false;
        }
    }

    private async init(isSetInfoProject: boolean = true) {
        this.loading = true;
        if (await this.templateSweepApplies()) {
            await removeNewStorFilesWithTemplateDefault();
        }
        if (isSetInfoProject) await this.initInfoProject();
        await this.setInfos();
        this.loading = false;
    }

    private async initInfoProject() {
        const prj = this.projectInSave;
        //Só projeto GitHub tem o repositório do cabeçalho.
        if (!prj || prj === mls.stor.LOCALPROJECTNUMBER || !isGithubProject(prj)) return;
        try {
            const info = await getGitRepoKeys(prj);
            this.branch = info.branch;
            this.owner = info.owner;
            this.repo = info.repo;
            this.requestUpdate();
        } catch (e: any) {
            this.setError(e.message);
        }
    }

    private async setInfos() {
        try {
            const objProjects: IDefItem = {};
            for (const fKey of Object.keys(mls.stor.files)) {
                const file = mls.stor.files[fKey] as mls.stor.IFileInfo;
                if (!file ||
                    (!file.inLocalStorage && file.status !== 'deleted') ||
                    file.project === 0 ||
                    !isGithubProject(file.project)
                ) continue;
                const list = this.getGroupList(objProjects, file.project, file.level, file.folder, file.shortName);
                list.push(await this.configItem(file));
            }
            this.otherProjects = await this.getOtherProjects(objProjects);
            this.undone = new Set();

            const projects = Object.keys(objProjects).map((p) => +p);
            if (this.saveProject !== undefined && !objProjects[this.saveProject]) this.saveProject = undefined;
            //Com um projeto só não há o que escolher: já vem selecionado.
            if (this.saveProject === undefined && projects.length === 1) {
                this.saveProject = projects[0];
                this.initInfoProject();
            }

            if (projects.length > 0) {
                this.itens = objProjects;
            } else {
                this.itens = undefined;
                this.toogleBadge(false, WIDGET);
            }
        } catch (e: any) {
            this.itens = undefined;
            this.error = e.message;
            this.setError(e.message);
        }
    }

    private getActualProjectDependencies(): number[] {
        if (!mls.actualProject) return [];
        const details = mls.l5.getProjectDetails(mls.actualProject);
        const ret = [...(details?.prj_dependencies || [])];
        ret.push(mls.actualProject);
        return ret;
    }

    private getDriverInSave(prj: number): mls.stor.others.DriverIOBase {
        return this.saveDriver || mls.stor.others.getDefaultDriver(prj);
    }

    private selectSaveProject(e: MouseEvent, project: number): void {
        e.stopPropagation();
        this.clearSelection();
        if (this.saveProject === project) {
            this.saveProject = undefined;
            return;
        }
        this.saveProject = project;
        this.initInfoProject();
    }

    private selectProject(e: MouseEvent, project: number): void {
        e.stopPropagation();
        this.selectedProject = this.selectedProject === project ? undefined : project;
        this.init();
    }

    private async getOtherProjects(listedProjects: IDefItem) {
        let dt = await mls.stor.localDB.getKeysWithPrefix('File_');
        dt = dt.filter((t) => t.indexOf(`_${this.currentProject}_`) < 0);
        const info: Record<string, Record<string, string[]>> = {};
        dt.forEach((i) => {
            const file = mls.stor.localDB.parseKeyToFile(i);
            if (!file || file.project === 0 || listedProjects[file.project] || !isGithubProject(file.project)) return;
            const name = `${file.folder ? file.folder + '/' : ''}${file.shortName}`;
            if (!info[file.project]) info[file.project] = {};
            if (!info[file.project][name]) info[file.project][name] = [];
            info[file.project][name].push(file.extension);
        });
        return info;
    }

    private getGroupList(obj: IDefItem, prj: number, level: number, folder: string, shortname: string): Iitem[] {
        if (!obj[prj]) obj[prj] = {};
        if (!obj[prj][level]) obj[prj][level] = {};
        const l = obj[prj][level];
        const key = folder ? folder + '/' + shortname : shortname;
        if (!l[key]) l[key] = [];
        return l[key];
    }

    private fromToExtension: Record<string, string> = {
        '.ts': 'ts',
        '.less': 'style',
        '.html': 'html',
        '.test.ts': 'test',
        '.defs.ts': 'defs'
    }

    private async configItem(item: mls.stor.IFileInfo): Promise<Iitem> {
        let text = item.shortName + item.extension;
        let disabled = false;
        let onlyFather = false;
        if (item.status === 'renamed' && item.getValueInfo) {
            const itemNew = await item.getValueInfo();
            text = `${itemNew.originalShortName + item.extension} → ${text}`;
            disabled = true;
            onlyFather = true;
        }

        const errorLocal = !(await mls.stor.localDB.existFile({ project: item.project, extension: item.extension, shortName: item.shortName, folder: item.folder, level: item.level }));

        let modelIsDispose = false;
        const models = mls.editor.getModels(item.project, item.shortName, item.folder, item.level);
        const ext = this.fromToExtension[item.extension];
        const model = models ? (models as any)[ext] as mls.editor.IModelBase : undefined;
        if (models && model && model.model.isDisposed()) modelIsDispose = true;

        return {
            file: item,
            text,
            hasError: !!item.hasError,
            onlyFather,
            disabled,
            errorLocal,
            modelIsDispose
        }
    }

    private async updateList() {
        try {
            this.loading = true;
            this.clearSelection();
            this.fireEventsDetails();
            await this.setInfos();
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
        } finally {
            this.loading = false;
        }
    }

    private addSaveLog(msg: string): void {
        this.saveLog = [...this.saveLog, msg];
    }

    //Sempre que salvar vai gerar um novo branch no usuario e solicitar um pullrequest.
    private async onSave() {
        if (this.inSaving) return;

        const oldOwner = this.owner;
        const oldRepo = this.repo;
        const oldBranch = this.branch;

        try {
            const msg = this.commitMsg.trim();
            if (!msg) throw new Error(this.myMessage.needComment);
            if (mls.l5.actualOrg === undefined) throw new Error('No organization selected');

            const prj = this.saveProject;
            if (!prj) throw new Error(this.myMessage.selectProjectToSave);

            const array = this.getFilesToSave().filter((f) => f.project === prj);
            if (array.some((f) => f.hasError && f.status !== 'deleted')) {
                if (!window.confirm(this.myMessage.msgErrorFilesSelected)) return;
            }

            this.inSaving = true;
            this.saveLog = [];
            this.loading = true;

            const driver = await getGitDriver(prj);

            //Repositório do save vem da url do l5/config.json; sem config.json ou sem url, o save para.
            const keys = await getGitRepoKeys(prj);
            this.owner = keys.owner;
            this.repo = keys.repo;
            this.branch = keys.branch;

            this.saveDriver = driver;
            this.arrayRollback = array;
            this.isRemovedFork = false;

            this.addSaveLog(`Checking fork of ${this.owner}/${this.repo}...`);
            await this.verifyForkTarget(driver);

            this.addSaveLog(`Updating fork main (${this.owner}/${this.repo})...`);
            await this.fireCreateForkOrUpdate();

            this.addSaveLog(`Creating branch in ${this.owner}/${this.repo}...`);
            await this.fireCreateNewBranch();

            this.addSaveLog(`Saving ${array.length} files in branch ${this.branch}...`);
            await this.onSavenewPullrequest(array, msg);

            const saveInfo = (driver as any).lastSaveInfo as { commits: number, skippedDeletions: string[] } | undefined;
            const hasCommits = !saveInfo || saveInfo.commits > 0;

            if (hasCommits) {
                this.addSaveLog(`Generating a pull request...`);
                await this.firePullrequest(msg);
            }

            this.clearSelection();
            await this.afterSave(array);
            this.commitMsg = '';

            this.clearLocalHIstoryCurrentInfoDriver();
            this.saveDriver = undefined;

            this.inSaving = false;
            this.owner = oldOwner;
            this.repo = oldRepo;
            this.branch = oldBranch;

            await this.setInfos();
            this.fireEvents();
            const msgEnd = hasCommits ? this.myMessage.pullrequestOk : this.myMessage.msgAllSynced;
            (window as any).collabMessages.add(msgEnd, 'information', { timeToClose: 5000, autoClose: true });
            this.loading = false;

        } catch (err: any) {
            this.inSaving = false;
            this.saveDriver = undefined;
            this.owner = oldOwner;
            this.repo = oldRepo;
            this.branch = oldBranch;

            this.arrayRollback.forEach((i) => {
                if (!i.inLocalStorage) i.inLocalStorage = true;
            });
            this.error = err.message;
            this.setError(err.message);
            this.clearSelection();
            this.loading = false;
            console.info('Error onSave:', err);
        }
    }

    private async afterSave(fileInfos: mls.stor.IFileInfo[]) {
        try {
            for await (const f of fileInfos) {
                if (f.onAction) await f.onAction('aftersave');
            }
        } catch (e: any) {
            console.info('Erro onAftersave:' + e.message);
        }
    }

    private async onSavenewPullrequest(ar: mls.stor.IFileInfo[], msg: string) {
        if (ar.length <= 0) return;
        try {
            const arrSet: mls.stor.IFileInfo[] = [];
            ar.forEach((i) => {
                i.inLocalStorage = false;
                if (!i.onAction) i.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(i);
                arrSet.push(i);
            });

            //O driver publica o progresso em window.messageSave; cada "success" é um arquivo a mais.
            const father = this;
            let currentFile = 0;
            let _value: any;
            Object.defineProperty(window as any, "messageSave", {
                get() {
                    return _value;
                },
                set(newValue) {
                    _value = newValue;
                    if (newValue.startsWith('success')) currentFile++;
                    father.addSaveLog(`FILES(${currentFile}/${arrSet.length}) ${newValue}`);
                },
                configurable: true
            });

            //Direto no driver do save: o mls.stor.setContents iria pelo slot, que no VM só lê.
            const prj = this.projectInSave as number;
            await this.getDriverInSave(prj).setContents(prj, arrSet, msg);
        } catch (e: any) {
            throw new Error(e.message + ' in: onSavenewPullrequest');
        }
    }

    //Trava antes de mexer no GitHub: o fork do usuário tem que ser login/repo. Fora do try do
    //fireCreateForkOrUpdate de propósito, para não cair no removeFork (que apaga login/repo).
    private async verifyForkTarget(driver: mls.stor.others.DriverIOBase): Promise<void> {
        if (driver.shortName !== 'github') return;
        const login = (await driver.getUserInfo()).login;
        const origin = `${this.owner}/${this.repo}`;
        const target = `${login}/${this.repo}`;
        const msg = (text: string, fork: string = '') => text
            .replace('[origin]', origin).replace('[fork]', fork).replace('[login]', login).replace('[repo]', this.repo);

        const forks = await driver.listForks(this.owner, this.repo);
        const myFork = forks.find((f) => f.nameWithOwner.toLowerCase().startsWith(`${login.toLowerCase()}/`));
        if (myFork) {
            if (myFork.nameWithOwner.toLowerCase() !== target.toLowerCase()) throw new Error(msg(this.myMessage.forkNameMismatch, myFork.nameWithOwner));
            return;
        }

        let repoId = '';
        try {
            repoId = await (driver as any).getIdProjectIO(0, login, this.repo);
        } catch (e: any) {
            if (!/could not resolve/i.test(e?.message || '')) throw e;
        }
        if (repoId) throw new Error(msg(this.myMessage.repoNotFork));
    }

    private isRemovedFork: boolean = false;
    private async fireCreateForkOrUpdate() {
        try {
            const prj = this.projectInSave;
            if (!prj) throw new Error('Not found project actual');

            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = this.getDriverInSave(prj);
            const user = await driver.getUserInfo();

            info.login = user.login;
            const isForkExist = await (driver as any).checkForkIO(this.owner, this.repo, info.login);

            if (!isForkExist) {
                const ret = await driver.createFork(info.login, this.repo, this.owner, info.login);
                if (!ret) throw new Error('Error create fork');
                this.owner = info.login;
                this.branch = 'main';
            } else {
                const opt = {
                    repoOrigin: this.repo,
                    ownerOrigin: this.owner,
                    branchOrigin: 'main',
                    repoDest: this.repo,
                    ownerDest: info.login,
                    branchDest: 'main',
                }
                const ret = await (driver as any).syncFork(prj, opt);
                if (!ret) throw new Error('Error sync fork');
                this.owner = info.login;
            }

        } catch (e: any) {
            if (!this.isRemovedFork) {
                await this.removeFork();
                return;
            }
            this.error = e.message;
            this.setError(e.message);
            this.loading = false;
            console.info('Error fireCreateForkOrUpdate: ' + e.message);
            throw new Error(e.message + ' in: fireCreateForkOrUpdate');
        }
    }

    private async removeFork() {
        try {
            this.isRemovedFork = true;
            const prj = this.projectInSave;
            if (!prj) throw new Error('Not found project actual');
            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = this.getDriverInSave(prj);
            const user = await driver.getUserInfo();
            info.login = user.login;
            const isForkExist = await (driver as any).checkForkIO(this.owner, this.repo, info.login);
            if (!isForkExist) throw new Error('removeFork: Not found fork for delet');
            await driver.deleteRepository(this.repo, info.login);
            console.info('deletou o fork');
            await this.fireCreateForkOrUpdate();
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
            this.loading = false;
            console.info('Error removeFork: ' + e.message);
            throw new Error(e.message + ' in: removeFork');
        }
    }

    private async fireCreateNewBranch() {
        try {
            const prj = this.projectInSave;
            if (!prj) throw new Error('Not found project actual');
            const driver = this.getDriverInSave(prj);
            const user = await driver.getUserInfo();
            const newBranch = user.login + '_' + Date.now().toString();
            const ret = await driver.createNewBranch({ owner: this.owner, repo: this.repo, branch: this.branch, newBranch: newBranch });
            if (!ret) throw new Error('Error create Branch');
            this.branch = newBranch;
            this.setLocalHIstoryCurrentInfoDriver();
        } catch (err: any) {
            throw new Error(err.message + ' in: fireCreateNewBranch');
        }
    }

    private async firePullrequest(msg: string) {
        try {
            const prj = this.projectInSave;
            if (!prj) throw new Error('Not found project actual');
            const driver = this.getDriverInSave(prj);
            const opt = {
                owner: this.owner,
                repo: this.repo,
                branch: this.branch,
                title: msg,
                description: msg
            }
            const ret = await (driver as any).createPullRequest(prj, opt);
            if (!ret) throw new Error('Error Pull request');
        } catch (err: any) {
            throw new Error(err.message + ' in: firePullrequest');
        }
    }

    private clearLocalHIstoryCurrentInfoDriver(): void {
        const prj = this.projectInSave;
        if (!prj) throw new Error('Not found project actual');
        const info: any = JSON.parse(localStorage.getItem('InfoCurrentDriver') || '{}');
        if (info[prj]) delete info[prj];
        localStorage.setItem('InfoCurrentDriver', JSON.stringify(info));
    }

    private setLocalHIstoryCurrentInfoDriver(user: string | undefined = undefined): void {
        const prj = this.projectInSave;
        if (!prj) throw new Error('Not found project actual');
        const info: any = JSON.parse(localStorage.getItem('InfoCurrentDriver') || '{}');
        info[prj] = {
            owner: this.owner,
            repo: this.repo,
            branch: this.branch,
            login: user ? user : info.login
        }
        localStorage.setItem('InfoCurrentDriver', JSON.stringify(info));
    }

    private getLocalHIstoryCurrentInfoDriver(): { owner: string, repo: string, branch: string, login: string } {
        const prj = this.projectInSave;
        if (!prj) throw new Error('Not found project actual');
        const info: any = JSON.parse(localStorage.getItem('InfoCurrentDriver') || '{}');
        return info[prj] || {} as any;
    }

    private async afterUpdate(storFile: mls.stor.IFileInfo) {
        const mmodel: mls.editor.IModels | undefined = mls.editor.getModels(storFile.project, storFile.shortName, storFile.folder);
        storFile.inLocalStorage = false;
        if (storFile.status === 'deleted') {
            await this.deleteFile(storFile);
            return;
        }
        if (storFile.status === 'renamed' && mmodel && mmodel.ts) {
            mmodel.ts.originalProject = undefined;
            mmodel.ts.originalShortName = undefined;
            mmodel.ts.originalCRC = mls.common.crc.crc32(mmodel.ts.model.getValue()).toString(16);
        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        storFile.status = 'nochange';
    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        if (storFile.inLocalStorage) {
            await mls.stor.cache.setContent(storFile, null);
            mls.editor.deleteModels(storFile.project, storFile.shortName, storFile.folder, true, storFile.level);
        }
        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];
    }

    private fireEvents(time: number = 0): void {
        const params = {} as mls.events.IFileAction;
        params.action = 'projectListChanged';
        params.level = 5;
        params.project = this.currentProject as number;
        params.position = this.position as ('right' | 'left');
        mls.events.fire([5], ['FileAction'], JSON.stringify(params), time);
        this.fireEventsDetails();
    }

    private fireEventsDetails() {
        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: '<plugin-git--plugin-pullrequest-100555 autoPrepare="true"></plugin-git--plugin-pullrequest-100555><plugin-verify--plugin-verify-error-100555 autoPrepare="true"></plugin-verify--plugin-verify-error-100555>'
        }
        mls.events.fire(mls.actualLevel as any, 'PluginDetails' as any, JSON.stringify(options), 0);
    }
}

interface IDefItem {
    [project: number]: IDefItemLevel
}

interface IDefItemLevel {
    [level: number]: Ifile
}

interface Ifile {
    [name: string]: Iitem[]
}

interface Iitem {
    file: mls.stor.IFileInfo;
    text: string,
    hasError: boolean,
    onlyFather: boolean,
    disabled: boolean,
    errorLocal: boolean,
    modelIsDispose: boolean
}

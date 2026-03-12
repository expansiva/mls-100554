/// <mls fileReference="_100554_/l2/pluginCollabPublish.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, svg, TemplateResult, unsafeHTML } from 'lit';
import { state, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { getAllDefs, IdefModule } from '/_100554_/l2/libMindMap.js';
import { getDependenciesByHtmlFile } from '/_100554_/l2/libCompile.js';
import { PreviewModeSinglePage } from '/_100554_/l2/previewModeSinglePage.js'; 
import { getMyKeysBranch } from '/_100554_/l2/libCommom.js';
import { getConfigProject, updateConfigProject } from '/_100554_/l2/libProjectConfig.js';

/// **collab_i18n_start**
const message_pt = {
    step1: "Selecionar Linguagem",
    step2: "Selecionar Páginas",
    step3: "Log de Publicação",
    continue: "Continuar",
    back: "Voltar",
    publish: "Publicar",
    alertTitle: "⚠️ Atenção",
    alertOnlySelected: "Apenas as páginas selecionadas neste passo serão atualizadas.",
    alertNotSelected: "Páginas não selecionadas não serão atualizadas após a conclusão.",
    alertReview: "Recomendamos revisar cuidadosamente as páginas selecionadas antes de continuar.",
    errorLanguage: "É preciso selecionar pelo menos uma linguagem!",
    errorPage: "É preciso selecionar pelo menos uma página!",
    startPublish: "Iniciando processo de publicação",
    publishCompleted: "Publicação concluída!",
    startingPublishLanguage: "Iniciando publicação da linguagem:",
    compilingPage: "Compilando página:",
    startingSaveDist: "Iniciando salvamento do dist",
    checkingFork: "Verificando fork...",
    addNewBranch: "Criando nova branch...",
    savingFiles: "Salvando arquivos...",
    savingAssets: "Salvando recursos...",
    creatingPullRequest: "Criando pull request..."
}

const message_en = {
    step1: "Select Language",
    step2: "Select Pages",
    step3: "Publish Log",
    continue: "Continue",
    back: "Back",
    publish: "Publish",
    alertTitle: "⚠️ Attention",
    alertOnlySelected: "Only selected pages will be updated.",
    alertNotSelected: "Unselected pages will not be updated after completion.",
    alertReview: "We recommend carefully reviewing selected pages before continuing.",
    errorLanguage: "You must select at least one language!",
    errorPage: "You must select at least one page!",
    startPublish: "Starting publish process",
    publishCompleted: "Publish completed!",
    startingPublishLanguage: "Starting publish language:",
    compilingPage: "Compiling page:",
    startingSaveDist: "Starting save dist",
    checkingFork: "Checking fork...",
    addNewBranch: "Creating new branch...",
    savingFiles: "Saving files...",
    savingAssets: "Saving assets...",
    creatingPullRequest: "Creating pull request..."
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

export class PluginCollabPublish extends PluginBaseModule {

    private myState: IStatePlugin = {
        languages: [],
        pages: [],
        assets: [],
        actualtheme: 'Default'
    };

    private msg: MessageType = messages['en'];
    @state() completed: number[] = [];
    @state() current: number = 1;
    @state() languages: ILanguage[] = [];
    @state() pages: mls.stor.IFileInfo[] = [];
    @state() inPublish: boolean = false;
    @state() logs: string[] = [];
    @query('#logBox') logBox: HTMLElement | undefined;


    firstUpdated() {
        this.init();
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
    }

    render(): TemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <div class="agent-box">
            ${this.renderHeader()}
            ${this.renderWizard()}
            ${this.renderScenary()}
            
        </div> 
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${pluginData.title} - ${mls.actualProject}</span>
            </header>
        `;
    }

    renderWizard() {
        return html`
            <div class="steps">
                <div class="step ${this.completed.includes(1) ? 'completed' : ''} ${this.current == 1 ? 'active' : ''}">
                    <div class="circle">1</div>
                    <span>${this.msg.step1}</span>
                </div>
                <div class="step ${this.completed.includes(2) ? 'completed' : ''} ${this.current == 2 ? 'active' : ''}">
                    <div class="circle">2</div>
                    <span>${this.msg.step2}</span>
                </div>
                <div class="step ${this.completed.includes(3) ? 'completed' : ''} ${this.current == 3 ? 'active' : ''}">
                    <div class="circle">3</div>
                    <span>${this.msg.step3}</span>
                </div>
            </div>
        `
    }

    renderScenary() {

        switch (this.current) {
            case (1): return this.renderScenary1();
            case (2): return this.renderScenary2();
            case (3): return this.renderScenary3();
        }

    }

    renderScenary1() {
        return html`
            <div class="content">
                <div class="grid">
                    ${this.languages.map((l) =>
            html`
                            <label class="card" for="${l.name}">
                                <input type="checkbox" .info=${l} id="${l.name}"> ${l.name} <small>(path: "${l.path}")</small>
                            </label>`
        )}

                </div>

                <div class="actions">
                    <button @click=${() => this.next(2)}>${this.msg.continue}</button>
                </div>
            
            </div>

        `
    }

    renderScenary2() {
        return html`
            <div class="content"> 
                <div class="grid">
                    ${this.pages.map((p) =>
            html`
                            <label class="card" for="${p.shortName}">
                                <input type="checkbox" .info=${p} id="${p.shortName}"> ${p.folder ? p.folder + '/' + p.shortName : p.shortName}
                            </label>`
        )}
                </div>
                <details class="publish-alert">
                    <summary class="alert-title">${this.msg.alertTitle}</summary>
                    <p><strong>${this.msg.publish}:</strong></p>
                    <ul>
                        <li>${this.msg.alertOnlySelected}</li>
                        <li>${this.msg.alertNotSelected}</li>
                        <li>${this.msg.alertReview}</li>
                    </ul>
                </details>
                <div class="actions">
                    <button @click=${() => this.next(1)} class="secondary">${this.msg.back}</button>
                    <button @click=${() => this.next(3)}>${this.msg.continue}</button>
                </div>
            </div>

        `
    }

    renderScenary3() {
        return html`
            <div class="content"> 
                <div class="log-box" id="logBox">
                    ${this.logs.map((p) => unsafeHTML(p))}
                </div>
                <div class="actions">
                    <button @click=${() => this.next(2)} class="secondary" ?disabled=${this.inPublish}>${this.msg.back}</button>
                    <button @click=${this.startPublish} class="publish-btn ${this.inPublish ? 'loading' : ''}">
                        <span class="btn-text">${this.msg.publish}</span>
                        <span class="loader"></span>
                    </button>
                </div>
            </div>

        `
    }

    //-------IMPLEMENTATION-------

    private async init() {

        await this.getLanguages();
        await this.getPages();
        this.getAssets();

    }

    private async getLanguages() {

        const info = await mls.l5.getProjectConf(mls.actualProject || 0);
        this.languages = info.languages;

    }

    private async getPages() {

        const allItens = await getAllDefs();
        const pages: mls.stor.IFileInfo[] = [];
        Object.keys(allItens).forEach((key: string) => {

            if (!allItens) return;
            const item = allItens[key];
            if (item.defs.meta.componentType === 'page') {
                const stor = mls.stor.files[key.replace('.defs', '')];
                if (stor && stor.project === mls.actualProject) pages.push(stor);
            }

        })

        this.pages = pages;

    }

    private getAssets() {

        const assets: mls.stor.IFileInfo[] = [];
        Object.keys(mls.stor.files).forEach((key) => {

            const stor = mls.stor.files[key];
            if (stor.project === mls.actualProject && stor.level === 3) {
                assets.push(stor);
            }

        });

        this.myState.assets = assets;

    }

    private next(scenary: number) {

        try {

            if (this.current === 1) {
                this.isValid1()
            }

            if (this.current === 2) {
                this.isValid2()
            }

            if (scenary === 1) {
                this.completed = [];
            }

            if (scenary === 2) {
                this.completed = [1];
            }

            if (scenary === 3) {
                this.logs = [];
                this.completed = [1, 2];
            }

            this.current = scenary;

        } catch (e: any) {
            alert(e && e.message ? e.message : 'Error invalid step');
        }

    }

    private isValid1() {
        const els = this.querySelectorAll('input:checked');
        if (els.length < 1) throw new Error(this.msg.errorLanguage);
        const infos: ILanguage[] = [];
        els.forEach((el: any) => {
            if (el.info) infos.push(el.info);
        });

        if (infos.length < 1) throw new Error(this.msg.errorLanguage);
        this.myState.languages = infos;

    }

    private isValid2() {
        const els = this.querySelectorAll('input:checked');
        if (els.length < 1) throw new Error(this.msg.errorPage);
        const infos: mls.stor.IFileInfo[] = [];
        els.forEach((el: any) => {
            if (el.info) infos.push(el.info);
        });

        if (infos.length < 1) throw new Error(this.msg.errorPage);
        this.myState.pages = infos;

    }

    private async startPublish() {
        this.inPublish = true;
        await this.addLog(`${this.msg.startPublish} (${this.myState.pages.length} pages)...`, 'INFO');
        let pages: mls.stor.IFileInfo[] = [];
        for await (const lang of this.myState.languages) {
            const ps = await this.publishByLanguage(lang);
            pages = [...pages, ...ps];
        }

        await this.onSave(pages);
        await this.addLog(this.msg.publishCompleted, 'SUCCESS');
        this.inPublish = false;
    }

    private async publishByLanguage(lang: ILanguage) {

        await this.addLog(`**************************************************`, 'INFO');
        await this.addLog(`Starting publish language: ${lang.name}`, 'INFO');
        const pages: mls.stor.IFileInfo[] = [];
        for await (const stor of this.myState.pages) {
            const p = await this.publishPage(lang, stor);
            if (p) pages.push(p);
        }

        return pages;


    }

    private async publishPage(lang: ILanguage, stor: mls.stor.IFileInfo): Promise<mls.stor.IFileInfo | undefined> {
        try {

            await this.addLog(`Compiling page: ${stor.folder ? stor.folder + '/' + stor.shortName : stor.shortName}`, 'INFO');

            let { project, shortName, folder } = stor;

            const keyHTML = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.html');

            if (!mls.stor.files[keyHTML]) {
                await this.addLog(`Not found html page: ${stor.folder ? stor.folder + '/' + stor.shortName : stor.shortName}`, 'ERROR');
                return undefined;
            }

            const contentHTML = await mls.stor.files[keyHTML].getContent() as string;

            let json = await getDependenciesByHtmlFile(stor, contentHTML, this.myState.actualtheme, true);



            const js = await this.modeSinglePage(json, stor);
            const content = this.mounHTML(json, js, contentHTML, lang);

            const auxFolder = lang.path === '/' || lang.path === '' ? '/' : lang.path + '/';

            const info: mls.stor.IFileInfo = {
                project,
                shortName,
                folder: 'dist' + auxFolder + folder,
                level: 0,
                extension: '.html',
                versionRef: '',
                projectDependencies: null,
                isLocalVersionOutdated: false,
                inLocalStorage: false,
                status: 'changed',
                hasError: false,
                getContent: function (this: mls.stor.IFileInfo, defaultValue?: string | Blob | null | undefined): Promise<string | Blob | null> {
                    return new Promise((resolve) => resolve(content));
                },
                getValueInfo: function (this: mls.stor.IFileInfo): Promise<mls.stor.IFileInfoValue> {
                    return new Promise((resolve) => resolve({ content, contentType: 'string' }));
                },
                getHistory: function (this: mls.stor.IFileInfo): Promise<mls.stor.IHistory[] | null> {
                    throw new Error('Function not implemented.');
                },
                getHistoryContent: function (this: mls.stor.IFileInfo, ref: string): Promise<string | null> {
                    throw new Error('Function not implemented.');
                },
                saveContentInCacheIfNeed: function (): Promise<string | null> {
                    throw new Error('Function not implemented.');
                },
                getOrCreateModel: async function (): Promise<mls.editor.IModelBase> {
                    throw new Error('Function not implemented.');
                }
            }

            return info;

        } catch (e: any) {
            console.info(e)
            return undefined;
        }


    }

    private mounHTML(json: any, js: String, contentHTML: string, lang: ILanguage) {

        const auxCss = json.globalCss ? `
            <style>
                ${json.globalCss}
            </style>
        ` : '';

        let html = `
            <html lang="${lang.language}" >
            <head>
                ${this.importJSON(json)}
                <style>
                    ${json.tokens || ''}
                </style>
                ${auxCss}
            </head>
            <body>
                ${contentHTML}
                <script>
                    ${js}
                </script>
            </body>
            </html>
        
        `

        return html;
    }

    private importJSON(info: any) {
        return `
            <script type="importmap">
                {"imports": { ${info.importsMap.join(',\n')}} }
            </script>`;
    }

    private addGlobalCss(globalCss: string, ifr: HTMLIFrameElement) {
        if (!globalCss || !ifr.contentDocument) return
        try {
            const oldStyle = ifr.contentDocument.querySelector('style#global_css');
            if (oldStyle) oldStyle.remove();
            const style = document.createElement('style');
            style.textContent = globalCss;
            style.id = 'global_css';
            style.type = "text/tailwindcss";
            ifr.contentDocument.head.appendChild(style);

        } catch (e: any) {
            console.info('Error mountTokens: ' + e.message);
        }
    }

    private async modeSinglePage(json: any, file: mls.stor.IFileInfo) {
        if (!file) return;
        const c = new PreviewModeSinglePage(json, document.createElement('div') as HTMLIFrameElement, '2', false, file, undefined);
        const outBuild = await c.buildJS([]);
        return outBuild.outputFiles[0].text
    }

    private async addLog(msg: string, tp: 'INFO' | 'SUCCESS' | 'ERROR') {

        let str = '';
        if (tp === 'INFO') {
            str = `<div class="log-line log-info">[INFO] ${msg}</div>`
        } else if (tp === 'SUCCESS') {
            str = `<div class="log-line log-success">[SUCCESS] ${msg}</div>`
        } else if (tp === 'ERROR') {
            str = `<div class="log-line log-error">[ERROR] ${msg}</div>`
        } else {
            str = `<div class="log-line">[MESSAGE] ${msg}</div>`
        }

        this.logs = [...this.logs, str]; // IMPORTANTE: nova referência
        await this.waitRender();         // 🔥 deixa o browser pintar

        if (this.logBox) {
            this.logBox.scrollTop = this.logBox.scrollHeight;
        }
    }


    private isRemovedFork = false;
    private owner = '';
    private repo = '';
    private branch = '';
    private async onSave(array: mls.stor.IFileInfo[]) {

        const info = getMyKeysBranch(mls.actualProject || 0);
        if (!info) return;

        await this.addLog(`**************************************************`, 'INFO');
        await this.addLog(this.msg.startingPublishLanguage, 'INFO');


        this.owner = info.owner;
        this.repo = info.repo;
        this.branch = info.branch;

        const oldOwner = info.owner;
        const oldRepo = info.repo;
        const oldBranch = info.branch;

        try {

            if (!mls.l5.actualOrg) throw new Error('No organization selected');

            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');

            const actualOrg = Object.keys(mls.stor.orgs)[mls.l5.actualOrg];
            const config = await getConfigProject(prj, true);
            if (!config) throw new Error('Not found config file in this project');

            const configOrg = config.orgName;
            if (actualOrg !== configOrg) {
                config.orgName = actualOrg;
                await updateConfigProject(prj, config);
            }

            const msg = 'Save dist';
            this.isRemovedFork = false;

            await this.addLog(this.msg.checkingFork, 'INFO');
            await this.fireCreateForkOrUpdate();

            await this.addLog(this.msg.addNewBranch, 'INFO');
            await this.fireCreateNewBranch();

            await this.addLog(this.msg.savingFiles, 'INFO');
            await this.onSavenewPullrequest(array, msg);

            await this.addLog(this.msg.savingAssets, 'INFO');
            //await this.onSaveAssets(msg);

            await this.addLog(this.msg.creatingPullRequest, 'INFO');
            await this.firePullrequest(msg);

            this.clearLocalHIstoryCurrentInfoDriver();
            this.owner = oldOwner;
            this.repo = oldRepo;
            this.branch = oldBranch;

        } catch (err: any) {
            this.owner = oldOwner;
            this.repo = oldRepo;
            this.branch = oldBranch;
            console.info('Error onSave:', err);
        }
    }

    private async onSaveAssets(msg: string) {
    
        if (!this.myState.assets || this.myState.assets.length < 1) return;

        const assets: mls.stor.IFileInfo[] = [];

        this.myState.assets.forEach(async (s, index) => {

            if (index !== 0) return;
            const { project, shortName, folder, extension } = s;
            const auxFolder = '/l3/';

            const content = await s.getContent();
            const vinfo = s.getValueInfo ? await s.getValueInfo() : undefined;

            const info: mls.stor.IFileInfo = {
                project,
                shortName,
                folder: 'dist' + auxFolder + folder,
                level: 0,
                extension,
                versionRef: '',
                projectDependencies: null,
                isLocalVersionOutdated: false,
                inLocalStorage: false,
                status: 'changed',
                hasError: false,
                getContent: function (this: mls.stor.IFileInfo, defaultValue?: string | Blob | null | undefined): Promise<string | Blob | null> {
                    return new Promise((resolve) => resolve(content));
                },
                getValueInfo: function (this: mls.stor.IFileInfo): Promise<mls.stor.IFileInfoValue> {
                    return new Promise((resolve) => resolve({ content, contentType: vinfo ? vinfo.contentType : 'blob' }));
                },
                getHistory: function (this: mls.stor.IFileInfo): Promise<mls.stor.IHistory[] | null> {
                    throw new Error('Function not implemented.');
                },
                getHistoryContent: function (this: mls.stor.IFileInfo, ref: string): Promise<string | null> {
                    throw new Error('Function not implemented.');
                },
                saveContentInCacheIfNeed: function (): Promise<string | null> {
                    throw new Error('Function not implemented.');
                },
                getOrCreateModel: async function (): Promise<mls.editor.IModelBase> {
                    throw new Error('Function not implemented.');
                }
            }

            assets.push(info);

        });

        await this.onSavenewPullrequest(assets, msg);

    }

    private clearLocalHIstoryCurrentInfoDriver(): void {
        const prj = mls.actualProject;
        if (!prj) throw new Error('Not found project actual');
        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';
        const info: any = JSON.parse(str);
        if (info[prj]) delete info[prj];
        localStorage.setItem('InfoCurrentDriver', JSON.stringify(info));
    }

    private async firePullrequest(msg: string) {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const driver = mls.stor.others.getDefaultDriver(prj);
            const opt = {
                owner: this.owner,
                repo: this.repo,
                branch: this.branch,
                title: msg,
                description: msg
            }
            const ret = await driver.createPullRequest(opt);
            if (!ret) throw new Error('Error Pull request');
        } catch (err: any) {
            throw new Error(err.message + ' in: firePullrequest');
        }
    }

    private async onSavenewPullrequest(ar: mls.stor.IFileInfo[], msg: string) {
        if (ar.length <= 0) return;
        try {
            const arrSet: mls.stor.IFileInfo[] = [];
            ar.forEach((i) => {
                i.inLocalStorage = false;
                if (!i.onAction) i.onAction = async (action: mls.stor.IFileInfoAction) => {

                }
                arrSet.push(i);
            });

            let father = this;
            let currentFile = 0;
            let _value: any;
            Object.defineProperty(window as any, "messageSave", {
                get() {
                    return _value;
                },
                set(newValue) {
                    const oldValue = _value;
                    _value = newValue;

                    let aux = newValue;
                    if (newValue.startsWith('success')) {
                        currentFile++;
                        aux = '';
                    }


                },
                configurable: true
            });

            if (arrSet.length > 0) {
                await mls.stor.setContents(arrSet, msg);

            }
            return;
        } catch (e: any) {
            //this.error = e.message;
            //this.setError(e.message);
            throw new Error(e.message + ' in: onSavenewPullrequest');
        }
    }

    private async fireCreateForkOrUpdate() {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');

            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = mls.stor.others.getDefaultDriver(prj);
            const user = await driver.getUserInfo();

            info.login = user.login;
            const isForkExist = await (driver as any).checkForkIO(this.owner, this.repo, info.login);

            if (!isForkExist) {
                //console.info('criou um novo fork');
                const ret = await driver.createFork(info.login, this.repo, this.owner, info.login);
                if (!ret) throw new Error('Error create fork');
                this.owner = info.login;
                this.branch = 'main';
            } else {
                //console.info('atualizou fork');
                const opt = {
                    repoOrigin: this.repo,
                    ownerOrigin: this.owner,
                    branchOrigin: 'main',
                    repoDest: this.repo,
                    ownerDest: info.login,
                    branchDest: 'main',
                }
                const ret = await (driver as any).syncFork(opt);
                if (!ret) throw new Error('Error sync fork');
                this.owner = info.login;
            }

        } catch (e: any) {
            if (!this.isRemovedFork) {
                await this.removeFork();
                return;
            }
            console.info('Error fireCreateForkOrUpdate: ' + e.message);
            throw new Error(e.message + ' in: fireCreateForkOrUpdate');
        }
    }

    private getLocalHIstoryCurrentInfoDriver(): { owner: string, repo: string, branch: string, login: string } {
        const prj = mls.actualProject;
        if (!prj) throw new Error('Not found project actual');
        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';
        const info: any = JSON.parse(str);
        if (info[prj]) return info[prj]
        return {} as any;
    }

    private async removeFork() {
        try {
            this.isRemovedFork = true;
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = mls.stor.others.getDefaultDriver(prj);
            const user = await driver.getUserInfo();
            info.login = user.login;
            const isForkExist = await (driver as any).checkForkIO(this.owner, this.repo, info.login);
            if (!isForkExist) throw new Error('removeFork: Not found fork for delet');
            await driver.deleteRepository(this.repo, info.login);
            console.info('deletou o fork');
            await this.fireCreateForkOrUpdate();
        } catch (e: any) {
            console.info('Error removeFork: ' + e.message);
            throw new Error(e.message + ' in: removeFork');
        }
    }

    private async fireCreateNewBranch() {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const driver = mls.stor.others.getDefaultDriver(prj);
            const user = await driver.getUserInfo();
            const login = user.login;
            const newBranch = login + '_' + Date.now().toString();
            const ret = await driver.createNewBranch({ owner: this.owner, repo: this.repo, branch: this.branch, newBranch: newBranch });
            if (!ret) throw new Error('Error create Branch');
            this.branch = newBranch;
            this.setLocalHIstoryCurrentInfoDriver();
        } catch (err: any) {
            throw new Error(err.message + ' in: fireCreateNewBranch')
        }
    }

    private setLocalHIstoryCurrentInfoDriver(user: string | undefined = undefined): void {
        const prj = mls.actualProject;
        if (!prj) throw new Error('Not found project actual');
        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';
        const info: any = JSON.parse(str);
        info[prj] = {
            owner: this.owner,
            repo: this.repo,
            branch: this.branch,
            login: user ? user : info.login
        }
        localStorage.setItem('InfoCurrentDriver', JSON.stringify(info));
    }

    private async waitRender() {
        await new Promise(requestAnimationFrame);
    }

}

interface ILanguage {
    language: string,
    name: string,
    path: string
}

interface IStatePlugin {
    languages: ILanguage[],
    pages: mls.stor.IFileInfo[],
    assets: mls.stor.IFileInfo[],
    actualtheme: string
}

if (!customElements.get('plugin-collab-publish-100554')) {
    customElements.define('plugin-collab-publish-100554', PluginCollabPublish);
}

export const pluginData: mls.plugin.IPluginData = {
    title: "Publish Project",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>
    `;
    }
}
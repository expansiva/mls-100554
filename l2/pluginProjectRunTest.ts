/// <mls shortName="pluginProjectRunTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, repeat, LitElement } from 'lit';
import { query, property } from 'lit/decorators.js';
import { forceServiceInstance } from './_100554_libCommom'
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { ICANTest, ICANIntegration, TsTestAst } from './_100554_tsTestAST';
import { CollabPageElement } from './_100554_collabPageElement';
import { collab_fileTest } from './_100554_collabIcons';

import './_100554_collabResultTest';

/// **collab_i18n_start**
const message_pt = {
    title: 'Executar testes',
    info: 'Este plugin executa automaticamente todos os testes disponíveis para a todas as páginas com teste no projeto.',
    page: 'Página'
}

const message_en = {
    title: 'Run Tests',
    info: 'This plugin automatically runs all available tests for all pages with tests in the project.',
    page: 'Page'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Run Tests",
    getSvg(): TemplateResult {
        return collab_fileTest;
    }
};

export class PluginProjectRunTest extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @query('collab-result-container-100554') collabResultContainer: HTMLElement | undefined;


    @property() progress: number = 0;
    @property() totalTest: number = 0;
    @property() actualAllPagesTests = 0;
    @property() filesWithTest: string[] = []

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

            <div>
                <h1>${this.msg.title}</h1>
                <small>${this.msg.info}</small>
                <div class="actions">
                    <button @click=${this.exec}>${this.msg.title}</button>
                </div>
            </div>


            <div class="progress-container">
				<div class="progress-bar" style="width: ${this.progress}%;"></div>
			</div>
            <collab-result-container-100554>
            
            </collab-result-container-100554>
        `;
    }

    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties)
        this.init();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('actualAllPagesTests')) {
            this.calcProgress(this.totalTest, this.actualAllPagesTests);
        }
    }

    private async init() {
        try {
            const { project } = mls.actual[5];
            if (!project) return;
            this.clear();
            this.filesWithTest = await this.getStorFilesWithTest(project);
        } catch (err: any) {
            console.info(err);
        }

    }

    private async exec() {
        this.clear();
        const models = await this.createModelsIfNeeded(this.filesWithTest);
        const tests = await this.getTestsByFile(models);
        this.totalTest = this.countTotalTests(tests);
        await forceServiceInstance(5, '_100554_servicePreview');
        await this.runAllTests(tests);
        this.onFinishTest();
    }

    private clear() {
        if (this.collabResultContainer) this.collabResultContainer.innerHTML = '';
        this.progress = 0;
        this.actualAllPagesTests = 0;
        this.totalTest = 0;

    }

    private countTotalTests(tests: ITests) {
        let total = 0
        Object.keys(tests).forEach((test) => {
            tests[test].tests.forEach((testData) => {
                let lengthTest = testData.params.length;
                total += lengthTest;
            });
        });
        return total;
    }

    private calcProgress(total: number, actual: number) {
        if (total <= 0) return;
        const part = 100 / total;
        const percent = actual * part;
        this.progress = percent;
    }

    private async createModelsIfNeeded(files: string[]) {
        await forceServiceInstance(2, '_100554_serviceSource');
        const instance = mls.services['100554_serviceSource_left'];
        if (!instance) throw new Error('Invalid instance for service source');
        if (!instance.createModels || typeof instance.createModels !== 'function') throw new Error(`Invalid function createModels`);

        const rc: mls.editor.IModelBase[] = []

        for await (let key of files) {
            const storFile = mls.stor.files[key];
            if (!storFile) continue;
            await instance.createModels(storFile);

            const keyModel = mls.editor.getKeyModel(storFile.project, storFile.shortName);
            if (mls.editor.models[keyModel] && mls.editor.models[keyModel].test) rc.push(mls.editor.models[keyModel].test as mls.editor.IModelBase)

        }

        return rc;
    }

    private async getTestsByFile(models: mls.editor.IModelTest[]) {

        const rc: ITests = {}

        for await (let modelTest of models) {

            const ast = new TsTestAst(modelTest, monaco.editor.create(document.createElement('div')));
            if (!ast) continue;

            const tests = ast.getTests();
            if (tests && tests.length > 0) rc[`_${modelTest.storFile.project}_${modelTest.storFile.shortName}`] = {
                tests,
                ast,
                storFile: modelTest.storFile
            }
        }

        return rc;
    }

    private async getStorFilesWithTest(project: number) {

        const filesWithTest = Object.keys(mls.stor.files).filter((key: string) => {
            const file = mls.stor.files[key];
            return file.project === project && file.extension === '.test.ts';
        }).map((item) => item.replace('.test.ts', '.ts'));

        return filesWithTest;
    }

    private addTestResultItem(container: HTMLDivElement, title: string, status: string) {

        if (!this.collabResultContainer) return;
        const item = document.createElement('collab-result-test-100554');
        item.setAttribute('testName', title);
        item.setAttribute('status', status);
        container.appendChild(item);
        return item;
    }

    private createPageContainer(pageName: string) {
        const el = document.createElement('div');
        const icon = document.createElement('i');
        icon.className = 'icon fa-solid fa-spinner'

        const span = document.createElement('h3');
        const br = document.createElement('br');

        const containerTest = document.createElement('div');
        containerTest.className = 'container-test';

        const details = document.createElement('details');
        details.open = false;
        const summary = document.createElement('summary');
        const summaryContent = document.createElement('div')
        summaryContent.className = 'summary-title'

        span.innerHTML = `${this.msg.page}: ${pageName}`;
        span.style.display = 'inline-block';

        const result = document.createElement('small')
        result.className = 'test-result';


        details.appendChild(summary);
        details.appendChild(containerTest);
        summaryContent.appendChild(span);
        summaryContent.appendChild(icon);
        summaryContent.appendChild(result);
        summary.appendChild(summaryContent);
        el.appendChild(details);

        return el;
    }

    private async runTest(actualData: ICANTest, index: number, ast: TsTestAst, containerTestDiv: HTMLDivElement) {

        const testItem = this.addTestResultItem(containerTestDiv, actualData.functionName + `(${index})`, 'running');
        if (!testItem) return;
        try {
            const result = await ast.runTest(actualData.functionName, index);
            testItem.setAttribute('resultStatus', 'pass');
            testItem.setAttribute('result', result);
        } catch (err: any) {
            testItem.setAttribute('resultStatus', 'failed');
            testItem.setAttribute('result', err.message);
            throw new Error();
        } finally {
            testItem.setAttribute('status', 'finished');
        }
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async runAllTests(allTests: ITests) {

        this.actualAllPagesTests = 0;

        for (let key of Object.keys(allTests)) {

            const testData = allTests[key];
            const container = this.createPageContainer(testData.storFile.shortName);
            this.collabResultContainer?.appendChild(container);
            const containerTestDiv = container.querySelector('.container-test') as HTMLDivElement;
            const icon = container.querySelector('.icon') as HTMLElement;
            const result = container.querySelector('.test-result') as HTMLElement;

            this.fireEvents(testData.storFile);
            await this.waitForPreviewLoaded();
            const iframe = window.preview.iframe;
            if (iframe) await this.waitForLitComponentsInIframe(iframe);
            // await this.delay(5000);

            let totalTest = 0;
            let success = 0;
            let failed = 0;

            for (let i = 0; i < testData.tests.length; i++) {
                const data = testData.tests[i];

                for (let j = 0; j < data.params.length; j++) {
                    if (!data.functionName) continue;
                    try {
                        await this.runTest(data, j, testData.ast, containerTestDiv);
                        success++;
                    } catch (error) {
                        failed++;
                        continue;
                    } finally {
                        totalTest++;
                        this.actualAllPagesTests++;
                        icon.remove();
                    }
                }
            }

            const resume = this.createResume(totalTest, success, failed);
            result.appendChild(resume);

        }
    }

    private createResume(totalTest: number, success: number, failed: number) {
        const resume = document.createElement('span');
        resume.innerHTML = `${totalTest} tests executed — ${success > 0 ? '<i class="success fa fa-check"></i>' : ''} ${success} passed, ${failed > 0 ? '<i class="failed fa fa-times"></i>' : ''} ${failed} failed.`
        return resume;
    }

    private waitForPreviewLoaded(): Promise<void> {
        return new Promise((resolve) => {
            window.addEventListener('preview-loaded', (e) => { resolve() }, { once: true });
        });
    }

    private async waitForLitComponentsInIframe(iframe: HTMLIFrameElement): Promise<void> {
        return new Promise((resolve) => {
            const iframeDoc = iframe.contentWindow?.document;
            if (!iframeDoc) return resolve();

            const checkLitComponents = async () => {

                const elements = Array.from(iframeDoc.querySelectorAll('*'))
                    .filter(el => el.tagName.includes('-')) as HTMLElement[];

                if (elements.length === 0) {
                    resolve();
                    return;
                }

                const litElementsWithOutRegister = elements.filter(el =>
                    iframe.contentWindow?.customElements.get(el.tagName.toLowerCase()) === undefined) as CollabPageElement[];

                await Promise.all(litElementsWithOutRegister.map(async (el) => {
                    await iframe.contentWindow?.customElements.whenDefined(el.tagName.toLowerCase());
                }));

                const litElements2 = elements.filter(el => 'updateComplete' in el && 'initPage' in el) as CollabPageElement[];
                await Promise.all(litElements2.map(el => el.updateComplete));
                await Promise.all(litElements2.map(el => el.initPageComplete));
                resolve();

            };

            checkLitComponents();
        });
    }


    private fireEvents(file: mls.stor.IFileInfo): void {
        const params = {} as mls.events.IFileAction;
        (params.action as any) = 'openBackground';
        params.level = file.level;
        params.project = file.project;
        params.shortName = file.shortName;
        params.extension = file.extension;
        params.folder = file.folder;
        params.position = 'left';

        mls.actual[2].setFullName(`_${file.project}_${file.shortName}`);
        (mls.actual[2] as any).left = {
            project: file.project,
            shortName: file.shortName,
            extension: file.extension,
            folder: file.folder,
        } as any;

        mls.events.fire([5], ['FileAction'], JSON.stringify(params), 0);
    }

    private onFinishTest() {
        (mls.actual[2] as any).left = undefined;
        window.preview.iframe?.remove();
        window.preview.iframe = undefined;

    }

}

if (!customElements.get('plugin-project-run-test-100554')) {
    customElements.define('plugin-project-run-test-100554', PluginProjectRunTest);
}

interface ITests {
    [key: string]: ITestsParams
}

interface ITestsParams {
    tests: ICANTest[],
    ast: TsTestAst,
    storFile: mls.stor.IFileInfo
}



/// <mls shortName="serviceDsStyles" project="100554" enhancement="_100554_enhancementLit" groupName="service" />


import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-ds-styles-100554')
export class ServiceDsStyles extends ServiceBase {

    public details: IService = {
        icon: '&#xf1e6',
        name: 'Results',
        mode: 'A',
        position: 'all',
        tooltip: 'Results',
        tags: [],
        levels: [2]
    }


    public onClickLink = (op: string): boolean => {
        if (op === 'opResultCss') return this.showResultCss();
        if (op === 'opStyle') return this.showStyle();
        if (op === 'opStyle2') return this.showStyle2();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Styles',
        actions: {
            opStyle: 'Styles Geral',
            opResultCss: 'Result CSS',
        },
        actionDefault: 'opStyle2', // call after close icon clicked
        icons: {},
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    static modelCount = 0;

    @property({ type: String })
    msize = '';

    @property()
    private isComponent: boolean = false;

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    @query('selectaaa')
    private c3: HTMLElement | undefined;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private timeoutChangesEditorStyle: number = 0;
    private timeoutCursorChangesEditorStyle: number = 0;

    private componentName: string = '';
    private isStyleRename: boolean = false;
    private oldStyleName: string = '';
    private isSetStyle: boolean = false;
    private rightServiceOpened: string = '';
    private dsInstance: mls.l3.DesignSystemIO | undefined;
    private lastEditorInfo = {
        line: 0,
        content: ''
    }

    private models: IModels = {
        style: undefined,
        results: undefined
    }

    private defaultServices: IDefaultServices = {
        componentStyle: '',
        globalStyle: '_100529_service_styles_preview'
    }

    createRenderRoot() {
        return this;
    }


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }


    private async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible) {
            this.createEditor();
            const serviceDef = this.isComponent ? this.defaultServices.componentStyle : this.defaultServices.globalStyle;
            const params: IEventsSelectedObj = {
                service: [serviceDef],
                isComponent: this.isComponent,
                component: this.componentName
            };

            const params2: IEventsSelectedObj = {
                service: [],
                isComponent: this.isComponent,
                component: this.componentName
            };

            mls.events.fire([this.level], ['DSStyleUnSelected'], JSON.stringify(params2), 0);
            mls.events.fire([this.level], ['DSStyleSelected'], JSON.stringify(params), 100);
            this.openServiceHelper(serviceDef);
            this.rightServiceOpened = this.getServiceRightOpened();
        }

        if (!reinit) {
            if (el && typeof el.layout === 'function') el.layout();
        } else {
            if (this._ed1) this._ed1.setModel(this.models['style'] as monaco.editor.ITextModel);
            if (this.menu.setMode) this.menu.setMode('initial');
            // if (!this.isComponent && this.c3) this.c3.style.display = 'none';
        }
    }

    private init() {
        this.setInitialModels('', 'style');
        this.setInitialModels('', 'results');
        this.setEvents();
    }

    private setEvents() {
        mls.events.addEventListener([this.level], ['DSStyleChanged'], (ev) => {
            this.onDSStyleChanged(ev);
        });
    }

    private showStyle(): boolean {
        if (this.menu.setMode) this.menu.setMode('initial');
        return this.showStyle2();
    }

    private showResultCss(): boolean {

        if (!this._ed1) return false;
        const modelResults = this.models['results'] as IMonacoModelStyle;
        this._ed1.setModel(modelResults);
        if (this.menu.setMode) this.menu.setMode('editor');
        if (this.c3) this.c3.style.display = 'none';
        this.serviceContent?.layout();
        this._ed1.updateOptions({ readOnly: true });

        modelResults.setValue('Compiling...');
        if (!this.dsInstance) return false;
        this.dsInstance.components.getCSS(this.componentName).then((result) => {
            modelResults.setValue(result);
        }).catch((err) => {
            modelResults.setValue(err);
        });

        return true;
    }

    private createEditor(): void {
        if (!this.c2 || this._ed1) return;
        this._ed1 = monaco.editor.create(this.c2, mls.editor.conf['style_config'] as monaco.editor.IEditorOptions);
        (this.c2 as any)['mlsEditor'] = this._ed1;

    }

    private getUri(shortFN: string): monaco.Uri {
        ServiceDsStyles.modelCount = ServiceDsStyles.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${ServiceDsStyles.modelCount}.ts`);
    }

    private setInitialModels(src: string, model: string) {
        const uri = this.getUri('l3_styles');
        this.models[model] = monaco.editor.getModel(uri) as monaco.editor.ITextModel;
        if (this.models[model]) this.models[model]?.setValue(src);
        else this.models[model] = monaco.editor.createModel(src, 'less', uri);
        this.setModelAPI();
    }

    private setModelAPI() {

        const modelStyle = this.models['style'] as IMonacoModelStyle;

        modelStyle.add = (text: string, lineNumber: number, refLine: number) => {
            let lineToChange = lineNumber;
            const blockInfo = modelStyle.getBlockInfo();
            if (!lineToChange) {
                const newLineNumber = refLine === blockInfo.endLine ? refLine : refLine + 1;
                const columnStartRefLine = modelStyle.getLineIndentColumn(refLine as number);
                const newLine = {
                    range: new monaco.Range(newLineNumber, 1, newLineNumber, 1),
                    text: ' '.repeat(columnStartRefLine - 1) + '\n',
                    forceMoveMarkers: true
                };

                if (this._ed1) this._ed1.executeEdits('style', [newLine]);
                lineToChange = newLineNumber;
            }

            const columnStart = modelStyle['getLineIndentColumn'](lineToChange);
            const columnEnd = modelStyle.getLineLength(lineToChange) + 1;
            const range = new monaco.Range(lineToChange, columnStart, lineToChange, columnEnd);
            if (this._ed1) this._ed1.executeEdits('style', [{ range, text }]);
            const endLineLength = modelStyle.getLineLength(blockInfo.endLine) + 1;
            const rangeBlock = new monaco.Range(blockInfo.startLine, 1, blockInfo.endLine, endLineLength);
            modelStyle.removeBlankLines(rangeBlock);

        };

        modelStyle.changeBlock = (key: string, value: string, comment: string) => {
            if (!this._ed1) return;
            const blockLess = modelStyle.getLessBlock();
            const { lineNumber } = this._ed1.getPosition() as monaco.Position;
            const text = `${key}: ${value};//${comment}`;
            const objChanged = {
                lineChange: -1,
                prop: key,
                newValue: value,
                oldValue: ''
            };

            if (!blockLess) return;

            blockLess.lines.forEach((item) => {
                if (item.key === key) {
                    objChanged.lineChange = item.line;
                    objChanged.oldValue = item.value;
                }
            });

            if (!objChanged.newValue) {
                const linewithSameKey = blockLess.lines.find((line) => line.key === objChanged.prop);
                if (!linewithSameKey) return;
                modelStyle.removeLine(linewithSameKey.line);
                return;
            }

            if (!objChanged.lineChange) {
                modelStyle.add(text, objChanged.lineChange, lineNumber);
                return;
            }
            modelStyle.add(text, objChanged.lineChange);
        };

        modelStyle.removeLine = (lineNumber: number) => {
            const columnEnd = modelStyle.getLineLength(lineNumber) + 1;
            const columnStart = modelStyle.getLineIndentColumn(lineNumber);
            const range = new monaco.Range(lineNumber, columnStart, lineNumber, columnEnd);
            if (this._ed1) this._ed1.executeEdits('', [{ range, text: null }]);
        };

        modelStyle.removeBlankLines = (range: monaco.IRange) => {

            if (!this._ed1) return;
            const text = this._ed1.getModel()?.getValueInRange(range);
            if (!text) return;
            const newText = text.replace(/^\s*[\r\n]/gm, '');
            const edit = { range, text: newText };
            this._ed1.executeEdits('style', [edit]);

        };

        modelStyle.getLessBlock = (): IBlockLess | undefined => {

            const { isValidBlock, endLine, startLine, selector } = modelStyle.getBlockInfo();
            if (!isValidBlock) return undefined;

            const rc: IBlockLess = {
                lines: [],
                selector
            };

            const lines = modelStyle.getLinesContent();
            let bracketsOpenCount = 0;
            let bracketsCloseCount = 0;

            for (let i = startLine - 1; i <= endLine - 1; i++) {

                let line = lines[i];
                line = line.replace(/\/\/.*/, ''); // remove inline comment
                const isInBlockComment = modelStyle.isInCommentBlock(lines, i + 1);
                if (isInBlockComment) continue;
                if (line.indexOf('{') >= 0) bracketsOpenCount += 1;
                if (line.indexOf('}') >= 0) bracketsCloseCount += 1;
                if ((bracketsOpenCount - bracketsCloseCount) > 1) continue;

                const rules = line.split(';');
                rules.forEach((rule) => {

                    if (!rule) return;
                    const item = modelStyle.convertRuleToKeyValue(rule);
                    if (!item) return;
                    item.line = i + 1;
                    rc.lines.push(item);

                });

            }

            return rc;

        };

        modelStyle.getHelperNameByLine = (lineNumber: number): string => {

            const lineContent = modelStyle.getLineContent(lineNumber);
            const [, helperName] = lineContent.split('//');
            return helperName;

        };

        modelStyle.isCursorInBlockValid = (): boolean => {

            const blockInfo = modelStyle.getBlockInfo();
            return blockInfo.isValidBlock;

        };

        modelStyle.getBlockInfoByLine = (lineNumber: number): IBlockInfo => {
            const lines = modelStyle.getLinesContent();
            const startBlockInfo = modelStyle.haveStartBlock(lines, lineNumber);
            const endBlockInfo = modelStyle.haveEndBlock(lines, lineNumber);
            const rc: IBlockInfo = {
                selector: '',
                endLine: endBlockInfo.line,
                hasEndBlock: endBlockInfo.haveEndBlock,
                hasStartBlock: startBlockInfo.haveStartBlock,
                startLine: startBlockInfo.line,
                isValidBlock: startBlockInfo.haveStartBlock && endBlockInfo.haveEndBlock
            };

            if (startBlockInfo.line > 0 && rc.isValidBlock) {
                const lineStartContent = modelStyle.getLineContent(startBlockInfo.line);
                rc.selector = lineStartContent.replace(/\/\/.*/, '').replace(/\{.*$/, '').trim();
            }

            return rc;
        };

        modelStyle.getBlockInfo = (): IBlockInfo => {
            const { lineNumber } = this._ed1?.getPosition() as monaco.Position;
            const rc = modelStyle.getBlockInfoByLine(lineNumber);
            return rc;
        };

        modelStyle.isInCommentBlock = (lines: string[], lineNumber: number): boolean => {

            let countStartBlockComment = 0;
            let countEndBlockComment = 0;

            for (let i = 0; i <= lineNumber - 1; i++) {
                const line = lines[i];
                if (line.indexOf('/*') >= 0) countStartBlockComment += 1;
                if (line.indexOf('*/') >= 0 && i !== lineNumber - 1) countEndBlockComment += 1;
            }

            const isInBlockComment = countStartBlockComment > countEndBlockComment;
            return isInBlockComment;

        };

        modelStyle.haveStartBlock = (lines: string[], lineNumber: number): { haveStartBlock: boolean, line: number } => {

            const rc = {
                haveStartBlock: false,
                line: -1
            };

            let bracketsCount = 1;

            let actualLine = lines[lineNumber - 1];
            if (actualLine.trim().startsWith('//')) return rc;

            actualLine = actualLine.replace(/\/\/.*/, '').replace(/\/\*.*/, ''); // remove comment in line
            if (actualLine.indexOf('{') >= 0) {
                rc.haveStartBlock = true;
                rc.line = lineNumber;
                return rc;
            }

            if (actualLine.indexOf('}') >= 0) bracketsCount -= 1;

            const isInBlockComment = modelStyle.isInCommentBlock(lines, lineNumber);
            if (isInBlockComment) return rc;

            for (let i = lineNumber - 1; i >= 0; i--) {
                let line = lines[i];
                line = line.replace(/\/\/.*/, ''); // remove inline comment 
                const lineInCommentBlock = modelStyle.isInCommentBlock(lines, i + 1);

                if (line.indexOf('}') >= 0 && !lineInCommentBlock) bracketsCount += 1;
                if (line.indexOf('{') >= 0 && !lineInCommentBlock) bracketsCount -= 1;

                if (bracketsCount === 0) {
                    rc.haveStartBlock = true;
                    rc.line = i + 1;
                    break;
                }
            }

            return rc;

        };

        modelStyle.haveEndBlock = (lines: string[], lineNumber: number): { haveEndBlock: boolean, line: number } => {

            const rc = {
                haveEndBlock: false,
                line: -1
            };

            let bracketsCount = 1;
            let actualLine = lines[lineNumber - 1];
            if (actualLine.trim().startsWith('//')) return rc;
            actualLine = actualLine.replace(/\/\/.*/, '').replace(/\/\*.*/, ''); // remove comment in line
            if (actualLine.indexOf('}') >= 0) {
                rc.haveEndBlock = true;
                rc.line = lineNumber;
                return rc;
            }

            if (actualLine.indexOf('{') >= 0) bracketsCount -= 1;
            const isInBlockComment = modelStyle.isInCommentBlock(lines, lineNumber);
            if (isInBlockComment) return rc;

            for (let i = lineNumber - 1; i <= lines.length - 1; i++) {

                let line = lines[i];
                line = line.replace(/\/\/.*/, ''); // remove inline comment 
                const lineInCommentBlock = modelStyle.isInCommentBlock(lines, i + 1);
                if (line.indexOf('{') >= 0 && !lineInCommentBlock) bracketsCount += 1;
                if (line.indexOf('}') >= 0 && !lineInCommentBlock) bracketsCount -= 1;
                if (bracketsCount === 0) {
                    rc.haveEndBlock = true;
                    rc.line = i + 1;
                    break;
                }

            }
            return rc;
        };

        modelStyle.convertRuleToKeyValue = (content: string): IBlockLessLine | undefined => {
            const blockLine: IBlockLessLine = {} as IBlockLessLine;
            const [key, value] = content.split(':');
            if (!key || !value) return undefined;
            blockLine.key = key.trim();
            blockLine.value = value.trim();
            return blockLine;
        };

    }

    private async setStyle(styleLess: string) {
        if (!this._ed1) return;
        this.isSetStyle = true;
        const lessTokens = await this.getTokens();
        let textByRange = styleLess;
        const content = `${textByRange.trim()}\n\n//Start Less Tokens\n${lessTokens}\n//End Less Tokens\n`;
        const model = this._ed1.getModel();
        if (!model) return;
        const range = new monaco.Range(0, 0, model.getLineCount() + 1, 0);
        this._ed1.updateOptions({ readOnly: false });
        this._ed1.executeEdits('style', [{ range, text: content.trim() }]);
        this._ed1.setScrollPosition({ scrollTop: 0 });
        const position = new monaco.Position(0, 0);
        this._ed1.setPosition(position);
    }

    private getIntervalLinesReadOnly(): { start: number | undefined, end: number | undefined } | undefined {

        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;

        const [startLine] = model.findMatches(`//Start Less Tokens`, true, false, false, null, true);
        const [endLine] = model.findMatches(`//End Less Tokens`, true, false, false, null, true);
        return {
            end: endLine ? endLine.range.startLineNumber : undefined,
            start: startLine ? startLine.range.startLineNumber : undefined
        };
    }

    private changeEditor(lines: IBlockLessLine[], helper: string) {
        const modelStyle = this.models['style'] as IMonacoModelStyle;
        lines.forEach((line) => {
            modelStyle.changeBlock(line.key, line.value, helper);
        });
    }

    private getParamsServices(): IEventsSelectedObj {
        const serviceDef = this.isComponent ? this.defaultServices.componentStyle : this.defaultServices.globalStyle;
        const params: IEventsSelectedObj = {
            service: [serviceDef],
            isComponent: this.isComponent,
            component: this.componentName
        };
        return params;
    }

    private showStyle2(): boolean {

        if (!this._ed1) return false;

        // if (!this.isComponent && this.c3) this.c3.style.display = 'none';
        this.serviceContent?.layout();

        this._ed1.setModel(this.models['style'] as monaco.editor.ITextModel);
        const modelStyle = this.models['style'] as IMonacoModelStyle;

        this._ed1.updateOptions({ readOnly: false });

        this.getStyle().then((styleGlobal) => {
            if (this.isComponent) return;
            this.setStyle(styleGlobal);
        });

        this._ed1.onDidChangeCursorPosition((e) => {

            if (!this._ed1) return;
            const actualModel = this._ed1.getModel();
            if (actualModel !== this.models['style']) return;
            const { lineNumber } = e.position;
            const content = modelStyle.getLineContent(lineNumber);
            const isReadOnlyArea = this.isReadOnlyArea(lineNumber);
            this._ed1.updateOptions({ readOnly: isReadOnlyArea });

            if (isReadOnlyArea) {

                const serviceDef = this.isComponent ? this.defaultServices.componentStyle : this.defaultServices.globalStyle;
                const params = this.getParamsServices();
                mls.events.fire([this.level], ['DSStyleUnSelected'], JSON.stringify(params), 0);
                this.openServiceHelper(serviceDef);
                this.lastEditorInfo.content = content;
                this.lastEditorInfo.line = lineNumber;
                return;

            }

            if (this.timeoutCursorChangesEditorStyle) clearTimeout(this.timeoutCursorChangesEditorStyle);
            this.timeoutCursorChangesEditorStyle = setTimeout(() => {
                this.onCursorChange(lineNumber, content);
            }, 500);

        });


        this._ed1.getModel()?.onDidChangeContent((event) => {
            if (this.timeoutChangesEditorStyle) clearTimeout(this.timeoutChangesEditorStyle);
            this.timeoutChangesEditorStyle = setTimeout(() => {
                this.onEditorChange(false);
            }, 1000);

        });

        return true;
    }

    private async onEditorChange(isGet: boolean) {

        this.clearErrors();
        if (this.isSetStyle) {
            this.isSetStyle = false;
            return;
        }

        const modelStyle = this.models['style'] as IMonacoModelStyle;
        const value = modelStyle.getLessBlock();
        const less = modelStyle.getValue().trim();
        const rc: IEditorChangedEventsObj = {
            emitter: 'left',
            helper: this.rightServiceOpened || this.getServiceRightOpened(),
            value: value?.lines || [],
            less,
            selector: value?.selector || '',
            isComponent: this.isComponent,
            origemLevel: 3
        };

        if (!isGet) {
            const regex = /\/\/Start Less Tokens[\s\S]*?\/\/End Less Tokens/g;
            rc.less = less.replace(regex, '');
        }
        if (!this.isComponent && !isGet) {
            if (!this.dsInstance) return;
            const cssItem = this.dsInstance.css.list['definitions'];
            if (!cssItem) return;
            try {
                await cssItem.setContent(rc.less);
            } catch (err: any) {
                const errorInfo = this.extractErrorDetails(err.message);
                if (errorInfo) this.setErrorOnEditor(errorInfo);
            }
        }

        if (this.isComponent) {
            rc.less = await this.onChangeEditorIfComponent(rc);
        }

        mls.events.fire([2], ['DSStyleChanged'], JSON.stringify(rc));
        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc), 300);

    }

    private async onAfterAdd() {
        const style: mls.l3.IComponentsStyle = (this.c3 as any).styles[(this.c3 as any).value];
        const less = await style.getStyleLessIO();
        this.onChangeWidgetStyle(less);
    }

    private async onChangeEditorIfComponent(params: IEditorChangedEventsObj): Promise<string> {
        const style: mls.l3.IComponentsStyle = (this.c3 as any).styles[(this.c3 as any).value];
        if (!style) return params.less;

        const isFirstLineCorrect = this.checkIfFirtsLineCorrect(params.less, style.stylename);
        if (!isFirstLineCorrect) {
            this.setError('Invalid first line, must be start with component tag name my-tag.mystyle')
            throw new Error('Invalid first line');
        }

        if (this.isStyleRename) {
            params.less = await this.renameStyleComponent(params.less, style);
            return params.less;
        }

        await this.saveStyleLess(params.less, style);

        const mfile = mls.l2.editor['mfiles'][this.componentName];
        if (mfile && mfile.compilerResults) {
            mfile.compilerResults.modelNeedCompile = true;
            await mls.l2.editor.getCompilerResultTS(mfile, true);
            const enhancement = await mls.l2.enhancement.getEnhancementInstance(mfile);
            if (enhancement) await enhancement.onAfterChange(mfile);
            const searchString = 'css';
            const replacementString = '';
            const regex = new RegExp(searchString, 'g');
            const modifiedString = mfile.compilerResults['cacheVersion'].replace(regex, replacementString);
            mfile.compilerResults['cacheVersion'] = modifiedString + 'css' + Math.floor(Math.random() * (1000 - 9999999 + 1)) + 9999999;
            await mls.stor.cache['AddMfileIfNeed'](mfile);
        }

        return params.less;

    }

    private async saveStyleLess(less: string, style: mls.l3.IComponentsStyle) {

        const validComponentStyle = this.checkIfValidComponentStyle(less);
        if (!validComponentStyle) return;
        try {
            await style.setStyleLessIO(less);
        } catch (err: any) {
            const errorInfo = this.extractErrorDetails(err.message);
            if (errorInfo) this.setErrorOnEditor(errorInfo);
        }
    }

    private async renameStyleComponent(less: string, style: mls.l3.IComponentsStyle): Promise<string> {
        this.isStyleRename = false;
        const allLines = less.split('\n');
        allLines[0] = allLines[0].replace(this.oldStyleName, style.stylename);
        const newless = allLines.join('\n');
        try {
            await style.setStyleLessIO(newless);
            await this.setStyle(newless);
            return newless;
        } catch (err: any) {
            const errorInfo = this.extractErrorDetails(err.message);
            if (errorInfo) this.setErrorOnEditor(errorInfo);
            return less;
        }
    }

    private checkIfValidComponentStyle(less: string): boolean {
        let bracketsOpenCount = 0;
        let bracketsCloseCount = 0;
        let isvalid: boolean = true;

        let lineStartInvalid: number = 0;

        const lines = less.split('\n');
        const modelStyle = this.models['style'] as IMonacoModelStyle;

        for (let i = 0; i <= lines.length - 1; i++) {
            let line = lines[i];
            line = line.replace(/\/\/.*/, ''); // remove inline comment
            const isInBlockComment = modelStyle.isInCommentBlock(lines, i + 1);
            if (isInBlockComment) continue;
            if (line.indexOf('{') >= 0) bracketsOpenCount += 1;
            if (line.indexOf('}') >= 0) bracketsCloseCount += 1;

            if (bracketsOpenCount > 0 && bracketsOpenCount === bracketsCloseCount) {
                lineStartInvalid = i + 2;
                break;
            }

        }

        if (lineStartInvalid) {

            for (let i = lineStartInvalid - 1; i <= lines.length - 1; i++) {
                let line = lines[i];
                line = line.replace(/\/\/.*/, ''); // remove inline comment

                if (line.indexOf('{') >= 0) {
                    isvalid = false;
                    const errorInfo: IErrorLessInfo = {
                        column: 0,
                        errorMessage: 'This block is invalid, in style component use once this first block',
                        line: i + 1
                    };
                    this.setErrorOnEditor(errorInfo);
                    break;
                }

            }
        }
        return isvalid;
    }

    private checkIfFirtsLineCorrect(less: string, stylename: string) {

        const [firstLine] = less.split('\n');
        const tagName = this.getWidgetTagName(this.componentName);
        if (stylename === this.componentName.substr(8, this.componentName.length)) {
            if (!this.isStyleRename && !firstLine.startsWith(tagName)) return false;
            return true;
        }

        if (!this.isStyleRename && !firstLine.startsWith(tagName + '.' + stylename)) return false;
        return true;
    }

    private extractErrorDetails(errorString: string): IErrorLessInfo | null {
        const pattern = /Error [A-Za-z]+: [A-Za-z]+: (.+) on line (\d+), column (\d+)/;
        const match = pattern.exec(errorString);
        if (match) {
            const errorMessage = match[1];
            const line = parseInt(match[2], 10);
            const column = parseInt(match[3], 10);
            return {
                errorMessage,
                line,
                column
            };
        }
        return null; // Return null if no match is found
    }

    private clearErrors() {
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        monaco.editor.setModelMarkers(model, 'markerSource', []);
    }

    private setErrorOnEditor(info: IErrorLessInfo) {
        const markerOptions = {
            severity: monaco.MarkerSeverity.Error,
            message: info.errorMessage,
            startLineNumber: info.line,
            startColumn: info.column,
            endLineNumber: info.line,
            endColumn: info.column,
        };
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        monaco.editor.setModelMarkers(model, 'markerSource', [markerOptions]);
    }

    private getServiceRightOpened() {
        let toolbar = this.serviceContent?.closest('mls-toolbar-100529');
        let nextToolbarRef: string = '';
        if (toolbar) {
            const nextToolbar = toolbar.nextElementSibling?.nextElementSibling;
            const nextToolbarItemSelected = nextToolbar?.querySelector('mls-toolbar-item-100529 .toolbar-item.selected');
            nextToolbarRef = nextToolbarItemSelected ? nextToolbarItemSelected.parentElement?.getAttribute('ref') as string : '';
        } else {
            const page = this.serviceContent?.closest('collab-page');
            const nav2 = page?.querySelector('collab-nav-2[toolbarposition="right"].selected');
            if (nav2) nextToolbarRef = nav2.getAttribute('data-service') as string;
        }

        return nextToolbarRef;
    }

    private onCursorChange(lineNumber: number, content: string) {

        const modelStyle = this.models['style'] as IMonacoModelStyle;
        if (lineNumber === this.lastEditorInfo.line && content === this.lastEditorInfo.content) return;
        this.lastEditorInfo.content = content;
        this.lastEditorInfo.line = lineNumber;

        const serviceDef = this.isComponent ? this.defaultServices.componentStyle : this.defaultServices.globalStyle;
        let helperName = serviceDef;
        const validPosition = modelStyle.isCursorInBlockValid();
        const params: IEventsSelectedObj = {
            service: [serviceDef],
            isComponent: this.isComponent,
            component: this.componentName
        };

        if (!validPosition) mls.events.fire([this.level], ['DSStyleUnSelected'], JSON.stringify(params), 0);
        else {
            params.service = [];
            mls.events.fire([this.level], ['DSStyleSelected'], JSON.stringify(params), 0);
            helperName = modelStyle.getHelperNameByLine(lineNumber);
        }

        this.openServiceHelper(helperName);

    }

    private isReadOnlyArea(lineNumber: number): boolean {
        const obj = this.getIntervalLinesReadOnly();
        if (!obj) return false;
        if (!obj.end || !obj.start) return false;
        if (lineNumber >= obj.start && lineNumber <= obj.end) return true;
        return false;
    }

    private isReadOnlyAreaIfIsComponent(lineNumber: number): boolean {
        return false;
        // const modelStyle = this.models['style'] as IMonacoModelStyle;
        // const blockInfo = modelStyle.getBlockInfoByLine(1);
        // const { endLine, startLine } = blockInfo;
        // if (!endLine || !startLine) return false;
        // if (lineNumber <= startLine) return true;
        // if (lineNumber >= endLine) return true;
        // return false;
    }

    private async getStyle() {
        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];
        if (project === undefined) throw new Error('No project selected!');
        this.dsInstance = mls.l3.getDSInstance(project, mode);
        await this.dsInstance.init();
        const cssItem = this.dsInstance.css.list['definitions'];
        if (!cssItem) return '';
        const content = await cssItem.getContent();
        return content;
    }

    private async getTokens() {
        if (!this.dsInstance) return;
        const { list } = this.dsInstance.tokens;
        const tokens: mls.l3.ITokenInfo[] = [];
        Object.keys(list).forEach((tok) => {
            tokens.push(list[tok]);
        });
        const tokensColors = tokens.filter((tok) => tok.category === 'color' && !tok.key.startsWith('_dark-'));
        const tokensTypo = tokens.filter((tok) => tok.category === 'typography');
        const tokensCustom = tokens.filter((tok) => tok.category === 'custom');
        const strColors = tokensColors.map((item) => `@${item.key}: ${item.value};`).join('\n');
        const strTypo = tokensTypo.map((item) => `@${item.key}: ${item.value};`).join('\n');
        const strCustom = tokensCustom.map((item) => `@${item.key}: ${item.value};`).join('\n');
        const resumeTokens = ['// Tokens Colors', strColors, '// Tokens Typography', strTypo, '//Tokens Custom', strCustom].join('\n');
        return resumeTokens;
    }

    private openServiceHelper(helperName: string) {

        this.rightServiceOpened = helperName;
        const rc: ICursorChangeEventsObj = {
            emitter: 'left',
            helper: helperName,
        };
        mls.events.fire([this.level], ['DSStyleCursorChanged'], JSON.stringify(rc));
    }

    private async onDSStyleChanged(obj: mls.events.IEvent) {

        if (!obj.desc) return;
        const desc: IEditorChangedEventsObj = JSON.parse(obj.desc);
        if (desc.emitter === 'left') return;
        if (desc.emitter === 'right-get') {
            this.onEditorChange(true);
            return;
        }

        if (desc.isComponent) {
            mls.actual[3].mode = 0;
            this.isComponent = true;
            this.defaultServices.componentStyle = desc.helper;
            const { widget } = desc;
            const itemStyles = this.serviceItemNav;
            if (!itemStyles || !widget) return;

            this.componentName = widget;
            this.onServiceClick(true, !!this._ed1, this.serviceContent);

            // this.c3.setAttribute('component', widget);


            const params = this.getParamsServices();
            mls.events.fire([this.level], ['DSStyleSelected'], JSON.stringify(params), 0);
            setTimeout(() => {
                this.openServiceHelper(this.defaultServices.componentStyle);
            }, 1000);
            return;
        }

        this.changeEditor(desc.value, desc.helper);

    }

    private async onChangeWidgetStyle(less: string) {
        await this.setStyle(less);
    }

    private async onAddWidgetStyle(value: string) {
        this.setError('');
        const tagName = this.getWidgetTagName(this.componentName);
        const styleName = value;
        const less = `${tagName}.${styleName} { // don't change this line \n \t// here your style \n}`;
        try {
            if (!this.dsInstance) return;
            await this.dsInstance.components.styles.add(this.componentName, styleName, less);
        } catch (err: any) {
            this.setError(err.message);
        }
    }

    private async onDeleteWidgetStyle(style: mls.l3.IComponentsStyle) {
        this.setError('');
        try {
            await style.setStyleLessIO(null as any);
            const rc: IEditorChangedEventsObj = {
                emitter: 'left',
                helper: this.rightServiceOpened || this.getServiceRightOpened(),
                value: [],
                less: '',
                selector: '',
                isComponent: this.isComponent,
                origemLevel: 3
            };

            mls.events.fire([this.level], ['DSStyleChanged'], JSON.stringify(rc));

        } catch (err: any) {
            this.setError(err.message);
        }
    }

    private async onRenameWidgetStyle(style: mls.l3.IComponentsStyle, value: string) {
        this.setError('');
        try {
            this.isStyleRename = true;
            this.oldStyleName = style.stylename;
            if (!this.dsInstance) return;
            await this.dsInstance.components.styles.rename(this.componentName, style.stylename, value);
            this.onEditorChange(false);
        } catch (err: any) {
            this.setError(err.message);
        }

    }

    private getWidgetTagName(widgetName: string): string {

        const parts = widgetName.split('_');
        parts.shift();
        const project = parts.shift() || '';
        let formattedString = `${parts.join('-')}-${project}`;
        formattedString = formattedString.replace(/([^A-Z-]|^)([A-Z])/g, (_, prefix, letter) => `${prefix}-${letter.toLowerCase()}`).toLowerCase();
        return formattedString;
    }

    render() {
        return html`
            <select
                .onChange = ${async (less: string) => this.onChangeWidgetStyle(less)}
                .onDelete =  ${async (style: mls.l3.IComponentsStyle) => this.onDeleteWidgetStyle(style)}
                .onAdd =  ${async (value: string) => this.onAddWidgetStyle(value)}
                .onAfterAdd =  ${async () => this.onAfterAdd()}
                .onRename =  ${async (style: mls.l3.IComponentsStyle, value: string) => this.onRenameWidgetStyle(style, value)}
            >
                <option value="0">Default</option>
            </select>
            <mls-editor-100529 ismls2="true"></mls-editor-100529>
        
        `
    }
}

type IModels = Record<string, IMonacoModelStyle | monaco.editor.ITextModel | undefined>
interface IDefaultServices {
    globalStyle: string,
    componentStyle: string,
}
interface IMonacoModelStyle extends monaco.editor.ITextModel {
    add(cssLine: string, line: number, refLine?: number): void;
    changeBlock(key: string, value: string, comment: string): void;
    removeLine(line: number): void;
    removeBlankLines(range: monaco.IRange): void;
    getHelperNameByLine(line: number): string;
    isCursorInBlockValid(): boolean;
    haveStartBlock(lines: string[], lineNumber: number): { haveStartBlock: boolean, line: number };
    haveEndBlock(lines: string[], lineNumber: number): { haveEndBlock: boolean, line: number };
    isInCommentBlock(lines: string[], lineNumber: number): boolean;
    getBlockInfo(): IBlockInfo;
    getBlockInfoByLine(line: number): IBlockInfo;
    getLessBlock(): IBlockLess | undefined;
    convertRuleToKeyValue(content: string): IBlockLessLine | undefined;
    getLineIndentColumn(line: number): number;
}

interface IBlockLess {
    selector: string,
    lines: IBlockLessLine[]
}

interface IBlockLessLine {
    key: string,
    value: string,
    line: number
}

interface IBlockInfo {
    selector: string,
    hasStartBlock: boolean,
    startLine: number,
    endLine: number,
    hasEndBlock: boolean,
    isValidBlock: boolean
}

interface IEditorChangedEventsObj {
    emitter: 'right' | 'left' | 'right-get',
    helper: string,
    value: IBlockLessLine[],
    selector?: string,
    less: string,
    widget?: string,
    origemLevel: number,
    isComponent: boolean
}

interface IErrorLessInfo {
    line: number,
    column: number,
    errorMessage: string
}

interface ICursorChangeEventsObj {
    emitter: 'left'
    helper: string,
}

interface IEventsSelectedObj {
    service: string[]
    isComponent: boolean,
    component: string,
}
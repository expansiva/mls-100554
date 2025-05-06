/// <mls shortName="lessCSS" project="100554" enhancement="_blank" />

import { LessAst } from "./_100554_lessAST";
import { globalState } from './_100554_collabState';

/**
 * A unique symbol used as a key for properties that should be ignored during JSON serialization.
 * 
 * Properties defined with this symbol as a key will not appear in the output of `JSON.stringify`,
 * ensuring that the property is excluded from serialization while avoiding key collisions.
 * 
 * @const {symbol} ignoredProperty - A unique symbol for marking non-serializable properties.
 */
const _editor = Symbol("ignoredProperty");

export class LessCSS {
    lessAST: LessAst;
    selector: string;
    position: "left" | "right" = "left";
    [_editor]: monaco.editor.IStandaloneCodeEditor | undefined;
    _url: string = '';

    public styles: CSSStyleDeclaration;

    constructor(url: string, editor: monaco.editor.IStandaloneCodeEditor, position: "left" | "right" = "left") {

        this.lessAST = new LessAst(url, editor);
        this[_editor] = editor;
        this.selector = '';
        this.position = position;
        this._url = url;
        this.initStateIfNeeded();

        // Initialize CSSStyleDeclaration to provide autocomplete for CSS properties
        const cssDeclaration = document.createElement("div").style;

        // Create a proxy to intercept get/set on `styles`
        this.styles = new Proxy(cssDeclaration, {
            get: (target, property: string) => {
                // Retrieve the property value from LessCSS's `getProperty` function
                return this.getProperty(property) ?? target[property as any];
            },
            set: (target, property: string, value: string) => {
                // Use `setProperty` to update both AST and Monaco
                this.setProperty(property, value);
                target[property as any] = value;
                return true;

            }
        });
    }

    public setEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    }

    /**
     * Sets the current selector for which properties will be applied.
     */
    public setSelector(selector: string): void {
        this.selector = selector;
    }

    /**
     * Retrieves a specific CSS property value for the current selector from the AST.
     * @param property The CSS property to retrieve
     */
    public getProperty(property: string): string | undefined {
        return this.lessAST.getProperty(this.selector, property);
    }

    /**
     * Sets or updates a CSS property in the AST and source model.
     * @param property The CSS property to set
     * @param value The new value for the property
     */
    public setProperty(property: string, value: string): void {

        // Update the AST and LESS source model
        this.lessAST.saveProperty(this.selector, property, value);

        // Optional: Fire an event to update the UI if necessary
        // this.fireChangeEvent();

        this.updateState();

    }

    public refresh() {
        if (this[_editor]) {
            this.lessAST = new LessAst(this._url, this[_editor]);
        }
        this.setSelector(this.selector);
    }

    public setStateByLine(lineNumber: number, lineContent: string, emitter: 'editor' | 'helper' | 'preview'): void {

        this.refresh();

        if (!globalState._ica
            || !globalState.globalStateManagment
            || !globalState._ica.less
            || !globalState._ica.less[this.position]) return;

        const selector = this.lessAST.findSelectorByLine(lineNumber);
        if (!selector) {
            this.clearState();
            globalState._ica.less[this.position].lineContent = lineContent;
            globalState.globalStateManagment.setState(`less.${this.position}`, { ...globalState._ica.less[this.position] });
            return;
        }

        this.setSelector(selector);
        const info = this.lessAST.findInfoByLine(selector, lineNumber);
        globalState._ica.less[this.position].selector = selector;
        globalState._ica.less[this.position].lineContent = lineContent;
        globalState._ica.less[this.position].key = info?.key;
        globalState._ica.less[this.position].value = info?.value;
        globalState._ica.less[this.position].emitter = emitter;
        globalState._ica.less[this.position].lineNumber = lineNumber;
        globalState._ica.less[this.position].lessCSS = this;
        globalState.globalStateManagment.setState(`less.${this.position}`, { ...globalState._ica.less[this.position] });

    }

    private clearState() {
        if (!globalState._ica
            || !globalState._ica.less
            || !globalState._ica.less[this.position]) return;

        globalState._ica.less[this.position].lessCSS = undefined;
        globalState._ica.less[this.position].key = undefined;
        globalState._ica.less[this.position].value = undefined;
        globalState._ica.less[this.position].selector = undefined;
    }

    private updateState() {
        if (!globalState._ica
            || !globalState.globalStateManagment
            || !globalState._ica.less
            || !globalState._ica.less[this.position]) return;

        globalState._ica.less[this.position].lessCSS = this;
        globalState._ica.less[this.position].lessCSS.styles = this.styles;
        globalState.globalStateManagment.setState(`less.${this.position}`, { ...globalState._ica.less[this.position] });
    }

    private initStateIfNeeded() {


        if (!globalState._ica) globalState._ica = {};
        if (!globalState._ica.less) globalState._ica.less = {};
        if (!globalState._ica.globalStateManagment) return;

        globalState._ica.less = {
            left: {},
            right: {}
        };

        globalState._ica.less[this.position] = {
            lessCSS: this,
            emitter: 'editor',
            key: undefined,
            value: undefined,
            lineNumber: undefined,
            selector: undefined,
            uri: this._url,
        };

        globalState.globalStateManagment.setState(`less.${this.position}`, { ...globalState._ica.less[this.position] });

    }

}

export interface ICSSState {
    uri: string,
    selector: string | undefined,
    lineNumber: number | undefined,
    lineContent: string | undefined,

    key: string | undefined,
    value: string | undefined,
    lessCSS: LessCSS | undefined,
    emitter: 'editor' | 'helper' | 'preview'
}
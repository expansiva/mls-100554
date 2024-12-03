/// <mls shortName="lessCSS" project="100554" enhancement="_blank" />

import { LessAst } from "./_100554_lessAST";
import { Window } from './_100554_icaState';

export class LessCSS {
    lessAST: LessAst;
    selector: string;
    position: "left" | "right" = "left";
    _url: string = '';

    public styles: CSSStyleDeclaration;

    constructor(url: string, position: "left" | "right" = "left") {
        this.lessAST = new LessAst(url);
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
        this.lessAST = new LessAst(this._url);
        this.setSelector(this.selector);
    }

    public setStateByLine(lineNumber: number, emitter: 'editor' | 'helper' | 'preview'): void {

        this.refresh();

        if (!(window as any as Window).globalState
            || !(window as any as Window).globalStateManagment
            || !(window as any as Window).globalState.less
            || !(window as any as Window).globalState.less[this.position]) return;

        const selector = this.lessAST.findSelectorByLine(lineNumber);
        if (!selector) {
            this.clearState();
            (window as any as Window).globalStateManagment.setState(`less.${this.position}`, { ...(window as any as Window).globalState.less[this.position] });
            return;
        }

        this.setSelector(selector);
        const info = this.lessAST.findInfoByLine(selector, lineNumber);
        (window as any as Window).globalState.less[this.position].selector = selector;
        (window as any as Window).globalState.less[this.position].key = info?.key;
        (window as any as Window).globalState.less[this.position].value = info?.value;
        (window as any as Window).globalState.less[this.position].emitter = emitter;
        (window as any as Window).globalState.less[this.position].lineNumber = lineNumber;
        (window as any as Window).globalState.less[this.position].lessCSS = this;
        (window as any as Window).globalStateManagment.setState(`less.${this.position}`, { ...(window as any as Window).globalState.less[this.position] });

    }

    private clearState() {
        if (!(window as any as Window).globalState
            || !(window as any as Window).globalState.less
            || !(window as any as Window).globalState.less[this.position]) return;

        (window as any as Window).globalState.less[this.position].lessCSS = undefined;
        (window as any as Window).globalState.less[this.position].key = undefined;
        (window as any as Window).globalState.less[this.position].value = undefined;
        (window as any as Window).globalState.less[this.position].selector = undefined;
    }

    private updateState() {
        if (!(window as any as Window).globalState
            || !(window as any as Window).globalStateManagment
            || !(window as any as Window).globalState.less
            || !(window as any as Window).globalState.less[this.position]) return;

        (window as any as Window).globalState.less[this.position].lessCSS = this;
        (window as any as Window).globalState.less[this.position].lessCSS.styles = this.styles;
        (window as any as Window).globalStateManagment.setState(`less.${this.position}`, { ...(window as any as Window).globalState.less[this.position] });
    }

    private initStateIfNeeded() {


        if (!(window as any as Window).globalState) (window as any as Window).globalState = {};
        if (!(window as any as Window).globalState.less) (window as any as Window).globalState.less = {};
        if (!(window as any as Window).globalState.globalStateManagment) return;

        (window as any as Window).globalState.less = {
            left: {},
            right: {}
        };

        (window as any as Window).globalState.less[this.position] = {
            lessCSS: this,
            emitter: 'editor',
            key: undefined,
            value: undefined,
            lineNumber: undefined,
            selector: undefined,
            uri: this._url,
        };

        (window as any as Window).globalStateManagment.setState(`less.${this.position}`, { ...(window as any as Window).globalState.less[this.position] });

    }

}

export interface ICSSState {
    uri: string,
    selector: string | undefined,
    lineNumber: number | undefined,
    key: string | undefined,
    value: string | undefined,
    lessCSS: LessCSS | undefined,
    emitter: 'editor' | 'helper' | 'preview'
}
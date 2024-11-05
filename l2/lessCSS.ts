/// <mls shortName="lessCSS" project="100554" enhancement="_blank" />

import { LessAst } from "./_100554_lessAST";

// todo: management state
export class LessCSS {
    lessAST: LessAst;
    selector: string;
    public styles: CSSStyleDeclaration;

    constructor(url: string, position: "left" | "right" = "left") {
        this.lessAST = new LessAst(url);
        this.selector = "";

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
    }

}
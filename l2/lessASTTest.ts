/// <mls fileReference="_100554_/l2/lessASTTest.ts" group="other" enhancement="_100554_enhancementLit" />

import { html, css, LitElement } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { LessCSS } from "/_100554_/l2/lessCSS.js";

@customElement('less-a-s-t-test-100554')
export class LessASTTest100554 extends LitElement {

    rootSelector = 'less-a-s-t-test-100554';
    fileToTest = '_100554_lessASTTest.less';
    url1 = monaco.editor.getModel(monaco.Uri.parse(`//server/${this.fileToTest}`));

    render() {
        return html`<p>testing file: ${this.fileToTest}</p>
         <p>model: ${this.url1?.uri.toString()} </p>
         <pre>test: <br>${this.exeTest()}</pre>
         `;
    }

    exeTest = (): string => {
        if (!this.url1) return "undefined;";
        const url = this.url1.uri.toString();
        const edt1 = document.createElement('div');
        const edt = monaco.editor.create(edt1)
        const lessCSS = new LessCSS(url, edt); 
        const selector = lessCSS.lessAST.findSelectorByLine(18);
        lessCSS.setSelector(this.rootSelector);
        return `selector: ${this.rootSelector}\n${this.test2(lessCSS, this.rootSelector)}`;
    }

    test1 = (lessCSS: LessCSS, rootSelector: string) => {
        let result = "test change property update value\n";
        result += "before:\n" + JSON.stringify(lessCSS.lessAST.ast[rootSelector], null, 2) + "\n\n";
        lessCSS.styles.color = "blue;";
        result += "after:\n" + JSON.stringify(lessCSS.lessAST.ast[rootSelector], null, 2) + "\n\n";
        return result;
    }

    test2 = (lessCSS: LessCSS, rootSelector: string) => {
        let selector = `${rootSelector} .cl1`;
        lessCSS.setSelector(selector);
        let result = `Adding selector ${selector} and property. If it already exists, please delete it manually before testing.\n`;
        result += "before:\n" + JSON.stringify(lessCSS.lessAST.ast[selector], null, 2) + "\n\n";
        lessCSS.styles.margin = "2px";
        result += "after:\n" + JSON.stringify(lessCSS.lessAST.ast[selector], null, 2) + "\n\n";
        result += "full:\n" + JSON.stringify(lessCSS.lessAST.ast, null, 2) + "\n\n";
        return result;
    }

    test3 = (lessCSS: LessCSS, rootSelector: string) => {
        let selector = `${rootSelector}`;
        lessCSS.setSelector(selector);
        let result = `delete property backgroundColor, currentValue='${lessCSS.styles.backgroundColor}'\n`;
        if (lessCSS.styles.backgroundColor === "") return result + `property dont exists\n`;
        result += "before:\n" + JSON.stringify(lessCSS.lessAST.ast[selector], null, 2) + "\n\n";
        lessCSS.styles.backgroundColor = "";
        result += "after:\n" + JSON.stringify(lessCSS.lessAST.ast[selector], null, 2) + "\n\n";
        result += "full:\n" + JSON.stringify(lessCSS.lessAST.ast, null, 2) + "\n\n";
        return result;
    }

    testt1 = (lessCSS: LessCSS, rootSelector: string) => { 
        let result = `list themes:\n`;
        result += JSON.stringify(lessCSS.lessAST.listThemes(), null, 2) + "\n\n";
        const themeName = "theme3";
        result += `adding theme: ${themeName}, return=${lessCSS.lessAST.addTheme(themeName)}\n`
        result += `theme description:\n\n${lessCSS.lessAST.getThemeDescription(themeName).join("\n")}\n\n`
        return result;
    }

    testt2 = (lessCSS: LessCSS, rootSelector: string) => { 
        let result = `list themes:\n`;
        result += JSON.stringify(lessCSS.lessAST.listThemes(), null, 2) + "\n\n";
        const themeName = "theme3";
        result += `deleting theme: ${themeName}, return=${lessCSS.lessAST.deleteTheme(themeName)}`
        return result;
    }


}

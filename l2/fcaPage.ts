/// <mls shortName="fcaPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * }
 */

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase, IAllowCommand } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-page-100554')
export class FcaPage extends FcaLitElementBase {

    //-------------- COMPONENT ------------------

    firstUpdated() {
        /*setTimeout(async () => {
            //console.info(await this.onlyHTML()) 
            //console.info(await this.onlyFCA())
        }, 3000)*/
    }

    // -------------- ABSTRACT ------------------

    public actions: IActionLevels = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: true, before: false, after: false };
    }

    public renderPreview = (param: string): any => {
        let code = `${this.myInnerHTML}`;
        return html`${unsafeHTML(code)}`;
    }

    public renderEditActive = (param: string): any => {

        let code = `${this.myInnerHTML}`;
        return html`${unsafeHTML(code)}`;

    }

    public changeStateHtml(html: string): void {

    }

    public changeStateStyle(style: {}): void {

    }

    public async setMyActions(level: string) {

        return;

    }

    // ----------- IMPLEMENTATION ---------------


    public async onlyHTML() {

        const all = document.createElement('div');
        for await (const c of Array.from(this.children)) {

            await this.onlyHTMLChild(all as HTMLElement, c as HTMLElement);
        }

        this.innerHTML = all.innerHTML;
        return all.innerHTML;

    }

    private async onlyHTMLChild(parent: HTMLElement, el: HTMLElement) {

        try {

            const tag = el.tagName.toLocaleLowerCase();
            if (tag.startsWith('fca-')) {

                for await (const c of Array.from(el.children)) {
                    await this.onlyHTMLChild(parent as HTMLElement, c as HTMLElement);
                }
            } else {
                const clone = el.cloneNode(false);
                if (el.children.length === 0) (clone as any).innerText = el.innerText;
                parent.appendChild(clone);
                for await (const c of Array.from(el.children)) {
                    await this.onlyHTMLChild(clone as HTMLElement, c as HTMLElement);
                }
            }

            return;

        } catch (e) {
            console.info(e);
            return;
        }


    }

    private async onlyFCA() {


        const all = document.createElement('div');
        for await (const c of Array.from(this.children)) {

            await this.onlyFCAChild(all as HTMLElement, c as HTMLElement);
        }

        return all.innerHTML;

    }

    private async onlyFCAChild (parent: HTMLElement, el: HTMLElement){

        try {

            const tag = el.tagName.toLocaleLowerCase();
            if (tag.startsWith('fca-')) {
                const clone = el.cloneNode(false);
                parent.appendChild(clone);
                for await (const c of Array.from(el.children)) {
                    await this.onlyFCAChild(clone as HTMLElement, c as HTMLElement);
                }
            } else {
                for await (const c of Array.from(el.children)) {
                    await this.onlyFCAChild(parent, c as HTMLElement);
                }
            }

            return;

        } catch (e) {
            console.info(e);
            return;
        }


    }

}

/// <mls shortName="icaLoadPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { convertFileNameToTag } from './_100554_utilsLit';
import { getDependenciesByHtml, IJSONDependence } from './_100554_libCompile';


@customElement('ica-load-page-100554')
export class IcaLoadPage100554 extends IcaLitElement {

    @property({ type: String }) src: string = '';

    async loadPage() {
        if (!this.src) return;
        await import(`./${this.src}`);
        const html = await this.getHTML();
        const deps = await this.getDeps(html);
        for await (let importJs of deps.importsJs) {
            await import(`.${importJs}`);
        }
        const tag = convertFileNameToTag(this.src);
        if (!tag) return;
        this.innerHTML = html;
    }

    async getHTML() {
        mls.actual[0].setFullName(this.src);
        const { project, path } = mls.actual[0];
        if (!project || !path) return '';
        const keyToFile = mls.stor.getKeyToFiles(project, 2, path, '', '.html');
        const file = mls.stor.files[keyToFile];
        if (!file) return '';
        const content = await file.getContent();
        return content as string;
    }

    async getDeps(html: string): Promise<IJSONDependence> {
        const mfile = mls.l2.editor.mfiles[this.src];
        const deps = await getDependenciesByHtml(mfile, html, '');
        return deps;

    }

    firstUpdated() {
        this.loadPage();
    }

    createRenderRoot() {
        return this; // dont use shadow root
    }

    render() {
        return html``;
    }
}

/// <mls shortName="icaLoadPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js';
import { getDependenciesByHtml, IJSONDependence } from '/_100554_/l2/libCompile.js';


@customElement('ica-load-page-100554')
export class IcaLoadPage100554 extends StateLitElement {

    @property({ type: String }) src: string = '';

    async loadPage() {
        if (!this.src) return;
        await import(`/${this.src}`);
        const html = await this.getHTML();
        const deps = await this.getDeps(html);
        for await (let importJs of deps.importsJs) {
            await import(`${importJs}`);
        }

        const infoPath = mls.l2.getPath(this.src)
        const tag = convertFileNameToTag(infoPath);
        if (!tag) return;
        this.innerHTML = html;
    }

    async getHTML() {

        const { project, shortName } = mls.l2.getPath(this.src)
        if (!project || !shortName) return '';

        const keyToFile = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
        const file = mls.stor.files[keyToFile];
        if (!file) return '';
        const content = await file.getContent();
        return content as string;
    }

    async getDeps(html: string): Promise<IJSONDependence> {
        const models = mls.editor.models[this.src];
        const deps = await getDependenciesByHtml(models, html, 'Default');
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

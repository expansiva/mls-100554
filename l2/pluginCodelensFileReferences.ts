/// <mls shortName="pluginCodelensFileReferences" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { collab_check, collab_xmark, collab_lock } from './_100554_collabIcons';
import { CollabLitElement } from './_100554_collabLitElement';

/// **collab_i18n_start**
const message_pt = {
    noRefs: "Nenhuma referencia.",
    refFrom: "Referências do arquivo: ",
    prj: 'Projeto',
    shortname: 'Nome',

}

const message_en = {
    noRefs: "No references.",
    refFrom: "File References from",
    prj: 'Project',
    shortname: 'Shortname',

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-codelens-file-references-100554')
export class PluginCodelensFileReferences extends CollabLitElement {

    private msg: MessageType = messages['en'];

    @property() references: mls.l2.editor.IMFile[] = [];

    @property() project: number = 0;

    @property() shortName: string = '';

    @property() position: string = 'left';

    async firstUpdated() {
        this.references = [];
        if (!this.project || !this.shortName) return;
        this.getReferences(this.shortName, this.project);
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`<div>
            <span><b>${this.msg.refFrom}</b> _${this.project}_${this.shortName}</span>
            <br>
            ${this.references.length === 0 ? html`<span>${this.msg.noRefs}</span>` : ''}
            <ul>
                ${this.references.map((ref) => html`
                <li>
                    <a @click=${(e: MouseEvent) => { this.handleClick(e, ref) }} href="#">
                        ${this.msg.prj}: ${ref.project} ${this.msg.shortname}: ${ref.shortName}  
                    </a> 
                </li>`)}
            </ul>
            

        </div>`
    }

    private handleClick(e: MouseEvent, ref: mls.l2.editor.IMFile) {
        e.preventDefault();
        const cmdOpen: mls.events.IFileAction = {
            action: 'open',
            level: 2,
            project: ref.project,
            shortName: ref.shortName,
            extension: ref.extension,
            folder: '',
            position: 'right'
        };
        mls.events.fire([2], ['FileAction'], JSON.stringify(cmdOpen), 0);
    }

    private async getReferences(shortName: string, project: number): Promise<mls.l2.editor.IMFile[]> {
        await mls.l2.editor.compileAllProjectIfNeed(project);
        const refs: mls.l2.editor.IMFile[] = mls.l2.editor.listAllAffectedFiles(project, shortName);
        return refs;
    }

}
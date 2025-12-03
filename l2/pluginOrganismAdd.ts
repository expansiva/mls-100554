/// <mls shortName="pluginOrganismAdd" project="100554" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { executeAgentByFile } from '/_100554_/l2/aiAgentHelper.js'
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { ServiceBase } from '/_100554_/l2/serviceBase.js';

/// **collab_i18n_start** 
const message_pt = {
    noItens: 'Nenhum item foi encontrado!',
    msg1: 'Describe the new element to add inside the organism (e.g., button, text, nav).',
    msg2: 'Type what to create inside the organism, like "add button" or "add text".',
    project: 'Projeto',
    module: 'Modulo',
    organism: 'Organismo',
    btn: 'Implementar com IA',
    promptPlaceholder: 'Escreva seu prompt...'
}

const message_en = {
    noItens: 'No items were found!',
    msg1: 'Describe the new element to add inside the organism (e.g., button, text, nav).',
    msg2: 'Type what to create inside the organism, like "add button" or "add text".',
    project: 'Project',
    module: 'Module',
    organism: 'Organism',
    btn: 'Implement with IA',
    promptPlaceholder: 'Write your prompt...'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('plugin-organism-add-100554')
export class PluginOrganisAdd extends CollabLitElement {

    private msg: MessageType = messages['en'];

    @state() service: ServiceBase | undefined;

    @query('#iptModule') iptModule: HTMLSelectElement | undefined;
    @query('#iptOrganism') iptOrganism: HTMLInputElement | undefined;
    @query('#iptPrompt') iptPrompt: HTMLInputElement | undefined;

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const { project, path } = mls.actual[3];
        const info = mls.l2.getPath(`_${project}_${path}`);

        return html`
            <div class="form-container">

                <div class="form-group">
                    <label for="project">${this.msg.project}</label>
                    <input type="text" disabled .value="${mls.actualProject}"/>
                </div>

                <div class="form-group">
                    <label for="module">${this.msg.module}</label>
                    <input type="text" disabled .value="${info.folder}"/>
                </div>

                <div class="form-group">
                    <label for="organism">${this.msg.organism}</label>
                    <input type="text" disabled .value="${info.shortName}"/>
                </div>

                <div class="form-group">
                    <label for="prompt">Prompt</label>
                    <textarea id="iptPrompt" placeholder=${this.msg.promptPlaceholder}></textarea>
                    <div style=" display: flex ; flex-direction: column;">
                        <small>${this.msg.msg1}</small>
                        <small>${this.msg.msg2}</small>
                    </div>
                </div>

                <button class="btn-save" @click=${this.createFile}>${this.msg.btn}</button>
            </div>
        
        `
    }

    private async createFile() {

        try {

            this.showLoad(true);

            if (!this.iptPrompt || !this.iptPrompt.value) {
                throw new Error('Enter the prompt');
            }

            const path = mls.actual[3].getFullName();
            if (!path) throw new Error('Not found path');
            const info = mls.l2.getPath(path);

            const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, info.folder, '.ts');
            if (!mls.stor.files[key]) throw new Error('Not found storFile');

            const pp = { page: path, prompt: this.iptPrompt.value, position: 'left' };

            await this.fireImprove(mls.stor.files[key], JSON.stringify(pp));
            mls.events.fireFileAction('statusOrErrorChanged', mls.stor.files[key], 'left', 0);
            this.iptPrompt.value = '';
            this.showLoad(false);

        } catch (e: any) {

            this.showError('[createFile]' + e.message);
            this.showLoad(false);
        }

    }

    private async fireImprove(file: mls.stor.IFileInfo, prompt: string) {
        await executeAgentByFile('agentImprovePrototypeOrganism', prompt, file);
    }

    private showLoad(active: boolean) {
        setTimeout(() => {
            if (!this.service) return;
            this.service.loading = active
        }, 500);
    }

    private showError(msg: string) {
        if (!this.service) return;
        this.service.setError(msg);
    }


}
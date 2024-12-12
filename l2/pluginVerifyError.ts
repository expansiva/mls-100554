/// <mls shortName="pluginVerifyError" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { initCompileMonaco } from './_100554_collabInit';

/// **collab_i18n_start**
const message_pt = {
    fileVerification: 'Verificação de arquivos',
    checkFiles: 'Verificando arquivos',
    noErros: "Nenhum erro encontrado",
};

const message_en = {
    fileVerification: 'File verification',
    checkFiles: 'Checking files',
    noErros: 'No errors found',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export class PluginVerifyError extends PluginBaseModule {

    private msg = messages['en'];

    @property() error: string = '';
    @property() autoPrepare: boolean = false;
    @property() isLoad: boolean = false;
    @property() listErrors: string[] = [];


    //-----COMPONENT---------
    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.autoPrepare)
            return;
        this.prepare();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.error !== '') {
            return html
                `${this.renderHeader()}
                <h4 style="color:red">${this.error}</h4>
            `;
        }

        if (this.isLoad) {
            return html`
                ${this.renderHeader()}
                ${this.renderLoad()}
            ` ;
        }

        return this.renderErros();
    
    }


    renderLoad() {
        return html`
        <div class="contentloader">
            <div class="textLoader">${this.msg.checkFiles}</div>
            <div class="loader"></div>
        </div>
        `
    }

    renderHeader() {
        return html`
            <h3>${this.msg.fileVerification}</h3>
        `;
    }

    renderErros() {

        if(this.listErrors.length <= 0) this.listErrors.push(this.msg.noErros)
        return html`
            ${this.renderHeader()}
            <ul>

                ${repeat(this.listErrors, ((key: string) => key) as any, ((k: any, index: any) => this.renderItem(k)) as any)}
            
            </ul>
        `
    }

    renderItem(i:string) {
        return html`
            <li>
                ${i}
            </li>
        `
    }


    //------IMPLEMENTS--------
    async prepare() {
        try {
            this.isLoad = true;
            const prj = mls.actual[5].project;
            if (!prj) throw new Error('Not found project');

            await initCompileMonaco(prj);
            const ret = await mls.l2.typescript.compileAll(prj);
            this.listErrors = ret;
            this.isLoad = false;
            
        } catch (e: any) {
            this.isLoad = false;
            this.error = e.message;
        }
        
    }


}

if (!customElements.get('plugin-verify-error-100554')) {
    customElements.define('plugin-verify-error-100554', PluginVerifyError);
}
/// <mls shortName="designSystemBaseTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { getImages, getVideos, getTokens, getTokensLess, getTokensCss, addAssets } from './_100554_designSystemBase';

@customElement('design-system-base-test-100554')
export class DesignSystemBaseTest100554 extends StateLitElement {

    fileToTest = '_100554__100554_designSystemBase';
    projectToTest = 100554;

    @property() result = '';

    render() {
        return html`<p>testing file: ${this.fileToTest}</p>
        <h4>Tokens</h4>
        <button @click=${this.execGetTokens}>Get Tokens</button>
        <button @click=${this.execGetTokensLess}>Get Tokens Less</button>
        <button @click=${this.execGetTokensCss}>Get Tokens Css</button>

        <h4>Assets</h4>

         <button @click=${this.execGetImages}>Get Images</button>
         <button @click=${this.execGetVideos}>Get Videos</button>
         <button @click=${this.addAssets}>Add assets</button>

         <pre style="white-space: break-spaces;">${this.result}</pre>
         `;
    }

    async addAssets() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async () => {
            if (input.files && input.files.length > 0) {
                const lastFile = input.files[input.files.length - 1]; // Obtém o último arquivo selecionado
                const success = await addAssets(this.projectToTest, lastFile); // Chama a função com o arquivo

                this.result = (success ? 'Arquivo enviado com sucesso!' : 'Falha ao enviar o arquivo');
            }
        };


        input.click();
    }

    async execGetImages() {
        try {
            const res = await getImages(this.projectToTest);
            this.result = JSON.stringify(res);
            console.info({ execGetImages: res });

        } catch (err: any) {
            this.result = `Error: ${err.message}`;
        }
    }

    async execGetVideos() {
        try {
            const res = await getVideos(this.projectToTest);
            this.result = JSON.stringify(res);
            console.info({ execGetVideos: res });
        } catch (err: any) {
            this.result = `Error: ${err.message}`;
        }
    }

    async execGetTokens() {
        try {
            const res = await getTokens(this.projectToTest);
            this.result = JSON.stringify(res);
            console.info({ execGetTokens: res });
        } catch (err: any) {
            this.result = `Error: ${err.message}`;
        }
    }

    async execGetTokensLess() {
        const theme = 'Default';
        try {
            const res = await getTokensLess(this.projectToTest, theme);
            this.result = JSON.stringify(res);
            console.info({ execGetTokensLess: res });

        } catch (err: any) {
            this.result = `Error: ${err.message}`;
        }
    }

    async execGetTokensCss() {
        const theme = 'Default';

        try {
            const res = await getTokensCss(this.projectToTest, theme);
            this.result = JSON.stringify(res);
            console.info({ execGetTokensCss: res });

        } catch (err: any) {
            this.result = `Error: ${err.message}`;
        }
    }

}

/// <mls shortName="designSystemBaseTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { getImages, getVideos, getTokens, getTokensLess, getTokensCss, addAssets, addNewTokensTheme } from '/_100554_/l2/designSystemBase.js';

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
        <button @click=${this.execAddTokensTheme}>Add Tokens Theme</button>

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


    async execAddTokensTheme() {
        try {
            await addNewTokensTheme(this.projectToTest, this._newTokensThemeData);
            console.info({ execAddTokensTheme: 'Ok, added' });

        } catch (err: any) {
            this.result = `Error: ${err.message}`;
        }
    }

    private _newTokensThemeData = { "themeName": "Urban Journey", "description": "Um tema acolhedor e autêntico para compartilhar experiências e histórias sobre a vida na capital. Focado em simplicidade e clareza, permitindo que os leitores se conectem com o conteúdo de forma sincera e envolvente.", "color": { "text-primary-color-lighter": "#4a4a4a", "text-primary-color-lighter-hover": "#5e5e5e", "text-primary-color-lighter-focus": "#373737", "text-primary-color-lighter-disabled": "#7b7b7b", "text-primary-color": "#292929", "text-primary-color-hover": "#3c3c3c", "text-primary-color-focus": "#1f1f1f", "text-primary-color-disabled": "#515151", "text-primary-color-darker": "#000000", "text-primary-color-darker-hover": "#121212", "text-primary-color-darker-focus": "#0a0a0a", "text-primary-color-darker-disabled": "#202020", "text-secondary-color-lighter": "#62A1D0", "text-secondary-color-lighter-hover": "#74B5E1", "text-secondary-color-lighter-focus": "#4F8DBE", "text-secondary-color-lighter-disabled": "#85C6E3", "text-secondary-color": "#007BB8", "text-secondary-color-hover": "#0092D6", "text-secondary-color-focus": "#006DA1", "text-secondary-color-disabled": "#4DA5DE", "text-secondary-color-darker": "#005B8E", "text-secondary-color-darker-hover": "#007DA5", "text-secondary-color-darker-focus": "#004A6E", "text-secondary-color-darker-disabled": "#428CA9", "bg-primary-color-lighter": "#F9F9F9", "bg-primary-color-lighter-hover": "#EDEDED", "bg-primary-color-lighter-focus": "#E1E1E1", "bg-primary-color-lighter-disabled": "#D5D5D5", "bg-primary-color": "#F7F7F7", "bg-primary-color-hover": "#EDEDED", "bg-primary-color-focus": "#E1E1E1", "bg-primary-color-disabled": "#D5D5D5", "bg-primary-color-darker": "#FFFFFF", "bg-primary-color-darker-hover": "#F2F2F2", "bg-primary-color-darker-focus": "#E6E6E6", "bg-primary-color-darker-disabled": "#D9D9D9", "bg-secondary-color-lighter": "#F2F2F2", "bg-secondary-color-lighter-hover": "#e9e9e9", "bg-secondary-color-lighter-focus": "#dedede", "bg-secondary-color-lighter-disabled": "#d4d4d4", "bg-secondary-color": "#E9E9E9", "bg-secondary-color-hover": "#D2D2D2", "bg-secondary-color-focus": "#BDBDBD", "bg-secondary-color-disabled": "#AFAFAF", "bg-secondary-color-darker": "#C8C8C8", "bg-secondary-color-darker-hover": "#B3B3B3", "bg-secondary-color-darker-focus": "#A6A6A6", "bg-secondary-color-darker-disabled": "#999999", "grey-color-lighter": "#F9FAFB", "grey-color-light": "#F2F2F2", "grey-color": "#D9D9D9", "grey-color-dark": "#BFBFBF", "grey-color-darker": "#A6A6A6", "error-color": "#FF4D4F", "error-color-hover": "#ff6666", "error-color-focus": "#e63e3e", "error-color-disabled": "#ff9999", "success-color": "#52C41A", "success-color-hover": "#66d93f", "success-color-focus": "#4ca610", "success-color-disabled": "#8cd78e", "warning-color": "#FAAD14", "warning-color-hover": "#fbbd34", "warning-color-focus": "#e09a0e", "warning-color-disabled": "#fdd55e", "info-color": "#0A6DC9", "info-color-hover": "#1B7EDB", "info-color-focus": "#006AB3", "info-color-disabled": "#66A8E1", "active-color": "#007BB8", "active-color-hover": "#0092D6", "active-color-focus": "#006DA1", "active-color-disabled": "#4DA5DE", "link-color": "#007BB8", "link-color-hover": "#0092D6", "link-color-focus": "#006DA1", "link-color-disabled": "#4DA5DE", "_dark-text-primary-color-lighter": "#D6D6D6", "_dark-text-primary-color-lighter-hover": "#C8C8C8", "_dark-text-primary-color-lighter-focus": "#B8B8B8", "_dark-text-primary-color-lighter-disabled": "#A6A6A6", "_dark-text-primary-color": "#E6E6E6", "_dark-text-primary-color-hover": "#D1D1D1", "_dark-text-primary-color-focus": "#B2B2B2", "_dark-text-primary-color-disabled": "#A0A0A0", "_dark-text-primary-color-darker": "#B0B0B0", "_dark-text-primary-color-darker-hover": "#A1A1A1", "_dark-text-primary-color-darker-focus": "#919191", "_dark-text-primary-color-darker-disabled": "#A8A8A8", "_dark-text-secondary-color-lighter": "#62A1D0", "_dark-text-secondary-color-lighter-hover": "#74B5E1", "_dark-text-secondary-color-lighter-focus": "#4F8DBE", "_dark-text-secondary-color-lighter-disabled": "#85C6E3", "_dark-text-secondary-color": "#007BB8", "_dark-text-secondary-color-hover": "#0092D6", "_dark-text-secondary-color-focus": "#006DA1", "_dark-text-secondary-color-disabled": "#4DA5DE", "_dark-text-secondary-color-darker": "#005B8E", "_dark-text-secondary-color-darker-hover": "#007DA5", "_dark-text-secondary-color-darker-focus": "#004A6E", "_dark-text-secondary-color-darker-disabled": "#428CA9", "_dark-bg-primary-color-lighter": "#B2B2B2", "_dark-bg-primary-color-lighter-hover": "#C1C1C1", "_dark-bg-primary-color-lighter-focus": "#A1A1A1", "_dark-bg-primary-color-lighter-disabled": "#B0B0B0", "_dark-bg-primary-color": "#1A1A1A", "_dark-bg-primary-color-hover": "#292929", "_dark-bg-primary-color-focus": "#151515", "_dark-bg-primary-color-disabled": "#383838", "_dark-bg-primary-color-darker": "#262626", "_dark-bg-primary-color-darker-hover": "#333333", "_dark-bg-primary-color-darker-focus": "#1f1f1f", "_dark-bg-primary-color-darker-disabled": "#404040", "_dark-bg-secondary-color-lighter": "#636363", "_dark-bg-secondary-color-lighter-hover": "#757575", "_dark-bg-secondary-color-lighter-focus": "#4e4e4e", "_dark-bg-secondary-color-lighter-disabled": "#808080", "_dark-bg-secondary-color": "#161b22", "_dark-bg-secondary-color-hover": "#1f2329", "_dark-bg-secondary-color-focus": "#0f1418", "_dark-bg-secondary-color-disabled": "#2c3238", "_dark-bg-secondary-color-darker": "#4b3f3f", "_dark-bg-secondary-color-darker-hover": "#5b4f4f", "_dark-bg-secondary-color-darker-focus": "#3f2f2f", "_dark-bg-secondary-color-darker-disabled": "#6a5c5c", "_dark-grey-color-lighter": "#2B2B2B", "_dark-grey-color-light": "#414141", "_dark-grey-color": "#575757", "_dark-grey-color-dark": "#6D6D6D", "_dark-grey-color-darker": "#969494", "_dark-error-color": "#f9676a", "_dark-error-color-hover": "#ff7b7f", "_dark-error-color-focus": "#e5565e", "_dark-error-color-disabled": "#ff9b9e", "_dark-success-color": "#63d42b", "_dark-success-color-hover": "#75d93d", "_dark-success-color-focus": "#55b825", "_dark-success-color-disabled": "#8ade5f", "_dark-warning-color": "#eead2b", "_dark-warning-color-hover": "#f2b73d", "_dark-warning-color-focus": "#d69c1f", "_dark-warning-color-disabled": "#f5cd5c", "_dark-info-color": "#0b81ef", "_dark-info-color-hover": "#1a95f6", "_dark-info-color-focus": "#0073d8", "_dark-info-color-disabled": "#66b3ef", "_dark-active-color": "#0b81ef", "_dark-active-color-hover": "#1a95f6", "_dark-active-color-focus": "#0073d8", "_dark-active-color-disabled": "#66b3ef", "_dark-link-color": "#0b81ef", "_dark-link-color-hover": "#1a95f6", "_dark-link-color-focus": "#0073d8", "_dark-link-color-disabled": "#66b3ef" }, "global": { "breakpoint-small": "544px", "breakpoint-medium": "768px", "breakpoint-large": "1012px", "transition-slow": "0.2s", "transition-normal": "0.3s", "transition-fast": "0.5s", "space-base-unit": "0.25rem", "space-8": "calc(@space-base-unit * 2)", "space-16": "calc(@space-base-unit * 4)", "space-24": "calc(@space-base-unit * 6)", "space-32": "calc(@space-base-unit * 8)", "space-40": "calc(@space-base-unit * 10)", "space-48": "calc(@space-base-unit * 12)", "space-64": "calc(@space-base-unit * 16)" }, "typography": { "font-base-unit": ".25rem", "font-family-primary": "'Arial', sans-serif", "font-family-secondary": "serif", "font-size-12": "calc(@font-base-unit * 3)", "font-size-16": "calc(@font-base-unit * 4)", "font-size-20": "calc(@font-base-unit * 5)", "font-size-24": "calc(@font-base-unit * 6)", "font-size-40": "calc(@font-base-unit * 10)", "font-size-48": "calc(@font-base-unit * 12)", "font-size-64": "calc(@font-base-unit * 16)", "line-height-base-unit": "1", "line-height-small": "calc(@line-height-base-unit * 1.1)", "line-height-medium": "calc(@line-height-base-unit * 1.3)", "line-height-large": "calc(@line-height-base-unit * 1.5)", "font-weight-lighter": "300", "font-weight-light": "400", "font-weight-normal": "500", "font-weight-bold": "700", "font-weight-bolder": "900" } }



}

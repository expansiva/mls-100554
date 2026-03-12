/// <mls fileReference="_100554_/l2/pluginCollabPublishS3.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, svg, TemplateResult, unsafeHTML } from 'lit';
import { state, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

export class PluginCollabPublishS3 extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private aws: any;
    private s3: any;

    @state() bucket: string = '';
    @state() accessKeyId: string = '';
    @state() secretAccessKey: string = '';
    @state() region: string = 'us-east-1';

    firstUpdated() {
        this.getConfigS3();
        this.addAws();
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
    }

    render(): TemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <div class="agent-box">
            ${this.renderHeader()}     
            ${this.renderInfo()}       
        </div> 
        
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${pluginData.title} - ${mls.actualProject}</span>
            </header>
        `;
    }

    renderInfo(): TemplateResult {
        return html`
        <div class="infoContent">

            <div class="infoField">
                <label>Bucket</label>
                <input 
                    type="text"
                    .value=${this.bucket}
                    @input=${(e: any) => this.bucket = e.target.value}
                    @change=${() => this.setConfigS3()}
                />
            </div>

            <div class="infoField">
                <label>Access Key</label>
                <input 
                    type="text"
                    .value=${this.accessKeyId}
                    @input=${(e: any) => this.accessKeyId = e.target.value}
                    @change=${() => this.setConfigS3()}
                />
            </div>

            <div class="infoField">
                <label>Secret Key</label>
                <input 
                    type="password"
                    .value=${this.secretAccessKey}
                    @input=${(e: any) => this.secretAccessKey = e.target.value}
                    @change=${() => this.setConfigS3()}
                />
            </div>

            <div class="infoField">
                <label>Region</label>
                <input 
                    type="text"
                    .value=${this.region}
                    @input=${(e: any) => this.region = e.target.value}
                    @change=${() => this.setConfigS3()}
                />
            </div>

            <button @click=${this.connectS3}>
                Connect
            </button>

            <button @click=${this.sendFile}>
                Teste
            </button>

        </div>
    `
    }

    //----------IMPLEMENTATION----------

    private addAws() {
        const s = this.querySelector('script');
        if (s) return;


        const st = document.createElement('script');
        st.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.1520.0.min.js';
        this.appendChild(st);
    }

    private async getAwsSDK(): Promise<void> {

        if (!this.aws && (window as any)['AWS']) {
            this.aws = (window as any)['AWS'];

        }
    }

    private async connectS3() {

        if (!this.bucket || !this.accessKeyId || !this.secretAccessKey) {
            alert("Fill all fields");
            return;
        }

        if (!this.aws) {
            await this.getAwsSDK();
        }

        await this.setConnectionConfig();
        alert("Connected to S3");
    }

    private async setConnectionConfig() {


        this.aws.config.update({
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
            region: this.region
        });

        // @ts-ignore
        this.s3 = new this.aws.S3();
    }


    private async sendFile(stor:mls.stor.IFileInfo) {

        let fileContent = await stor.getContent() as string;
        const contentType = this.getContentType(stor.extension);

        if (['.html', '.txt'].includes(stor.extension)) fileContent = unescape(encodeURIComponent(fileContent));

        const fileContentBlob = this.convertToBLob(fileContent, contentType);
        const { folder, shortName, extension } = stor;
        
        const params = {
            Bucket: this.bucket,
            Key: (folder ? folder + '/' : '') + shortName + extension,
            Body: fileContentBlob,
            ContentType: contentType
        };

        this.s3.upload(params, (err: any, data: any) => {

            if (err) {
                console.error(err);
                alert("Upload error");
                return;
            }

            alert("Upload success!");
            console.log(data);
        });
    }

    private getContentType(extension: string): string {

        let contentType = 'application/octet-stream';

        if (extension === '.html') { contentType = 'text/html; charset=utf-8'; }
        if (extension === '.ico') { contentType = 'image/x-icon'; }
        if (extension === '.css') { contentType = 'text/css'; }
        if (extension === '.js') { contentType = 'application/javascript'; }
        if (extension === '.json') { contentType = 'application/json'; }
        if (extension === '.png' || extension === '.jpg' || extension === '.gif') {
            contentType = 'image/' + extension.replace('.', '');
        }

        return contentType
    }

    private convertToBLob(content: string, contentType: string): Blob {
        const bytes = content.length;
        const myArr = new Uint8Array(bytes);

        for (let i = 0; i < bytes; i++) {

            myArr[i] = content.charCodeAt(i);

        }

        return new Blob([new Uint8Array(myArr)], { type: contentType });

    }

    private setConfigS3() {
        localStorage.setItem('configS3', JSON.stringify({ bucket: this.bucket, region: this.region, accessKeyId: this.accessKeyId, secretAccessKey: this.secretAccessKey }))
    }

    private getConfigS3() {
        const str = localStorage.getItem('configS3');
        if (!str) return;
        try {

            const info = JSON.parse(str);
            this.bucket = info.bucket || '';
            this.region = info.region || '';
            this.accessKeyId = info.accessKeyId || '';
            this.secretAccessKey = info.secretAccessKey || '';

        } catch (e: any) {

        }
    }


}

if (!customElements.get('plugin-collab-publish-s3-100554')) {
    customElements.define('plugin-collab-publish-s3-100554', PluginCollabPublishS3);
}

export const pluginData: mls.plugin.IPluginData = {
    title: "Publish S3",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M180.4 267C179.7 289.6 191 299.7 191.3 306C191.2 307.3 190.7 308.5 190 309.6C189.3 310.7 188.3 311.6 187.2 312.2L174.4 321.2C172.7 322.4 170.8 323 168.8 323.1C168.4 323.1 160.6 324.9 148.3 297.5C140.8 306.9 131.3 314.4 120.4 319.5C109.5 324.6 97.7 327.2 85.7 327C69.4 327.9 25.3 317.8 27.6 270.8C26 232.5 61.7 208.7 98.5 210.8C105.6 210.8 120.1 211.2 145.5 217.1L145.5 201.5C148.2 175 130.8 154.5 100.7 157.6C98.3 157.6 81.3 157.1 54.9 167.7C47.5 171.1 46.6 170.5 44.1 170.5C36.7 170.5 39.7 149 41.2 146.3C46.4 139.9 77.1 127.9 107.1 128.1C127.2 126.3 147.2 132.5 162.8 145.4C169.1 152.5 174 160.8 177 169.8C180 178.8 181.2 188.3 180.5 197.8L180.5 267.1zM94 299.4C126.4 298.9 140.2 279.4 143.3 268.9C145.8 258.8 145.4 252.5 145.4 241.5C135.7 239.2 121.8 236.6 105.8 236.6C90.6 235.5 63 242.2 64.1 268.9C62.9 285.7 75.2 300.3 94.1 299.4zM264.9 322.5C257 323.2 253.4 317.6 252.2 312.1L202.4 147.4C201.4 144.6 200.8 141.8 200.5 138.8C200.3 137.6 200.6 136.4 201.3 135.4C202 134.4 203.1 133.8 204.3 133.6C204.5 133.6 202.2 133.6 226.5 133.6C235.3 132.7 238.1 139.6 239.1 144L274.9 284.8L308.1 144C308.6 140.8 311 132.9 320.9 133.8L338.1 133.8C340.3 133.6 349.2 133.3 350.8 144.2L384.1 286.7L421 144.1C421.5 141.9 423.7 132.7 433.7 133.7L453.4 133.7C454.3 133.6 459.6 132.9 458.7 142.3C458.3 144.1 462.1 131.6 405.9 312.2C404.8 317.7 401.1 323.3 393.2 322.6L374.5 322.6C363.6 323.8 362 312.9 361.8 311.9L328.6 174.8L295.8 311.8C295.6 312.9 294.1 323.7 283.1 322.5L264.8 322.5L264.8 322.5zM538.4 328.1C532.5 328.1 504.5 327.8 481 315.8C478.7 314.8 476.7 313.2 475.3 311C473.9 308.8 473.2 306.4 473.2 303.9L473.2 293.2C473.2 284.7 479.4 286.3 482 287.3C492 291.4 498.5 294.4 510.8 296.9C547.5 304.4 563.6 294.6 567.5 292.4C580.7 284.6 581.7 266.7 572.8 257.5C562.3 248.7 557.3 248.4 519.7 236.5C515.1 235.2 476 222.9 475.9 184.1C475.3 155.9 500.9 127.9 545.4 128.1C558.1 128.1 591.8 132.2 601 143.7C602.4 145.8 603 148.3 602.9 150.7L602.9 160.8C602.9 165.2 601.3 167.5 598 167.5C590.3 166.6 576.6 156.3 548.8 156.7C541.9 156.3 508.9 157.6 510.4 181.7C510 200.7 537 207.8 540.1 208.6C576.6 219.6 588.7 221.4 603.2 238.2C620.3 260.4 611.1 286.5 607.5 293.6C588.4 331.1 539.1 328 538.2 328zM578.6 433C508.6 484.7 406.9 512.2 320.1 512.2C203 513 89.8 469.9 2.8 391.5C-3.7 385.6 2 377.5 10 382C106.5 437.2 215.7 466.2 326.9 466.1C409.9 465.7 492 448.8 568.5 416.6C580.3 411.6 590.3 424.4 578.6 433zM607.8 399.7C598.8 388.2 548.5 394.3 526 397C519.2 397.8 518.1 391.9 524.2 387.5C564.3 359.3 630.1 367.4 637.6 376.9C645.1 386.4 635.5 452.3 598 483.8C592.2 488.7 586.7 486.1 589.3 479.7C597.7 458.4 616.7 411.2 607.7 399.7z"/></svg>
    `;
    }
}
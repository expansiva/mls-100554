/// <mls shortName="testGenerateDefs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { addMessage } from '/_100554_/l2/collabMessageHelper.js';

@customElement('test-generate-defs-100554')
export class TestGenerateDefs100554 extends StateLitElement {

    project = 100554;
    threadId = "20250521144240.1000";
    filePrefix: string = "plugin";
    max = 20;
    log: string[] = [];

    render() {
        return html`
         <p> pressione o botão para iniciar o processamenteo</p>
         <p> Vários arquivos serão analisados para o projeto ${this.project} e prefixo ${this.filePrefix}</p>
         <p> Até no máximo ${this.max} arquivos serão processados para gerar o .defs</p>
         <button @click=${this.handleClickIniciar}> Iniciar </button>
         <button @click=${this.handleClickSimular}> Simular </button>
         <pre>${this.log.join('\n')}</pre>
         `;
    }

    handleClickIniciar() {
        this.executar(false);
    }
    handleClickSimular() {
        this.executar(true);
    }

    async executar(simular: boolean) {
        const keys = Object.keys(mls.stor.files);
        this.log = [];
        this.log.push(`analisando ${keys.length} files`)
        this.requestUpdate();

        const shortNames = new Set();
        for (const key of keys) {
            if (mls.stor.files[key].project !== this.project) continue;
            if (mls.stor.files[key].level !== 2) continue;
            if (mls.stor.files[key].shortName.startsWith(this.filePrefix) === false) continue;
            shortNames.add(mls.stor.files[key].shortName);
        }
        this.log.push(`analisando ${shortNames.size} files apos filtragem`);
        this.requestUpdate();

        const updateDefsAfter = new Date("2025-07-01");

        const files: mls.stor.IInfo[] = [];
        
        for (const shortName of shortNames) {
            const info = await mls.stor.getFiles({ project: this.project, shortName: shortName as string, folder: "", loadContent: false });
            if (info.defs && info.defs.updatedAt && (new Date(info.defs.updatedAt)) > updateDefsAfter) {
                continue;
            }
            if (files.length >= this.max) break;
            this.log.push("added " + shortName + "," + (!!info.defs) + "," + info?.defs?.updatedAt )
            files.push(info);
        }
        this.log.push(`preparando ${files.length} files limitado por max`);
        this.requestUpdate();

        const batchSize = 5;
        let batch: Promise<any>[] = [];
        for await (const file of files) {
            if (!file || !file.ts) continue;
            const command = `@@GenerateDefs gerar o arquivo de definição: {"project":${file.ts.project}, "shortName":"${file.ts.shortName}" }`;

            if (!simular) {
                batch.push(
                    (async () => {
                        if (!file || !file.ts) return;
                        try {
                            await addMessage(this.threadId, command);
                            this.log.push("added message: " + command);
                        } catch (e: any) {
                            this.log.push("erro ao adicionar mensagem: " + (e?.message || e));
                        }
                        this.requestUpdate();
                    })()
                );

                if (batch.length === batchSize) {
                    this.log.push("starting " + batch.length + " batch.")
                    this.requestUpdate();
                    await Promise.all(batch);
                    await sleep(batchSize * 1000);
                    this.requestUpdate();
                    batch = [];
                }
            } else {
                this.log.push(command);
                this.requestUpdate();
            }
        }

        // Espera o resto
        if (batch.length > 0) {
            await Promise.all(batch);
        }
        this.log.push("end");
        this.requestUpdate();

    }

 }

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


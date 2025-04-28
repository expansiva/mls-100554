/// <mls shortName="agentCreateTs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType } from './_100554_aiPrompts'; 
import { createNewFile } from "./_100554_pluginNewFileBase";

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    calculateStepsStatistics,
    updateStepStatus,
    getNextPendentStep
} from "./_100554_aiAgentHelper";

import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask    
} from "./_100554_aiAgentOrchestration";

const agentName = "agentCreateTs";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url:svg_agent,
        agentDescription: "Especialista em desenvolvimento de Web Components usando TypeScript e Lit. Sua função é criar um arquivo TypeScript que define um Web Component para comandar uma página.",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        // using temporary context, create a new task
        const inputs = await getPrompts(context.message.content, null);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
        const inputs = await getPrompts(JSON.stringify(step.prompt), step.rags);
        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}


const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    const { flexible } = calculateStepsStatistics([step], true);
    if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
    context.task = await updateStepStatus(context.task, step.stepId, "completed");

    await addFile(context);
    await executeNextStep(context);    
    
}

async function addFile(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error('Not found context to create files');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'result') throw new Error('Invalid step in create files');

    if (!step.result || !(step.result as any).fileHTML || !(step.result as any).fileTS || !(step.result as any).pageName) throw new Error('Not found "fileHTML" or "fileTS" or "pageName" in create files');
    
    const pageName = (step.result as any).pageName;
    const fileHTML = (step.result as any).fileHTML;
    const fileTS = (step.result as any).fileTS;
    const project = mls.actual[5].project || 100554;
    const enhancement = '_100554_enhancementLit';
    await createNewFile(project, 'right', pageName, enhancement, fileTS, fileHTML, false);
    console.info('Aqui', { fileTS, fileHTML, pageName});
}


export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemRulesInstruction());
    //prompts.push(systemFile1Instruction());
    prompts.push(systemExampleInstruction());
    prompts.push(systemOutInstruction());
    prompts.push({
        type: 'human',
        content: '##JSON BASE \n\n' + prompt
    });
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',//${preferModelType("cost")}
        content: `
Você é um especialista em desenvolvimento de Web Components usando TypeScript e Lit. Sua função é criar um arquivo TypeScript que define um Web Component para comandar uma página.
`
    }
}


function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## REGRAS

 - A pagina deve estender do arquivo _100554_collabPageElement
 - Será usado o Lit versão 3 
 - Não se deve usar shadow DOM 
 - Deve se iniciar o state de acordo com a necessidade do html base que se encontra no JSON do usuario no campo "fileHTML"
 - Levar em consideração o exemplo, para seguir o padrão
 - A primeira linha do arquivo .ts deve ser o tripleslach conforme a regra
 - /// <mls shortName="{{nome_da_pagina}}" project="{{projeto}}" enhancement="_100554_enhancementLit"/> 
 - O componente não deve ter render
 - O state deve ser criado respeitando sua sequencia exemplo value="{{pageCadastro.dadosVeiculo.placa}}" na função 
    initState('pageCadastro', {{dadosVeiculo:{{placa:""}}}})
`
    }
}


function systemFile1Instruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##ARQUIVO _100554_collabPageElement

/// <mls shortName="collabPageElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { WCDOverlayMethods  } from './_100554_wcdTypes';
import { IICADepths, IcaLitElementBaseMethods } from './_100554_icaTypes'
import { convertTagToFileName } from './_100554_utilsLit'

export const PREFIX_ICA_ID = 'ica_';

export function toPascalCase(str: string) {
    return str.replace(/(^\w|-\w)/g, match => match.replace('-', '').toUpperCase());
}

export abstract class CollabPageElement extends IcaLitElement {

    abstract initPage(): void

    @property({ type: String, reflect: true }) modeoverlay: string = '';

    @property() initPageComplete: boolean = false;

    @property({ type: String, reflect: true }) level: string = mls.actualLevel.toString() || '7';

    public overlay: WCDOverlayMethods | undefined;

    public isPage = true;

    public recreateOverlay() {
        this.overlay?.remove();
        this.overlay = undefined;
        this.createOverlay();
    }

    public refreshOverlay() {
        this.checkToAddOverlay();
    }

    constructor() {
        super();
    }

    //--------COMPONENT------------

    createRenderRoot() {
        return this; // dont use shadow root
    }

    async firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        setTimeout(() => {
            this.checkToAddOverlay();
        }, 500);

        this.setupIds();
        // this.setupEvents();
        await this.initPage();
        this.initPageComplete = true;

    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('level') && changedProperties.get('level') !== undefined) {
            this.checkToAddOverlay();
        }
    } 

    render() {
        this.style.position = 'relative';
        return html\`\`;
    }

    //--------IMPLEMENTS------------


    private setupIds(): void {
        const icas = this.findAllElementsIca(this);
        icas.forEach((item) => {
            const oldId = item.element.id;
            const icaId = \`\${PREFIX_ICA_ID}\${item.element.id}\`;
            item.element.setAttribute('id', icaId);
            item.element.setAttribute('idel', oldId);
        });

    }

    private checkToAddOverlay(): void {

        if (this.level === '7') {
            this.overlay?.remove();
            this.overlay = undefined;
            return;
        }

        if (this.overlay) {
            this.overlay.setAttribute('level', this.level)
            this.overlay.changeOverlayItemsLevel();
            return;
        }

        this.createOverlay();
    }

    private async createOverlay() {

        if (!this.modeoverlay) return;
        const ok = await this.importWCDOverlay(this.modeoverlay);
        if (!ok) return;
        this.overlay = document.createElement(this.modeoverlay) as WCDOverlayMethods;
        this.overlay.myItens = this.findAllElementsIca(this);
        this.overlay.createOverlayItems();
        this.appendChild(this.overlay as HTMLElement);
        mls.events.fire(3, 'WCDEventChange' as any,JSON.stringify({op:'recreateOverlay'}));

    }

    private hasImport: string[] = [];
    private async importWCDOverlay(imports: string) {

        try {

            if (this.hasImport.includes(imports)) return true;
            imports = convertTagToFileName(imports);
            if (!imports.startsWith('./')) imports = './' + imports;
            await import(imports);
            this.hasImport.push(imports);
            return true;

        } catch (e) {
            console.info(e);
            return false
        }

    }

    private findAllElementsIca(el: HTMLElement): IICADepths[] {
        let elements: IICADepths[] = [];
        let elToSearch: Element | ShadowRoot = el;

        const arrayEls: HTMLElement[] = [];

        function traverseShadowRoot(element: HTMLElement, depth: number) {

            if (element.tagName.toLowerCase().startsWith('ica') && !arrayEls.includes(element)) {
                const { x, y, height, width } = element.getBoundingClientRect();
                elements.push({ element: element as IcaLitElementBaseMethods, depth, x, y, height, width, opacity: element.style.opacity });
                arrayEls.push(element);
                return;
            }
            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item as HTMLElement, depth + 1);
                });
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child as HTMLElement, depth + 1));
                }
            }
        }



        if (el.shadowRoot)
            elToSearch = el.shadowRoot;
        elToSearch.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item as HTMLElement, 0); // Inicializar com profundidade 0
        });

        return elements;

    }

}
`
    }
}

function systemExampleInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## PAGINA DE EXEMPLO

/// <mls shortName="pageTest1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_icaState';

@customElement('page-test1-100554')
export class PageTest1100554 extends CollabPageElement {

    initPage() {
        initState('page1', {
            action: '',
            labelError: '',
            labelOk: '',
        });

        globalState.globalStateManagment.subscribe( [ 'projectTest.page1.action' ], this);

    }


    handleIcaStateChange(_key: string, _value: any) {

        if (_key !== 'projectTest.page1.action') return;
        if (_value === 'save') this.handleClickBtnSave();
        else if (_value === 'cancel') this.handleClickBtnCancel();
    }

    async handleClickBtnSave() {
       // ação botão save
    }

    async handleClickBtnCancel() {
        // ação botão cancel
    }

}
`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Saída Esperada 
A resposta deve ser um JSON estruturado contendo as informações da interface. Preencha os campos com os dados passados pelo usuario você deve preencher somente "fileTS"
O codigo TS criado deve se colocar no atributo "fileTS" dentro do JSON de exemplo passado abaixo,
* Lembrando tem que responder no padrão abaixo, todos os campos são obrigatorios;
* É de suma importancia o retorno do campo "fileTS" com o codigo gerado;

\`\`\`json
[
  {
    "type": "result", // campo obrigatorio
    "taskTitle": string,// O mesmo que veio na requisição do usuario
    "promptUser": string, // O mesmo que veio na requisição do usuario
    "result":{
      "pageName": string, // O mesmo que veio na requisição do usuario
      "pageType": "crud" | "report" | "dashboard" | "form" | "search" | "workflow" | "config" | "association", // O mesmo que veio na requisição do usuario
      "loadContext": boolean,    // O mesmo que veio na requisição do usuario 
      "modoInicial": string, // O mesmo que veio na requisição do usuario
      "fluxo": string, // O mesmo que veio na requisição do usuario
      "fileHTML":string,// O mesmo que veio na requisição do usuario fileHTML
      "fileTS":"{codigo ts}" // preencha com o codigo gerado
    }
  }
]

\`\`\``
    }
}
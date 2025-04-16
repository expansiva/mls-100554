/// <mls shortName="agentCreateTs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAMessageInputType, TaskData, AIPayload, AIAfterPrompt } from './_100554_iaChatInterfaces';

export const visibility: 'public' | 'private' = 'private'

export function beforePrompt(task: TaskData, payload: AIPayload | null | undefined): IAMessageInputType[] {

    const j = Object.assign({}, payload) as any;
    delete j.agentName;
    delete j.interaction;
    delete j.rags;
    delete j.stepId;
    delete j.type;
    delete j.status;

    return startPrompt(JSON.stringify(j));
}

export async function afterPrompt(task: TaskData, payload: AIPayload | null | undefined): Promise<AIAfterPrompt[]> {

    const ret: AIAfterPrompt[] = [];

    return ret

}

export function getDescriptions(): string {

    return `Especialista em desenvolvimento de Web Components usando TypeScript e Lit. Sua função é criar um arquivo TypeScript que define um Web Component para comandar uma página.`
}

export function startPrompt(userPrompt: string): IAMessageInputType[] {
    return [
        {
            type: 'system',
            content: `
Você é um especialista em desenvolvimento de Web Components usando TypeScript e Lit. Sua função é criar um arquivo TypeScript que define um Web Component para comandar uma página
`
        },
        {
            type: 'system',
            content: `## REGRAS

 - A pagina deve estender do arquivo _100554_collabPageElement
 - Será usado o Lit versão 3 
 - Não se deve usar shadow DOM 
 - Deve se iniciar o state de acordo com a necessidade do html base
 - Levar em consideração o exemplo, para seguir o padrão
 - A primeira linha do arquivo .ts deve ser o tripleslach conforme a regra
 - // <mls shortName="{{nome_da_pagina}}" project="{{projeto}}" enhancement="_100554_enhancementLit" 
 - O componente não deve ter render
 - O state deve ser criado respeitando sua sequencia exemplo value="{{pageCadastro.dadosVeiculo.placa}}" na função 
    initState('pageCadastro', {{dadosVeiculo:{{placa:""}}}})
`
        },
        {
            type: 'system',
            content: ` 
##ARQUIVO _100554_collabPageElement

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

}`
        },
        {
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

}`
        },
        {
            type: 'system',
            content: `## SAIDA ESPERADA  um json

        {
            "type": "result",
            "resulthtml": "{html base}"	,
            "resultts": "{o codigo ts gerado}"	,
        }
        
O código TS deve ser devolvido, seguindo todas as especificações.`
        },

        {
            type: 'human',
            content: userPrompt
        },
    ]
}
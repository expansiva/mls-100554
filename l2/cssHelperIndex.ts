/// <mls shortName="cssHelperIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, when, repeat, TemplateResult } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

import { convertFileNameToTag } from './_100554_utilsLit'
import { IBlockLess, IBlockLessLine } from './_100554_enhancementStyle';
import {
    collab_heart,
    collab_heart_o,
    collab_question,
    collab_angles_right,
    collab_chevron_right,
    collab_info_circle
} from './_100554_collabIcons'

/// **collab_i18n_start**

const message_pt = {
    'msg': 'Nenhum helper disponivel',
    'selector': 'Seletor',
}
const message_en = {
    'msg': 'No helper available.',
    'selector': 'Selector',

}


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('css-helper-index-100554')
export class CssHelperIndex extends IcaLitElement {


    private msg: MessageType = messages['en'];

    @property() helpers: IHelpers[] = [];
    @property() avaliablePlugins: IHelpers[] = [];

    @property() position: 'right' | 'left' | undefined;

    @property() mode: 'collapsed ' | 'expanded ' | 'full' = 'collapsed ';

    @property({ reflect: true }) actualProp: string = '';
    @property({ reflect: true }) actualValue: string = '';
    @property({ reflect: true }) actualSelector: string = '';
    @property() actualLineNumber: number | undefined;

    // @property() args: Record<string, string> = {};
    @propertyDataSource() state: IStateStyle | undefined;

    @queryAll('.plugin-item') allPluginsEls!: IHTMLPluginItemElement[];

    handleIcaStateChange(key: string, value: IStateStyle) {

        if (key !== 'style' || !value || value.position !== this.position) return;

        const { lineKey, lineValue, selector, lineNumber } = value;

        this.actualProp = lineKey;
        this.actualValue = lineValue;
        this.actualSelector = selector;
        this.actualLineNumber = lineNumber;

        if (lineNumber && lineKey) {
            this.actualProp = lineKey;
            this.actualValue = lineValue;
            this.openIfNeeded();

        } else {
            this.actualProp = '';
            this.actualValue = '';
        }

    }

    async updated(changedProperties: any) {

        if (changedProperties.has('actualProp') || changedProperties.has('actualValue') || changedProperties.has('actualLineNumber')) {
            this.helpers = this.filterByProp(this.avaliablePlugins, this.actualProp, this.actualValue).sort((a, b) => a.priority - b.priority);
            await this.updateComplete;
            this.openIfNeeded();
        }
    }

    async firstUpdated(a: any) {
        super.firstUpdated(a)
        const avaliablePlugins = await this.getAvaliablesPlugins();
        this.avaliablePlugins = avaliablePlugins;
        const helpers = this.filterByProp(this.avaliablePlugins, this.actualProp, this.actualValue);
        this.helpers = helpers;
        // this.helpers = avaliablePlugins;
        await this.updateComplete;
    }

    private async getAvaliablesPlugins(): Promise<IHelpers[]> {

        const { project } = mls.actual[5];
        if (!project) return [];
        await mls.plugin.loadAll(project, true);
        const allPlugins = mls.plugin.getAllMenuActions(project, { scope: 'l2StyleHelper' } as any);
        const helpers: IHelpers[] = []

        for await (let plugin of allPlugins) {
            const instance = await import(`./${plugin.widget}`);
            if (!instance || !instance.tags || !Array.isArray(instance.tags)) continue;
            const obj: IHelpers = {
                name: plugin.category || 'none',
                widget: plugin.widget,
                tags: instance.tags,
                priority: plugin.priority || 1,
                description: instance.description || '',
                mode: 'collapsed',
                liked: false,
                likedAnimation: false,
                showInfo: false
            };
            helpers.push(obj);
        }

        return helpers;

    }

    private filterByProp(helpers: IHelpers[], actualProp: string, actualValue: string): IHelpers[] {

        if (!window.globalState?.style || !window.globalState?.style.lineNumber || !window.globalState?.style.validLine) return [];
        // if (!window.globalState?.style?.lineKey) this.isPreviewMode = true;

        const rc = helpers.filter(helper => {


            return helper.tags.some(helperTag => {
                const [tagProperty, tagValue] = helperTag.split(':');

                const validateTagOrProp = (tagCompare: string, value: string, returnAllIfEmpty: boolean = false) => {
                    // Se o valor for vazio, não atende à condição

                    if (!value && returnAllIfEmpty) {
                        return true;
                    }
                    if (!value) return false;

                    // Excluir os que começam com prefixo negado (!)
                    if (tagCompare.startsWith('!')) {
                        const prefix = tagCompare.substring(1);
                        if (tagCompare.endsWith('*')) {
                            const trimmedPrefix = prefix.slice(0, -1); // Remove o '*'
                            return !value.startsWith(trimmedPrefix);
                        }
                        // Caso contrário, exclui somente a correspondência exata
                        return value !== prefix;
                    }

                    // Incluir os que começam com o prefixo curinga (*)
                    if (tagCompare.endsWith('*')) {
                        const prefix = tagCompare.slice(0, -1); // Remove o '*'
                        return value.startsWith(prefix);
                    }

                    // Caso não tenha *, verifica se é uma correspondência exata
                    return tagCompare === value;
                };


                // Verifica tanto a actualProp quanto o actualValue
                const propMatches = validateTagOrProp(tagProperty, actualProp, true);
                const valueMatches = tagValue ? validateTagOrProp(tagValue, actualValue) : true; // Se não houver tagValue, não valida

                return propMatches && valueMatches;

            });
        });

        const mode: IMode = rc.length < 3 ? 'full' : (rc.length < 7 ? 'expanded' : 'collapsed');
        rc.forEach((help) => help.mode = mode);
        return rc;
    }

    render() {
        return html`
            <div> ${this.msg.selector}: <b>${this.actualSelector} </b> </div>
            ${when(this.helpers.length === 0,
            () => html`<div>${this.msg.msg}</div>`,
            () => html`
                <div class="helpers">
                ${repeat(
                this.helpers,
                ((item: IHelpers) => item.widget) as any,
                ((item: IHelpers, index: number) => this.renderHelper(item, index)) as any)
                }
                </div>`)
            }`;


    }

    renderHelper(help: IHelpers, index: number) {

        return html`
            <div class="plugin-item" .data=${help} >
                
                <div class="plugin-item-header">
                    <span>${help.name}</span>
                    <div class="plugin-item-icons">
                        <i
                            class="i-expanded ${help.mode === 'full' || help.mode === 'expanded' ? 'open' : ''}"
                            @click=${(e: MouseEvent) => { this.handleExpandedClick(e, help); }}
                        >${collab_chevron_right}</i>

                        <i
                            class="i-full ${help.mode === 'full' ? 'open' : ''}"
                            @click=${(e: MouseEvent) => { this.handleFullClick(e, help); }}
                        
                        >${collab_angles_right}</i>
                        <i
                            class="i-question ${help.showInfo ? 'info' : ''}"
                            @click=${(e: MouseEvent) => { this.handleInfoClick(e, help); }}
                        >${collab_question}</i>
                        <i
                            class="i-like ${help.liked ? 'liked' : ''} ${help.likedAnimation ? 'likedAnimation' : ''}"
                            @click=${(e: MouseEvent) => { this.handleLikeClick(e, help); }}
                        >${help.liked ? collab_heart : collab_heart_o}
                        </i>
                    </div>
                </div>
                
                ${help.showInfo ? html`
                    <div class="plugin-item-info">
                        <i>${collab_info_circle}</i>
                        <span>${help.widget}</span>
                    </div>
                `: ''}

                <div class="plugin-item-desc">${help.description}</div>
                <div class="plugin-item-container ${help.mode === 'expanded' ? 'expanded' : ''}">
                </div>            

            </div>`
    }

    openIfNeeded() {
        this.allPluginsEls.forEach((pluginEl) => {
            if (pluginEl.data.mode === "expanded" || pluginEl.data.mode === "full") {
                const container = pluginEl.querySelector('.plugin-item-container') as HTMLElement;
                this.openPlugin(container, pluginEl.data, false);
            }
        })
    }

    async handleOpenPlugin(e: MouseEvent, help: IHelpers, close: boolean = false) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (!target) return;
        const parent = target.closest('.plugin-item') as HTMLElement;
        if (!parent) return;
        const container = parent.querySelector('.plugin-item-container') as HTMLElement;
        if (!container) return;
        this.openPlugin(container, help, close);
    }

    private async openPlugin(container: HTMLElement, help: IHelpers, close: boolean) {
        if (close) {
            container.style.display = 'none';
            return;
        }

        if (container.childElementCount === 0) {
            const tag = convertFileNameToTag(help.widget);
            const item = document.createElement(tag);
            item.setAttribute('state', '{{ style }}');
            item.setAttribute('showFull', help.mode === 'full' ? 'true' : 'false');
            container.appendChild(item);
        } else {
            const item = container.children[0] as HTMLElement;
            item.setAttribute('showFull', help.mode === 'full' ? 'true' : 'false');
        }
        container.style.display = 'block';


    }

    handleExpandedClick(e: MouseEvent, help: IHelpers) {
        if (help.mode === 'expanded' || help.mode === 'full') {
            help.mode = 'collapsed';
            this.requestUpdate();
            this.handleOpenPlugin(e, help, true);
            return;
        }
        help.mode = 'expanded';
        this.requestUpdate();
        this.handleOpenPlugin(e, help);
    }

    handleFullClick(e: MouseEvent, help: IHelpers) {
        if (help.mode === 'full') {
            help.mode = 'collapsed';
            this.requestUpdate();
            this.handleOpenPlugin(e, help, true);
            return;
        }
        help.mode = 'full';
        this.requestUpdate();
        this.handleOpenPlugin(e, help)

    }

    async handleLikeClick(e: MouseEvent, help: IHelpers) {
        help.liked = !help.liked;
        help.likedAnimation = help.liked;
        this.requestUpdate();
        setTimeout(() => {
            help.likedAnimation = false;
        }, 1000);
    }

    async handleInfoClick(e: MouseEvent, help: IHelpers) {
        help.showInfo = !help.showInfo;
        this.requestUpdate();
    }

}

type IMode = 'collapsed' | 'expanded' | 'full';

interface IHTMLPluginItemElement extends HTMLElement {
    data: IHelpers
}
interface IStateStyle {
    lines: IBlockLessLine[]
    selector: string
    lineNumber: number
    lineKey: string
    lineValue: string,
    position: 'left' | 'right'
}

interface IHelpers {
    name: string,
    priority: number,
    widget: string,
    tags: string[],
    description: string,
    mode: IMode,
    liked: boolean,
    likedAnimation: boolean,
    showInfo: boolean
}

interface IEventData {
    info: IBlockLess,
    lineNumber: number,
    position: 'left' | 'right'
}
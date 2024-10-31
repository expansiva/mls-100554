/// <mls shortName="cssHelperIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, when, repeat, TemplateResult } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

import { convertFileNameToTag } from './_100554_utilsLit'
import { IBlockLess, IBlockLessLine } from './_100554_enhancementStyle';

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

    @property({ reflect: true }) actualProp: string = '';
    @property({ reflect: true }) actualValue: string = '';
    @property({ reflect: true }) actualSelector: string = '';
    @property() actualLineNumber: number | undefined;

    // @property() args: Record<string, string> = {};
    @propertyDataSource() state: IStateStyle | undefined;

    @queryAll('details') allDetails!: HTMLDetailsElement[];

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
            this.openAllDetails(false);

        } else {
            this.actualProp = '';
            this.actualValue = '';
        }

    }

    async updated(changedProperties: any) {

        if (changedProperties.has('actualProp') || changedProperties.has('actualValue') || changedProperties.has('actualLineNumber')) {
            this.helpers = this.filterByProp(this.avaliablePlugins, this.actualProp, this.actualValue).sort((a, b) => a.priority - b.priority);
            await this.updateComplete;
            this.openAllDetails();

        }
    }

    async firstUpdated(a: any) {
        super.firstUpdated(a)
        const avaliablePlugins = await this.getAvaliablesPlugins();
        this.avaliablePlugins = avaliablePlugins;
        const helpers = this.filterByProp(this.avaliablePlugins, this.actualProp, this.actualValue);
        this.helpers = helpers;
        await this.updateComplete;
        this.openAllDetails();

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
                priority: plugin.priority || 1
            };
            helpers.push(obj);
        }

        return helpers;

    }

    private filterByProp(helpers: IHelpers[], actualProp: string, actualValue: string): IHelpers[] {

        if (!window.globalState?.style || !window.globalState?.style.lineNumber || !window.globalState?.style.validLine) return [];

        return helpers.filter(helper => {
            return helper.tags.some(helperTag => {
                const [tagProperty, tagValue] = helperTag.split(':');

                const validateTagOrProp = (tagCompare: string, value: string, returnAllIfEmpty: boolean = false) => {
                    // Se o valor for vazio, não atende à condição

                    if (!value && returnAllIfEmpty) return true;
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
    }

    private async handleOpen(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target) return;
        const details = target.closest('details') as HTMLDetailsElement;
        if (!details) return;
        this.openDetails(details);
    }

    private openAllDetails(open: boolean = true) {
        this.allDetails.forEach((det) => this.openDetails(det, open));
    }

    private async openDetails(details: HTMLDetailsElement, open?: boolean) {

        const container = details.querySelector(':scope>div');
        if (details.open === true && open !== false) return;
        if (!container) return;

        if (container.childElementCount === 0) {
            const tag = convertFileNameToTag(details.id);
            const item = document.createElement(tag);
            item.setAttribute('state', '{{ style }}');
            container.appendChild(item);
        }

        if (open) {
            details.open = true;
            details.scrollIntoView({ behavior: 'smooth' });
        }
    }

    render() {
        return html`
            <div> ${this.msg.selector}: <b>${this.actualSelector} </b> </div>
            ${when(this.helpers.length === 0,
            () => html`<div>${this.msg.msg}</div>`,
            () => html`
                <div>
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
            <details @click=${this.handleOpen} id=${help.widget}>
                <summary>${help.name} </summary>
                <div></div>
            </details>`
    }

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
    tags: string[]
}
interface IEventData {
    info: IBlockLess,
    lineNumber: number,
    position: 'left' | 'right'
}
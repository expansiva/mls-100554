/// <mls fileReference="_100554_/l2/cssHelperIndex.ts" enhancement="_blank" />

import { html, when, repeat } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { propertyDataSource } from '/_100554_/l2/collabDecorators.js';
import { PluginStyleIndexItem } from '/_100554_/l2/pluginStyleIndexItem.js';
import { IHelpers, IMode } from '/_100554_/l2/cssHelperIndexBase.js';
import { ICSSState } from '/_100554_/l2/lessCSS.js';
import { setState, getState } from '/_100554_/l2/collabState.js';
import { loadPluginProject } from '/_100554_/l2/libCommom.js';
import '/_100554_/l2/pluginStyleIndexItem.js';

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
export class CssHelperIndex extends StateLitElement {

    private msg: MessageType = messages['en'];

    private minValueToOpen = {
        'full': 3,
        'expanded': 20,
    }

    @property() helpers: IHelpers[] = [];
    @property() avaliablePlugins: IHelpers[] = [];

    @property() position: 'right' | 'left' = 'left';
    @property({ reflect: true }) actualProp: string | undefined = '';
    @property({ reflect: true }) actualValue: string | undefined = '';
    @property({ reflect: true }) actualSelector: string | undefined = '';
    @property({ reflect: true }) actualLineContent: string | undefined = '';

    @property() actualLineNumber: number | undefined;
    private isFirtsLoading: boolean = true;
    @propertyDataSource() state: ICSSState | undefined;

    @queryAll('plugin-style-index-item-100554') allPluginsEls!: PluginStyleIndexItem[];

    handleIcaStateChange(_key: string, _value: ICSSState) {

        if (_key !== `less.${this.position}` || !_value) return;
        const { key, value, selector, lineNumber, lineContent } = _value;

        this.actualSelector = selector;
        this.actualProp = key;
        this.actualValue = value;
        this.actualLineNumber = lineNumber;
        this.actualLineContent = lineContent;


        if (lineNumber && key) {
            this.actualProp = key;
            this.actualValue = value;

        } else {
            this.actualProp = '';
            this.actualValue = '';
        }

    }

    async updated(changedProperties: any) {
        if ((changedProperties.has('actualProp') ||
            changedProperties.has('actualValue') ||
            changedProperties.has('actualLineNumber')
        )
        ) {
            if (
                !(this.actualSelector && (this.actualSelector.endsWith(':') || this.actualSelector.endsWith('::'))) &&
                !(this.actualLineContent && (this.actualLineContent.endsWith(':') || this.actualLineContent.endsWith('::')))
            ) {

                this.avaliablePlugins = this.mergeHelpersArrays(this.avaliablePlugins, this.helpers);
                this.helpers = this.filterByProp(this.avaliablePlugins, this.actualProp, this.actualValue).sort((a, b) => a.priority - b.priority);
            }
        }


        if (changedProperties.has('actualLineContent') &&
            this.actualProp === '' &&
            this.actualValue === '' &&
            (this.actualLineContent && (this.actualLineContent.endsWith(':') || this.actualLineContent.endsWith('::')) ||
                this.actualSelector && (this.actualSelector.endsWith(':') || this.actualSelector.endsWith('::')))
        ) {

            this.avaliablePlugins = this.mergeHelpersArrays(this.avaliablePlugins, this.helpers);
            this.helpers = this.avaliablePlugins.filter((pl) => pl.tags.includes('pseudo:*'));
            if (this.helpers[0]) this.helpers[0].mode = 'full';
        }

        // if (changedProperties.has('actualSelector') &&
        //     this.actualProp === '' &&
        //     this.actualValue === '' &&
        //     this.actualSelector &&
        //     (this.actualSelector.endsWith(':') || this.actualSelector.endsWith('::'))
        // ) {
        //     this.avaliablePlugins = this.mergeHelpersArrays(this.avaliablePlugins, this.helpers);
        //     this.helpers = this.avaliablePlugins.filter((pl) => pl.tags.includes('pseudo:*'));
        //     if (this.helpers[0]) this.helpers[0].mode = 'full';
        // }
    }

    private mergeHelpersArrays(a: IHelpers[], b: IHelpers[]): IHelpers[] {
        const mergedMap = new Map<string, IHelpers>();
        for (const item of a) {
            mergedMap.set(item.name, { ...item });
        }
        for (const item of b) {
            mergedMap.set(item.name, { ...mergedMap.get(item.name), ...item });
        }
        return Array.from(mergedMap.values());
    }

    async firstUpdated(a: any) {
        super.firstUpdated(a)
        const avaliablePlugins = await this.getAvaliablesPlugins();
        this.avaliablePlugins = avaliablePlugins;
        const helpers = this.filterByProp(this.avaliablePlugins, this.actualProp, this.actualValue);
        this.helpers = helpers;
        await this.updateComplete;
    }

    private baseProject = 100554;
    private async getAvaliablesPlugins(): Promise<IHelpers[]> {

        const project = mls.actualProject;

        const allPlugins = await loadPluginProject(project || 0, 'l2StyleHelper');

        const helpers: IHelpers[] = []

        for await (let plugin of allPlugins) {

            const instance = await import(`/${plugin.widget}`);
            let description: string = '';

            if (!instance || !instance.tags || !Array.isArray(instance.tags)) continue;

            if (instance.getDescription && typeof instance.getDescription === 'function') {
                const descriptionRc = instance.getDescription();
                if (descriptionRc && typeof descriptionRc === 'string') description = descriptionRc;
            }

            const obj: IHelpers = {
                name: plugin.category || 'none',
                widget: plugin.widget,
                tags: instance.tags,
                priority: plugin.priority || 1,
                description,
                mode: 'expanded',
                liked: false,
                likedAnimation: false,
                showInfo: false,
            };
            helpers.push(obj);
        }

        return helpers;

    }

    private filterByProp(helpers: IHelpers[], actualProp: string | undefined, actualValue: string | undefined): IHelpers[] {

        const state = getState(`less.${this.position}`);
        if (!state || !state.selector || !state.lineNumber) return [];

        const rc = helpers.filter(helper => {
            return helper.tags.some(helperTag => {

                const [tagProperty, tagValue] = helperTag.split(':');
                const validateTagOrProp = (tagCompare: string, value: string, returnAllIfEmpty: boolean = false) => {

                    if (!value && returnAllIfEmpty) return true;
                    if (!value) return false;

                    if (tagCompare.startsWith('!')) {
                        const prefix = tagCompare.substring(1);
                        if (tagCompare.endsWith('*')) {
                            const trimmedPrefix = prefix.slice(0, -1);
                            return !value.startsWith(trimmedPrefix);
                        }
                        return value !== prefix;
                    }

                    if (tagCompare.endsWith('*')) {
                        const prefix = tagCompare.slice(0, -1);
                        return value.startsWith(prefix);
                    }

                    return tagCompare === value;
                };

                const propMatches = validateTagOrProp(tagProperty, actualProp || '', true);
                const valueMatches = tagValue ? validateTagOrProp(tagValue, actualValue || '') : true;
                return propMatches && valueMatches;

            });
        });

        if (this.isFirtsLoading) {
            this.isFirtsLoading = false;
            const mode: IMode = rc.length < this.minValueToOpen.full ? 'full' : (rc.length < this.minValueToOpen.expanded ? 'expanded' : 'collapsed');
            rc.forEach((help) => {
                const sameHelp = this.avaliablePlugins.find((item) => item.widget === help.widget);
                if (sameHelp) sameHelp.mode = mode;
                help.mode = mode
            });
        }

        if (rc.length <= this.minValueToOpen.full) {
            rc.forEach((help) => {
                help.mode = 'full';
            });
        }

        if (rc.length > this.minValueToOpen.full) {
            rc.forEach((help) => {
                help.mode = 'expanded';
            });
        }


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
        return html`<plugin-style-index-item-100554 position="${this.position}" mode=${help.mode} .help=${help}></plugin-style-index-item-100554>`
    }

}


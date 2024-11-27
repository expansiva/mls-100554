/// <mls shortName="cssHelperIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, when, repeat, TemplateResult } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { propertyDataSource } from './_100554_icaLitElement';
import { PluginStyleIndexItem } from './_100554_pluginStyleIndexItem';
import { IHelpers, IMode } from './_100554_cssHelperIndexBase';
import { ICSSState } from './_100554_lessCSS';
import { Window } from './_100554_icaState';
import './_100554_pluginStyleIndexItem';

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

    private minValueToOpen = {
        'full': 3,
        'expanded': 10,
    }

    @property() helpers: IHelpers[] = [];
    @property() avaliablePlugins: IHelpers[] = [];

    @property() position: 'right' | 'left' = 'left';
    @property({ reflect: true }) actualProp: string | undefined = '';
    @property({ reflect: true }) actualValue: string | undefined = '';
    @property({ reflect: true }) actualSelector: string | undefined = '';
    @property() actualLineNumber: number | undefined;

    @propertyDataSource() state: ICSSState | undefined;

    @queryAll('plugin-style-index-item-100554') allPluginsEls!: PluginStyleIndexItem[];

    handleIcaStateChange(_key: string, _value: ICSSState) {

        if (_key !== `less.${this.position}` || !_value) return;
        const { key, value, selector, lineNumber } = _value;

        this.actualProp = key;
        this.actualValue = value;
        this.actualSelector = selector;
        this.actualLineNumber = lineNumber;

        if (lineNumber && key) {
            this.actualProp = key;
            this.actualValue = value;
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
                mode: 'collapsed',
                liked: false,
                likedAnimation: false,
                showInfo: false
            };
            helpers.push(obj);
        }

        return helpers;

    }

    private filterByProp(helpers: IHelpers[], actualProp: string | undefined, actualValue: string | undefined): IHelpers[] {

        if (!(window as any as Window).globalState?.less
            || !(window as any as Window).globalState.less[this.position]
            || !(window as any as Window).globalState.less[this.position].selector
            || !(window as any as Window).globalState.less[this.position].lineNumber) return [];

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

        const mode: IMode = rc.length < this.minValueToOpen.full ? 'full' : (rc.length < this.minValueToOpen.expanded ? 'expanded' : 'collapsed');
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
        return html`<plugin-style-index-item-100554 position="${this.position}" .help=${help}></plugin-style-index-item-100554>`
    }

    openIfNeeded() {

        this.allPluginsEls.forEach((pluginEl) => {
            pluginEl.requestUpdate();
            const mode = pluginEl.getAttribute('mode');
            if (mode === "collapsed" && pluginEl.help && pluginEl.help?.mode !== "collapsed") {
                pluginEl.open(pluginEl.help.mode);
            }
        })
    }

}


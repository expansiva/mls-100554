/// <mls shortName="servicePreviewAddStyle" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const initServicePreviewAddStyle = '';

/// **collab_i18n_start**
const message_pt = {
    groupAndSubgroup: 'Grupo e subgrupo',
    tagsForSearch: 'Tags para busca',
    exInputList: 'ex: entrada, lista',
    addInDesingSystem: 'Adicionar no Sistema de Design',
    thisComponentAlreadyHasStyleAdded: 'Este componente já tem estilo adicionado',
    notAdded: 'Este componente não é adicionado no Design System, adicione abaixo'
}

const message_en = {
    groupAndSubgroup: 'Group and subgroup',
    tagsForSearch: 'Tags for search',
    exInputList: 'ex: input,list',
    addInDesingSystem: 'Add in Desing System',
    thisComponentAlreadyHasStyleAdded: 'This component already has style added',
    notAdded: 'This component is not added in Design System, please add below'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-add-style-100554')
export class ServicePreviewAddStyle extends LitElement {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private dsInstance: mls.l3.DesignSystemIO | undefined;

    @property() father: any = undefined;

    @property() widget: string = '';

    @property() level: string = '';

    @property({ type: Array }) tags: string[] = [];

    @property() error: string = '';

    @property() groupName: string = '';

    @property() styleAlready: boolean = false;

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {

        const lang = this.father.getMessageKey(messages);
        this.msg = lang ? messages[lang] : message_en;

        if (this.styleAlready) return this.renderStyleAlreadyr();
        else return this.renderAdd();

    }

    renderStyleAlreadyr() {
        return html`<h3>${this.msg.thisComponentAlreadyHasStyleAdded}</h3>`
    }

    renderAdd() {
        return html`
            <div>
                <h4 style="text-align:center">${this.msg.notAdded}</h4>
                <span>${this.msg.groupAndSubgroup}</span>
                <input type="text" class="inputGroup" .value="${this.groupName}"></input>
            </div>
            <div style="display:flex; flex-direction: column;">
                <span>${this.msg.tagsForSearch}</span>
                <mls-input-tags>
                    ${repeat(this.tags, ((item: string) => item) as any,
            ((vl: string, index: number) => this.renderItemTag(vl, index)) as any
        )}
                    <input type="text" @keydown="${this.addInputTag}"></input>
                </mls-input-tags>
                <span style="font-size:.8rem; color: #595959;">${this.msg.exInputList}</span>
            </div>
            <div style="display:flex; justify-content:center;">
                <button @click="${this.addComponent}">${this.msg.addInDesingSystem}</button>
            </div>
            <h3 style="color:red">${this.error}</h3>
        `;
    }

    renderItemTag(vl: string, idx: number) {
        return html`
            <div>
                ${vl}
                <span .idx="${idx}" @click="${this.deleteItemTag}">x</span>
            </div>
        `
    }

    //-----------IMPLEMENTS---------------

    private async init() {

        try {

            this.showLoader(true);
            await this.initds();
            await this.getGroup();
            this.verifyAlready();
            this.showLoader(false);

        } catch (e: any) {

            this.error = e.message;
        }


    }

    private verifyAlready(): void {

        if (!this.widget || !this.dsInstance) return;

        const componentName = this.widget;
        const comp = this.dsInstance.components.find(componentName);
        if (!comp) this.styleAlready = false;

    }

    private async getGroup() {

        mls.actual[0].setFullName(this.widget);
        const model = mls.l2.editor.get({ project: mls.actual[0].project as any, shortName: mls.actual[0].path as any });

        if (!model || !model.compilerResults) return;

        const { variables } = model.compilerResults.tripleSlashMLS;
        if (!variables) return;

        const { groupName } = variables;
        if (!groupName) return;

        this.groupName = groupName
    }

    private async initds() {

        this.dsInstance = mls.l3.getDSInstance(mls.actual[5].project as any, mls.actual[3].mode);


    }

    private addInputTag(e: KeyboardEvent): void {

        e.stopPropagation();

        const el = e.target as HTMLInputElement;
        if (!el) return;

        const { value } = el;

        if (e.keyCode === 13) {

            this.addTag(value);
            el.value = '';

        } else if (e.keyCode === 188) {

            e.preventDefault();
            this.addTag(value);
            el.value = '';

        } else if (e.keyCode === 8 && value.length === 0) {

            this.deleteTag(this.tags.length - 1);

        }
    }

    private addTag(vl: string): void {

        if (this.tags.includes(vl)) return;
        this.tags.push(vl);
        this.tags = [... this.tags];

    }

    private deleteTag(idx: number): void {

        if (idx > this.tags.length || idx < 0) return;
        this.tags.splice(idx, 1);
        this.tags = [... this.tags];

    }

    private deleteItemTag(e: MouseEvent): void {

        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;

        const idx = +(el as any).idx;
        this.deleteTag(idx);

    }

    private setTimeLoader = -1;
    private showLoader(show: boolean) {

        if (!this.father) return;
        clearTimeout(this.setTimeLoader);
        this.setTimeLoader = setTimeout(() => {
            this.father.loading = show;
        }, 200);


    }

    private async addComponent() {

        if (!this.widget || !this.shadowRoot || !this.dsInstance) return;
        const group = this.shadowRoot.querySelector('.inputGroup') as HTMLInputElement;
        if (!group || !group.value) throw new Error('Not found group');

        this.showLoader(true);
        const componentName = this.widget;
        const widget: mls.l3.IComponentInfo = {
            docPath: '',
            examples: [],
            group: group.value as mls.l3.ComponentsGroups,
            l4MarketingRef: '',
            name: componentName,
            reference: undefined as any,
            styles: [],
            tags: this.tags,
            widgetExampleRef: {
                path: '',
                tagname: ''
            }
        };

        try {

            await this.dsInstance.components.add(widget);
            this.styleAlready = true;

        } catch (err: any) {
            this.error = err.message;
        }
        finally {
            this.showLoader(false);
        }

    }

}

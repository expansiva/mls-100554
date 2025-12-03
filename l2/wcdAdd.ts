/// <mls shortName="wcdAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';
import { collab_xmark } from '/_100554_/l2/collabIcons.js';

@customElement('wcd-add-100554')
export class WcdAdd100554 extends WcdToolboxItemBase {

    public args: string | undefined;

    @property({ type: String }) buttons = 'image,unsplash,video,embed,code,part,add';
    @property() initialMode: 'close' | 'open' = 'close';

    @query('.buttons-actions') containerButtons: HTMLDivElement | undefined;
    @query('.buttons-actions-container') containerButtonsContainer: HTMLDivElement | undefined;

    @query('add-tooltip') addTooltip: HTMLElement | undefined;
    @query('.add-button-helper') helperContainer: HTMLElement | undefined;


    createRenderRoot() {
        return this;
    }

    async firstUpdated() {

        this.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const buttonsArray = this.buttons.split(',').map(button => button.trim());
        const components: (string | null)[] = await Promise.all(buttonsArray.map(button => this.loadComponent(button)));
        if (!this.containerButtons) return;
        this.containerButtons.innerHTML = `
            ${components.filter(Boolean).map(button => `<${button}></${button}>`).join('')}
        `;

        setTimeout(() => {
            const allBtns = this.containerButtons?.querySelectorAll('wcd-add-button');
            if (!allBtns) return;
            allBtns.forEach((btn) => { this.tooltipElement(btn as HTMLElement); });
        }, 500)

    }

    render() {

        if (this.args) {
            try {
                const args: IArgs = JSON.parse(this.args);
                if (!args) return;
                if (args.open) this.initialMode = 'open';
                if (args.buttons) this.buttons = args.buttons;
            } catch (e: any) {
                throw new Error('Invalid args' + e.message);
            }
        }

        this.style.zIndex = '99999';
        return html`
        <div class="add-button ${this.initialMode === 'close' ? 'close' : ''}">
            <wcd-add-button @click=${this.onButtonClick} >
                <span>
                    ${collab_xmark}
                </span>
            </wcd-add-button>
            <div class="buttons-actions-container">
                <div class="buttons-actions"></div>
                <add-tooltip></add-tooltip>
            </div>
        </div>

        <div class="add-button-helper">
            ${this.buttons.split(',').map((btn) => html`<div data-helper="${btn}"></div>`)}
        </div>
        <style>${this.styles}</style>
        `;
    }

    private async loadComponent(button: string) {
        switch (button) {
            case 'image':
                await import('/_100554_/l2/wcdAddItemImage.js');
                return 'wcd-add-item-image-100554';
            case 'unsplash':
                await import('/_100554_/l2/wcdAddItemUnsplash.js');
                return 'wcd-add-item-unsplash-100554';
            case 'video':
                await import('/_100554_/l2/wcdAddItemVideo.js');
                return 'wcd-add-item-video-100554';
            case 'video':
                await import('/_100554_/l2/wcdAddItemVideo.js');
                return 'wcd-add-item-video-100554';
            case 'code':
                await import('/_100554_/l2/wcdAddItemCode.js');
                return 'wcd-add-item-code-100554';
            case 'embed':
                await import('/_100554_/l2/wcdAddItemEmbed.js');
                return 'wcd-add-item-embed-100554';
            case 'part':
                await import('/_100554_/l2/wcdAddItemPart.js');
                return 'wcd-add-item-part-100554';
            case 'add':
                await import('/_100554_/l2/wcdAddWidget.js');
                return 'wcd-add-widget-100554';
            case 'del':
                await import('/_100554_/l2/wcdAddItemDel.js');
                return 'wcd-add-item-del-100554';
            default:
                console.error('invalid button name: "' + button + '"');
                return null;
        }
    }

    private tooltipElement(el: HTMLElement) {
        if (this.addTooltip && el) this.tooltip(el);
    }

    private tooltip(el: HTMLElement) {
        el.addEventListener('mouseover', this.show.bind(this), false);
        (el as any)['element'] = el;
        el.addEventListener('mouseleave', this.destroy.bind(this), false);
    }

    private destroy(evt: MouseEvent) {
        if (!this.addTooltip) return;
        this.addTooltip.innerHTML = '';
        this.addTooltip.style.top = '0px';
        this.addTooltip.style.left = '0px';
    }

    private widthMarginOfError = 10;

    private show(evt: MouseEvent) {
        if (!this.addTooltip || !this.containerButtons) return;
        this.addTooltip.innerHTML = '';
        const el = (evt.currentTarget as any)['element'] as HTMLElement;
        if (!el) return;
        const title = el.getAttribute('data-tooltip');
        const arrow = document.createElement('div');
        const content = document.createElement('span');
        content.innerHTML = title || '';
        const position = el.getBoundingClientRect();
        const positionContainer = this.containerButtons.getBoundingClientRect();
        const positionDocument = document.body.getBoundingClientRect();
        const { width } = positionDocument;
        this.addTooltip.appendChild(arrow);
        this.addTooltip.appendChild(content);
        const positionContent = content.getBoundingClientRect();
        if (positionContent.width + position.left > (width - this.widthMarginOfError)) {
            arrow.classList.add('open-to-right');
            this.addTooltip.style.left = ((position.left - positionContainer.left) + (position.width / 2) - (positionContent.width - 30)) + 'px';
            this.addTooltip.style.top = '35px';
        } else {
            this.addTooltip.style.top = '35px';
            this.addTooltip.style.left = ((position.left - positionContainer.left) + (position.width / 2) + 20) + 'px';
        }
    }

    onButtonClick(e: MouseEvent) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const btn = target.closest('.add-button');
        if (!btn) return;
        btn.classList.toggle('close');
        if (!this.containerButtons) return;
        const allBtns = this.containerButtons.querySelectorAll('wcd-add-button');
        allBtns.forEach((bt) => bt.classList.toggle('scale-in-center', !btn.classList.contains('close')))
    }

    private styles = `
        .add-button{
            position:relative;
        }
        wcd-add-button span {
            display:flex;
            color: var(--text-primary-color);
        }
        wcd-add-button svg{
            width:14px;
            height:14px;
            fill: var(--text-primary-color);
        }
        wcd-add-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: var(--bg-primary-color-lighter);
            border-radius: 100%;
            border: 1px solid rgba(0, 0, 0, .68);
        }
        .add-button:not(.close) .buttons-actions-container{
            opacity: 1;
            display:inline-block;
        }
        .buttons-actions-container{
            position:relative;
            display:none;
            padding-left: 22px;
        }
        .buttons-actions{
            position:relative;
        }
        wcd-add-button svg{
            transition:transform .1s,-webkit-transform .1s;
        }
        .add-button.close svg{
            transform:rotate(-45deg);
        }
        wcd-add-button span {
            vertical-align: middle;
        }
        add-tooltip {
            display:block;
            position: absolute;
            will-change: transform;
            white-space: nowrap;
            top: 0px;
            left: 0px;
            transform: translate3d(-13px, 5px, 0px);
            z-index: 9999;
            font-size:14px;
        }
        add-tooltip > div {
            top: -8px;
            position: absolute;
            display: block;
            width: 100%;
            height: 0.4rem;
        }
        add-tooltip > div::before {
            position: absolute;
            content: "";
            border-color: transparent;
            border-style: solid;
            bottom: -1px;
            left: 5px;
            border-width: 0 0.4rem 0.4rem;
            border-bottom-color: #000;
        }
        add-tooltip > div.open-to-right::before {
            left: 0;
            content: none;
        }
        add-tooltip > div.open-to-right::after {
            position: absolute;
            content: "";
            border-color: transparent;
            border-style: solid;
            right: 8px;
            bottom: -1px;
            border-width: 0 0.4rem 0.4rem;
            border-bottom-color: #000;
        }
        add-tooltip > span {
            max-width: 200px;
            padding: 0.25rem 0.5rem;
            color: #fff;
            text-align: center;
            background-color: #000;
            border-radius: 0.25rem;
        }
        add-toolti a[title]:hover::after {
            display: none;
        }
        .scale-in-center {
            -webkit-animation: scale-in-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                    animation: scale-in-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        @-webkit-keyframes scale-in-center {
            0% {
                -webkit-transform: scale(0);
                        transform: scale(0);
                opacity: 1;
            }
            100% {
                -webkit-transform: scale(1);
                        transform: scale(1);
                opacity: 1;
            }
            }
            @keyframes scale-in-center {
            0% {
                -webkit-transform: scale(0);
                        transform: scale(0);
                opacity: 1;
            }
            100% {
                -webkit-transform: scale(1);
                        transform: scale(1);
                opacity: 1;
            }
        }
    `;
}

interface IArgs {
    open: boolean,
    buttons: string,
}
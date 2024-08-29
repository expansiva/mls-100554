/// <mls shortName="wcdAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css, LitElement } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { getMessageKey } from "./_100554_collabLitElement";
import { WCDToolbox } from './_100554_wcdToolbox';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import * as commandDivider from './_100554_wcdCommandAddDivider';
import * as commandCode from './_100554_wcdCommandAddCodeBlock';

import { collab_xmark, collab_image, collab_unsplash, collab_video, collab_code, collab_ellipsis, collab_link } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    image: 'Adicionar uma imagem',
    video: 'Adicionar um video',
    embed: 'Adicionar um link incorporado',
    unsplash: 'Adicionar uma imagem do Unsplash',
    code: 'Adicionar um novo bloco de código',
    newPart: 'Adicionar uma nova parte',
}
const message_en = {
    image: 'Add an image',
    video: 'Add a video',
    embed: 'Add an embed',
    unsplash: 'Add an imagem from Unsplash',
    code: 'Add a new code block',
    newPart: 'Add a new part',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('wcd-add-100554')
export class WcdAdd100554 extends WcdToolboxItemBase {

    private msg: MessageType = messages['en'];
    public myParent: WCDToolbox | undefined | any;
    public elMain: HTMLElement | undefined | any;
    public elICA: IcaLitElementBase | undefined | any;
    public args: string | undefined;

    @query('.buttons-actions') containerButtons: HTMLDivElement | undefined;
    @query('add-tooltip') addTooltip: HTMLElement | undefined;
    @query('.add-button-helper') helperContainer: HTMLElement | undefined;

    @property() intialMode: 'close' | 'open' = 'close';

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        const allBtns = this.containerButtons?.querySelectorAll('button');
        if (!allBtns) return;
        allBtns.forEach((btn) => { this.tooltipElement(btn); });
        this.addEventListener('click', (e) => {
            e.stopPropagation();
        });

    }

    render() {

        if (this.args) {
            try {
                const j = JSON.parse(this.args);
                if (j && j.open) this.intialMode = 'open';
            } catch (e) {
                
            }
        }
        const lang = getMessageKey(messages);
        this.msg = messages[lang];
        this.style.zIndex = '99999';
        return html`
        <div class="add-button ${this.intialMode === 'close' ? 'close' : ''}">
            <button @click=${this.onButtonClick} >
                <span>
                    ${collab_xmark}
                </span>
            </button>
            <div class="buttons-actions">
                <button @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 'image')} @click=${this.handleImageClick} data-tooltip=${this.msg.image} ><span>${collab_image}</span></button>
                <button @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 'unsplash')} @click=${this.handleUnsplashClick} data-tooltip=${this.msg.unsplash}><span>${collab_unsplash}</span></button>
                <button @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 'video')} @click=${this.handleVideoClick} data-tooltip=${this.msg.video}><span>${collab_video}</span></button>
                <button  @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 'embed')} @click=${this.handleEmbedClick} data-tooltip=${this.msg.embed}><span>${collab_link}</span></button>
                <button @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 'code')} @click=${this.handleCodeClick} data-tooltip=${this.msg.code}><span>${collab_code}</span></button>
                <button @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 'part')} @click=${this.handleNewPartClick} data-tooltip=${this.msg.newPart}><span>${collab_ellipsis}</span></button>
                <add-tooltip></add-tooltip>
            </div>
        </div>

        <div class="add-button-helper">
            <div data-helper="image"></div>
            <div data-helper="unsplash"></div>
        </div>
        <style>${this.styles}</style>
        `;
    }

    private async handleUnsplashClick(e: MouseEvent) {
        e.stopPropagation();
        this.showHelper('unsplash');
    }

    private handleClick(action: 'image' | 'unsplash' | 'video' | 'embed' | 'code' | 'part') {
        const obj = {
            image: this.handleImageClick,
            unsplash: this.handleUnsplashClick,
            video: this.handleVideoClick,
            embed: this.handleEmbedClick,
            code: this.handleCodeClick,
            part: this.handleNewPartClick,
        };

        if (obj[action]) obj[action](new MouseEvent('click'));

    }

    private async handleKeyDown(e: KeyboardEvent, btnAction: 'image' | 'unsplash' | 'video' | 'embed' | 'code' | 'part') {
        e.stopPropagation();
        if (e.key === 'Enter') {
            this.handleClick(btnAction);
        }
    }

    private async handleImageClick(e: MouseEvent) {
        e.stopPropagation();
        this.showHelper('image');
    }

    private async handleNewPartClick(e: MouseEvent) {
        await commandDivider.execute({
            args: {},
            overlay: this.myParent.parentElement?.parentElement,
            selectedIca: this.elICA,
        });
    }

    private async handleCodeClick(e: MouseEvent) {
        await commandCode.execute({
            args: {},
            overlay: this.myParent.parentElement?.parentElement,
            selectedIca: this.elICA,
        });
    }

    private async handleEmbedClick(e: MouseEvent) {
        this.showHelper('embed');
    }

    private async handleVideoClick(e: MouseEvent) {
        this.showHelper('video');
    }

    private importsInfo: IImports = {
        unsplash: '_100554_wcdDialogImageUnsplash',
        image: '_100554_wcdDialogImage',
        video: '_100554_wcdDialogVideo',
        embed: '_100554_wcdDialogEmbedLink',
    }

    private showHelper(helper: string) {

        if (!this.myParent) return;
        this.myParent.onclick = undefined;
        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: this.importsInfo[helper],
                    args: '',
                    position: 'p-l1',
                    level: [2],
                    toolboxOptions: { background: '#fff', border: 'none' }
                },

            ],
            false,
            'size'
        );

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
            this.addTooltip.style.left = ((position.left - positionContainer.left) + (position.width / 2)) + 'px';
        }
    }

    onButtonClick(e: MouseEvent) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const btn = target.closest('.add-button');
        if (!btn) return;
        btn.classList.toggle('close');
        if (!this.containerButtons) return;
        const allBtns = this.containerButtons.querySelectorAll('button');
        allBtns.forEach((bt) => bt.classList.toggle('scale-in-center', !btn.classList.contains('close')))
    }

    private styles = `
        .add-button{
            position:relative;
        }
        button span {
            color: var(--text-primary-color);
        }
        button svg{
            fill: var(--text-primary-color);
        }
        button {
            width: 32px;
            height: 32px;
            line-height: 30px;
            padding: 0;
            font-size: 15px;
            background: var(--bg-primary-color-lighter);
            border-radius: 100%;
            border: 1px solid rgba(0,0,0,.68);
            text-decoration: none;
            cursor: pointer;
            vertical-align: bottom;
            white-space: nowrap;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            letter-spacing: 0;
            font-weight: 400;
            font-style: normal;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
        .add-button:not(.close) .buttons-actions{
            opacity: 1;
            display:inline-block;
        }
        .buttons-actions{
            position:relative;
            display:none;
            padding-left: 22px;
        }
        button svg{
            transition:transform .1s,-webkit-transform .1s;
        }
        .add-button.close svg{
            transform:rotate(-45deg);
        }
        button span {
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

interface IImports {
    [key: string]: string;
}
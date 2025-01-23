/// <mls shortName="pluginPageNavigation" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property, queryAll } from 'lit/decorators.js';
import { convertTagToFileName } from './_100554_utilsLit';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand } from './_100554_wcdTypes';
import { execute as executeDel } from './_100554_wcdCommandDel';
import { execute as executeAddTexto } from './_100554_wcdCommandEnter';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item ICA foi encontrado!'
}

const message_en = {
    noItens: 'No ICA items were found!',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export class PluginPageNavigation extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    constructor() {
        super();
        this.setEvents();

        this.setVoice()
    }

    private setEvents(): void {
        mls.events.addListener(3, 'WCDEventChange' as any, (ev) => this.onWCDEventChange(ev));
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));

    }

    private onlevelChange(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const j = JSON.parse(ev.desc);
        if (j.level !== 3 && this.recognition) {
            this.recognition.stop();
            return;
        }

        if (this.recognition) this.recognition.start();
    }

    private onWCDEventChange(ev: mls.events.IEvent) {

        if (this && this.forceUpdate) this.forceUpdate();

    }


    //--------COMMANDS-------------------

    private commands = {
        selecionar: {
            item: this.cmdSelectItem.bind(this)
        },

        setar: {
            color: this.cmdSetCor.bind(this),
            background: this.cmdSetBackground.bind(this),
            margem: {
                top: (vl: string) => { this.processStyle('margin-top', vl.replace(/ /g, '')) },
                button: (vl: string) => { this.processStyle('margin-bottom', vl.replace(/ /g, '')) },
                botton: (vl: string) => { this.processStyle('margin-bottom', vl.replace(/ /g, '')) },
                left: (vl: string) => { this.processStyle('margin-left', vl.replace(/ /g, '')) },
                white: (vl: string) => { this.processStyle('margin-right', vl.replace(/ /g, '')) },
                right: (vl: string) => { this.processStyle('margin-right', vl.replace(/ /g, '')) },
            },
            texto: this.setTexto.bind(this),
        },

        adicionar: {
            elemento: {
                texto: this.cmdAddTexto.bind(this)
            }
        },

        deletar: this.cmdDel.bind(this)
    }

    private setTexto(vl: string) {

        if (!(window as any).preview || !(window as any).preview.iframe || !(window as any).preview.iframe.contentWindow.wcdState || !(window as any).preview.iframe.contentWindow.wcdState.elICA) return;

        const ica = (window as any).preview.iframe.contentWindow.wcdState.elICA
        if (!ica || !ica.overlayRef) return;

        if (ica.tagName.toLocaleLowerCase() !== 'ica-apresentation-text-text-100554') return;
        console.info(ica);
        ica.setAttribute('text', vl);
        ica.requestUpdate();
    }

    private cmdDel() {

        if (!(window as any).preview || !(window as any).preview.iframe || !(window as any).preview.iframe.contentWindow.wcdState || !(window as any).preview.iframe.contentWindow.wcdState.elICA) return;

        const ica = (window as any).preview.iframe.contentWindow.wcdState.elICA
        if (!ica || !ica.overlayRef) return;

        const param: IWCDCommand = {
            args: new KeyboardEvent('keydown', {
                key: 'Del', 
                code: 'Del',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
                composed: true,
            }),
            overlay: ica.overlayRef.parentElement as any,
            selectedIca: ica
        }

        executeDel(param);

    }

    private cmdAddTexto() {

        if (!(window as any).preview || !(window as any).preview.iframe || !(window as any).preview.iframe.contentWindow.wcdState || !(window as any).preview.iframe.contentWindow.wcdState.elICA) return;

        const ica = (window as any).preview.iframe.contentWindow.wcdState.elICA
        if (!ica || !ica.overlayRef) return;

        const param: IWCDCommand = {
            args: new KeyboardEvent('keydown', {
                key: 'Enter', 
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
                composed: true,
            }),
            overlay: ica.overlayRef.parentElement as any,
            selectedIca: ica
        }

        executeAddTexto(param);
        this.requestUpdate();

    }

    private cmdSetCor(color: string) {

        try {

            this.processStyle('color', color);

        } catch (e: any) { }

    }

    private cmdSetBackground(color: string) {

        try {

            this.processStyle('background', color);

        } catch (e: any) { }

    }

    private processStyle(attr: string, value: string) {

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (!active) return;

        const el = active.querySelector('info-item') as any;
        if (!el) return;

        const info = el.info as IInfoElCholdren;
        if (!info) return;

        const css = info.el.getAttribute('styleel');
        const t = document.createElement('div');

        t.style.cssText = css || '';
        t.style[attr as any] = value;
        info.el.setAttribute('styleel', t.style.cssText);

    }

    private cmdSelectItem(item: string) {

        try {

            console.info('cmdSelectItem', item);
            const child = ((+item) - 1);

            const all = this.querySelectorAll('li');
            if (!all[child]) return;

            const el = all[child].querySelector('.header') as HTMLElement;
            if (el) el.click();

        } catch (e: any) {

        }

    }

    private recognition: any;
    private activationWord = "comando";

    private setVoice() {

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {

            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'pt-BR';
            this.recognition.interimResults = true;
            this.recognition.continuous = true;

            this.recognition.onresult = (event: any) => this.onSucessVoice(event);
            this.recognition.onerror = (event: any) => {
                console.error("Erro no reconhecimento de voz:", event.error);
            };

        } else {
            console.error("API de Reconhecimento de Voz não é suportada neste navegador.");
        }
    }

    private onSucessVoice(event: any) {

        for (let i = event.resultIndex; i < event.results.length; i++) {

            if (event.results[i].isFinal) {

                const transcript = event.results[i][0].transcript.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                console.info("Comando reconhecido:", transcript);

                if (transcript.startsWith(this.activationWord)) {
                    const command = transcript.replace(this.activationWord, "").trim();
                    this.processCommand(command);

                } else {
                    console.info(`Aguardando a palavra-chave "${this.activationWord}" para ativar.`);
                }

            }
        }

    }

    private processCommand(phrase: string) {

        const words = phrase.toLowerCase().split(" ");
        let current = this.commands as any;

        for (let i = 0; i < words.length; i++) {

            let word = words[i];
            if (current[word]) {
                current = current[word];
                if ((i + 1) === words.length && typeof current === "function") {
                    current();
                    return;
                }

            } else if (typeof current === "function") {

                current(words.slice(i, words.length).join(' '));
                return;
            }
        }

        //console.error("Comando não encontrado.");

    }

    private startRecognition(ev: MouseEvent) {

        let el = ev.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'mic-command') {
            el = el.closest('mic-command') as HTMLElement;
        }

        if (el.classList.contains('active')) {
            el.classList.remove('active');

            if (this.recognition) this.recognition.stop();

        } else {
            el.classList.add('active');


            this.recognition.start();
            console.log("Aguardando comando de voz...");
        }
    }


    //-------COMPONENT----------


    createRenderRoot() {
        return this;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const ar = this.getICAComponents();
        if (ar && ar.length > 0) return this.createNavigation(ar);
        return html`<h3 style="padding:1rem">${this.msg.noItens}<h3>`;
    }

    createNavigation(array: IInfoElCholdren[]) {

        const obj = html`
            <mic-command @click="${this.startRecognition}"></mic-command>
            <ul>
                ${repeat(array, ((key: IInfoElCholdren, idx: number) => key.el.tagName + idx) as any,
            ((item: IInfoElCholdren, index: any) => { return this.renderItemTree(item, index); }) as any
        )}
            </ul><style>${this.myCss}</style>
        `;

        return obj;

    }

    renderItemTree(item: IInfoElCholdren, idx: string) {

        const name = convertTagToFileName(item.el.tagName.toLocaleLowerCase());
        const cls = (item.el as any).renderType === 'editactive' ? 'activeBranch' : '';

        if (this.idLastClick === name + idx) { // Verifico se preciso forçar um click

            setTimeout(() => {

                const active = this.querySelector('.activeBranch') as HTMLElement;
                if (active) active.classList.remove('activeBranch');

                this.idLastClick = '';
                item.el.click();

            }, 200);

        }

        let mySymbol = 'fa-cubes'
        if ((item.el as any).mySymbol) mySymbol = (item.el as any).mySymbol;

        return html`
            <li>
                <div id="${name + idx}" .info=${item} @mouseover="${this.mouseOver}" @mouseleave="${this.mouseLeave}" class="header ${cls}" @click="${(e: MouseEvent) => this.selectItem(e, item)}">
                    <info-item .info=${item}><span class="fa ${mySymbol}" style="margin-right:.5rem"></span>${name}</info-item>
                    <div class="dragDropcontainer">
                        <span class="dbefore fa fa-arrow-up"></span>
                        <span class="din fa fa-arrow-turn-down"></span>
                        <span class="dAfter fa fa-arrow-down"></span>
                    </div>
                    <div class="groupHiddenList" .info=${item} @click="${this.clickGroupHidden}">
                        <span class="mls-gpbtnslider-item fa fa-up-down-left-right" title="move" @click="${this.activeMove}"></span>
                        
                        <span class="mls-gpbtnslider-item fa fa-trash" @click="${this.delEl}" title="remove"></span>
                    </div>
                </div>
                <ul>
                    ${repeat(item.children, ((c: IInfoElCholdren, idx: number) => c.el.tagName + idx) as any, ((i: any, idxI: any) => {

            return this.renderItemTree(i, idx + '_' + idxI);

        }) as any
        )}
                </ul>
            </li>
        `;

        //<span class="mls-gpbtnslider-item fa classLock" @click="${this.setLock}"></span>

    }

    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        this.requestUpdate();

    }

    private getICAComponents(): IInfoElCholdren[] {

        let ret: IInfoElCholdren[] = [];
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return ret;

        const reentrance = (array: IInfoElCholdren[], element: HTMLElement) => {

            let info: IInfoElCholdren | undefined;
            const tag = element.tagName.toLowerCase();
            if (tag.startsWith('ica') && !tag.startsWith('ica-page-overlay')) {
                info = { el: element as IcaLitElementBaseMethods, children: [] as any };
                array.push(info);
            }

            const isGroup = element.getAttribute('isFCAGroup');

            if (!isGroup || isGroup === 'false') {

                if (element.shadowRoot) {
                    const children = Array.from(element.shadowRoot.children);

                    for (let i = 0; i < children.length; i++) {
                        const child = children[i] as HTMLElement;
                        reentrance(info ? info.children : array, child as HTMLElement)
                    }

                } else {
                    const children = Array.from(element.children);
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i] as HTMLElement;
                        reentrance(info ? info.children : array, child as HTMLElement)
                    }
                }

            }

        }

        reentrance(ret, scope);

        return ret;

    }


    private idLastClick: string = '';
    private selectItem(e: MouseEvent, item: IInfoElCholdren): void {

        e.stopPropagation();
        let target = e.target as HTMLElement;
        if (target && target.className.indexOf('header') < 0) {
            target = target.closest('.header') as HTMLElement;
        }

        if (!target) return;

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (active && active === target) return;
        if (active) active.classList.remove('activeBranch');

        target.classList.add('activeBranch');

        item.el.style.border = '';
        const father = item.el.closest('*[rendertype="editactive"]');
        if (father) {

            this.idLastClick = target.id;
            item.el.overlayRef?.click();
            item.el.overlayRef?.scrollIntoView({ block: 'center' });

        } else {
            item.el.overlayRef?.click();
            item.el.overlayRef?.scrollIntoView({ block: 'center' });
        }

    }

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        el.classList.toggle('activegpbtnslider');

        if (!(el as any).info) return;

        let lock = 'fa-lock-open';
        const isGroup = (el as any).info.el.getAttribute('isFCAGroup');
        if (isGroup || isGroup === 'true') {
            lock = 'fa-lock';
        }

        const group = el.querySelector('.classLock') as HTMLElement;
        if (group) {
            group.classList.remove('fa-lock');
            group.classList.remove('fa-lock-open');
            group.title = lock === 'fa-lock' ? 'lock' : 'lock open';
            group.classList.add(lock);

        }

    }

    private setLock(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const info: IInfoElCholdren = (el.parentElement as any).info;
        if (!info) return;

        const isGroup = (el.className.indexOf('fa-lock-open') < 0);
        info.el.setAttribute('isFCAGroup', (!isGroup).toString());

        let lock = 'fa-lock-open';
        if (!isGroup) {
            lock = 'fa-lock';
        }

        el.classList.remove('fa-lock');
        el.classList.remove('fa-lock-open');
        el.title = lock === 'fa-lock' ? 'lock' : 'lock open';
        el.classList.add(lock);

        this.requestUpdate();

    }

    private delEl(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const info: IInfoElCholdren = (el.parentElement as any).info;
        if (!info) return;

        info.el.remove();

        this.requestUpdate();

    }

    private activeMove(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const info: IInfoElCholdren = (el.parentElement as any).info;
        if (!info) return;

        const wc = info.el.querySelector('wcd-toolbox-100554') as HTMLElement;
        if (!wc || !wc.shadowRoot) return;

        const move = wc.shadowRoot.querySelector('wcd-toolbox-item-action-move-100554') as HTMLElement;
        if (move) move.click();

        setTimeout(() => {

            this.setDragDrop(info.el);

        }, 500);


    }

    private setDragDrop(active: HTMLElement): void {

        const dragStart = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            if (!(el as any).info) return;
            el.style.opacity = '0.4';
        };

        const dragEnter = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            const elLast = this.querySelector('.overdragdrop') as HTMLElement;
            if (elLast) elLast.classList.remove('overdragdrop');
            el.classList.add('overdragdrop');
        };

        const dragLeave = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            //el.classList.remove('overdragdrop');
        };

        const dragOver = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            e.preventDefault();
            (e as any).dataTransfer.dropEffect = 'move';
            return false;
        };

        const dragDrop = (e: MouseEvent, el: HTMLElement, mode: HTMLElement) => {
            e.stopPropagation();
            if (!(el as any).info) return;
            mode.click();

            return false;
        };

        const dragEnd = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            try {
                //mls.events.fire(2,'DSStyleChanged','{"emitter":"left"}',500);

                Array.from(listItens).forEach((el: any) => {

                    el.removeAttribute('draggable');
                    el.classList.remove('overdragdrop');
                    el.style.opacity = '';
                    el.ondragstart = () => { };
                    el.ondragenter = () => { };
                    el.ondragover = () => { };
                    el.ondragleave = () => { };

                    const elbefore = el.querySelector('.dbefore') as HTMLElement;
                    const elafter = el.querySelector('.dAfter') as HTMLElement;
                    const elinn = el.querySelector('.din') as HTMLElement;

                    if (elbefore) {
                        elbefore.removeAttribute('draggable');
                        elbefore.ondrop = (e: MouseEvent) => { };
                    }
                    if (elafter) {
                        elafter.removeAttribute('draggable');
                        elafter.ondrop = (e: MouseEvent) => { };
                    }
                    if (elinn) {
                        elinn.removeAttribute('draggable');
                        elinn.ondrop = (e: MouseEvent) => { };
                    }

                    const cont = el.querySelector('.dragDropcontainer') as HTMLElement;

                    if (cont) {
                        cont.classList.remove('b');
                        cont.classList.remove('a');
                        cont.classList.remove('i');
                    }

                    if (el.info) {

                        const elBase = el.info.el;
                        if (!elBase) return;
                        if (elBase.getAttribute('renderType') === 'editactive') return;

                        elBase.style.position = '';
                        const content = elBase.querySelector(':scope > wcd-dragdrop-aux');
                        if (!content) return;
                        content.remove();

                    }

                });

            } catch (e) {
                this.requestUpdate();
            }



        };

        const addEventsDragAndDrop = (el: HTMLElement) => {

            if (!(el as any).info) return;

            const rtp = (el as any).info.el.getAttribute('rendertype');
            const wcd = (el as any).info.el.querySelector(':scope > wcd-dragdrop-aux');

            if (!wcd && rtp === 'edit') return;

            const before = wcd ? wcd.querySelector('wcd-dragdrop-aux-before') : undefined;
            const after = wcd ? wcd.querySelector('wcd-dragdrop-aux-after') : undefined;
            const inn = wcd ? wcd.querySelector('wcd-dragdrop-aux-in') : undefined;

            const elbefore = el.querySelector('.dbefore') as HTMLElement;
            const elafter = el.querySelector('.dAfter') as HTMLElement;
            const elinn = el.querySelector('.din') as HTMLElement;

            const cont = el.querySelector('.dragDropcontainer') as HTMLElement;
            if (cont && before) cont.classList.add('b');
            if (cont && after) cont.classList.add('a');
            if (cont && inn) cont.classList.add('i');

            if (active === (el as any).info.el) {
                el.ondragstart = (e: MouseEvent) => dragStart(e, el);
            }

            if (active !== (el as any).info.el) {
                el.ondragenter = (e: MouseEvent) => dragEnter(e, el);
                el.ondragover = (e: MouseEvent) => dragOver(e, el);
                el.ondragleave = (e: MouseEvent) => dragLeave(e, el);
                if (before && elbefore) {
                    elbefore.setAttribute('draggable', 'true');
                    elbefore.ondrop = (e: MouseEvent) => dragDrop(e, el, before);
                }
                if (after && elafter) {
                    elafter.setAttribute('draggable', 'true');
                    elafter.ondrop = (e: MouseEvent) => dragDrop(e, el, after);
                }
                if (inn && elinn) {
                    elinn.setAttribute('draggable', 'true');
                    elinn.ondrop = (e: MouseEvent) => dragDrop(e, el, inn);
                }
            }

            el.ondragend = (e: MouseEvent) => dragEnd(e, el);

        }

        const listItens = this.querySelectorAll('.header');

        Array.from(listItens).forEach((el) => {
            el.setAttribute('draggable', 'true');
            addEventsDragAndDrop(el as HTMLElement);
        });

    }

    private mouseOver(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        let el = e.target as any;
        if (el && el.className.indexOf('header') < 0) {
            el = el.closest('.header') as HTMLElement;
        }

        let inOver = el.getAttribute('inOver');
        if (!inOver) inOver = 'false';

        if (!el || !el.info || inOver === 'true' || el.className.indexOf('activeBranch') >= 0) return;
        //el.info.el.style.border = '1px solid blue';
        el.info.el.style.boxShadow = '0px 0px 2px #0909dd';


    }

    private mouseLeave(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        let el = e.target as any;
        if (el && el.className.indexOf('header') < 0) {
            el = el.closest('.header') as HTMLElement;
        }

        el.removeAttribute('inOver');
        //el.info.el.style.border = '';
        el.info.el.style.boxShadow = '';


    }

    private myCss = `

        plugin-page-navigation-100554 mic-command{
            background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d='M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z'/></svg>");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            width: 20px;
            height: 20px;
            display: block;
            cursor: pointer;
        }

        plugin-page-navigation-100554 mic-command.active{
            background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d='M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z'/></svg>")!important;
            
        }


        plugin-page-navigation-100554{
            padding: 1rem;
            display:block;
        }
        plugin-page-navigation-100554 ul {
            list-style: none;
            padding: 0px 0rem 0rem .5rem;
            border-left: 1px solid #d4d4d4;
        }

        plugin-page-navigation-100554 ul li {
            position: relative;
            user-select:none;

        }

        plugin-page-navigation-100554 ul li .header {
            border: 1px solid transparent;
            padding: .4rem;
            cursor: pointer;
        }

        plugin-page-navigation-100554 ul li .header:hover {
            border: 1px solid #d4d4d4;

        }

        plugin-page-navigation-100554 ul li .header .dragDropcontainer {
            display:none;
            gap:0.5rem;
        }

        plugin-page-navigation-100554 ul li .header.overdragdrop {
            display: flex!important;
            justify-content: space-between;
        }

        plugin-page-navigation-100554 ul li .header.overdragdrop .dragDropcontainer {
            display:flex;
            gap:0.5rem;
        }

        plugin-page-navigation-100554 ul li .header .dragDropcontainer span {
            display: none;
            justify-content: center;
            align-items: center;
            width:20px;
            heigth:20px;
        }

        plugin-page-navigation-100554 ul li .header .dragDropcontainer.b .dbefore {
            display: flex!important;
        }

        plugin-page-navigation-100554 ul li .header .dragDropcontainer.i .din {
            display: flex!important;
        }

        plugin-page-navigation-100554 ul li .header .dragDropcontainer.a .dAfter {
            display: flex!important;
        }

        plugin-page-navigation-100554 ul li div.activeBranch{
            border: 1px solid #d4d4d4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            background: #f8f8f8;
        }

        plugin-page-navigation-100554 ul li:before {
            content: ' ';
            position: absolute;
            width: 7px;
            height: 1px;
            background: #d4d4d4;
            top: 1.2rem;
            left: -8px;
        }

        plugin-page-navigation-100554 .groupHiddenList {
            border-radius: 4px;
            padding: .3rem;
            transition: all 0.5s;
            cursor: pointer;
            display: none; //flex!important;
            z-index: 9;
            height: .7rem;
            
        }

        plugin-page-navigation-100554 ul li div.activeBranch .groupHiddenList{
            display: flex;
            align-items: center;
            position: relative;
        }

        plugin-page-navigation-100554 .groupHiddenList::after {
            content: ' ';
            width: 23px;
            height: 19px;
            position: absolute;
            right: -15px;
            background-image:  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z' fill='rgb(66,65,65,1)'/></svg>");
            background-repeat:no-repeat;
            background-position-y: center;
        }

        plugin-page-navigation-100554 .groupHiddenList .mls-gpbtnslider-item {
            display: none;
            transition: 0.5s;
            margin-left: 1rem;
            z-index: 10;
            font-size: 16px;
            line-height: normal;
        }

        plugin-page-navigation-100554 .groupHiddenList .mls-gpbtnslider-item:hover {
            color: #1a83ff;
        }
        

        plugin-page-navigation-100554 .groupHiddenList.activegpbtnslider {
            padding-right: 24px;
            padding-left: 8px;
        }

        plugin-page-navigation-100554 .groupHiddenList.activegpbtnslider .mls-gpbtnslider-item {
            display: inherit;
            text-align: center;
            float: left;
        }
        
    `;

}

interface IInfoElCholdren {
    el: IcaLitElementBaseMethods,
    children: IInfoElCholdren[]
}

if (!customElements.get('plugin-page-navigation-100554')) {
    customElements.define('plugin-page-navigation-100554', PluginPageNavigation);
}
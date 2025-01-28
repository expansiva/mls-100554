/// <mls shortName="wcdOverlayModeStory" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { ActionTag, IICADepths, IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand, WCDOverlayItensMethods } from './_100554_wcdTypes';
import { getPosition } from './_100554_icaGlobal';
import { execute as excCommandEnter } from './_100554_wcdCommandEnter';
import { execute as excCommandDel } from './_100554_wcdCommandDel';
import { execute as excCommandCopy } from './_100554_wcdCommandCopy';
import { execute as excCommandNext } from './_100554_wcdCommandSelectNext';
import { execute as excCommandUndo } from './_100554_wcdCommandUndo';

import { initWcdOverlayModeStoryItem } from './_100554_wcdOverlayModeStoryItem';
import { CollabPageElement } from './_100554_collabPageElement';

@customElement('wcd-overlay-mode-story-100554')
export class WcdOverlayModeStory extends WcdOverlayLitBase {

    constructor() {
        super();
        initWcdOverlayModeStoryItem();
    }

    private resizeObserver: ResizeObserver | undefined;

    public listWidgetsBase = [
        
        {name: '_100554_wcImage'},
        {name: '_100554_wcText' },
        {name: '_100554_wcCode' },
        {name: '_100554_wcVideo'},
        
        {name: '_100554_wcSection'},
        {name: '_100554_wcDivider'}
    ]

    private keys: { [key: string]: string } = {
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right' 
    }

    public myKeyEvents = {
        'Enter': excCommandEnter,
        'Backspace': excCommandDel,
        'Delete': excCommandDel,
        'c': excCommandCopy,
        'v': excCommandCopy,
        'z': excCommandUndo,
        'ArrowDown': this.onkeydownArrow.bind(this),
        'ArrowLeft': this.onkeydownArrow.bind(this),
        'ArrowUp': this.onkeydownArrow.bind(this),
        'ArrowRight': this.onkeydownArrow.bind(this)
    };

    private onkeydownArrow(e: IWCDCommand) {

        const param: IWCDCommand = {
            args: {},
            overlay: e.overlay,
            selectedIca: e.selectedIca
        }

        const event = e.args as KeyboardEvent;

        event.preventDefault();

        if (!this.keys[event.key]) return;
        const info: { position: string, positionMode: string } =
            { position: '', positionMode: '' };

        info.position = this.keys[event.key];
        info.positionMode = event.altKey ? 'tree' : 'visual';
        param.args = info;

        excCommandNext(param);
    }

    public refreshOverlay(){
        const page = this.parentElement as CollabPageElement; 
        if(page){
            page.overlay?.remove();
            page.overlay = undefined;
            page.refreshOverlay();
        }
    }

    public selectItem(ica: IcaLitElementBaseMethods): void {
        if (!ica || !ica.overlayRef) return;
        ica.overlayRef.click();
        ica.overlayRef.scrollIntoView({ block: 'center' });
    }

    public getActionsTagsDefault(): { [key: string]: ActionTag } {
        
        return {
            'backButton': {
                name: 'button',
                position: 'p-r0',
                args: '',
                level: [1, 2, 3, 4, 5, 6]
            },
            'menu': {
                name: '_100554_wcdToolboxItemActionMenu',
                position: 'p-m0',
                args: '{}',
                level: [2, 4]
            },
            'add': {
                name: "_100554_wcdAdd",
                level: [2, 4],
                position: 'p-l2',
                args: '{ "buttons" : "image,unsplash,video,embed,code,part,add" }',
                toolboxOptions: { background: 'none', border: 'none' }
            },
            'edit': {
                name: "_100554_wcdToolboxItemActionEditText",
                level: [2, 4],
                position: 'p-l0',
                args: ''
            },
            'title': {
                name: "_100554_wcdToolboxItemActionTitle",
                level: [1, 2, 3, 4, 5, 6],
                position: 'p-title',
                args: ''
            },
            'edit-code': {
                name: "_100554_wcdToolboxItemActionEditCode",
                level: [2, 4],
                position: 'p-l0',
                args: ''
            },
            'code-language': {
                name: "_100554_wcdToolboxItemActionCodeLanguage",
                level: [2, 4],
                position: 'p-l0',
                args: ''
            },
        }
    }

    //---------COMPONENT----------------

    firstUpdated() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.updateSizeOverlayItems();

            }
        });
        this.resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('globalVariation') && changedProperties.get('globalVariation') !== undefined) {
            setTimeout(() => this.updateSizeOverlayItems(), 500);
        }
    }

    render() {
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.width = '100%';
        this.style.height = 'calc(100% + 55px)';//'calc(100vh - 50px)';//'100%';
        this.style.zIndex = '9000';
        this.style.top = '0';
        return html``;
    }

    //---------IMPLEMENTS---------------
    changeOverlayItemsLevel(): void {

        if (!this) return;
        Array.from(this.children).forEach((item) => {
            item.setAttribute('level', this.level);
        })

    }

    createOverlayItems(): void {

        const boundingPage = this.getBoundingClientRect();

        this.innerHTML = '';

        this.myItens.forEach((item) => {
            item.element.setAttribute('level', this.level);
            this.createOverlayItem(item, this as HTMLElement, boundingPage);
        });

    }

    private createOverlayItem(icaInfo: IICADepths, content: HTMLElement, boundingPage: DOMRect): void {

        const icaOverlayItem = document.createElement('wcd-overlay-mode-story-item-100554') as WCDOverlayItensMethods;
        icaOverlayItem.setAttribute('widget', icaInfo.element.tagName.toLowerCase());
        icaOverlayItem.setAttribute('level', this.level);
        icaOverlayItem.info = icaInfo as any;
        icaOverlayItem.boundingPage = boundingPage;
        content.appendChild(icaOverlayItem)
    }

    private updateSizeOverlayItems() {

        const items = Array.from(this.children) as WCDOverlayItensMethods[];
        const boundingPage = this.getBoundingClientRect();
        items.forEach((item) => {
            if (!item.info) return;
            const { x, y, height, width } = item.info.element.getBoundingClientRect();
            item.info.x = x;
            item.info.y = y;
            item.info.height = height;
            item.info.width = width;
            const pos = getPosition(item.info, boundingPage);
            item.style.width = pos.width;
            item.style.height = pos.height;
            item.style.top = pos.top;
            item.style.left = pos.left;
        });
    }

}
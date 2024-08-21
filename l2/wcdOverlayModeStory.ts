/// <mls shortName="wcdOverlayModeStory" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WcdOverlayLitBase, IICADepths, getPosition } from './_100554_wcdOverlayLitBase';
import { WcdOverlayModeStoryItem, initWcdOverlayModeStoryItem } from './_100554_wcdOverlayModeStoryItem';
import { ActionTag } from './_100554_icaGlobal';

import { excCommandEnter } from './_100554_wcdCommandEnter';
import { excCommandDel } from './_100554_wcdCommandDel';
import { excCommandCopy } from './_100554_wcdCommandCopy';

@customElement('wcd-overlay-mode-story-100554')
export class WcdOverlayModeStory extends WcdOverlayLitBase {

    constructor() {
        super();
        initWcdOverlayModeStoryItem();
    }

    private resizeObserver: ResizeObserver | undefined;

    public myKeyEvents = {
        'Enter': excCommandEnter,
        'Backspace': excCommandDel,
        'Delete': excCommandDel,
        'c': excCommandCopy,
        'v': excCommandCopy
    };

    public getActionsTagsDefault(): { [key: string]: ActionTag } {
        return {
            'events': {
                name: '_100554_wcdToolboxItemActionEvents',
                position: 'p-r1',
                args: '',
                level: [2]
            },
            'backButton': {
                name: 'button',
                position: 'p-r0' as any,
                args: '',
                level: [1, 2, 3, 4, 5, 6]
            },
            'margin': {
                name: '_100554_wcdToolboxItemActionMargin',
                position: 'p-m4',
                args: '',
                level: [4]
            },
            'padding': {
                name: '_100554_wcdToolboxItemActionPadding',
                position: 'p-l4',
                args: '',
                level: [4]
            },
            'size': {
                name: '_100554_wcdToolboxItemActionSize',
                position: 'p-r4',
                args: '',
                level: [4]
            },
            'menu': {
                name: '_100554_wcdToolboxItemActionMenu',
                position: 'p-m1',
                args: '',
                level: [4]
            },
            'add': {
                name: "_100554_wcdAdd",
                level: [2, 4],
                position: 'p-l2',
                args: '',
                toolboxOptions: { background: 'none', border: 'none' }
            },
            'edit': {
                name: "_100554_wcdToolboxItemActionEditText",
                level: [2, 4],
                position: 'p-r4',
                args: ''
            },
            'title': {
                name: "_100554_wcdTitle",
                level: [1, 2, 3, 4, 5, 6],
                position: 'p-l1',
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

        const icaOverlayItem = document.createElement('wcd-overlay-mode-story-item-100554') as WcdOverlayModeStoryItem;
        icaOverlayItem.setAttribute('widget', icaInfo.element.tagName.toLowerCase());
        icaOverlayItem.setAttribute('level', this.level);
        icaOverlayItem.info = icaInfo as any;
        icaOverlayItem.boundingPage = boundingPage;
        content.appendChild(icaOverlayItem)
    }

    private updateSizeOverlayItems() {

        const items = Array.from(this.children) as WcdOverlayModeStoryItem[];
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
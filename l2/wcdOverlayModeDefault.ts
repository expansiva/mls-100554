/// <mls shortName="wcdOverlayModeDefault" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdOverlayLitBase } from '/_100554_/l2/wcdOverlayLitBase.js';
import { ActionTag,  IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { execute as excCommandEnter } from '/_100554_/l2/wcdCommandEnter.js';
import { execute as excCommandDel } from '/_100554_/l2/wcdCommandDel.js';
import { execute as excCommandCopy } from '/_100554_/l2/wcdCommandCopy.js';
import { execute as excCommandNext } from '/_100554_/l2/wcdCommandSelectNext.js';
import { execute as excCommandUndo } from '/_100554_/l2/wcdCommandUndo.js';
import '/_100554_/l2/wcdOverlayModeDefaultItem.js';
import { CollabPageElement } from '/_100554_/l2/collabPageElement.js'; 

@customElement('wcd-overlay-mode-default-100554')
export class WcdOverlayModeDefault extends WcdOverlayLitBase {

    public overlayItemTagName = 'wcd-overlay-mode-default-item-100554';

    public listWidgetsBase = [
        
        {name: '_100554_widgetImage'},
        {name: '_100554_widgetText' },
        {name: '_100554_widgetTextCode' },
        {name: '_100554_widgetVideo'},
        
        {name: '_100554_widgetSection'},
        {name: '_100554_widgetDividerLine'}
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

        const menu = {
            itens: [
                {
                    item: '_100554_wcdToolboxItemActionEditAttr',
                    args: '',
                    level: [3],
                },
                {
                    item: '_100554_wcdToolboxItemActionDelete',
                    args: '',
                    level: [3],
                },
                {
                    item: '_100554_wcdToolboxItemActionAdd',
                    args: '',
                    level: [3],
                },
                {
                    item: '_100554_wcdToolboxItemActionAdd',
                    args: 'child',
                    level: [2, 3],
                },
                {
                    item: '_100554_wcdToolboxItemActionMove',
                    args: '',
                    level: [2, 3],
                }
            ]
        }
        
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
                args: JSON.stringify(menu),
                level: [2, 3]
            },
            'add': {
                name: "_100554_wcdAdd",
                level: [2, 3],
                position: 'p-l2',
                args: '{ "buttons" : "image,unsplash,video,embed,code,part,add,del" }',
                toolboxOptions: { background: 'none', border: 'none' }
            },
            'edit': {
                name: "_100554_wcdToolboxItemActionEditText",
                level: [2, 3],
                position: 'p-l0',
                args: ''
            },
            'title': {
                name: "_100554_wcdToolboxItemActionTitle",
                level: [1, 2, 3, 4, 5, 6],
                position: 'p-title-top',
                args: ''
            },
            'edit-code': {
                name: "_100554_wcdToolboxItemActionEditCode",
                level: [2, 3],
                position: 'p-l0',
                args: ''
            },
            'code-language': {
                name: "_100554_wcdToolboxItemActionCodeLanguage",
                level: [2, 3],
                position: 'p-l0',
                args: ''
            },

            'margin': {
                name: "_100554_wcdToolboxItemActionMargin",
                level: [3],
                position: 'p-l4',
                args: ''
            },
            'padding': {
                name: "_100554_wcdToolboxItemActionPadding",
                level: [3],
                position: 'p-m4',
                args: ''
            },
            'size': {
                name: "_100554_wcdToolboxItemActionSize",
                level: [3],
                position: 'p-r4',
                args: ''
            },
            'attr': {
                name: "_100554_wcdToolboxItemActionEditAttr",
                level: [2,3],
                position: 'p-r0',
                args: ''
            },
        }
    }

    //---------COMPONENT----------------

    render() {
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.width = '100%';
        this.style.height = 'calc(100% + 55px)';//'calc(100vh - 50px)';//'100%';
        this.style.zIndex = '9000';
        this.style.top = '0';
        return html``;
    }

}
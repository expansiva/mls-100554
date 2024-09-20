/// <mls shortName="collabTiles" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import './_100554_collabTilesItem';
import 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js';//https://github.com/SortableJS/Sortable/blob/master/Sortable.js
@customElement('collab-tiles-100554')
export class CollabTiles extends LitElement {

    @property({ type: String, reflect: true }) config = 'close';

    @property({ type: [], reflect: true }) tilesItens: ITilesItem[] = []

    @property({ type: String, reflect: true }) text = '';

    @query('collab-tiles') collabTiles: HTMLElement | undefined;


    //---------COMPONENT-------------


    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            ${this.renderConfigItens()}
            <collab-tiles>
                ${repeat(
            this.tilesItens,
            ((key: ITilesItem, idx: number) => 'tile_' + idx) as any,
            ((item: ITilesItem, index: any) => {
                return this.renderItem(item, index);
            }) as any
        )}
            </collab-tiles>
            <style>${this.myCss}</style>
        `;
    }


    renderItem(item: ITilesItem, idx: number) {
        return html`
        <collab-tiles-item-100554 position="${item.position}" index="${idx}" plugin="${item.plugin}"></collab-tiles-item-100554>
        `
    }

    renderConfigItens() {
        if (this.config === 'close') return this.renderConfigItensOpen()
        return this.renderConfigItensClose()
    }

    renderConfigItensOpen() {
        return html`
            <div style="display:flex; justify-content: end;">
                <button class="collabtilesconfigiten" style="margin-right:10px" title="config" @click="${this.open}">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                    
                </button>
            <div>
        `
    }

    renderConfigItensClose() {
        return html`
            <div style="display:flex; justify-content: end;">
                <button class="collabtilesconfigiten" style="margin-right:10px" title="config" @click="${this.close}">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
                </button>
            </div>
            
        `

        /*
        
        <ul>
                ${repeat(
            this.tilesItens,
            ((key: ITilesItem, idx: number) => 'tile_' + idx) as any,
            ((item: ITilesItem, index: any) => {
                return this.renderItemConfig(item, index);
            }) as any
        )}
            </ul>
        */
    }

    renderItemConfig(item: ITilesItem, index: number) {
        return html`
        <li>
            <div>${item.title}: <div>
            <input .value="${item.position}" .index=${index} @blur="${this.fireChange}"/>
        </li>
        `
    }

    //---------IMPLEMENT-------------

    private sort: any;
    private setDragAndDrop(active: boolean) {

        const all = this.querySelectorAll('collab-tiles-item-100554');

        if (!active) {
            
            Array.from(all).forEach((e) => {
                e.removeAttribute('edit');
            })

            if(this.sort) this.sort.destroy();

            return;
        }

        if ((window['Sortable' as any] as any)) {

            this.sort = (window['Sortable' as any] as any).create(this.collabTiles, {
                group: "sorting",
                sort: active,
                onUpdate: function (evt: any) {
                    console.info(evt)
                },
            });
        }


        Array.from(all).forEach((e) => {
            e.setAttribute('edit', 'true');
        })
    }

    private open() {
        this.config = 'open';
        this.setDragAndDrop(true);
    }

    private close() {
        this.config = 'close';
        this.setDragAndDrop(false)

    }

    private fireChange(e: MouseEvent): void {

        const el = e.target as HTMLInputElement;
        const index = (el as any).index;

        if (this.tilesItens[index]) this.tilesItens[index].position = el.value;

        this.tilesItens = Object.assign([], this.tilesItens);
    }

    private myCss = `
        collab-tiles-100554{
            background-color: #bfc0edab;
            display:block;
            overflow-y: auto;
            height: calc(100vh - 106px);
            padding:10px;
        }

        collab-tiles-100554 .collabtilesconfigiten{
            background: none;
            border: none;
            box-shadow: none;
        }

        collab-tiles-100554 .collabtilesconfigiten:hover{
            background: none;
            border: none;
            box-shadow: none;
            fill:#7d00ff;
        }

        collab-tiles-100554 collab-tiles{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            grid-auto-rows: 100px;
            gap: 10px;
        }

        collab-tiles-100554 collab-tiles-item-100554{
            background-color: #fff;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            text-align: center;
        }

        
        collab-tiles-100554.break-800 collab-tiles{
            display:flex;
            flex-direction:column;
        }
        collab-tiles-100554.break-800 collab-tiles-item-100554 {
            grid-area: none !important;
            height: 300px;
        }
        
    `

}

interface ITilesItem {
    title: string;
    plugin: string;
    position: string;
}
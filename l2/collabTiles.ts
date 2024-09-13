/// <mls shortName="collabTiles" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import './_100554_collabTilesItem';

@customElement('collab-tiles-100554')
export class CollabTiles extends LitElement {

    @property({ type: String, reflect: true }) config = 'close';

    @property({ type: [], reflect: true }) tilesItens = [    
        {
            title: 'Disciplina',
            plugin: '_100554_pluginSiteMonitorDashboardErrors',
            position: '1 / 1 / 4 / 3'
        },
        
        {
            title: 'Acidentes',
            plugin: '_100554_pluginSiteMonitorDashboardSpikes',
            position: '1 / 3 / 4 / 7'
        },
        {
            title: 'Atividades',
            plugin: '_100554_pluginSiteMonitorDashboardExpenses',
            position: '4 / 4 / 7 / 7'
        },
        {
            title: 'Numero',
            plugin: '_100554_pluginSiteMonitorDashboardSales',
            position: '4 / 1 / 7 / 4'
        }
    ];
    

    @property({ type: String, reflect: true }) text = '';


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
    

    renderItem(item: ITilesItem, idx:number) {
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
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
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
            <ul>
                ${repeat(
                    this.tilesItens,
                    ((key: ITilesItem, idx: number) => 'tile_' + idx) as any,
                    ((item: ITilesItem, index: any) => {
                        return this.renderItemConfig(item, index);
                    }) as any
                )}
            </ul>
        `
    }

    renderItemConfig(item: ITilesItem, index:number) {
        return html`
        <li>
            <div>${item.title}: <div>
            <input .value="${item.position}" .index=${index} @blur="${this.fireChange}"/>
        </li>
        `
    }

    //---------IMPLEMENT-------------

    private open() {
        this.config = 'open';
    }

    private close() {
        this.config = 'close';
        
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
            grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
            grid-auto-rows: 100px;
            gap: 15px;
            padding:10px;
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
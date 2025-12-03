/// <mls shortName="collabTiles" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

import { customElement, property, query } from 'lit/decorators.js';
import { getConfigProject, updateConfigProjectPlugins } from '/_100554_/l2/libProjectConfig.js';
import '/_100554_/l2/collabTilesItem.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js';//https://github.com/SortableJS/Sortable/blob/master/Sortable.js
@customElement('collab-tiles-100554')
export class CollabTiles extends CollabLitElement {

    @property({ type: String, reflect: true }) config = 'close';

    @property({ type: [], reflect: true }) tilesItens: ITilesItem[] = []

    @property({ type: String, reflect: true }) text = '';

    @property({ type: String, reflect: true }) example = '';

    @query('collab-tiles') collabTiles: HTMLElement | undefined;

    private oldJson = '';


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
            ((key: ITilesItem, idx: number) => key.plugin) as any,
            ((item: ITilesItem, index: any) => {
                return this.renderItem(item, index);
            }) as any
        )}
            </collab-tiles>
        `;
    }


    renderItem(item: ITilesItem, idx: number) {

        return html`
        <collab-tiles-item-100554 position="${item.position}" index="${idx}" plugin="${item.plugin}" .myinfo=${item}></collab-tiles-item-100554>
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
                <button class="collabtilesconfigiten" style="margin-right:10px" title="save" @click="${this.close}">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
                    Save
                </button>
                <button class="collabtilesconfigiten" style="margin-right:10px" title="cancel" @click="${this.onlyclose}">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
                    Cancel
                </button>
                
            </div>
            
        `
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

            if (this.sort) this.sort.destroy();

            return;
        }

        if ((window['Sortable' as any] as any)) {

            this.sort = (window['Sortable' as any] as any).create(this.collabTiles, {
                group: "sorting",
                sort: active,
                onUpdate: function (evt: any) {},
            });
        }


        Array.from(all).forEach((e) => {
            e.setAttribute('edit', 'true');
        })
    }

    private open() {
        this.oldJson = JSON.stringify(this.tilesItens);
        this.config = 'open';
        this.setDragAndDrop(true);

        if(mls.actualLevel !== 2) mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(
                {
                    shortName: '',
                    project: '',
                    htmlText: '<div></div>'
                }
            ),
            0
        );
    }

    private async close() {
        await this.verifyNeedSaveAndSave();
        this.config = 'close';
        this.setDragAndDrop(false);

    }

    private onlyclose() {
        this.tilesItens = JSON.parse(this.oldJson);
        this.config = 'close';
        this.setDragAndDrop(false);

    }

    private async verifyNeedSaveAndSave() {

        const all = this.querySelectorAll('collab-tiles-item-100554');
    
        const actualTiles: ITilesItem[] = [];

        Array.from(all).forEach((e: any, index: number) => {

            const tl: ITilesItem | undefined = e && e.myinfo ? e.myinfo : undefined;
            if (!tl) return;

            const idx = e.getAttribute('index') ? +e.getAttribute('index') : 0;

            if (idx !== index) {
                tl.index = (index + 1).toString();
            }

            actualTiles.push(tl);
        })

        const actualJson = JSON.stringify(actualTiles);

        const need = actualJson !== this.oldJson;

        if (need) {
            await this.changeConfig(actualTiles);

            actualTiles.sort((a, b) => {
                return Number(a.index) - Number(b.index);
            });

            this.tilesItens = actualTiles;
        }

        return;
    }

    private async changeConfig(tiles: ITilesItem[]) {

        const prj = mls.actualProject;
        if (!prj) return;


        const config = await getConfigProject(prj);

        if (!config) return;

        tiles.forEach((t) => {
            this.setInfoPlugin(config, t);
        });

        await updateConfigProjectPlugins(prj, config.plugins)

    }

    private setInfoPlugin(config: mls.l5_common.ProjectConfig | undefined, tile: ITilesItem) {

        if (!config) return;

        const dash = "l6Dashboard" as mls.plugin.Scope;
        const ex = "Examples " + this.example;
        const pos: string = 'tile ' + tile.position + ' ' + tile.index;

        const plugin = config.plugins;

        if (!plugin[tile.widgetConfig]) {

            plugin[tile.widgetConfig] = {
                [tile.plugin]: {
                    "l6Dashboard": {
                        [ex]: pos
                    },
                    "enabled": tile.enabled
                }
            }
        } else if (plugin[tile.widgetConfig] && !plugin[tile.widgetConfig][tile.plugin]) {
            plugin[tile.widgetConfig][tile.plugin] = {
                "l6Dashboard": {
                    [ex]: pos
                },
                "enabled": tile.enabled
            }

        } else if (plugin[tile.widgetConfig] && plugin[tile.widgetConfig][tile.plugin] && !plugin[tile.widgetConfig][tile.plugin][dash]) {

            plugin[tile.widgetConfig][tile.plugin][dash] = {
                [ex]: pos
            };

            plugin[tile.widgetConfig][tile.plugin].enabled = tile.enabled;

        } else if (plugin[tile.widgetConfig] && plugin[tile.widgetConfig][tile.plugin] && plugin[tile.widgetConfig][tile.plugin][dash]) { 

            (plugin[tile.widgetConfig][tile.plugin][dash] as any)[ex] = pos as any

            plugin[tile.widgetConfig][tile.plugin].enabled = tile.enabled;

        }

    }

    private fireChange(e: MouseEvent): void {

        const el = e.target as HTMLInputElement;
        const index = (el as any).index;

        if (this.tilesItens[index]) this.tilesItens[index].position = el.value;

        this.tilesItens = Object.assign([], this.tilesItens);
    }


}

interface ITilesItem {
    title: string,
    plugin: string,
    position: string,
    index: string,
    enabled: string,
    widgetConfig: string
}
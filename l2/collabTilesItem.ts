/// <mls fileReference="_100554_/l2/collabTilesItem.ts" enhancement="_blank" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';


@customElement('collab-tiles-item-100554')
export class CollabTilesItem extends CollabLitElement {

    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;

    public myinfo: ITilesItem | undefined;


    @property({ type: String, reflect: true }) position = '';
    @property({ type: String, reflect: true }) plugin = '';
    @property({ type: String, reflect: true }) index = '';
    @property({ type: String, reflect: true }) edit = '';

    @property({ type: String, reflect: true }) mode = 'loading';

    @query('collabtileitemresize') collabtileitemresize: HTMLElement | undefined;

    private elPlugin: HTMLElement | undefined

    //---------COMPONENT-------------
    createRenderRoot() {
        return this;
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);

        if (this.edit === 'true' && this.collabtileitemresize) {
            this.collabtileitemresize.addEventListener('dragstart', this.initDragging.bind(this));
            this.collabtileitemresize.addEventListener('drag', this.doDragging.bind(this));
            this.collabtileitemresize.addEventListener('dragend', this.stopDragging.bind(this));
        }

    }

    render() {

        if (!this.myinfo) return;

        this.style.display = '';
        if (this.edit !== 'true' && this.myinfo.enabled === 'false') this.style.display = 'none';


        const [r, c] = this.myinfo.position ? this.myinfo.position.split(' ') : ['2', '2'];

        this.style.gridRow = 'span ' + r;
        this.style.gridColumn = 'span ' + c;
        this.onclick = () => this.clickPlugin();
        this.loadingPlugin();

        let aux: any = '';
        if (this.edit === 'true') aux = this.renderResize();


        return html`
            <div style="${this.mode !== 'loading' ? 'display:none;' : 'position:relative; width:100%; height:100%;background: #ececec;'}">
                <div class="loader">
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square last"></div>
                    <div class="square clear"></div>
                    <div class="square"></div>
                    <div class="square last"></div>
                    <div class="square clear"></div>
                    <div class="square "></div>
                    <div class="square last"></div>
                </div>
            </div>
            <collabtileitemcontent style="${this.mode !== 'plugin' ? 'display:none;' : 'height:100%; width:100%;overflow:hidden;'}">
            </collabtileitemcontent>
            ${aux}

        `

    }

    renderResize() {

        let title = 'activate'
        let aux = '+';

        if (this.myinfo && this.myinfo.enabled !== 'false') {
            aux = '-';
            title = 'disable';
        }

        return html`
            <collabtileenabled title="${title}" @click="${this.setEnabled}">${unsafeHTML(aux)}</collabtileenabled>
            <collabtileitemresize draggable="true">
            </collabtileitemresize>
        `
    }

    //-----------IMPLEMENTS-----------

    private setEnabled() {

        if (!this.myinfo) return;

        this.myinfo.enabled = this.myinfo.enabled === 'true' ? 'false' : 'true';
        this.requestUpdate();

    }

    private async loadingPlugin() {

        const infoPathPlugin = mls.l2.getPath(this.plugin);
        await import('/' + `_${infoPathPlugin.project}_/l2/${infoPathPlugin.shortName}`);
        const tag = convertFileNameToTag(infoPathPlugin);
        this.elPlugin = document.createElement(tag);
        this.elPlugin.setAttribute('dashboardindex', this.index);
        this.setPlugin();
    }

    private async setPlugin() {
        const el = this.querySelector('collabtileitemcontent');
        if (!el || !this.elPlugin) return;
        el.innerHTML = '';
        el.appendChild(this.elPlugin);
        if ((this.elPlugin as any).prepare) await (this.elPlugin as any).prepare();
        this.mode = 'plugin';

    }

    private clickPlugin(): void {

        if (!this.plugin || this.edit === 'true') return;

        mls.actual[0].setFullName(this.plugin);
        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(
                {
                    shortName: mls.actual[0].path,
                    project: mls.actual[0].project
                }
            ),
            0
        );

    }

    private initDragging(e: MouseEvent): void {

        if (!this.collabtileitemresize) return;

        if (!document.defaultView) return;

        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this).height, 10);



    }

    private doDragging(e: MouseEvent): void {

        if (!this.collabtileitemresize) return;

        let col = (this.startWidth + e.clientX - this.startX);
        let row = (this.startHeight + e.clientY - this.startY);
        this.style.width = col + 'px';
        this.style.height = row + 'px';

    }

    private stopDragging(e: MouseEvent): void {

        if (!this.collabtileitemresize) return;

        let col = Number.parseInt(this.style.width);
        let row = Number.parseInt(this.style.height);

        if (!col || !row) return;

        if (col < 0) col = col * -1;
        if (row < 0) row = row * -1;

        col = Math.round(col / 100);
        row = Math.round(row / 100);

        this.style.gridArea = '';
        this.style.gridRow = 'span ' + row;
        this.style.gridColumn = 'span ' + col;

        this.style.width = '';
        this.style.height = '';

        if (this.myinfo) this.myinfo.position = row + ' ' + col;

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
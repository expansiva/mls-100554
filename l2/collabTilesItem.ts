/// <mls shortName="collabTilesItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';


@customElement('collab-tiles-item-100554')
export class CollabTilesItem extends LitElement {

    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;

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

        const [r, c] = this.position ? this.position.split(' ') : ['2', '2'];


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
            <style>

                ${this.myCss}
            </style>
        `

    }

    renderResize() {
        return html`
            <collabtileitemresize draggable="true">
            </collabtileitemresize>
        `
    }

    //-----------IMPLEMENTS-----------

    private async loadingPlugin() {

        await import('./' + this.plugin)
        const tag = convertFileNameToTag(this.plugin);
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

        if (col < 0) col = col * -1;
        if (row < 0) row = row * -1;

        col = Math.round(col / 100);
        row = Math.round(row / 100);

        this.style.gridArea = '';
        this.style.gridRow = 'span ' + row;
        this.style.gridColumn = 'span ' + col;

        this.style.width = '';
        this.style.height = '';

    }

    private myCss = `

        collab-tiles-item-100554{
            position:relative;
        }

        collabtileitemresize{
            content: ' ';
            bottom: 0px;
            right: 0px;
            width:10px;
            height:10px;
            background:#fff;
            border-radius:50%;
            box-shadow: 0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3);
            position: absolute;
            transform: translate(40%, 40%);
            cursor: se-resize;
        }

        @-webkit-keyframes enter {
            0% {
                opacity: 0;
                top: -10px;
            }
            5% {
                opacity: 1;
                top: 0px;
            }
            50.9% {
                opacity: 1;
                top: 0px;
            }
            55.9% {
                opacity: 0;
                top: 10px;
            }
        }
        @keyframes enter {
            0% {
                opacity: 0;
                top: -10px;
            }
            5% {
                opacity: 1;
                top: 0px;
            }
            50.9% {
                opacity: 1;
                top: 0px;
            }
            55.9% {
                opacity: 0;
                top: 10px;
            }
        }
        @-moz-keyframes enter {
            0% {
                opacity: 0;
                top: -10px;
            }
            5% {
                opacity: 1;
                top: 0px;
            }
            50.9% {
                opacity: 1;
                top: 0px;
            }
            55.9% {
                opacity: 0;
                top: 10px;
            }
        }
        
        collab-tiles-item-100554 .loader {
            position: absolute;
            left: 50%;
            top: 50%;
            background: #00000029;
            padding: 1rem;
            border-radius: 5px;
            transform: translate(-50%, -50%);
        }

        collab-tiles-item-100554 .square {
            background: white;
            width: 15px;
            height: 15px;
            float: left;
            top: -10px;
            margin-right: 5px;
            margin-top: 5px;
            position: relative;
            opacity: 0;
            -webkit-animation: enter 6s infinite;
            animation: enter 6s infinite;
        }

        collab-tiles-item-100554 .enter {
            top: 0px;
            opacity: 1;
        }

        collab-tiles-item-100554 .square:nth-child(1) {
            -webkit-animation-delay: 1.8s;
            -moz-animation-delay: 1.8s;
            animation-delay: 1.8s;
        }

        collab-tiles-item-100554 .square:nth-child(2) {
            -webkit-animation-delay: 2.1s;
            -moz-animation-delay: 2.1s;
            animation-delay: 2.1s;
        }

        collab-tiles-item-100554 .square:nth-child(3) {
            -webkit-animation-delay: 2.4s;
            -moz-animation-delay: 2.4s;
            animation-delay: 2.4s;
            background: #7e70d2;
        }

        collab-tiles-item-100554 .square:nth-child(4) {
            -webkit-animation-delay: 0.9s;
            -moz-animation-delay: 0.9s;
            animation-delay: 0.9s;
        }

        collab-tiles-item-100554 .square:nth-child(5) {
            -webkit-animation-delay: 1.2s;
            -moz-animation-delay: 1.2s;
            animation-delay: 1.2s;
        }

        collab-tiles-item-100554 .square:nth-child(6) {
            -webkit-animation-delay: 1.5s;
            -moz-animation-delay: 1.5s;
            animation-delay: 1.5s;
        }

        collab-tiles-item-100554 .square:nth-child(8) {
            -webkit-animation-delay: 0.3s;
            -moz-animation-delay: 0.3s;
            animation-delay: 0.3s;
        }

        collab-tiles-item-100554 .square:nth-child(9) {
            -webkit-animation-delay: 0.6s;
            -moz-animation-delay: 0.6s;
            animation-delay: 0.6s;
        }

        collab-tiles-item-100554 .clear {
            clear: both;
        }

        collab-tiles-item-100554 .last {
            margin-right: 0;
        }
    `

}
/// <mls shortName="collabTilesItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';


@customElement('collab-tiles-item-100554')
export class CollabTilesItem extends LitElement {

    @property({ type: String, reflect: true }) position = '';
    @property({ type: String, reflect: true }) plugin = '';
    @property({ type: String, reflect: true }) index = '';

    @property({ type: String, reflect: true }) mode = 'loading';

    private elPlugin: HTMLElement | undefined

    //---------COMPONENT-------------
    createRenderRoot() {
        return this;
    }

    render() {
        this.style.gridArea = this.position;
        this.onclick = () => this.clickPlugin();
        this.loadingPlugin();
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
            <collabtileitemcontent style="${this.mode !== 'plugin' ? 'display:none;' : 'height:100%; width:100%;overflow:hidden;'}"></collabtileitemcontent>
            <style>
                ${this.myCss}
            </style>
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

        if (!this.plugin) return;

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

    private myCss = `
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
/// <mls shortName="wcVideo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaApresentationVideoEmbeddedVideoBase } from './_100554_icaApresentationVideoEmbeddedVideoBase';

@customElement('wc-video-100554')
export class WcVideo100554 extends IcaApresentationVideoEmbeddedVideoBase {

    static styles = css`
        :host{
            display:block;
        }
        video {
            width: 100%;
            height: auto;
        }
    `;

    @property({ type: String }) src = '';
    @property({ type: Boolean }) autoplay = false;
    @property({ type: Boolean }) controls = true;
    @property({ type: Boolean }) loop = false;
    @property({ type: Boolean }) muted = false;
    @property({ type: String }) preload: 'auto' | 'metadata' | 'none' = 'auto';
    
    @query('video') video: HTMLVideoElement | undefined;

    render() {
        return html`
            <video
                .src=${this.src}
                ?autoplay=${this.autoplay}
                ?controls=${this.controls}
                ?loop=${this.loop}
                ?muted=${this.muted}
                .preload=${this.preload}
            ></video>
        `;
    }

}

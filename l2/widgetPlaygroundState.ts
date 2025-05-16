/// <mls shortName="widgetPlaygroundState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { initState} from './_100554_collabState';

@customElement('widget-playground-state-100554')
export class WidgetPlaygroundState extends LitElement { 

    @property({ type: String }) state: string = '';

    firstUpdated() {
        this.initStatePlayground();
    }

    render() {
        return html``;
    }

    private initStatePlayground() {
        try {

            if (!this.state) return;
            const js = JSON.parse(this.state);
            Object.keys(js).forEach((k) => {

                initState(k, js[k]);

            });
            
        } catch (e: any) {
            console.info(e.message);
        }
    }

}
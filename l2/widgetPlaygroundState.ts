/// <mls shortName="widgetPlaygroundState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { initState, setState} from '/_100554_/l2/collabState.js';

@customElement('widget-playground-state-100554')
export class WidgetPlaygroundState extends LitElement { 

    @property({ type: String }) state: string = '';

    connectedCallback() {
        setState('playground', {});
        super.connectedCallback();
    }

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
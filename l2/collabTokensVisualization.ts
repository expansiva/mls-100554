/// <mls shortName="collabTokensVisualization" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { getTokens, IDesignSystemTokens } from '/_100554_/l2/designSystemBase.js';

@customElement('collab-tokens-visualization-100554')
export class CollabTokensVisuzalization100554 extends StateLitElement {

    @property() tokens: IDesignSystemTokens[] = [];

    @property() project: number = 100554;

    async firstUpdated(prop: any) {
        super.firstUpdated(prop);
        this.tokens = await this.getTokens();
        console.info(this.tokens)
    }

    render() {
        return html`
        <div>
            ${this.tokens.filter((t) => t.themeName === 'Default').map((theme) => {
            return html`
                    <div>
                        <div class="colors-container">
                            ${Object.keys(theme.color).filter((key) => !key.startsWith('_')).map((key) => {
                                return html`
                                    <div style="background:var(--${key});"></div>
                                `
                            })}
                        </div>
                        <br>
                        <div style="border:1px solid var(--text-primary-color); padding:1rem; background:var(--bg-primary-color);">
                            Hello world;
                        </div>
                        <br>
                        
                        <div style="border:1px solid var(--text-primary-color); padding:1rem; background:var(--bg-secondary-color);">
                            Hello world;
                        </div>

                        <br>

                        <div style="font-family: var(--font-family-primary)">
                            Font family primary;
                        </div>
                        <br>
    
                        <div style="font-family: var(--font-family-secondary)">
                            Font family secondary;
                        </div>
                        <br>
        
                        <ul style="padding-inline-start:0;list-style:none; display:flex; flex-direction: column; gap:1rem;font-family: var(--font-family-secondary)">
                            <li style= font-size:var(--font-size-12)> Font size 12</li>
                            <li style= font-size:var(--font-size-16)> Font size 16</li>
                            <li style= font-size:var(--font-size-20)> Font size 20</li>
                            <li style= font-size:var(--font-size-24)> Font size 24</li>
                            <li style= font-size:var(--font-size-40)> Font size 40</li>
                            <li style= font-size:var(--font-size-48)> Font size 48</li>
                            <li style= font-size:var(--font-size-64)> Font size 64</li>
                        </ul>
                    </div>

                `
        })}
        </div>`;
    }

    async getTokens() {
        return getTokens(this.project);
    }

}

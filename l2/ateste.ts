/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, when, repeat, classMap, styleMap, ifDefined } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'
import { updateHTML } from './_100554_collabDOMSync';

@customElement('ateste-100554')
export class SimpleGreeting extends CollabLitElement {

    @property() selectedId: number | null = 2;
    @state() items = [
        { id: 1, name: 'Banana', color: 'green' },
        { id: 2, name: 'Maçã', color: 'red' },
        { id: 3, name: 'Uva', color: 'purple' },
    ];

  render() {

      console.log('teste 2')
        return html`
    <div>
      <h3>Frutas:</h3>
      <ul>
        ${repeat(
            this.items,
            ((item: any) => item.id) as any,
            ((item: any) => {

                const classes = {
                    'highlight': item.color === 'green',
                    'selected': item.id === this.selectedId,
                };

                const styles = {
                    color: item.color,
                    cursor: 'pointer',
                };

                return html`
              <li
                class=${classMap(classes)}
                style=${styleMap(styles)}
                title=${ifDefined(item.name)}
                @click=${() => (this.selectedId = item.id)}
              >
                ${item.name}
              </li>
            `;
            }) as any
        )}
      </ul>

      ${when(
            this.selectedId !== null,
            () => html`<p>Selecionado: ${this.getSelectedName()}</p>`,
            () => html`<p>Nenhuma fruta selecionada.</p>`
        )}
    </div>
  `;
    }


    private getSelectedName(): string {
        const found = this.items.find(i => i.id === this.selectedId);
        return found ? found.name : '';
    }
}



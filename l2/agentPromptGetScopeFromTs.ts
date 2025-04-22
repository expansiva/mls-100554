/// <mls shortName="agentPromptGetScopeFromTs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { AgentBase, IAgentBase } from './_100554_iaAgentBase';

export class agentPromptGetScopeFromTs extends AgentBase implements IAgentBase {

    public task: mls.msg.TaskData | undefined;
    public visibility: 'public' | 'private' = 'private';

    public getPrompt(prompt: string | undefined): mls.msg.IAMessageInputType[] {
        return this.getMyImputs(prompt || '');
    }

    public async afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void> {
        return this._afterPrompt(payload);
    }

    //---------IMPLEMENTS-------------

    private async _afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void> {

    }

    private getMyImputs(prompt: string): mls.msg.IAMessageInputType[] {

        return [
            {
                type: 'system',
                content: `

Você é um programador especialista em desenvolvimento de componentes WEB com Lit versão 3

A partir do código typescript passado pelo usuário, você deve gerar um HTML de saída, emulando o processamento do lit

Se faltar qualquer informação, retornar uma "clarificationMessage".
`
            },
            {
                type: 'system',
                content: `
## Exemplo de processamento

* Código enviado pelo usuário
\`\`\`
/// <mls shortName="wcButtonSubmit" project="100554" enhancement="_100554_enhancementLit" groupName="FormsSubmitSubmit" />

import { html, css, ifDefined } from 'lit';
import { customElement, property, } from 'lit/decorators.js';
import { IcaFormsSubmitSubmitBase } from './_100554_icaFormsSubmitSubmitBase';
import { propertyDataSource } from './_100554_icaLitElement';

@customElement('wc-button-submit-100554')
export class WcButtonSubmit extends IcaFormsSubmitSubmitBase {

    @propertyDataSource({ type: String, attribute: 'clicked-value' }) clickedValue: string | undefined;
    @propertyDataSource({ type: String, attribute: 'clicked-action' }) clickedAction: string | undefined;

    @property({ type: String }) name: string | undefined;
    @property({ type: String }) title: string = '';
    @property({ type: String }) icon: string | undefined;
    @property({ type: String }) text: string | undefined;
    @property({ type: Boolean }) disabled: boolean = false; // Whether the field is ready for input or disabled
    @property({ type: String }) form: string | undefined; // The form element that the button is associated with (it is the owning form).   

    render() {
        return html\`
            <button 
                name=\${ifDefined(this.name)} 
                title=\${ifDefined(this.title)} 
                ?disabled=\${this.disabled} 
                form=\${ifDefined(this.form)}
                @click=\${this.handleClick}
                >
                \${this.text || ''}
            </button>
        \`;
    }

    handleClick() {
        this.clickedAction = this.clickedValue;
    }

}
\`\`\`

* retorno esperado
<wc-button-submit-100554 text="Example">
       <button title="">
                <!--?lit$494687120$-->Example
       </button>
</wc-button-submit-100554>
`
            },
            {
                type: 'system',
                content: `
## Restrições adicionais

- o HTML processado deve estar sempre dentro da tag gerada pelo componente
- Simular o HTML final com todos os parâmetros possíveis, configurados no componente pelo marcador @property
`
            },
            {
                type: 'human',
                content: prompt || ''
            },
        ]

    }

}
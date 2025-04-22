/// <mls shortName="agentPageTsChange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { AgentBase, IAgentBase } from './_100554_iaAgentBase';

export class agentPageTsChange extends AgentBase implements IAgentBase {

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
Você é um agente especializado na manutenção em Typescript. Sua responsabilidade é modificar a estrutura de um webcomponent Lit Page apenas conforme solicitado pelo usuário, sem alterar sua organização original.        
        `
            },
            {
                type: 'system',
                content: `
##REGRAS PRINCIPAIS
 
 - Nunca modifique a primeira linha do arquivo, pois ela contém informações críticas da página.
 - Respeite a estrutura existente e realize somente as alterações especificadas pelo usuário.
 - Não introduza elementos ou remoções não solicitadas.
 - Não adicionar atributos além dos que estão especificados e solicitados
 - Caso precise setar algo no state troque a linha "import {{ globalState, initState }} from './_100554_icaState';" por      
    "import {{ globalState, initState, setState}} from './_100554_icaState"
- A função setState espera 3  parametros (path:string, value:any,  systemChange: boolean default false)
- Para pegar algo do state, basta começar "globalState._ica." mais o nome do state que foi definido no
initState e navegar ate a posição do state solicitada.                

`
            },
            {
                type: 'system',
                content: `
## SAIDA ESPERADA

Teremos duas opções de retorno, caso tudo esteja resolvido e a alteração seja possível ser realizada sem mais informações retorne de acordo com a opção 1, caso contrario faça o retorno conforme a opção 2.


Opção 1:
  - Apenas o código TS deve ser devolvido, seguindo todas as especificações.

Opção 2:
  - Retorne  o json abaixo
\`\`\`json
[
 {{
    "type": "clarification",
    "clarificationMessage": string,
   "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  }}
]
\`\`\`                
`
            },
            {
                type: 'system',
                content: `## TS BASE`
            },
            {
                type: 'human',
                content: '##SOLICITACAO DO USURIAO '+prompt || ''
            },
        ]

    }

}
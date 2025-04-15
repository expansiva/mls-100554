/// <mls shortName="agenteCreateHtml1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAMessageInputType, TaskData, AIPayload } from './_100554_iaChatInterfaces';

export const visibility: 'public' | 'private' = 'private'
export function beforePrompt(stepId: number, task: TaskData): IAMessageInputType[] {
    return []
}

export function afterPrompt(stepId: number, task: TaskData): string {
    return ''
}

export function getDescriptions(): string {

    return `Entender a intenção da página com base nos requisitos e no prompt do usuário..`
}

export function startPrompt(userPrompt: string): IAMessageInputType[] {
    return [
        {
            type: 'system',
            content: `
Você é um analista de interface. Sua tarefa é entender a intenção da página com base nos requisitos e no prompt do usuário.

Seu objetivo é gerar uma estrutura conceitual da interface, sem mapear componentes técnicos nem definir estados, bindings ou web components. Apenas descreva o que a página deve conter e qual o propósito de cada elemento.
`
        },
        {
            type: 'system',
            content: `##Diretrizes para a Resposta

-Para cada seção da interface, defina:
-Nome da seção
-Descrição (opcional)
-Lista de campos ou ações
-Nome lógico (ex: nome, email, botaoSalvar)
-Intenção (ex: capturar nome do cliente, permitir salvar o formulário)`
        },
        {
            type: 'system',
            content: `##Descreva o comportamento geral da página, incluindo:

-Nome da página
-Modo inicial (ex: visualizacao ou edicao)
-Regras de fluxo (ex: salvar somente após clicar em “editar”)

*Importante: Não inclua nomes de web components, atributos HTML, bindings ou lógica de estado.`
        },
        {
            type: 'system',
            content: `##Saída Esperada

A resposta deve ser um JSON estruturado contendo as informações da interface.

{
  "pagina": "Cadastro de Cliente",
  "modoInicial": "visualizacao",
  "fluxo": "Permite visualizar os dados inicialmente. O botão 'Editar' ativa os campos para edição. A alteração só é salva após clicar em 'Salvar'.",
  "secoes": [
    {
      "nome": "dadosPessoais",
      "descricao": "Campos principais do cliente",
      "campos": [
        {
          "nome": "nome",
          "intencao": "capturar nome completo do cliente"
        },
        {
          "nome": "email",
          "intencao": "capturar e-mail para contato"
        },
        {
          "nome": "telefone",
          "intencao": "capturar telefone de contato"
        },
        {
          "nome": "dataNascimento",
          "intencao": "registrar a data de nascimento do cliente"
        },
        {
          "nome": "idadeTexto",
          "intencao": "exibir idade atual calculada com base na data de nascimento"
        }
      ]
    },
    {
      "nome": "acoes",
      "descricao": "Botões de interação com o formulário",
      "campos": [
        {
          "nome": "botaoEditar",
          "intencao": "ativar edição dos campos"
        },
        {
          "nome": "botaoSalvar",
          "intencao": "salvar os dados do cliente após edição"
        }
      ]
    }
  ]
}`
        },
        {
            type: 'human',
            content: userPrompt
        },
    ]
}
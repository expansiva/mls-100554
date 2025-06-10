/// <mls shortName="agentGenerateDefs" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "agentGenerateDefs",
    "type": "lib",
    "group": "other",
    "tags": [
      "ai-agent",
      "automation",
      "defs-generator"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_aiAgentBase",
      "./_100554_libCommom",
      "./_100554_aiPrompts",
      "./_100554_aiAgentHelper",
      "./_100554_aiAgentOrchestration"
    ]
  },
  "codeInsights": {
    "todos": [
      "fazer html com explicações"
    ],
    "securityWarnings": [
      "A função extJson faz parsing de strings para JSON sem validação robusta, podendo causar erros se o conteúdo não for seguro.",
      "Não há tratamento explícito para possíveis ataques de injeção em conteúdos vindos de arquivos externos.",
      "Acesso direto a propriedades de objetos sem checagem profunda pode causar falhas se a estrutura esperada não for seguida."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O HTML do componente é apenas um <h1>, sem atributos de acessibilidade como aria-label, role, tabindex, etc.",
      "Não há problemas de contraste visíveis, pois o LESS define tokens de cor, mas não há uso prático no HTML.",
      "Não há navegação por teclado ou foco definido, mas o conteúdo é mínimo."
    ],
    "i18nWarnings": [
      "Strings como 'Creating.', 'Invalid context', 'Erro', 'Not found context to create files', 'Do not change – automatically generated code.' e mensagens de erro diversas não estão internacionalizadas.",
      "O HTML contém apenas texto técnico, mas se for exibido ao usuário, deveria ser internacionalizado."
    ]
  },
  "planning": {
    "generalDescription": "Este componente é um agente automatizado para geração e manutenção de arquivos de definição (.defs) de outros componentes do sistema Collab.codes, analisando arquivos .ts, .html e .less e produzindo documentação estruturada e insights técnicos.",
    "goal": "Automatizar a geração e atualização de arquivos .defs para componentes, facilitando documentação, suporte à IA e análise organizacional.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero que o agente gere automaticamente arquivos .defs a partir dos arquivos fonte do componente, para que eu tenha documentação e insights atualizados.",
        "derivedRequirements": [
          {
            "description": "Analisar arquivos .ts, .html e .less e extrair informações relevantes para o .defs.",
            "done": true,
            "comment": "O código implementa funções para ler e processar os arquivos necessários."
          },
          {
            "description": "Gerar o objeto BaseDefs conforme o formato especificado.",
            "done": true,
            "comment": "A função updateDefs monta o objeto e salva no formato correto."
          },
          {
            "description": "Atualizar o arquivo .defs no repositório do componente.",
            "done": true,
            "comment": "A função createStorFile é chamada para atualizar o arquivo."
          },
          {
            "description": "Registrar e atualizar o status das tarefas e etapas do agente.",
            "done": true,
            "comment": "Funções como updateStepStatus e updateTaskTitle são utilizadas para isso."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Permitir atualização incremental do .defs sem sobrescrever dados manuais.",
        "done": false,
        "comment": "Atualmente, o arquivo é sobrescrito completamente."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte a internacionalização automática das mensagens de erro.",
        "done": false,
        "comment": "Mensagens de erro ainda estão hardcoded em português. Verificar."
      }
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}

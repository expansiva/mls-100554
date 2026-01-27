/// <mls fileReference="_100554_/l2/agentFix.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentFix.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "IAgent",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getNextPendingStepByAgentName",
            "type": "function"
          },
          {
            "name": "getNextInProgressStepByAgentName",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "getNextFlexiblePendingStep",
            "type": "function"
          },
          {
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "appendLongTermMemory",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "startNewInteractionInAiTask",
            "type": "function"
          },
          {
            "name": "startNewAiTask",
            "type": "function"
          },
          {
            "name": "executeNextStep",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "forceServiceInstance",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "setState",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceSource.js",
        "dependencies": [
          {
            "name": "ServiceSource100554",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createAllModels",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Responsavel por corrigir erros",
      "businessCapabilities": [
        "Você é um agente especializado em corrigir erros de componentes web desenvolvidos com o framework Lit",
        "O arquivo do source seria fornecido, juntamente com um resumo dos erros encontrados no arquivo. Sua tarefa é: 1. Ver os erros e identificar quais alterações precisam ser realizadas 2. Executar apenas as alterações necessárias 3. Retornar somente os arquivos que você modificou"
      ],
      "technicalCapabilities": [
        "Arquivo '.ts' com a lógica do componente",
        "Arquivo '.html' com a pagina em que o componente esta sendo usado",
        "Arquivo '.less' com os estilos"
      ],
      "implementedFeatures": [
        "beforePrompt",
        "afterPrompt",
        "replayForSupport"
      ],
      "constraints": [
        "Não se deve remover ou renomear atributos sem a solicitação do usuario",
        "Não se deve adicionar novos tokens no less",
        "*Não remover*, a primeira linha com tripleslash ex: /// <mls shortName=\"xxx\" project=\"yyy\" enhancement=\"yyy\" groupName=\"zzzz\" />",
        "Não alterar o valor dos itens do tripleslash(shortName,project,enhancement,groupName)",
        "Os arquivos .ts e .less tem como controle a primeira linha sendo um tripleslash. Essa linha é obrigatória, não remover.",
        "Os atributos válidos são : shortName,project,enhancement,groupName.",
        "Corrigir o nome dos atributos se necessário.",
        "Não adicionar novos atributos.",
        "Não alterar o value dos atributos",
        "O value deverá ser sempre entre aspas duplas \"\" ex: /// <mls shortName=\"xxx\" project=\"yyy\" enhancement=\"yyy\" groupName=\"zzzz\" />",
        "Erro na tipagem do *repeat* no lit: is not assignable to parameter of type 'RepeatFunction'.",
        "Erros de nomes de tokens Less: ex margin: @space-4 => NameError: variable @space-4 is undefined"
      ]
    }
  }
}
    
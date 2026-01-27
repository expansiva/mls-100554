/// <mls fileReference="_100554_/l2/toolMortgageCalculator.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/toolMortgageCalculator.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement",
    "languages": [
      "pt"
    ]
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "ITool",
            "type": "interface"
          },
          {
            "name": "svg_tool",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Calcula a parcela mensal de um financiamento imobiliário usando a Tabela Price com juros anuais fixos de 13%",
      "businessCapabilities": [
        "Calcula a parcela mensal de um financiamento imobiliário"
      ],
      "technicalCapabilities": [
        "Implementa cálculo da Tabela Price",
        "Suporta parâmetros opcionais"
      ],
      "implementedFeatures": [
        "Cálculo da parcela mensal com juros anuais fixos de 13%",
        "Suporte a taxa administrativa"
      ],
      "constraints": [
        "Parâmetros devem ser números válidos",
        "Valor financiado deve ser maior que zero"
      ]
    }
  }
}
    
/// <mls fileReference="_100554_/l2/toolFilterFilesL2.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/toolFilterFilesL2.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
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
            "name": "svg_tool"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Filtra uma lista de arquivos com base em critérios como extensão, nome, erro, status, entre outros.",
      "businessCapabilities": [
        "Filtra uma lista de arquivos"
      ],
      "technicalCapabilities": [
        "regex",
        "date comparison"
      ],
      "implementedFeatures": [
        "equals",
        "startsWith",
        "endsWith",
        "contains",
        "regex",
        "isTrue",
        "isFalse",
        "between"
      ]
    }
  }
}
    
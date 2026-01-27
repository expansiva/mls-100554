/// <mls fileReference="_100554_/l2/lessAST.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/lessAST.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/lessMonaco.js",
        "dependencies": [
          {
            "name": "MonacoDriver",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "This class parses a LESS model, building an AST and converting LESS selectors into a CSS-compatible format.",
      "businessCapabilities": [
        "Basic Selector Nesting",
        "Simple Variables",
        "Basic LESS Structure"
      ],
      "technicalCapabilities": [
        "Parses basic selectors, properties, and tokens",
        "Converts LESS selectors to CSS-compatible format",
        "Manages selector hierarchy with stack"
      ],
      "implementedFeatures": [
        "parse",
        "listThemes",
        "addTheme",
        "deleteTheme",
        "getThemeDescription",
        "selectorCSS2LESS",
        "selectorLESS2CSS",
        "toCamelCaseProperty",
        "toKebabCaseProperty",
        "getProperty",
        "saveProperty",
        "findLastLineInSelector",
        "findInfoByLine",
        "findSelectorByLine",
        "findFirstSelectorAfterRoot",
        "insertSelector"
      ],
      "constraints": [
        "Variable Interpolation within Selectors",
        "Parameterized Mixins",
        "Mathematical and Color Functions",
        "Looping and Iteration",
        "Global Scope Management"
      ]
    }
  }
}
    
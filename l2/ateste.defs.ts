/// <mls fileReference="_100554_/l2/ateste.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/ateste.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "when",
            "type": "function"
          },
          {
            "name": "repeat",
            "type": "function"
          },
          {
            "name": "classMap",
            "type": "function"
          },
          {
            "name": "styleMap",
            "type": "function"
          },
          {
            "name": "ifDefined",
            "type": "function"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "state",
            "type": "function"
          },
          {
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDOMSync.js",
        "dependencies": [
          {
            "name": "updateHTML",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "/*if (f && f.level === 2 && ['.ts'].includes(f.extension) && (f.shortName.startsWith('c') || f.shortName.startsWith('d') || f.shortName.startsWith('l') || f.shortName.startsWith('e') || f.shortName.startsWith('m') || f.shortName.startsWith('a') || f.shortName.startsWith('validate') || f.shortName.startsWith('process') || f.shortName.startsWith('stateLit') || f.shortName.startsWith('pluginTask') || f.shortName.startsWith('icaApresentationTextRichBase') || f.shortName.startsWith('widgetTextCode') || f.shortName.startsWith('icaApresentationTextCodeBase') || f.shortName.startsWith('pluginStyleIndexItem') || f.shortName.startsWith('collabMessagesThreadModal') || f.shortName.startsWith('previewModeUtil')) ) return; itens.push(key);*/",
      "/*if (f && f.level === 2 && ['.ts'].includes(f.extension) && (f.shortName.startsWith('service') || f.shortName.startsWith('pluginPreview') || f.shortName.startsWith('tsTest') || f.shortName.startsWith('previewModeSinglePage') || f.shortName.startsWith('previewModeMinimum') || f.shortName.startsWith('widgetDefs') || f.shortName.startsWith('saveAddBranch') || f.shortName.startsWith('pluginCreateProjectLocalToDriver') || f.shortName.startsWith('pluginNewProjectLog')) ) itens.push(key);*/",
      "/*if (f && f.level === 2 && ['.ts'].includes(f.extension) && (f.shortName.startsWith('p')) && !f.shortName.startsWith('pluginPreview') && !f.shortName.startsWith('previewModeSinglePage') && !f.shortName.startsWith('previewModeMinimum') && !f.shortName.startsWith('pluginCreateProjectLocalToDriver') && !f.shortName.startsWith('pluginNewProjectLog') && !f.shortName.startsWith('process') && !f.shortName.startsWith('pluginTask') && !f.shortName.startsWith('pluginStyleIndexItem') && !f.shortName.startsWith('previewModeUtil')) itens.push(key); if (f && f.level === 2 && ['.ts'].includes(f.extension) && (f.shortName.startsWith('i') || f.shortName.startsWith('w')) && !f.shortName.startsWith('icaApresentationTextRichBase') && !f.shortName.startsWith('icaApresentationTextCodeBase') && !f.shortName.startsWith('widgetTextCode') && !f.shortName.startsWith('widgetDefs')) itens.push(key); })*/"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Component for processing and updating TypeScript test files",
      "businessCapabilities": [
        "Processes project files",
        "Transforms import paths",
        "Updates file contents"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Interacts with file storage",
        "Performs string replacements"
      ],
      "implementedFeatures": [
        "Filters test files",
        "Applies import transformations",
        "Saves modified content",
        "Checks for compilation errors"
      ]
    }
  }
}
    
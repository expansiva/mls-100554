/// <mls fileReference="_100554_/l2/collabDOMSync.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabDOMSync.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "/*const tagname = element.tagName.toLowerCase();\nif (element && element.getAttribute('modeoverlay')) {\nconst clone = element.cloneNode(false);\n//(clone as HTMLElement).removeAttribute('style');\n(clone as HTMLElement).removeAttribute('ori');\n(clone as HTMLElement).removeAttribute('level');\nparent.appendChild(clone);\nlet children = [];\nif (element.shadowRoot) children = [...element.shadowRoot.children]\nelse children = [...element.children]\nfor (const child of children) {\nclearTree2(clone as HTMLElement, child as HTMLElement);\n}\n}*/"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Functions for syncing HTML from iframe to Monaco editor and formatting HTML",
      "businessCapabilities": [
        "Sync DOM changes to editor",
        "Update HTML content in editor",
        "Format HTML with indentation"
      ],
      "technicalCapabilities": [
        "Manipulate DOM elements",
        "Use Monaco editor API for editing",
        "Handle HTML attributes and nodes"
      ],
      "implementedFeatures": [
        "sync()",
        "updateHTML(html: string, format: boolean = true)",
        "setValueInModeKeepingUndo(model: monaco.editor.ITextModel, newContent: string)",
        "formatHtml(html: string)",
        "clearTree(iframe: HTMLIFrameElement): string",
        "clearTree2(parent: HTMLElement, element: HTMLElement): HTMLElement",
        "clearTree3(parent: HTMLElement, element: HTMLElement)"
      ]
    }
  }
}
    
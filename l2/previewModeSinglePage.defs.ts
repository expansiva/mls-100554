/// <mls fileReference="_100554_/l2/previewModeSinglePage.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/previewModeSinglePage.ts",
    "componentType": "editorService",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "IJSONDependence",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "setErrorOnModel",
            "type": "function"
          },
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/previewModeUtil.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "PreviewModeSinglePage class for handling single page previews",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Loads esbuild",
        "Configures iframe",
        "Bundles JavaScript",
        "Handles caching"
      ],
      "implementedFeatures": [
        "init",
        "configIframe",
        "parseImportsMap",
        "findWidgets",
        "loadEsbuild",
        "initializeEsBuild",
        "loadCache"
      ],
      "constraints": []
    }
  }
}
    
/// <mls fileReference="_100554_/l2/pluginCollabWidgetIndex.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCollabWidgetIndex.ts",
    "componentType": "pluginSettings",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "_100554_wcText",
      "_100554_wcImage",
      "_100554_wcCode",
      "_100554_wcVideo",
      "_100554_wcSection",
      "_100554_wcDivider",
      "_100554_wcButtonSubmit",
      "_100554_wcChart",
      "_100554_wcColumn",
      "_100554_wcInputNumber",
      "_100554_wcInputText",
      "_100554_wcInputNumberRange",
      "_100554_wcInputNumberWithButtons",
      "_100554_wcRow",
      "_100554_wcSelectOne",
      "_100554_wcTableSelect"
    ],
    "imports": [
      {
        "ref": "/_100554_/l2/pluginBaseIndex.js",
        "dependencies": [
          {
            "name": "PluginBaseIndex",
            "type": "class"
          }
        ]
      }
    ]
  },
  "auth": {
    "use": [
      "*"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Registers a collection of UI widgets for use within the Collab.codes editor.",
      "businessCapabilities": [
        "Provides a set of UI widgets for content creation and data input within the editor.",
        "Extends base plugin functionality to register editor menus."
      ],
      "technicalCapabilities": [
        "Registers plugin menus for widget categories.",
        "Extends `PluginBaseIndex` for core plugin functionality."
      ],
      "implementedFeatures": [
        "Widget registration for Text, Image, Code, Video, Section, Divider, Button Submit, Chart, Column, Input Number, Input Text, Input Number Range, Input Number With Buttons, Row, Select One, and Table Select components."
      ]
    }
  }
}
    
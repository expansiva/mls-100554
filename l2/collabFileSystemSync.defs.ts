/// <mls fileReference="_100554_/l2/collabFileSystemSync.defs.ts" enhancement="_blank" />

// Do not change - automatically generated code.

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabFileSystemSync.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {},
  "asIs": {
    "semantic": {
      "generalDescription": "Manual sync engine for comparing mls.stor browser files with a selected local folder.",
      "businessCapabilities": [
        "Review project differences before writing to the local filesystem",
        "Pull browser project files to a local folder"
      ],
      "technicalCapabilities": [
        "Validates the first folder link",
        "Builds local/browser diff state",
        "Writes browser files to the selected local folder",
        "Updates .collab-fs.json"
      ],
      "implementedFeatures": [
        "First link validation",
        "Manual scan",
        "Line diff generation",
        "Pull to FS",
        "Manifest update"
      ]
    }
  }
}

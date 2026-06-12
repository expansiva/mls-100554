/// <mls fileReference="_100554_/l2/collabFileSystemAccess.defs.ts" enhancement="_blank" />

// Do not change - automatically generated code.

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabFileSystemAccess.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {},
  "asIs": {
    "semantic": {
      "generalDescription": "Adapter for browser File System Access API operations used by Local FS sync.",
      "businessCapabilities": [
        "Allow Studio to access a user-selected local folder"
      ],
      "technicalCapabilities": [
        "Selects a writable directory",
        "Persists directory handles in IndexedDB",
        "Reads, writes and removes files inside the selected directory"
      ],
      "implementedFeatures": [
        "Directory picker",
        "IndexedDB handle storage",
        "Text file read and write",
        "Controlled file deletion"
      ]
    }
  }
}

/// <mls fileReference="_100554_/l2/serviceCollabFileSystem.defs.ts" enhancement="_blank" />

// Do not change - automatically generated code.

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceCollabFileSystem.ts",
    "componentType": "service",
    "componentScope": "editor",
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
            "name": "state",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          },
          {
            "name": "IService",
            "type": "interface"
          },
          {
            "name": "IToolbarContent",
            "type": "interface"
          },
          {
            "name": "IServiceMenu",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabFileSystemAccess.js",
        "dependencies": [
          {
            "name": "CollabFsDirectoryHandle",
            "type": "type"
          },
          {
            "name": "FileSystemAccessAdapter",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabFileSystemSync.js",
        "dependencies": [
          {
            "name": "CollabFileSystemSync",
            "type": "class"
          },
          {
            "name": "CollabFsChange",
            "type": "type"
          },
          {
            "name": "CollabFsDiffLine",
            "type": "type"
          },
          {
            "name": "CollabFsScanResult",
            "type": "type"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service for manually synchronizing the opened Studio project with a local filesystem folder.",
      "businessCapabilities": [
        "Link a local folder to the opened project",
        "Scan local filesystem differences",
        "Pull browser project files to the local filesystem"
      ],
      "technicalCapabilities": [
        "Uses File System Access API",
        "Stores directory handles in IndexedDB",
        "Stores lightweight preferences in localStorage",
        "Reads browser content from mls.stor and open mls.editor models",
        "Emits mls.events notifications after Pull to FS"
      ],
      "implementedFeatures": [
        "L5 left service registration",
        "Folder selection",
        "Automatic scan on service entry",
        "Change list",
        "Diff details",
        "Pull to FS"
      ]
    }
  }
}

/// <mls fileReference="_100554_/l2/libProviders.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/libProviders.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "svg",
            "type": "function"
          }
        ]
      }
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "codeInsights": {
    "securityWarnings": [
      "Hardcoded OAuth client IDs and secrets in code"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Library for OAuth provider login functions",
      "businessCapabilities": [
        "Enable login via GitHub",
        "Enable login via GitLab",
        "Enable login via Google"
      ],
      "technicalCapabilities": [
        "Generate OAuth authorization URLs",
        "Check provider connection status",
        "Provide SVG icons for providers"
      ],
      "implementedFeatures": [
        "gitHubLogin",
        "gitLabLogin",
        "googleLogin",
        "isProviderConnected",
        "googleIcon",
        "githubIcon",
        "gitlabIcon",
        "generateRandomState",
        "verifyDisconnect",
        "getState"
      ]
    }
  }
}
    
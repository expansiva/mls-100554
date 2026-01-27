/// <mls fileReference="_100554_/l2/libProviders.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/libProviders.ts",
    "componentType": "other",
    "componentScope": "appFrontEnd",
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
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "OAuth login providers library",
      "businessCapabilities": [
        "OAuth authentication for GitHub",
        "OAuth authentication for GitLab",
        "OAuth authentication for Google"
      ],
      "technicalCapabilities": [
        "Generate random state for OAuth",
        "Redirect to OAuth URLs",
        "Check provider connection status",
        "Render SVG icons"
      ],
      "implementedFeatures": [
        "gitHubLogin function",
        "gitLabLogin function",
        "googleLogin function",
        "isProviderConnected function",
        "googleIcon function",
        "githubIcon function",
        "gitlabIcon function"
      ]
    }
  }
}
    
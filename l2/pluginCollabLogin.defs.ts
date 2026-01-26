/// <mls fileReference="_100554_/l2/pluginCollabLogin.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCollabLogin.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-collab-login-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "constant"
          },
          {
            "name": "css",
            "type": "constant"
          },
          {
            "name": "svg",
            "type": "constant"
          },
          {
            "name": "TemplateResult",
            "type": "type"
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {},
  "asIs": {
    "semantic": {
      "generalDescription": "A plugin for Collab.codes enabling user authentication via Google, GitHub, and GitLab, with internationalization support.",
      "businessCapabilities": [
        "User authentication via Google",
        "User authentication via GitHub",
        "User authentication via GitLab",
        "User logoff",
        "Display connection status for authentication providers",
        "Internationalization for login messages"
      ],
      "technicalCapabilities": [
        "Renders a login user interface using Lit",
        "Handles OAuth2 authentication flows for Google, GitHub, and GitLab",
        "Manages session state using cookies and local storage",
        "Generates random states for OAuth security",
        "Provides SVG icons for login providers"
      ],
      "implementedFeatures": [
        "Google Sign-In, Connect, and Disconnect functionality",
        "GitHub Sign-In, Connect, and Disconnect functionality",
        "GitLab Sign-In, Connect, and Disconnect functionality",
        "Logoff functionality",
        "Dynamic language selection for UI text",
        "Display of Terms of Service and Privacy Policy links"
      ],
      "constraints": [
        "Requires 'mls.cbe.Provider', 'mls.l0.providersConnected', and 'mls.api.common.getCookie' to be available in the global 'mls' object",
        "Relies on specific hardcoded OAuth client IDs and redirect URIs",
        "Assumes 'collab.codes' as the redirect URI for OAuth flows"
      ]
    }
  }
}
    
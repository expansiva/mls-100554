/// <mls fileReference="_100554_/l2/designSystem.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/designSystem.ts",
    "componentType": "other",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "IDesignSystemTokens",
            "type": "interface"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Design system tokens definition file containing two theme configurations (Default and Natal) using the ROLE-BASED color vocabulary of _102029_/l2/designSystemBase.ts (MANDATORY_COLOR_ROLES / DEFAULT_TOKENS_TEMPLATE): 44 color roles x 4 states, plus global variables and typography settings",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Theme token management",
        "Color palette definition",
        "Typography system configuration",
        "Responsive breakpoint definition",
        "Spacing system configuration",
        "Transition timing configuration",
        "Dark mode color variant support"
      ],
      "implementedFeatures": [
        "Default theme with the role-based color system: surfaces (page-bg, surface-bg, surface-alt-bg, input-bg), text (text-strong, text-default, text-muted), borders (border-default, border-subtle), actions (button-primary-*, button-secondary-*, button-danger-*), link-text, focus-ring, selection (selected-*), status pairs (status-success/error/warning/info/neutral with matching -bg and -text), navigation (nav-*), overlay-backdrop-bg, tooltip-* and chart-series-1..6 — each with -hover, -focus and -disabled variants",
        "Natal theme with the same role vocabulary in its red/green brand values",
        "Global design tokens for breakpoints, transitions, spacing, border radius (radius-*) and elevation (shadow-*)",
        "Typography system with font families, sizes, line heights, and weights",
        "Dark mode color variants prefixed with _dark- for every color key of the Default theme"
      ],
      "constraints": [
        "Color values are hardcoded as hex strings",
        "Spacing and font sizes use calc() with base unit references (@space-base-unit, @font-base-unit, @line-height-base-unit) that may require preprocessor/variable substitution",
        "The Natal theme has no _dark- twins, as it never had them in the family-based model",
        "transition-slow/normal/fast keep the project's original (inverted) values; the correction lives only in the _102029_ template and is not propagated per project",
        "Color keys are ordered with all light keys first, then all _dark- keys",
        "No runtime theme switching logic implemented in this file"
      ]
    }
  }
}

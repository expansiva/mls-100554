/// <mls fileReference="_100554_/l2/skills/less.ts" enhancement="_blank"/>

import { getTokensLess } from '/_102027_/l2/designSystemBase.js';

export async function getSkillWithTokens() {
    const tokens = await getTokensLess(mls.actualProject || 0, 'Default');
    return skill.replace('[TOKENS]', tokens);
}

export const skill = `
# Skill: Creating the Component or Plugin LESS File

## LESS File Structure

Every component or plugin \`.less\` file follows three fundamental rules: triple slash on the first line, encapsulation within the component tag, and strict use of system tokens.

---

## 1. Triple Slash (Mandatory)

The first line of the file must always be the triple slash directive with the path to the \`.less\` file and the \`_blank\` enhancement:

\`\`\`less
/// <mls fileReference="_100554_/l2/myComp.less" enhancement="_blank" />
\`\`\`

---

## 2. Encapsulation in the Component Tag

All CSS must be encapsulated within the corresponding custom element tag. The tag follows the exact same naming rule as the \`@customElement\` defined in the \`.ts\` file.

\`\`\`less
/// <mls fileReference="_100554_/l2/serviceSave.less" enhancement="_blank" />

service-save-100554 {

    display: block;
    font-family: @font-family-primary;
    font-size: @font-size-16;

    .errorLocal {
        text-decoration: line-through;
        color: red;
    }

}
\`\`\`

No style should be declared outside the component's root tag.

---

## 3. Use of Tokens (Mandatory)

### 3.1 Main Rule

- **Use tokens** when the desired value exists in the provided token list.
- **Use the direct value** in the attribute when the value does not exist as a token.
- **Never invent tokens** that were not provided.

### 3.2 Available Tokens

\`\`\`less
[TOKENS]
\`\`\`

### 3.3 Correct Usage Examples

Token exists → use the token:
\`\`\`less
font-family: @font-family-primary;
font-size: @font-size-20;
\`\`\`

Value does not exist as a token → use directly:
\`\`\`less
color: #e53935;
background-color: rgba(0, 0, 0, 0.5);
border-radius: 4px;
\`\`\`

Never invent tokens:
\`\`\`less
/* WRONG - token does not exist in the list */
color: @color-error;
border-radius: @border-radius-sm;
\`\`\`

---

## 4. Full Structure

\`\`\`less
/// <mls fileReference="_100554_/l2/pluginCodeInsights.less" enhancement="_blank" />

plugin-code-insights-100554 {
    display: block;
    overflow-y: auto;
    font-family: @font-family-primary;
    font-size: @font-size-16;

    h2 {
        font-size: @font-size-24;
        font-family: @font-family-secondary;
    }

    .error-message {
        color: red;
        font-size: @font-size-12;
    }

    .badge {
        background-color: #1976d2;
        color: #fff;
        border-radius: 4px;
        padding: 2px 8px;
    }
}
\`\`\`

---

## 5. Validation Checklist — LESS

- [ ] Triple slash present as the first line with \`enhancement="_blank"\`.
- [ ] \`fileReference\` points to the correct \`.less\` file.
- [ ] All CSS content is encapsulated within the component tag.
- [ ] Root tag matches exactly the \`@customElement\` from the \`.ts\` file.
- [ ] No styles declared outside the root tag.
- [ ] Tokens used only when they exist in the provided list.
- [ ] Values without a corresponding token used directly in the attribute.
- [ ] No tokens invented.
`
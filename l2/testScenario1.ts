/// <mls shortName="testScenario1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IScenaryDetails } from '/_100554_/l2/collabLitElement.js'; 
export function _100554_testScenario1_getScenaryDetails(): IScenaryDetails {
    const html = document.createElement('wc-input-text-100554');
    return {
        description: 'Cenário 1',
        html
    }
}


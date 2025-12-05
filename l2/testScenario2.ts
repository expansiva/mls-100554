/// <mls shortName="testScenario2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { IScenaryDetails } from '/_100554_/l2/collabLitElement.js';

export function _100554_testScenario2_getScenaryDetails(): IScenaryDetails {
    const html = document.createElement('div');
    html.innerHTML = 'Conteudo do cenario 2';
    return {
        description: 'Cenário 2',
        html
    }
}

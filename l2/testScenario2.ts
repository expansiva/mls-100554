/// <mls fileReference="_100554_/l2/testScenario2.ts" enhancement="_100554_/l2/enhancementLit" />
import { IScenaryDetails } from '/_100554_/l2/collabLitElement.js';

export function _100554_testScenario2_getScenaryDetails(): IScenaryDetails {
    const html = document.createElement('div');
    html.innerHTML = 'Conteudo do cenario 2';
    return {
        description: 'Cenário 2',
        html
    }
}

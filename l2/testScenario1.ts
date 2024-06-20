/// <mls shortName="testScenario1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

function _100554_testScenario1_getScenaryDetails(): IScenaryDetails {
    const html = document.createElement('wc-input-text-100554');
    return {
        description: 'Cenário 1',
        html
    }
}

interface IScenaryDetails {
    description: string,
    html: HTMLElement
}
/// <mls shortName="agentCreateNewPrototypeOrganismFeedback" project="100554" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getAgentStepByAgentName, } from "./_100554_aiAgentHelper";
import { StateLitElement } from './_100554_stateLitElement';
import { getTask } from './_100554_msgDBController';
import { selectLevel, openService } from './_100554_libCommom';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    agent1Title: 'Agente (1/3)',
    agent1PromptAnalysis: 'Análise do prompt',
    agent1PromptDefs: 'Preparando arquivo de definição',

    agent2Title: 'Agente (2/3)',
    agent2RequirementAnalysis: 'Analisando arquivo de definição',
    agent2Prepare: 'Criando organismo',

    agent3Title: 'Agente (3/3)',
    agent3StyleAnalysis: 'Analisando style',
    agent3ImprovingStyle: 'Melhorando style do organismo',
    agent3SeePage: 'Ver organismo',

    nextStepsTitle: 'Próximos passos',
    nextStepsMessage: 'O organismo foi criado agora você pode utiliza-lo em suas paginas ou fazer alterações para melhora-lo.'
};

const message_en = {
    loading: 'Loading...',
    agent1Title: 'Agent (1/3)',
    agent1PromptAnalysis: 'Prompt analysis',
    agent1PromptDefs: 'Preparing definition file',

    agent2Title: 'Agent (2/3)',
    agent2RequirementAnalysis: 'Analyzing definition file',
    agent2Prepare: 'Creating organism',

    agent3Title: 'Agent (3/3)',
    agent3StyleAnalysis: 'Analyzing style',
    agent3ImprovingStyle: 'Improving organism style',
    agent3SeePage: 'See organism',

    nextStepsTitle: 'Next steps',
    nextStepsMessage: 'The organism has been created, now you can use it in your pages or make changes to improve it.'
};

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    en: message_en,
    pt: message_pt
};
/// **collab_i18n_end**

@customElement('agent-create-new-prototype-organism-feedback-100554')
export class AgentCreateNewPrototypeOrganismFeedback100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @state() task?: mls.msg.TaskData;
    @state() agent1Running: boolean = false;
    @state() agent1Complete: boolean = false;

    @state() agent2Running: boolean = false;
    @state() agent2Complete: boolean = false;

    @state() agent3Running: boolean = false;
    @state() agent3Complete: boolean = false;

    async firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        // this.task = await getTask('20250925174013.1001');
    }

    updated(_changedProperties: Map<PropertyKey, unknown>) {
        super.updated(_changedProperties);
        if (_changedProperties.has('task')) {
            this.prepareState();
        }
    }


    private prepareState() {
        this.prepareAgentCreateNewPrototypeOrganism1();
        this.prepareAgentCreateNewPrototypeOrganism2();
        this.prepareAgentGenerateStyle();
    }

    private prepareAgentCreateNewPrototypeOrganism1() {
        if (!this.task) return;
        const agent1 = getAgentStepByAgentName(this.task, 'agentCreateNewPrototypeOrganism');
        if (!agent1) return;
        this.agent1Running = agent1.status === 'pending';
        if (agent1.status === 'completed') {
            this.agent1Complete = true;
        }
    }

    private prepareAgentCreateNewPrototypeOrganism2() {
        if (!this.task) return;
        const agent2 = getAgentStepByAgentName(this.task, 'agentCreateNewPrototypeOrganism2');
        const agent3 = getAgentStepByAgentName(this.task, 'agentGenerateStyle');

        if (!agent2) return;
        this.agent2Running = agent2.status === 'pending'
        if (agent2.status === 'completed' || (agent3 && agent3.status === 'pending')) {
            this.agent2Complete = true;
        }
    }

    private prepareAgentGenerateStyle() {
        if (!this.task) return;
        const agent3 = getAgentStepByAgentName(this.task, 'agentGenerateStyle');
        if (!agent3) return;
        this.agent3Running = agent3.status === 'pending';
        if (agent3.status === 'completed') {
            this.agent3Complete = true;
        }
    }

    private openPage() {
        if (!this.task) return;
        const pageMemory = this.task?.iaCompressed?.longMemory as any;
        const { project, shortName, folder } = pageMemory;
        if (!project || !shortName) return;
        let data: string = '';
        if (folder) {
            data = `_${project}_${folder}/${shortName}`;
            mls.setActualModule(folder);
        } else data = `_${project}_${shortName}`;

        const keyToStorFile = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
        const storFile = mls.stor.files[keyToStorFile];
        if (!storFile) return;

        mls.actual[3].setFullName(data);
        selectLevel(3);
        setTimeout(() => {
            openService('_100554_serviceOrganism', 'left', 3);
            openService('_100554_servicPreview', 'right', 3);

        }, 100);
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="feedback-section">
            <h3>${this.msg.agent1Title} ${this.agent1Running ? html`<span class="loader"></span>` : ''}</h3>
            <ul>
                <li>[ ${this.agent1Complete ? 'x' : ''} ] ${this.msg.agent1PromptAnalysis}</li>
                <li>[ ${this.agent1Complete ? 'x' : ''} ] ${this.msg.agent1PromptDefs}</li>
            </ul>

            <h3>${this.msg.agent2Title} ${this.agent2Running ? html`<span class="loader"></span>` : ''}</h3>
            <ul>
                <li>[ ${this.agent2Complete ? 'x' : ''} ] ${this.msg.agent2RequirementAnalysis}</li>
                <li>[ ${this.agent2Complete ? 'x' : ''} ] ${this.msg.agent2Prepare}</li>

            </ul>

            <h3>${this.msg.agent3Title} ${this.agent3Running ? html`<span class="loader"></span>` : ''}</h3>
            <ul>
                <li>[ ${this.agent3Complete ? 'x' : ''} ] ${this.msg.agent3StyleAnalysis}</li>
                <li>[ ${this.agent3Complete ? 'x' : ''} ] ${this.msg.agent3ImprovingStyle}
                    ${this.agent3Complete ? html`
                    <a
                        href="#"
                        @click=${(e: MouseEvent) => {
                    e.preventDefault();
                    this.openPage()
                }} >
                        ${this.msg.agent3SeePage}
                    </a>` : ''}
                
                </li>
            </ul>

            <h3> ${this.msg.nextStepsTitle}</h3>
            <span>${this.msg.nextStepsMessage}</span>
        
        </section>
    `;
    }

}

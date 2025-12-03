/// <mls shortName="servicePrompt" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';

@customElement('service-prompt-100554')
export class ServicePrompt100554 extends ServiceBase {
    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Service Example',
        visible: true,
        widget: '_100554_servicePrompt',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: undefined,
        tools: {},
        onClickMain: undefined
    }

    private uploadSvg = svg`<svg width=20 height=20 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>`

    private chat = svg`<svg xmlns="http://www.w3.org/2000/svg" width=20 height=20 viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z"/></svg>`

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @state() data: IIAPrompts[] = [
        {
            prompt: 'Resuma o artigo sobre mudanças climáticas.',
            status: 'finalized',
            result: [
                {
                    type: 'result',
                    status: 'finalized',
                    price: 0.00001,
                    result: 'O artigo descreve os principais efeitos das mudanças climáticas e propõe soluções baseadas em energia renovável.'
                }
            ]
        },
        
        {
            prompt: 'Gerar uma imagem de um castelo medieval à noite.',
            status: 'in-process',
            result: [{
                type: 'tool',
                toolName: 'ImageGenerator',
                status: 'in-process',
                args: JSON.stringify({ prompt: 'Castelo medieval à noite com céu estrelado', resolution: '800x600' })
            }]
        },
        {
            prompt: 'Crie uma introdução para meu artigo sobre IA.',
            status: 'canceled',
            result: [{
                type: 'agent',
                agentName: 'TextWizard',
                taskTitle: 'Criar introdução',
                prompt: 'Crie uma introdução para um artigo acadêmico sobre os impactos positivos da IA na educação.',
                status: 'canceled',
                price: 0.00,
                rags: null
            }]
        },
        {
            prompt: 'Quais são os próximos passos do projeto?',
            status: 'waiting',
            result: [{
                type: 'clarification',
                status: 'waiting',
                clarificationMessage: 'Você gostaria de ver os passos técnicos ou os de planejamento?',
                htmlForm: '<form><select name="tipo"><option value="tecnico">Técnico</option><option value="planejamento">Planejamento</option></select></form>'
            }]
        },
        {

            prompt: 'me ajude a criar um jogo de xadrez para web que permita dois jogadores',
            status: 'waiting',
            result: [{
                type: "clarification",
                status: 'finalized',
                clarificationMessage: "Vamos precisar de mais detalhes para planejar seu jogo de xadrez. Por favor, especifique:",
                htmlForm: `
                <form id='chessGameDetails'>
                    <div style='display: grid; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;'>
                        <div>
                            <label>Recursos necessários:</label>
                            <div style='display: grid; gap: 0.5rem; margin-top: 0.5rem;' >
                                <label> <input type='checkbox' name = 'features' value='movement'> Validação de movimentos básicos</label >
                                <label> <input type='checkbox' name = 'features' value = 'check'> Detecção de xeque / xeque - mate </label>
                                <label> <input type='checkbox' name = 'features' value = 'history'> Histórico de jogadas </label>
                                <label> <input type='checkbox' name = 'features' value = 'timer' > Temporizador de partida </label>
                                <label> <input type='checkbox' name = 'features' value = 'multiplayer' > Multiplayer online </label>
                            </div>
                        </div>
                    <div >
                    <label>Tecnologias preferidas: </label>
                    <select name = 'tech' style = 'margin-top: 0.5rem; width: 100%; padding: 0.5rem;'>
                        <option value='any' > Qualquer tecnologia </option>
                        <option value = 'react' > React + Node.js </option>
                        <option value = 'vue' > Vue.js + Firebase </option>
                        <option value = 'vanilla' > JavaScript Vanilla </option>
                    </select>
                    </div>
                    <div>
                        <label>Deseja sistema de autenticação de usuários ? </label>
                        <select name = 'auth' style = 'margin-top: 0.5rem; width: 100%; padding: 0.5rem;'>
                            <option value='no' > Não necessário </option>
                            <option value = 'yes' > Sim, com login básico </option>
                            <option value = 'social' > Sim, com login social(Google / Facebook) </option>
                        </select>
                    </div>
                </div>
            </form>`
            },
            {

                type: "agent",
                status: 'waiting',
                agentName: "agentPlannerNewProject",
                taskTitle: "Planejamento de Jogo de Xadrez Online",
                prompt: "Requisitos do sistema:\n\n1. **Regras do Jogo**\n- Validação de movimentos básicos para todas as peças\n- Detecção de xeque e xeque-mate\n- Histórico de jogadas em notação algébrica\n\n2. **Multiplayer Online**\n- Sistema de salas para partidas PvP\n- Comunicação em tempo real (WebSocket)\n- Identificação anônima sem login\n\n3. **Interface Web**\n- Tabuleiro interativo com arrastar-e-soltar\n- Painel lateral com histórico de jogadas\n- Indicadores de status do jogo (vez atual, xeque)\n\n4. **Requisitos Técnicos**\n- Tecnologia frontend (HTML5/CSS3/JavaScript)\n- Backend para gestão de partidas (Node.js/Python)\n- Banco de dados para persistência de partidas em andamento",
                "rags": ["rag1"]

            }
            ]
        }
    ];

    @state() promptValue: string = '';
    @state() selectedPromptIndex: number | null = null;
    @state() filterStatus: TStatus | 'all' = 'all';
    @state() currentPage: number = 0;
    private itemsPerPage: number = 5;

    private handleInputChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.promptValue = target.value;
    }

    private handleCardClick(index: number) {
        this.selectedPromptIndex = index;
    }

    private goBackToList() {
        this.selectedPromptIndex = null;
    }

    private handleFilterChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.filterStatus = target.value as TStatus | 'all';
        this.currentPage = 0;
    }

    private handlePageChange(direction: 'next' | 'prev') {
        if (direction === 'next' && (this.currentPage + 1) * this.itemsPerPage < this.data.length) {
            this.currentPage++;
        } else if (direction === 'prev' && this.currentPage > 0) {
            this.currentPage--;
        }
    }

    render() {
        if (this.selectedPromptIndex !== null) {
            const card = this.data[this.selectedPromptIndex];
            return html`
      <div class="card-details">
        <button @click=${this.goBackToList}>← Voltar</button>
        <h2>${card.prompt}</h2>
        <div class="status ${card.status}">${card.status}</div>

        ${card.result.map(
                (result, index) => html`
                <details class="card-details-item">
                    <summary>${result.type}</summary>
                    ${this.renderDetails(result)}
                </details>
            `
            )}
      </div>
    `;
        }

        const filteredData = this.filterStatus === 'all' ? this.data : this.data.filter(card => card.status === this.filterStatus);
        const paginatedData = filteredData.slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);
        const totalPages = Math.ceil(filteredData.length / this.itemsPerPage);

        return html`
    <div class="prompt-container">
      <textarea
        type="text"
        .value=${this.promptValue}
        @input=${this.handleInputChange}
        placeholder="Pergunte alguma coisa..."
        >
      </textarea>
      <div class="prompt-action">
        <button>${this.uploadSvg}</button>
        <button>Enviar</button>
      </div>
    </div>

    <div class="filter-container">
      <label for="statusFilter">Filtrar por status:</label>
      <select id="statusFilter" @change=${this.handleFilterChange}>
        <option value="all">Todos</option>
        <option value="in-process">Em processo</option>
        <option value="canceled">Cancelado</option>
        <option value="finalized">Finalizado</option>
        <option value="waiting">Aguardando</option>
      </select>
    </div>

    <div class="prompts-results-container">
        ${paginatedData.map(
            (card, index) => html`
        <div class="card" @click=${() => this.handleCardClick(index + this.currentPage * this.itemsPerPage)}>
          ${this.chat}
          <span>${card.prompt}</span>
          <div class="status ${card.status}">${card.status}</div>
        </div>
      `
        )}
    </div>

    <div class="pagination-controls">
      <button @click=${() => this.handlePageChange('prev')} ?disabled=${this.currentPage === 0}>Anterior</button>
      <span>${this.currentPage + 1}/${totalPages}</span>
      <button @click=${() => this.handlePageChange('next')} ?disabled=${(this.currentPage + 1) * this.itemsPerPage >= filteredData.length}>Próximo</button>
    </div>
  `;
    }

    private renderDetails(result: Interaction) {
        switch (result.type) {
            case 'agent':
                return html`
        <p><strong>Agente:</strong> ${result.agentName}</p>
        <p><strong>Tarefa:</strong> ${result.taskTitle}</p>
        <p><strong>Prompt:</strong> ${result.prompt}</p>
        <p><strong>RAGs:</strong> ${result.rags?.join(', ') || 'Nenhum'}</p>
      `;
            case 'tool':
                return html`
        <p><strong>Ferramenta:</strong> ${result.toolName}</p>
        <p><strong>Argumentos:</strong> <pre>${result.args}</pre></p>
      `;
            case 'clarification':
                return html`
        <p><strong>Esclarecimento:</strong> ${result.clarificationMessage}</p>
        ${result.htmlForm ? html`<div .innerHTML=${result.htmlForm}></div> <button>Enviar<button>` : ''}
      `;
      
            case 'result':
                return html`
        <p><strong>Resultado:</strong> ${result.result}</p>
      `;
            default:
                return html`<p>Tipo de resultado desconhecido.</p>`;
        }
    }
}

interface IIAPrompts {
    prompt: string,
    status: TStatus,
    result: Interaction[]
}

type TStatus = 'in-process' | 'canceled' | 'finalized' | 'waiting';
type TType = 'agent' | 'tool' | 'clarification' | 'result';

type Interaction =
    | AgentInteraction
    | ToolInteraction
    | ClarificationInteraction
    | ResultInteraction;

interface ITollResponseBase {
    status: TStatus,
    price?: number
}

interface AgentInteraction extends ITollResponseBase {
    type: 'agent',
    agentName: string;
    taskTitle: string;
    prompt: string;
    rags: string[] | null;
}

interface ToolInteraction extends ITollResponseBase {
    type: 'tool',
    toolName: string;
    args: string;
}

interface ClarificationInteraction extends ITollResponseBase {
    type: 'clarification',
    clarificationMessage: string;
    htmlForm?: string;
}

interface ResultInteraction extends ITollResponseBase {
    type: 'result',
    result: string;
}
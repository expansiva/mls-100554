/// <mls shortName="wcClarificationAnalyzeNewModule1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { postBackClarification } from "./_100554_aiAgentOrchestration";
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    cancel: 'Cancelar Task',
    continue: 'Continuar',
    goalPrincipal: 'Objectivo principal',
    entitities: 'Entidades',
    features: 'Características',
    openQuestions: 'Questões abertas',
    constraints: 'Restrições',
    stylePreferences: 'Preferências de estilo',
    brandPersonality: 'Personalidade da Marca',
    toneOfVoice: 'Tom de Voz',
    userPrompt: 'Prompt de alteração',
    sincerityI: 'Frio',
    excitementI: 'Calmo',
    competenceI: 'Amador',
    sophisticationI: 'Simples',
    ruggednessI: 'Leve',
    funny_seriousI: 'Divertido',
    formal_casualI: 'Formal',
    respectful_irreverentI: 'Respeitoso',
    enthusiastic_matterOfFactI: 'Entusiasmado',
    sincerityF: 'Acolhedor',
    excitementF: 'Vibrante',
    competenceF: 'Profissional',
    sophisticationF: 'Elegante',
    ruggednessF: 'Forte',
    funny_seriousF: 'Sério',
    formal_casualF: 'Casual',
    respectful_irreverentF: 'Irreverente',
    enthusiastic_matterOfFactF: 'Neutro',
    promptDesc: 'Digite o prompt para ser reavaliado, esta clarificação será enviado novamente após o processamento'
}

const message_en = {
    loading: 'Loading...',
    cancel: 'Cancel Task',
    continue: 'Continue',
    goalPrincipal: 'Main Goal',
    entitities: 'Entities',
    features: 'Features',
    openQuestions: 'Open Questions',
    constraints: 'Constraints',
    stylePreferences: 'Style Preferences',
    brandPersonality: 'Brand Personality',
    toneOfVoice: 'Tone of Voice',
    userPrompt: 'Change Request',
    sincerityI: 'Cold',
    excitementI: 'Calm',
    competenceI: 'Amateur',
    sophisticationI: 'Plain',
    ruggednessI: 'Light',
    funny_seriousI: 'Funny',
    formal_casualI: 'Formal',
    respectful_irreverentI: 'Respectful',
    enthusiastic_matterOfFactI: 'Enthusiastic',
    sincerityF: 'Warm',
    excitementF: 'Vibrant',
    competenceF: 'Professional',
    sophisticationF: 'Elegant',
    ruggednessF: 'Strong',
    funny_seriousF: 'Serious',
    formal_casualF: 'Casual',
    respectful_irreverentF: 'Irreverent',
    enthusiastic_matterOfFactF: 'Neutral',
    promptDesc: 'Enter the prompt to be re-evaluated, this clarification will be sent again after processing'

}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('wc-clarification-analyze-new-module1-100554')
export class WcClarificationPlannerNewWidget100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @property() data?: ClarificationData;

    @property({ type: Boolean, reflect: true }) develpoment?: boolean = false;

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.develpoment) this.setDevelpoment();
        if (!this.data) return html`No data finded`;

        return html`
        <div>
            ${Object.keys(this.data.json).map((key) => {
            switch (key) {
                case 'goal':
                    return this.renderGoal(this.data?.json.goal || '');
                case 'entities':
                    return this.renderEntities(this.data?.json.entities || []);
                case 'features':
                    return this.renderFeatures(this.data?.json.features || []);
                case 'openQuestions':
                    return this.renderOpenQuestions(this.data?.json.openQuestions || []);
                case 'stylePreferences':
                    return this.renderStylePreferences(this.data?.json.stylePreferences);
                case 'constraints':
                    return this.renderConstraints(this.data?.json.constraints || []);
            }
        })}
            ${this.renderPromptUser()}
            <div class="buttons">
                <button class="cancel" @click=${this.handleCancel}>${this.msg.cancel}</button>
                <button class="continue" @click=${this.handleOk}>${this.msg.continue}</button>
            </div>

        </div>`;
    }

    private renderGoal(goal: string) {
        return html`
            <div class="section">
                <h2 class="title">${this.msg.goalPrincipal}</h2>
                <p class="desc">${goal}</p>
            </div>
        `
    }

    private renderEntities(entities: Record<string, any>[]) {
        return html`
            <div class="section entities">
                <h3>${this.msg.entitities}</h3>
                <form>  
                    ${entities.map((entitie, index) => html`
                        <input
                            type="text"
                            .value="${entitie.name}" 
                            @input=${(e: MouseEvent) => this.handleEntetiesNameInput(e, index)}
                        /input>

                        <textarea
                            @input=${(e: MouseEvent) => this.handleEntetiesValueInput(e, index)}
                            .value=${entitie.fields.join(', ')}
                        >
                            
                        </textarea>

                    `)}
                </form>     
            </div>
        `
    }

    private renderFeatures(features: string[]) {
        return html`
            <div class="section">
                <h3>${this.msg.features}</h3>
                <textarea
                    rows=${features.length}
                    .value = "- ${features.join('\n -')}"
                    @input=${(e: MouseEvent) => this.handleFeaturesInput(e, features)}
                    >
                </textarea>
            </div>
        `
    }

    private renderOpenQuestions(openQuestions: OpenQuestion[]) {
        return html`
            <div class="section">
                <h3>${this.msg.openQuestions}</h3>
                <form>  
                    ${openQuestions.map((q, index) => html`
                        <div class="question">
                            <span>${q.question}</span>

                            <textarea
                                @input=${(e: MouseEvent) => this.handleOpenQuestionsInput(e, index)}
                            >    
                            </textarea>
                        </div>

                    `)}
                </form>  
            </div>
        `
    }

    private renderConstraints(constraints: string[]) {
        return html`
            <div class="section">
                <h3>${this.msg.constraints}</h3>
                <textarea
                    rows=${constraints.length}
                    .value = "- ${constraints.join('\n -')}"
                    @input=${(e: MouseEvent) => this.handleConstraintsInput(e, constraints)}
                    >
                </textarea>
            </div>
        `
    }

    private renderStylePreferences(preferences: StylePreferences | undefined) {
        if (!preferences) return html``;

        const keyInitial: Record<string, string> = {
            sincerity: this.msg.sincerityI,
            excitement: this.msg.excitementI,
            competence: this.msg.competenceI,
            sophistication: this.msg.sophisticationI,
            ruggedness: this.msg.ruggednessI,
            funny_serious: this.msg.funny_seriousI,
            formal_casual: this.msg.formal_casualI,
            respectful_irreverent: this.msg.respectful_irreverentI,
            enthusiastic_matterOfFact: this.msg.enthusiastic_matterOfFactI,
        }

        const keyFinal: Record<string, string> = {
            sincerity: this.msg.sincerityF,
            excitement: this.msg.excitementF,
            competence: this.msg.competenceF,
            sophistication: this.msg.sophisticationF,
            ruggedness: this.msg.ruggednessF,
            funny_serious: this.msg.funny_seriousF,
            formal_casual: this.msg.formal_casualF,
            respectful_irreverent: this.msg.respectful_irreverentF,
            enthusiastic_matterOfFact: this.msg.enthusiastic_matterOfFactF,
        }

        return html`
            <div class="section style-preferences">
                <h3>${this.msg.stylePreferences}</h3>

                <h4>${this.msg.brandPersonality}</h4>
                ${Object.keys(preferences.brandPersonality).map((key) => {
            return html`
                        <div class="slider-row">
                            <div class="slider-title">${key}</div>
                            <div class="slider-wrap">
                                <span class="slider-label">${keyInitial[key]}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    @change=${(e: MouseEvent) => this.handleBrandPersonalityChange(e, key)}
                                    .value="${preferences.brandPersonality[key as keyof BrandPersonality].value}" 
                                />
                                <span class="slider-label">${keyFinal[key]}</span>
                            </div>
                            <small class="desc">${preferences.brandPersonality[key as keyof BrandPersonality].description}</small>
                        </div>`
        })}

                <h4>${this.msg.toneOfVoice}</h4>
                ${Object.keys(preferences.toneOfVoice).map((key) => {
            return html`
                        <div class="slider-row">
                            <div class="slider-title">${key}</div>
                            <div class="slider-wrap">
                                <span class="slider-label">${keyInitial[key]}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    @change=${(e: MouseEvent) => this.handleToneOfVoiceChange(e, key)}
                                    .value="${preferences.toneOfVoice[key as keyof ToneOfVoice].value}" 
                                />
                                <span class="slider-label">${keyFinal[key]}</span>
                            </div>
                            <small class="desc">${preferences.toneOfVoice[key as keyof ToneOfVoice].description}</small>
                        </div>`
        })}

            </div>
        `
    }

    private renderPromptUser() {
        return html`
            <div class="section">
                <h2 class="title">${this.msg.userPrompt}</h2>
                <textarea
                    rows=5
                    @input=${(e: MouseEvent) => this.handlePromptUserInput(e)}
                    >
                </textarea>
                <p class="desc">${this.msg.promptDesc}</p>
            </div>
        `
    }

    private handlePromptUserInput(e: MouseEvent) {
        if (!this.data) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.promptUser = target.value.trim();
    }

    private handleFeaturesInput(e: MouseEvent, item: string[]) {
        if (!this.data || !this.data.json || !this.data.json.features) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.features = target.value.trim().split('\n');
    }

    private handleConstraintsInput(e: MouseEvent, item: string[]) {
        if (!this.data || !this.data.json || !this.data.json.constraints) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.constraints = target.value.trim().split('\n');
    }

    private handleEntetiesNameInput(e: MouseEvent, index: number) {
        if (!this.data || !this.data.json || !this.data.json.entities) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.entities[index].name = target.value.trim()
    }

    private handleEntetiesValueInput(e: MouseEvent, index: number) {
        if (!this.data || !this.data.json || !this.data.json.entities) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.entities[index].fields = target.value.trim().split(',').map(f => f.trim())
    }

    private handleOpenQuestionsInput(e: MouseEvent, index: number) {
        if (!this.data || !this.data.json || !this.data.json.openQuestions) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.openQuestions[index].userResponse = target.value.trim();
    }

    private handleBrandPersonalityChange(e: MouseEvent, key: string) {
        if (!this.data || !this.data.json || !this.data.json.stylePreferences.brandPersonality) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.stylePreferences.brandPersonality[key as keyof BrandPersonality].value = +target.value.trim();
    }

    private handleToneOfVoiceChange(e: MouseEvent, key: string) {
        if (!this.data || !this.data.json || !this.data.json.stylePreferences.toneOfVoice) throw new Error('Missing keys in json');
        const target = e.target as HTMLTextAreaElement;
        this.data.json.stylePreferences.toneOfVoice[key as keyof ToneOfVoice].value = +target.value.trim();
    }

    private handleCancel() {
        this.handleAction('cancel');
    }

    private handleOk() {
        this.handleAction('continue');
    }

    private async handleAction(action: 'cancel' | 'continue') {
        if (!this.data) return;
        console.info(this.data);
        await postBackClarification(action, this.data);
    }

    private setDevelpoment() {
        this.data = {
            clarificationMessage: '',
            stepId: 123,
            taskId: '123',
            promptUser: '',
            json: {
                goal: "Desenvolver um site para um petshop que apresente os produtos e serviços oferecidos, facilite o contato com clientes e possibilite vendas online.",
                entities: [
                    { name: "Produto", fields: ["nome", "descrição", "preço", "categoria", "imagem", "estoque"] },
                    { name: "Serviço", fields: ["nome", "descrição", "preço", "duração", "imagem"] },
                    { name: "Cliente", fields: ["nome", "email", "telefone", "endereço", "senha"] },
                    { name: "Pedido", fields: ["cliente", "produtos", "quantidade", "valor total", "status", "data"] },
                    { name: "Contato", fields: ["nome", "email", "mensagem", "data"] }
                ],
                features: [
                    "Catálogo de produtos com busca e filtros",
                    "Página de serviços oferecidos (banho, tosa, consulta veterinária, etc.)",
                    "Carrinho de compras e finalização de pedidos",
                    "Cadastro e login de clientes",
                    "Formulário de contato",
                    "Página institucional (sobre o petshop, missão, valores)",
                    "Integração com meios de pagamento",
                    "Área administrativa para gestão de produtos, serviços e pedidos"
                ],
                openQuestions: [
                    { id: "q1", question: "O site deverá permitir agendamento online de serviços (banho, tosa, consultas)?", userResponse: "você decide" },
                    { id: "q2", question: "Quais métodos de pagamento serão aceitos (cartão, boleto, Pix)?", userResponse: "você decide" },
                    { id: "q3", question: "O site terá integração com redes sociais ou chat online?", userResponse: "você decide" },
                    { id: "q4", question: "Haverá programa de fidelidade ou descontos promocionais?", userResponse: "você decide" },
                    { id: "q5", question: "O site será apenas informativo ou terá e-commerce completo?", userResponse: "você decide" }
                ],
                constraints: [
                    "Deve ser responsivo para dispositivos móveis",
                    "Deve garantir segurança dos dados dos clientes",
                    "Deve ser fácil de atualizar (produtos, serviços, promoções)",
                    "Possível integração com sistemas de estoque ou ERP"
                ],
                stylePreferences: {
                    brandPersonality: {
                        sincerity: {
                            value: 85,
                            description: "Indicates warmth, honesty, and trust. High values suggest soft colors, friendly language, and empathetic tone."
                        },
                        excitement: {
                            value: 60,
                            description: "Measures energy and boldness. Higher values lead to vibrant palettes, fast animations, and youthful aesthetics."
                        },
                        competence: {
                            value: 80,
                            description: "Reflects professionalism and efficiency. High scores imply clean layout, technical precision, and trustworthy tone."
                        },
                        sophistication: {
                            value: 40,
                            description: "Captures elegance and exclusivity. Higher values suggest premium feel, serif fonts, generous spacing, and refined visuals."
                        },
                        ruggedness: {
                            value: 30,
                            description: "Conveys strength and robustness. High values suggest bold fonts, textured backgrounds, and strong visual contrast."
                        }
                    },
                    toneOfVoice: {
                        funny_serious: {
                            value: 30,
                            description: "Low values use humor and playfulness; high values use a formal, authoritative tone in texts and CTAs."
                        },
                        formal_casual: {
                            value: 70,
                            description: "Controls the vocabulary and sentence structure. Low = formal and structured; high = relaxed and conversational."
                        },
                        respectful_irreverent: {
                            value: 20,
                            description: "Defines politeness level. Low = traditional and polite; high = informal, bold, possibly sarcastic copy."
                        },
                        enthusiastic_matterOfFact: {
                            value: 60,
                            description: "Low values are objective and neutral; high values use expressive, motivational tone and dynamic CTAs."
                        }
                    }
                }

            }

        }
    }

}

interface ClarificationData {
    json: ClarificationJson,
    taskId: string,
    stepId: number,
    clarificationMessage: string,
    promptUser: string,
}

interface ClarificationJson {
    goal: string;
    entities: Entity[];
    features: string[];
    openQuestions: OpenQuestion[];
    constraints: string[];
    stylePreferences: StylePreferences
}

interface Entity {
    name: string;
    fields: string[];
}

interface OpenQuestion {
    id: string;
    question: string;
    userResponse: string;
}

interface StyleAttribute {
    value: number;
    description: string;
}

interface BrandPersonality {
    sincerity: StyleAttribute;
    excitement: StyleAttribute;
    competence: StyleAttribute;
    sophistication: StyleAttribute;
    ruggedness: StyleAttribute;
}

interface ToneOfVoice {
    funny_serious: StyleAttribute;
    formal_casual: StyleAttribute;
    respectful_irreverent: StyleAttribute;
    enthusiastic_matterOfFact: StyleAttribute;
}

interface StylePreferences {
    brandPersonality: BrandPersonality;
    toneOfVoice: ToneOfVoice;
}

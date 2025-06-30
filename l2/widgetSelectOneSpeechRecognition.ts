/// <mls shortName="widgetSelectOneSpeechRecognition" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, repeat, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    start: 'Iniciar reconhecimento de fala',
    stop: 'Parar reconhecimento de fala',
    microphone: 'Microfone',
    speechNotSupported: 'Reconhecimento de fala não suportado neste navegador.',
};
const message_en = {
    start: 'Start speech recognition',
    stop: 'Stop speech recognition',
    microphone: 'Microphone',
    speechNotSupported: 'Speech recognition not supported in this browser.',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget de seleção única com reconhecimento de fala, botão microfone, transcrição em tempo real no hint e fallback para digitação padrão.
 * Baseado em ica-forms-input-select-one.
 */
@customElement('widget-select-one-speech-recognition-100554')
export class WidgetSelectOneSpeechRecognition extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['pt'];

    /**
     * Texto do rótulo exibido para o campo
     * @example label="Estado"
     */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /**
     * Texto de dica exibido abaixo do campo, usado para mostrar a transcrição em tempo real
     * @example hint="Fale ou digite o estado"
     */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /**
     * Valor selecionado atualmente
     * @example selectedvalue="SP"
     */
    @propertyDataSource({ type: String }) selectedvalue: string | undefined;
    /**
     * Indica se o campo é obrigatório
     * @example required=true
     */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /**
     * Indica se o campo está desabilitado
     * @example disabled=true
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
     * Lista de opções disponíveis para seleção
     * @example options="['SP','RJ','MG']"
     */
    @propertyDataSource({ type: Array }) options: string[] = [];
    /**
     * Habilita ou desabilita o reconhecimento de fala
     * @example speechRecognitionEnabled=true
     */
    @propertyDataSource({ type: Boolean }) speechRecognitionEnabled: boolean = true;
    /**
     * Texto ou tooltip para o botão do microfone
     * @example microphoneButtonLabel="Falar"
     */
    @propertyDataSource({ type: String }) microphoneButtonLabel: string = '';
    /**
     * Texto da transcrição em tempo real do reconhecimento de fala
     * @example transcription="São Paulo"
     */
    @propertyDataSource({ type: String }) transcription: string = '';
    /**
     * Atributo aria-label para acessibilidade
     */
    @propertyDataSource({ type: String }) ariaLabel: string = '';

    // --- Correção: Declaração dos tipos SpeechRecognition e SpeechRecognitionEvent para browsers ---
    // Não é necessário declarar tipos extras, pois usamos 'any' para compatibilidade cross-browser.
    // --- Fim da correção ---
    private recognition: any = null; // Corrigido para 'any' para evitar erro de tipagem
    private recognizing: boolean = false;
    private lastTranscript: string = '';

    public async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        this.__initSpeechRecognition();
    }

    private __initSpeechRecognition() {
        if (!this.speechRecognitionEnabled) return;
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionClass) {
            this.speechRecognitionEnabled = false;
            return;
        }
        this.recognition = new SpeechRecognitionClass();
        this.recognition.lang = 'pt-BR';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.lastTranscript = transcript.trim();
                } else {
                    interimTranscript += transcript;
                }
            }
            const fullTranscript = (this.lastTranscript + ' ' + interimTranscript).trim();
            this.transcription = fullTranscript;
            this.requestUpdate();
            this.__trySelectOptionFromTranscript(fullTranscript);
        };
        this.recognition.onerror = () => {
            this.recognizing = false;
            this.requestUpdate();
        };
        this.recognition.onend = () => {
            this.recognizing = false;
            this.requestUpdate();
        };
    }

    private __toggleRecognition() {
        if (!this.speechRecognitionEnabled || !this.recognition) return;
        if (this.recognizing) {
            this.recognition.stop();
            this.recognizing = false;
        } else {
            this.lastTranscript = '';
            this.transcription = '';
            this.recognition.start();
            this.recognizing = true;
        }
        this.requestUpdate();
    }

    private __trySelectOptionFromTranscript(transcript: string) {
        if (!transcript || !this.options || !Array.isArray(this.options)) return;
        const normalized = transcript.trim().toLowerCase();
        const found = this.options.find((opt: string) => (typeof opt === 'string' ? opt.toLowerCase() : '') === normalized);
        if (found) {
            this.selectedvalue = found;
            this.requestUpdate();
        }
    }

    private __onSelectChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.selectedvalue = target.value;
        this.transcription = '';
        this.requestUpdate();
    }

    render() {
        const showSpeech = this.speechRecognitionEnabled && !!this.recognition;
        const micActive = this.recognizing;
        const micLabel = this.microphoneButtonLabel || this.myMessage.microphone;
        const hintText = this.transcription ? this.transcription : this.hint;
        return html`
      <div class="select-one-speech-container">
        <label ?hidden="${!this.label}" class="select-label">${this.label}</label>
        <div class="select-microphone-row">
          <select
            class="select-control"
            name="select-one-speech"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            aria-label="${this.ariaLabel}"
            @change="${(e: Event) => this.__onSelectChange(e)}">
            <option value="" ?selected="${!this.selectedvalue}"></option>
            ${repeat(
            this.options,
            ((item: string) => item) as () => string,
            ((item: string) => html`<option value="${item}" ?selected="${this.selectedvalue === item}">${item}</option>`) as () => TemplateResult<1>
        )}
          </select>
          ${showSpeech ? html`
            <button
              class="microphone-btn ${micActive ? 'active' : ''}"
              type="button"
              title="${micLabel}"
              @click="${() => this.__toggleRecognition()}"
              aria-pressed="${micActive}">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="${micActive ? '#1C91CD' : '#E6E6E6'}"/>
                <rect x="8" y="5" width="4" height="8" rx="2" fill="${micActive ? '#fff' : '#403f3f'}"/>
                <rect x="9" y="13" width="2" height="2" rx="1" fill="${micActive ? '#fff' : '#403f3f'}"/>
              </svg>
            </button>
          ` : html``}
        </div>
        <div class="select-hint">${hintText}</div>
        ${!showSpeech && this.speechRecognitionEnabled ? html`<div class="speech-not-supported">${this.myMessage.speechNotSupported}</div>` : html``}
      </div>
    `;
    }
}

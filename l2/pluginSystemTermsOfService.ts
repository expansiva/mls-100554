/// <mls shortName="pluginSystemTermsOfService" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    html: `	<h1>Termos de Uso</h1>
	<p><strong>Última atualização:</strong> [Date]</p>
	<p>Bem-vindo ao <strong>[SystemName]</strong>! Estes Termos de Uso regulam o uso da nossa plataforma e serviços. Ao acessar ou utilizar o sistema, você concorda em cumprir os termos aqui descritos.</p>
	<p>Se você não concorda com qualquer parte destes Termos, não utilize o <strong>[SystemName]</strong>.</p>

	<h2>1. Definições</h2>
	<h3>1.1 Sistema</h3>
	<p>Refere-se à plataforma <strong>[SystemName]</strong>, incluindo suas funcionalidades, serviços e aplicativos associados.</p>
	<h3>1.2 Usuário</h3>
	<p>Qualquer pessoa ou entidade que acessa e utiliza o sistema.</p>

	<h2>2. Aceitação dos Termos</h2>
	<p>Ao criar uma conta ou utilizar qualquer funcionalidade do sistema, o usuário declara que:</p>
	<ul>
		<li>Leu e compreendeu os Termos de Uso;</li>
		<li>Tem capacidade legal para aceitar os Termos;</li>
		<li>Concorda com o uso do sistema conforme descrito.</li>
	</ul>

	<h2>3. Cadastro e Responsabilidades do Usuário</h2>
	<h3>3.1 Cadastro</h3>
	<p>Para acessar determinados recursos, pode ser necessário criar uma conta. O usuário é responsável por:</p>
	<ul>
		<li>Fornecer informações precisas, completas e atualizadas;</li>
		<li>Manter a confidencialidade de suas credenciais de acesso;</li>
		<li>Notificar imediatamente o sistema sobre qualquer uso não autorizado da conta.</li>
	</ul>
	<h3>3.2 Restrições</h3>
	<p>O usuário não deve:</p>
	<ul>
		<li>Utilizar o sistema para fins ilegais ou não autorizados;</li>
		<li>Violar direitos de propriedade intelectual, privacidade ou outros direitos de terceiros;</li>
		<li>Interferir no funcionamento do sistema ou tentar obter acesso não autorizado a ele.</li>
	</ul>

	<h2>4. Funcionamento e Disponibilidade do Sistema</h2>
	<ul>
		<li><strong>[SystemName]</strong> se esforça para manter a plataforma acessível 24/7, mas não garante disponibilidade contínua.</li>
		<li>A plataforma pode ser temporariamente suspensa para manutenção ou atualizações.</li>
		<li>Não nos responsabilizamos por perdas ou danos causados por interrupções no sistema.</li>
	</ul>

	<h2>5. Propriedade Intelectual</h2>
	<ul>
		<li>Todos os direitos sobre o sistema, incluindo software, design, logotipos e conteúdo, pertencem ao <strong>[SystemName]</strong> ou a seus licenciadores.</li>
		<li>É proibido copiar, distribuir, modificar ou criar trabalhos derivados do sistema sem autorização prévia por escrito.</li>
	</ul>

	<h2>6. Privacidade</h2>
	<p>O uso do sistema está sujeito à nossa Política de Privacidade, que explica como coletamos e tratamos os dados dos usuários.</p>

	<h2>7. Limitação de Responsabilidade</h2>
	<ul>
		<li>O sistema é fornecido "como está", sem garantias de qualquer tipo, explícitas ou implícitas.</li>
		<li>Não nos responsabilizamos por:</li>
		<ul>
			<li>Perdas ou danos diretos, indiretos ou consequenciais relacionados ao uso do sistema;</li>
			<li>Conteúdo ou ações de terceiros que utilizem a plataforma.</li>
		</ul>
	</ul>

	<h2>8. Modificações nos Termos</h2>
	<p>Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. Alterações serão notificadas por meio do sistema ou por e-mail. O uso continuado após a notificação indica aceitação das mudanças.</p>

	<h2>9. Rescisão</h2>
	<p>Podemos suspender ou encerrar o acesso do usuário ao sistema, sem aviso prévio, em caso de:</p>
	<ul>
		<li>Violação destes Termos de Uso;</li>
		<li>Uso indevido do sistema;</li>
		<li>Decisão unilateral de descontinuação do serviço.</li>
	</ul>

	<h2>10. Legislação Aplicável e Foro</h2>
	<p>Estes Termos são regidos pelas leis do <strong>[locationCountry]</strong>. Quaisquer disputas serão resolvidas no foro da <strong>[locationCity]</strong>, salvo disposição em contrário prevista em lei.</p>

	<h2>11. Contato</h2>
	<p>Em caso de dúvidas sobre os Termos de Uso, entre em contato:</p>
	<ul>
		<li><strong>E-mail:</strong> [email]</li>
		<li><strong>Telefone:</strong> [contact]</li>
	</ul>

	<h2>Declaração de Aceite</h2>
	<p>Ao utilizar o <strong>[SystemName]</strong>, você concorda com todos os termos aqui apresentados.</p>`
}

const message_en = {
    html: `
    <h1>Terms of Use</h1>
	<p><strong>Last Updated:</strong> [Date]</p>
	<p>Welcome to <strong>[SystemName]</strong>! These Terms of Use govern the use of our platform and services. By accessing or using the system, you agree to comply with the terms outlined here.</p>
	<p>If you do not agree with any part of these Terms, do not use <strong>[SystemName]</strong>.</p>

	<h2>1. Definitions</h2>
	<h3>1.1 System</h3>
	<p>Refers to the <strong>[SystemName]</strong> platform, including its features, services, and associated applications.</p>
	<h3>1.2 User</h3>
	<p>Any individual or entity that accesses and uses the system.</p>

	<h2>2. Acceptance of Terms</h2>
	<p>By creating an account or using any functionality of the system, the user declares that they:</p>
	<ul>
		<li>Have read and understood the Terms of Use;</li>
		<li>Have the legal capacity to accept the Terms;</li>
		<li>Agree to use the system as described.</li>
	</ul>

	<h2>3. User Registration and Responsibilities</h2>
	<h3>3.1 Registration</h3>
	<p>To access certain features, creating an account may be required. The user is responsible for:</p>
	<ul>
		<li>Providing accurate, complete, and up-to-date information;</li>
		<li>Keeping their access credentials confidential;</li>
		<li>Immediately notifying the system of any unauthorized account use.</li>
	</ul>
	<h3>3.2 Restrictions</h3>
	<p>The user must not:</p>
	<ul>
		<li>Use the system for illegal or unauthorized purposes;</li>
		<li>Violate intellectual property, privacy, or other rights of third parties;</li>
		<li>Interfere with the system's operation or attempt unauthorized access to it.</li>
	</ul>

	<h2>4. System Operation and Availability</h2>
	<ul>
		<li><strong>[SystemName]</strong> strives to keep the platform accessible 24/7 but does not guarantee continuous availability.</li>
		<li>The platform may be temporarily suspended for maintenance or updates.</li>
		<li>We are not liable for losses or damages caused by system interruptions.</li>
	</ul>

	<h2>5. Intellectual Property</h2>
	<ul>
		<li>All rights to the system, including software, design, logos, and content, belong to <strong>[SystemName]</strong> or its licensors.</li>
		<li>Copying, distributing, modifying, or creating derivative works of the system without prior written authorization is prohibited.</li>
	</ul>

	<h2>6. Privacy</h2>
	<p>The use of the system is subject to our Privacy Policy, which explains how we collect and handle user data.</p>

	<h2>7. Limitation of Liability</h2>
	<ul>
		<li>The system is provided "as is," without any warranties, explicit or implied.</li>
		<li>We are not responsible for:</li>
		<ul>
			<li>Direct, indirect, or consequential losses or damages related to the use of the system;</li>
			<li>Content or actions of third parties using the platform.</li>
		</ul>
	</ul>

	<h2>8. Changes to the Terms</h2>
	<p>We reserve the right to amend these Terms of Use at any time. Changes will be notified through the system or via email. Continued use after notification indicates acceptance of the changes.</p>

	<h2>9. Termination</h2>
	<p>We may suspend or terminate the user's access to the system without prior notice in cases of:</p>
	<ul>
		<li>Violation of these Terms of Use;</li>
		<li>Misuse of the system;</li>
		<li>Unilateral decision to discontinue the service.</li>
	</ul>

	<h2>10. Governing Law and Jurisdiction</h2>
	<p>These Terms are governed by the laws of <strong>[locationCountry]</strong>. Any disputes will be resolved in the courts of <strong>[locationCity]</strong>, unless otherwise required by law.</p>

	<h2>11. Contact</h2>
	<p>For questions regarding the Terms of Use, contact us:</p>
	<ul>
		<li><strong>Email:</strong> [email]</li>
		<li><strong>Phone:</strong> [contact]</li>
	</ul>

	<h2>Acceptance Declaration</h2>
	<p>By using <strong>[SystemName]</strong>, you agree to all the terms outlined herein.</p>`
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Terms of Service",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/></svg>
    `;
    }
};


@customElement('plugin-system-terms-of-service-100554')
export class PluginSystemTermosOfService100554 extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;

    private systemName: string = 'Collab Codes';
    private contact: string = '(11) 1111- 1111';
    private email: string = 'email@teste.com.br';
    private lastChange: string = '2024-11-19T19:45:30.276Z'
    private locationCountry: string = 'Brazil';
    private locationCity: string = 'São Paulo/SP';


    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();
    }

    async prepare() {
        await this.init();
    }

    private async init() {
    }

    private replaceAllOccurrences(
        source: string,
        replaceKey: string,
        replaceValue: string
    ): string {
        return source.split(replaceKey).join(replaceValue);
    }

    private prepareText(
        source: string,
    ): string {

        source = this.replaceAllOccurrences(source, '[SystemName]', this.systemName);
        source = this.replaceAllOccurrences(source, '[email]', this.email);
        source = this.replaceAllOccurrences(source, '[contact]', this.contact);
        source = this.replaceAllOccurrences(source, '[Date]', this.formatToLocalDate(this.lastChange));
        source = this.replaceAllOccurrences(source, '[locationCountry]', this.locationCountry);
        source = this.replaceAllOccurrences(source, '[locationCity]', this.locationCity);
        return source;
    }

    private formatToLocalDate(
        date: Date | string,
        locale: string = this.closest('html')?.lang || navigator.language,
        options?: Intl.DateTimeFormatOptions
    ): string {

        const validDate = typeof date === "string" ? new Date(date) : date;
        if (isNaN(validDate.getTime())) throw new Error("Invalid date provided.");
        return validDate.toLocaleDateString(locale, options) + ' ' + validDate.toLocaleTimeString(locale, options);
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];


        return html`
            <div class="plugin-container">
                ${unsafeHTML(this.prepareText(this.msg.html))}
            </div>
        `;
    }
}

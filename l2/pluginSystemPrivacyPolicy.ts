/// <mls shortName="pluginSystemPrivacyPolicy" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    html: `
    <h1>Política de Privacidade</h1>
	<p><strong>Última atualização:</strong> 19/11/2024 16:23:23</p>
	<p>A privacidade de nossos usuários é prioridade no <strong>Collab Codes</strong>. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos os dados pessoais fornecidos pelos usuários ao utilizar nossa plataforma.</p>

	<h2>1. Informações que Coletamos</h2>

	<h3>1.1 Informações Pessoais</h3>
	<p>Podemos coletar as seguintes informações pessoais:</p>
	<ul>
		<li>Nome completo;</li>
		<li>Endereço de e-mail;</li>
		<li>Dados de contato (como telefone, quando aplicável);</li>
		<li>Informações de pagamento, caso serviços pagos sejam oferecidos.</li>
	</ul>

	<h3>1.2 Informações Não-Pessoais</h3>
	<p>Coletamos automaticamente informações sobre o uso do sistema, incluindo:</p>
	<ul>
		<li>Endereço IP;</li>
		<li>Tipo de navegador;</li>
		<li>Páginas acessadas e tempo de permanência;</li>
		<li>Dados técnicos (ex.: erros reportados no sistema).</li>
	</ul>

	<h3>1.3 Cookies e Tecnologias Semelhantes</h3>
	<p>Utilizamos cookies e outras tecnologias para:</p>
	<ul>
		<li>Personalizar a experiência do usuário;</li>
		<li>Monitorar métricas de desempenho;</li>
		<li>Facilitar o login.</li>
	</ul>

	<h2>2. Como Usamos as Informações</h2>
	<p>As informações coletadas têm como finalidade:</p>
	<ul>
		<li>Fornecer e aprimorar nossos serviços;</li>
		<li>Atender solicitações de suporte técnico;</li>
		<li>Informar sobre atualizações ou mudanças importantes no sistema;</li>
		<li>Cumprir com obrigações legais ou regulatórias.</li>
	</ul>

	<h2>3. Compartilhamento de Dados</h2>
	<p>Os dados pessoais dos usuários não são vendidos ou compartilhados com terceiros, exceto:</p>
	<ul>
		<li><strong>Provedores de serviços:</strong> Para operação e manutenção da plataforma (ex.: serviços de hospedagem e análise de dados);</li>
		<li><strong>Obrigação legal:</strong> Em cumprimento a leis, regulamentos, ordens judiciais ou solicitações governamentais.</li>
	</ul>

	<h2>4. Armazenamento e Segurança</h2>
	<p>Adotamos medidas para proteger os dados armazenados:</p>
	<ul>
		<li>Criptografia de informações sensíveis;</li>
		<li>Monitoramento constante para detectar acessos não autorizados;</li>
		<li>Proteção contra ataques cibernéticos.</li>
	</ul>
	<p>Os dados serão armazenados pelo tempo necessário para atender às finalidades descritas, a menos que legislação aplicável exija período diferente.</p>

	<h2>5. Direitos dos Usuários</h2>
	<p>Os usuários têm os seguintes direitos:</p>
	<ul>
		<li>Acessar, corrigir ou excluir seus dados pessoais;</li>
		<li>Solicitar a portabilidade de dados;</li>
		<li>Revogar consentimento para o processamento de informações;</li>
		<li>Registrar reclamações junto às autoridades de proteção de dados.</li>
	</ul>

	<h2>6. Transferência Internacional de Dados</h2>
	<p>Caso os dados sejam transferidos para servidores fora do país de origem do usuário, garantimos que serão adotadas medidas adequadas para proteger a privacidade, em conformidade com as leis aplicáveis.</p>

	<h2>7. Atualizações desta Política</h2>
	<p>Reservamo-nos o direito de atualizar esta Política de Privacidade. Qualquer alteração será comunicada por meio da plataforma ou pelo e-mail cadastrado.</p>

	<h2>8. Entre em Contato</h2>
	<p>Se tiver dúvidas ou solicitações, entre em contato conosco:</p>
	<ul>
		<li><strong>E-mail:</strong> [email@example.com]</li>
		<li><strong>Telefone:</strong> [Número de contato]</li>
	</ul>`
}

const message_en = {
    html: `
	<h1>Privacy Policy</h1>
	<p><strong>Last Updated:</strong> 11/19/2024 4:23:23 PM</p>
	<p>The privacy of our users is a priority at <strong>Collab Codes </strong>. This Privacy Policy describes how we collect, use, store, and protect personal data provided by users while using our platform.</p>

	<h2>1. Information We Collect</h2>

	<h3>1.1 Personal Information</h3>
	<p>We may collect the following personal information:</p>
	<ul>
		<li>Full name;</li>
		<li>Email address;</li>
		<li>Contact details (e.g., phone number, where applicable);</li>
		<li>Payment information, if paid services are offered.</li>
	</ul>

	<h3>1.2 Non-Personal Information</h3>
	<p>We automatically collect information about system usage, including:</p>
	<ul>
		<li>IP address;</li>
		<li>Browser type;</li>
		<li>Pages accessed and time spent;</li>
		<li>Technical data (e.g., system-reported errors).</li>
	</ul>

	<h3>1.3 Cookies and Similar Technologies</h3>
	<p>We use cookies and other technologies to:</p>
	<ul>
		<li>Personalize the user experience;</li>
		<li>Monitor performance metrics;</li>
		<li>Facilitate login.</li>
	</ul>

	<h2>2. How We Use the Information</h2>
	<p>The information we collect is used to:</p>
	<ul>
		<li>Provide and improve our services;</li>
		<li>Respond to technical support requests;</li>
		<li>Inform users about updates or important system changes;</li>
		<li>Comply with legal or regulatory obligations.</li>
	</ul>

	<h2>3. Data Sharing</h2>
	<p>We do not sell or share users' personal data with third parties, except:</p>
	<ul>
		<li><strong>Service providers:</strong> For platform operation and maintenance (e.g., hosting and data analytics services);</li>
		<li><strong>Legal obligations:</strong> In compliance with laws, regulations, court orders, or government requests.</li>
	</ul>

	<h2>4. Storage and Security</h2>
	<p>We adopt measures to protect stored data:</p>
	<ul>
		<li>Encryption of sensitive information;</li>
		<li>Constant monitoring to detect unauthorized access;</li>
		<li>Protection against cyberattacks.</li>
	</ul>
	<p>Data will be stored for as long as necessary to fulfill the purposes described, unless applicable laws require otherwise.</p>

	<h2>5. User Rights</h2>
	<p>Users have the following rights:</p>
	<ul>
		<li>Access, correct, or delete their personal data;</li>
		<li>Request data portability;</li>
		<li>Revoke consent for data processing;</li>
		<li>File complaints with data protection authorities.</li>
	</ul>

	<h2>6. International Data Transfers</h2>
	<p>If data is transferred to servers outside the user's home country, we ensure appropriate measures are in place to protect privacy in compliance with applicable laws.</p>

	<h2>7. Policy Updates</h2>
	<p>We reserve the right to update this Privacy Policy. Any changes will be communicated via the platform or the registered email.</p>

	<h2>8. Contact Us</h2>
	<p>If you have questions or requests, please contact us:</p>
	<ul>
		<li><strong>Email:</strong> [email@example.com]</li>
		<li><strong>Phone:</strong> [Contact Number]</li>
	</ul>`
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Privacy Policy",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,22A17.5,17.5,0,0,0,21,6.7V6L12,2,3,6v.7A17.5,17.5,0,0,0,12,22ZM11,6h2V8H11Zm0,4h2v8H11Z"/></svg>
    `;
    }
};


@customElement('plugin-system-privacy-policy-100554')
export class PluginSystemPrivacyPolicy100554 extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;

    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();
    }

    async prepare() {
        await this.init();
    }

    private async init() {
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="plugin-container">
                ${unsafeHTML(this.msg.html)}
            </div>
        `;
    }
}

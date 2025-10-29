/// <mls shortName="agentImprovePrototype" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { convertTagToFileName } from './_100554_utilsLit';
import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getAgentStepByAgentName,
    appendLongTermMemory,
    notifyTaskChange,
    updateStepStatus,
    getNextPendentStep
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
    ClarificationValue,
    startClarification
} from "./_100554_aiAgentOrchestration";

const agentName = "agentImprovePrototype";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for prototype improve",
        visibility: "public",
        scope: ['l2_preview', 'l3_preview', 'l4_preview'],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        let data: IDataPrompt | undefined;
        let pp = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@${agentName}`, '').trim()
            .replace(`@@ImprovePrototype`, '');

        data = mls.common.safeParseArgs(pp) as IDataPrompt;
        if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
        let inputs = [];
        if (context.modeSingleStep) inputs = await getPromptsTest(data);
        else inputs = await getPrompts(data);

        await startNewAiTask(
            agentName,
            taskTitle,
            context.message.content,
            context.message.threadId,
            context.message.senderId,
            inputs,
            context,
            _afterPrompt,
            { 'page': `${data.page}` }
        ).catch((err) => {
            throw new Error(err.message)
        });
        return;
    }


    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataPrompt = mls.common.safeParseArgs(step.prompt) as IDataPrompt;
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
    await appendLongTermMemory(context, { 'page': `${data.page}` });
    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    notifyTaskChange(context);

    const result = getPayload2(context);
    if (!context.task) throw new Error("Invalid task");
    const stepPendent = getNextPendentStep(context.task);
    if (!stepPendent) throw new Error(`[${agentName}] afterPrompt: Invalid next stepPendent`);

    const nextSteps = [];
    const agentsAvaliables = ['agentImprovePrototypeOrganism']
    if (Array.isArray(result)) {

        console.info({
            result
        })
        for await (let task of result) {

            if (!agentsAvaliables.includes(task.agentName)) continue;

            const fileInfo = convertTagToFileName(task.ref);
            if (!fileInfo) continue;
            const { folder, project, shortName } = fileInfo;
            const data = {
                page: folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`,
                prompt: task.prompt
            }
            const newStep: mls.msg.AIPayload = {
                agentName: task.agentName,
                prompt: JSON.stringify(data),
                status: 'pending',
                stepId: stepPendent.stepId + 1,
                interaction: null,
                nextSteps: null,
                rags: null,
                type: 'agent'
            };
            nextSteps.push(newStep);
        }

        await addNewStep(context, stepPendent.stepId, nextSteps);
    }

}

async function getPromptsTest(data: IDataPrompt): Promise<mls.msg.IAMessageInputType[]> {


    let mode: string = 'page';
    let fileName: string = 'home';

    const html = getHtmlForTeste();
    const htmlCompiled = getHtmlCompiledForTest();

    const dataForReplace = {
        promptUser: data.prompt,
        html,
        htmlCompiled,
        mode,
        fileName
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: dataForReplace })
    return prompts;
}


async function getPrompts(data: IDataPrompt): Promise<mls.msg.IAMessageInputType[]> {

    const moduleDefs = await import(`/${data.page}.defs.js`);
    console.info({ moduleDefs });
    let mode: string = '';
    let fileName: string = data.page;

    if (moduleDefs && moduleDefs.defs?.meta) {
        mode = moduleDefs.defs.meta.type;
        fileName = moduleDefs.defs.meta.shortName;
    }

    const html = await getContentByExtension(data.page, 'html');
    if (!html) throw new Error(`[${agentName}] getPrompts: No html found.`);
    const htmlCompiled = await renderHtmlWithComponents(html);

    const dataForReplace = {
        promptUser: data.prompt,
        html,
        htmlCompiled,
        mode,
        fileName
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: dataForReplace })
    return prompts;
}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style' | 'defs') {

    const info = mls.l2.getPath(fullName);
    try {
        const models = getModel(info)
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + info.shortName);
        if (!models[ext]) return '';
        return models[ext]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

export function getPayload2(context: mls.msg.ExecutionContext): IPayload {
    if (!context || !context.task) throw new Error(`[${agentName}] [getPayload] Invalid context`);
    const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[${agentName}] [getPayload] no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[0];
    if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[${agentName}] [getPayload] No step flexible found for this agent.`);
    let payload2: IPayload | string = resultStep.result;
    if (typeof payload2 === "string") payload2 = JSON.parse(payload2) as IPayload;
    return payload2;
}


function getHtmlForTeste() {
    return `<petshop--home-102009>
	<header id="home-core-header-1">
		<petshop--organism-nav-102009 id="home-nav1">
		</petshop--organism-nav-102009>
	</header>
	<main id="home-core-main-1">
		<petshop--organism-hero-banner-102009 id="home-hero-banner1">
		</petshop--organism-hero-banner-102009>
		<petshop--organism-about-petshop-102009 id="home-about-petshop1">
		</petshop--organism-about-petshop-102009>
		<petshop--organism-featured-services-102009 id="home-featured-services1">
		</petshop--organism-featured-services-102009>
		<petshop--organism-featured-products-102009 id="home-featured-products1">
		</petshop--organism-featured-products-102009>
	</main>
	<footer id="home-core-footer-1">
		<petshop--organism-footer-info-102009 id="home-footer-info1">
		</petshop--organism-footer-info-102009>
	</footer>
</petshop--home-102009>`
}

function getHtmlCompiledForTest() {
    return `'<petshop--home-102009 mls_origin="true" modeoverlay="" level="2" style="position: relative;">\n\t<header id="home-core-header-1" mls_origin="true">\n\t\t<petshop--organism-nav-102009 id="home-nav1" mls_origin="true">\n\t\t\x3C!----><div class="nav-container" id="petshop--nav-102009-1">\n          <a href="/" class="logo" aria-label="Página inicial" id="petshop--nav-102009-2">\n            <img src="https://images.unsplash.com/photo-1701500096456-28186c4a306d?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxwZXRzaG9wJTIwbG9nbyUyMGFuaW1hbCUyMHBhdyUyMGJsdWUlMjBncmVlbnxlbnwwfHx8fDE3NTQ0MTEzMTR8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Logo Petshop" id="petshop--nav-102009-3">\n            <span class="brand" id="petshop--nav-102009-4">Petshop Amigo</span>\n          </a>\n          <nav aria-label="Menu principal" id="petshop--nav-102009-5">\n            <ul id="petshop--nav-102009-6">\n              <li id="petshop--nav-102009-7"><a href="/" id="petshop--nav-102009-8">Home</a></li>\n              <li id="petshop--nav-102009-9"><a href="/agendamento" id="petshop--nav-102009-10">Agendamento</a></li>\n              <li id="petshop--nav-102009-11"><a href="/produtos" id="petshop--nav-102009-12">Produtos</a></li>\n              <li id="petshop--nav-102009-13"><a href="/contato" id="petshop--nav-102009-14">Contato</a></li>\n            </ul>\n          </nav>\n          <div class="social" aria-label="Redes sociais" id="petshop--nav-102009-15">\n            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" id="petshop--nav-102009-16">\n              <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--nav-102009-17"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z" id="petshop--nav-102009-18"></path></svg>\n            </a>\n            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" id="petshop--nav-102009-19">\n              <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--nav-102009-20"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0z" id="petshop--nav-102009-21"></path></svg>\n            </a>\n            <a href="https://wa.me/5599999999999" target="_blank" rel="noopener" aria-label="WhatsApp" id="petshop--nav-102009-22">\n              <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--nav-102009-23"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.45l-.37-.22l-3.67.97l.98-3.58l-.24-.38A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10s-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9c-.25-.09-.43-.14-.61.14c-.18.28-.7.9-.86 1.08c-.16.18-.32.2-.6.07c-.28-.14-1.18-.44-2.25-1.41c-.83-.74-1.39-1.65-1.55-1.93c-.16-.28-.02-.43.12-.57c.13-.13.28-.34.42-.51c.14-.17.18-.29.27-.48c.09-.19.05-.36-.02-.5c-.07-.14-.61-1.47-.84-2.01c-.22-.54-.45-.47-.61-.48c-.16-.01-.35-.01-.54-.01c-.19 0-.5.07-.76.34c-.26.27-1 1-.98 2.44c.02 1.44 1.03 2.84 1.18 3.04c.15.2 2.03 3.1 4.93 4.22c.69.28 1.23.45 1.65.58c.69.22 1.32.19 1.82.12c.56-.08 1.65-.67 1.88-1.32c.23-.65.23-1.2.16-1.32c-.07-.12-.25-.19-.53-.33z" id="petshop--nav-102009-24"></path></svg>\n            </a>\n          </div>\n        </div>\n      </petshop--organism-nav-102009>\n\t</header>\n\t<main id="home-core-main-1" mls_origin="true">\n\t\t<petshop--organism-hero-banner-102009 id="home-hero-banner1" mls_origin="true">\n\t\t\x3C!----><div class="banner-content" id="petshop--hero-banner-102009-1">\n          <div class="banner-text" id="petshop--hero-banner-102009-2">\n            <h1 id="petshop--hero-banner-102009-3">Bem-vindo ao Petshop Amigo!</h1>\n            <p id="petshop--hero-banner-102009-4">Cuidado, carinho e tudo para o seu pet em um só lugar. Agende banho, tosa ou encontre os melhores produtos para seu melhor amigo!</p>\n            <a href="/agendamento" class="cta-btn" id="petshop--hero-banner-102009-5">Agende um banho &amp; tosa</a>\n          </div>\n          <div class="banner-image" id="petshop--hero-banner-102009-6">\n            <img src="https://images.unsplash.com/photo-1711185891190-0f66509c0b9c?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGFmdGVyJTIwYmF0aCUyMHBldHNob3AlMjBiYW5uZXJ8ZW58MHx8fHwxNzU0NDExMzE1fDA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Cachorro feliz após banho" id="petshop--hero-banner-102009-7">\n          </div>\n        </div>\n      </petshop--organism-hero-banner-102009>\n\t\t<petshop--organism-about-petshop-102009 id="home-about-petshop1" mls_origin="true">\n\t\t\x3C!----><div class="about-container" id="petshop--about-petshop-102009-1">\n          <h2 id="petshop--about-petshop-102009-2">Sobre o Petshop Amigo</h2>\n          <div class="about-text" id="petshop--about-petshop-102009-3">\n            O Petshop Amigo nasceu do amor pelos animais e da vontade de oferecer o melhor em serviços e produtos para pets de todas as espécies. Nossa missão é cuidar com carinho, respeito e profissionalismo, proporcionando bem-estar e felicidade para seu melhor amigo.\n          </div>\n          <div class="about-values" id="petshop--about-petshop-102009-4">\n            <div class="value" id="petshop--about-petshop-102009-5">Carinho &amp; Respeito</div>\n            <div class="value" id="petshop--about-petshop-102009-6">Profissionalismo</div>\n            <div class="value" id="petshop--about-petshop-102009-7">Bem-estar animal</div>\n            <div class="value" id="petshop--about-petshop-102009-8">Atendimento personalizado</div>\n          </div>\n        </div>\n      </petshop--organism-about-petshop-102009>\n\t\t<petshop--organism-featured-services-102009 id="home-featured-services1" mls_origin="true">\n\t\t\x3C!----><div class="services-container" id="petshop--featured-services-102009-1">\n          <h2 id="petshop--featured-services-102009-2">Nossos principais serviços</h2>\n          <div class="services-list" id="petshop--featured-services-102009-3">\n            <div class="service-card" id="petshop--featured-services-102009-4">\n              <div class="icon" id="petshop--featured-services-102009-5">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--featured-services-102009-6"><circle cx="12" cy="12" r="10" id="petshop--featured-services-102009-7"></circle><path d="M12 7a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm0 6c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z" fill="#52C41A" id="petshop--featured-services-102009-8"></path></svg>\n              </div>\n              <div class="service-title" id="petshop--featured-services-102009-9">Banho &amp; Tosa</div>\n              <div class="service-desc" id="petshop--featured-services-102009-10">Higiene, beleza e bem-estar para seu pet, com todo carinho.</div>\n            </div>\n            <div class="service-card" id="petshop--featured-services-102009-11">\n              <div class="icon" id="petshop--featured-services-102009-12">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--featured-services-102009-13"><rect x="4" y="4" width="16" height="16" rx="8" id="petshop--featured-services-102009-14"></rect><path d="M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" fill="#1C91CD" id="petshop--featured-services-102009-15"></path></svg>\n              </div>\n              <div class="service-title" id="petshop--featured-services-102009-16">Consultas Veterinárias</div>\n              <div class="service-desc" id="petshop--featured-services-102009-17">Profissionais experientes para cuidar da saúde do seu pet.</div>\n            </div>\n            <div class="service-card" id="petshop--featured-services-102009-18">\n              <div class="icon" id="petshop--featured-services-102009-19">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--featured-services-102009-20"><rect x="2" y="10" width="20" height="4" rx="2" id="petshop--featured-services-102009-21"></rect><circle cx="6" cy="12" r="2" fill="#52C41A" id="petshop--featured-services-102009-22"></circle><circle cx="18" cy="12" r="2" fill="#1C91CD" id="petshop--featured-services-102009-23"></circle></svg>\n              </div>\n              <div class="service-title" id="petshop--featured-services-102009-24">Vacinação</div>\n              <div class="service-desc" id="petshop--featured-services-102009-25">Vacinas essenciais para cães, gatos e outros pets.</div>\n            </div>\n            <div class="service-card" id="petshop--featured-services-102009-26">\n              <div class="icon" id="petshop--featured-services-102009-27">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--featured-services-102009-28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm0 14.2c-2.5 0-4.71-1.28-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" fill="#1C91CD" id="petshop--featured-services-102009-29"></path></svg>\n              </div>\n              <div class="service-title" id="petshop--featured-services-102009-30">Hotel &amp; Day Care</div>\n              <div class="service-desc" id="petshop--featured-services-102009-31">Hospedagem e recreação para seu pet com segurança e diversão.</div>\n            </div>\n          </div>\n        </div>\n      </petshop--organism-featured-services-102009>\n\t\t<petshop--organism-featured-products-102009 id="home-featured-products1" mls_origin="true">\n\t\t\x3C!----><div class="products-container" id="petshop--featured-products-102009-1">\n          <h2 id="petshop--featured-products-102009-2">Produtos em destaque</h2>\n          <div class="products-list" id="petshop--featured-products-102009-3">\n            <div class="product-card" id="petshop--featured-products-102009-4">\n              <div class="product-image" id="petshop--featured-products-102009-5">\n                <img src="https://images.unsplash.com/photo-1684882726821-2999db517441?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxkb2clMjBmb29kJTIwcHJlbWl1bSUyMHBhY2t8ZW58MHx8fHwxNzU0NDExMzE1fDA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Ração Premium para cães" id="petshop--featured-products-102009-6">\n              </div>\n              <div class="product-title" id="petshop--featured-products-102009-7">Ração Premium Cães</div>\n              <div class="product-price" id="petshop--featured-products-102009-8">R$ 89,90</div>\n              <div class="product-action" id="petshop--featured-products-102009-9">\n                <a href="/produtos/1" id="petshop--featured-products-102009-10">Comprar</a>\n              </div>\n            </div>\n            <div class="product-card" id="petshop--featured-products-102009-11">\n              <div class="product-image" id="petshop--featured-products-102009-12">\n                <img src="https://images.unsplash.com/photo-1708979346021-e7dad8f83096?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxjYXQlMjB0b3klMjBpbnRlcmFjdGl2ZSUyMGNvbG9yZnVsfGVufDB8fHx8MTc1NDQxMTMxNnww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Brinquedo interativo para gatos" id="petshop--featured-products-102009-13">\n              </div>\n              <div class="product-title" id="petshop--featured-products-102009-14">Brinquedo Interativo Gatos</div>\n              <div class="product-price" id="petshop--featured-products-102009-15">R$ 29,90</div>\n              <div class="product-action" id="petshop--featured-products-102009-16">\n                <a href="/produtos/2" id="petshop--featured-products-102009-17">Comprar</a>\n              </div>\n            </div>\n            <div class="product-card" id="petshop--featured-products-102009-18">\n              <div class="product-image" id="petshop--featured-products-102009-19">\n                <img src="https://images.unsplash.com/photo-1587291086390-69a3af40cf0b?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaGFtcG9vJTIwYm90dGxlJTIwbmV1dHJhbHxlbnwwfHx8fDE3NTQ0MTEzMTZ8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Shampoo neutro para pets" id="petshop--featured-products-102009-20">\n              </div>\n              <div class="product-title" id="petshop--featured-products-102009-21">Shampoo Neutro</div>\n              <div class="product-price" id="petshop--featured-products-102009-22">R$ 19,90</div>\n              <div class="product-action" id="petshop--featured-products-102009-23">\n                <a href="/produtos/3" id="petshop--featured-products-102009-24">Comprar</a>\n              </div>\n            </div>\n            <div class="product-card" id="petshop--featured-products-102009-25">\n              <div class="product-image" id="petshop--featured-products-102009-26">\n                <img src="https://images.unsplash.com/photo-1583860332956-0cd934c28cec?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxwZXQlMjBiZWQlMjBjb21mb3J0YWJsZSUyMGJsdWUlMjBncmVlbnxlbnwwfHx8fDE3NTQ0MTEzMTZ8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Caminha confortável para pets" id="petshop--featured-products-102009-27">\n              </div>\n              <div class="product-title" id="petshop--featured-products-102009-28">Caminha Confortável</div>\n              <div class="product-price" id="petshop--featured-products-102009-29">R$ 119,90</div>\n              <div class="product-action" id="petshop--featured-products-102009-30">\n                <a href="/produtos/4" id="petshop--featured-products-102009-31">Comprar</a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </petshop--organism-featured-products-102009>\n\t</main>\n\t<footer id="home-core-footer-1" mls_origin="true">\n\t\t<petshop--organism-footer-info-102009 id="home-footer-info1" mls_origin="true">\n\t\t\x3C!----><div class="footer-container" id="petshop--footer-info-102009-1">\n          <div class="footer-section" id="petshop--footer-info-102009-2">\n            <h4 id="petshop--footer-info-102009-3">Contato</h4>\n            <div class="contact-info" id="petshop--footer-info-102009-4">Telefone: <a href="tel:+5599999999999" id="petshop--footer-info-102009-5">(99) 99999-9999</a></div>\n            <div class="contact-info" id="petshop--footer-info-102009-6">E-mail: <a href="mailto:contato@petshopamigo.com" id="petshop--footer-info-102009-7">contato@petshopamigo.com</a></div>\n            <div class="contact-info" id="petshop--footer-info-102009-8">Endereço: Av. dos Pets, 123 - Centro, Cidade/UF</div>\n          </div>\n          <div class="footer-section" id="petshop--footer-info-102009-9">\n            <h4 id="petshop--footer-info-102009-10">Links úteis</h4>\n            <ul id="petshop--footer-info-102009-11">\n              <li id="petshop--footer-info-102009-12"><a href="/" id="petshop--footer-info-102009-13">Home</a></li>\n              <li id="petshop--footer-info-102009-14"><a href="/agendamento" id="petshop--footer-info-102009-15">Agendamento</a></li>\n              <li id="petshop--footer-info-102009-16"><a href="/produtos" id="petshop--footer-info-102009-17">Produtos</a></li>\n              <li id="petshop--footer-info-102009-18"><a href="/contato" id="petshop--footer-info-102009-19">Contato</a></li>\n            </ul>\n          </div>\n          <div class="footer-section" id="petshop--footer-info-102009-20">\n            <h4 id="petshop--footer-info-102009-21">Redes sociais</h4>\n            <div class="footer-social" id="petshop--footer-info-102009-22">\n              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" id="petshop--footer-info-102009-23">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--footer-info-102009-24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z" id="petshop--footer-info-102009-25"></path></svg>\n              </a>\n              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" id="petshop--footer-info-102009-26">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--footer-info-102009-27"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0z" id="petshop--footer-info-102009-28"></path></svg>\n              </a>\n              <a href="https://wa.me/5599999999999" target="_blank" rel="noopener" aria-label="WhatsApp" id="petshop--footer-info-102009-29">\n                <svg viewBox="0 0 24 24" fill="currentColor" id="petshop--footer-info-102009-30"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.45l-.37-.22l-3.67.97l.98-3.58l-.24-.38A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10s-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9c-.25-.09-.43-.14-.61.14c-.18.28-.7.9-.86 1.08c-.16.18-.32.2-.6.07c-.28-.14-1.18-.44-2.25-1.41c-.83-.74-1.39-1.65-1.55-1.93c-.16-.28-.02-.43.12-.57c.13-.13.28-.34.42-.51c.14-.17.18-.29.27-.48c.09-.19.05-.36-.02-.5c-.07-.14-.61-1.47-.84-2.01c-.22-.54-.45-.47-.61-.48c-.16-.01-.35-.01-.54-.01c-.19 0-.5.07-.76.34c-.26.27-1 1-.98 2.44c.02 1.44 1.03 2.84 1.18 3.04c.15.2 2.03 3.1 4.93 4.22c.69.28 1.23.45 1.65.58c.69.22 1.32.19 1.82.12c.56-.08 1.65-.67 1.88-1.32c.23-.65.23-1.2.16-1.32c-.07-.12-.25-.19-.53-.33z" id="petshop--footer-info-102009-31"></path></svg>\n              </a>\n            </div>\n          </div>\n        </div>\n        <div class="footer-bottom" id="petshop--footer-info-102009-32">\n          © 2025 Petshop Amigo. Todos os direitos reservados.\n        </div>\n      </petshop--organism-footer-info-102009>\n\t</footer>\n\x3C!---->\x3C!--?--></petshop--home-102009>'`
}

async function renderHtmlWithComponents(html: string): Promise<string> {

    return ''
}

function getModel(info: { project: number, shortName: string, folder: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder, 2);
    return mls.editor.models[key];
}


interface IDataPrompt {
    page: string,
    prompt: string
}

type IPayload = PayloadAgent[] | PayloadResult;

type PayloadAgent = {
    type: "agent"
    agentName: string,
    title: string,
    prompt: string,
    ref: string,
}

type PayloadResult = {
    type: "result"
    result: string
}




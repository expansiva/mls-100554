/// <mls shortName="agentPrototypeOptimizer" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    notifyTaskChange,
    updateTaskTitle,
    updateStepStatus,
    appendLongTermMemory,
    getNextPendentStep,
    getInteractionStepId,
    getStepById
} from "/_100554_/l2/aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
} from "/_100554_/l2/aiAgentOrchestration";

const agentName = "agentPrototypeOptimizer";
const agentProject = 100554;
const projectToSave = mls.actualProject || 0;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a new Module - 4",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        }
    };

}


const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    const taskTitle = "Planning 4...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const htmlMock = getHtmlMock();
        const inputs: any = await getPrompts(htmlMock);

        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}](afterPrompt) No in progress interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed", "no more agents");
    context = await createPage(context);
    notifyTaskChange(context);

    if (!context.task) throw new Error(`[${agentName}](afterPrompt) Invalid context task`);
    context.task = await updateTaskTitle(context.task, "Ok, page optimized");
    await executeNextStep(context);


}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
  throw new Error("[replayForSupport] not implemented");
}

async function getPrompts(html: string): Promise<mls.msg.IAMessageInputType[]> {

    const data: Record<string, string> = {
        html,
    }

    const prompts = await getPromptByHtml({ project: agentProject, shortName: agentName, folder: '', data })
    return prompts;
}

async function createPage(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}](createPage) Not found context to createPage`);
    const step = getNextPendentStep(context.task);
    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}](createPage) Invalid step in createPage`);
    const payload4 = step.result;
    console.info(payload4);
    return context;
}

function getHtmlMock() {
    return `
    <!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Petshop Amigável - Home</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <style>
    /* Custom styles for petshop theme */
    body {
      background-color: #f0f9ff;
      color: #374151;
    }

    .btn-primary {
      background-color: #10b981;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: background-color 0.3s;
    }

    .btn-primary:hover {
      background-color: #059669;
    }

    .card {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 1rem;
    }
  </style>
</head>

<body class="font-sans">
  <home-100554 class="block">
    <organism-nav class="block bg-green-600 text-white shadow-md sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="text-xl font-bold">Petshop Amigável</div>
        <div class="hidden md:flex space-x-6">
          <a href="#" class="hover:text-green-200">Home</a>
          <a href="#" class="hover:text-green-200">Agendamento</a>
          <a href="#" class="hover:text-green-200">Catálogo</a>
          <a href="#" class="hover:text-green-200">Contato</a>
        </div>
        <button class="md:hidden" onclick="toggleMenu()">☰</button>
      </nav>
      <div id="mobile-menu" class="hidden md:hidden bg-green-700 px-4 py-2">
        <a href="#" class="block py-2 hover:text-green-200">Home</a>
        <a href="#" class="block py-2 hover:text-green-200">Agendamento</a>
        <a href="#" class="block py-2 hover:text-green-200">Catálogo</a>
        <a href="#" class="block py-2 hover:text-green-200">Contato</a>
      </div>
      <script>
        function toggleMenu() {
          const menu = document.getElementById('mobile-menu');
          menu.classList.toggle('hidden');
        }
      </script>
    </organism-nav>
    <organism-banner-welcome
      class="block relative bg-gradient-to-r from-blue-500 to-green-500 text-white py-20 px-4 text-center">
      <div class="container mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Bem-vindo ao Petshop Amigável!</h1>
        <p class="text-lg md:text-xl mb-8">Cuidamos do seu pet com amor e dedicação. Agende agora!</p>
        <img
          src="https://images.unsplash.com/photo-1711376582747-22cd0839ffad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxjYWNob3JybyUyMGZlbGl6JTIwZW0lMjBwZXRzaG9wfGVufDB8fHx8MTc2NDAwNDIwMXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cachorro feliz no petshop" class="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
      </div>
    </organism-banner-welcome>
    <organism-services-highlight class="block py-16 px-4 bg-white">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">Nossos Serviços</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="card">
            <h3 class="text-xl font-semibold mb-4">Banho e Tosa</h3>
            <p class="mb-4">Serviço completo para deixar seu pet limpo e bonito.</p>
            <button class="btn-primary">Agendar</button>
          </div>
          <div class="card">
            <h3 class="text-xl font-semibold mb-4">Consulta Veterinária</h3>
            <p class="mb-4">Cuidado profissional para a saúde do seu animal.</p>
            <button class="btn-primary">Agendar</button>
          </div>
          <div class="card">
            <h3 class="text-xl font-semibold mb-4">Produtos para Pets</h3>
            <p class="mb-4">Tudo que seu pet precisa em um só lugar.</p>
            <button class="btn-primary">Ver Catálogo</button>
          </div>
        </div>
      </div>
    </organism-services-highlight>
    <organism-featured-products class="block py-16 px-4 bg-gray-100">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">Produtos em Destaque</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card text-center">
            <img
              src="https://images.unsplash.com/photo-1702838640191-8f0607031ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxyYSVDMyVBNyVDMyVBM28lMjBwcmVtaXVtJTIwcGFyYSUyMGMlQzMlQTNlc3xlbnwwfHx8fDE3NjM5OTU4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Ração para cães" class="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h3 class="text-xl font-semibold mb-2">Ração Premium</h3>
            <p class="text-lg font-bold text-green-600">R$ 49,90</p>
          </div>
          <div class="card text-center">
            <img
              src="https://images.unsplash.com/photo-1652524791225-ea5e6de0ea71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxicmlucXVlZG8lMjBpbnRlcmF0aXZvJTIwcGFyYSUyMGdhdG9zfGVufDB8fHx8MTc2Mzk5NzY4NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Brinquedo para gatos" class="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h3 class="text-xl font-semibold mb-2">Brinquedo Interativo</h3>
            <p class="text-lg font-bold text-green-600">R$ 19,90</p>
          </div>
          <div class="card text-center">
            <img
              src="https://images.unsplash.com/photo-1760110756737-9ea31c02ba45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxjYW1hJTIwY29uZm9ydCVDMyVBMXZlbCUyMHBhcmElMjBwZXRzfGVufDB8fHx8MTc2Mzk5NDI5MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Cama para pets" class="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h3 class="text-xl font-semibold mb-2">Cama Confortável</h3>
            <p class="text-lg font-bold text-green-600">R$ 89,90</p>
          </div>
        </div>
      </div>
    </organism-featured-products>
    <organism-about-petshop class="block py-16 px-4 bg-white">
      <div class="container mx-auto text-center max-w-4xl">
        <h2 class="text-3xl font-bold mb-8">Sobre Nós</h2>
        <p class="text-lg leading-relaxed">O Petshop Amigável foi fundado com o objetivo de oferecer cuidados de
          qualidade para cães, gatos e outros animais de estimação. Nossa equipe é apaixonada por pets e trabalha com
          dedicação para garantir o bem-estar dos seus companheiros. Venha nos conhecer e veja a diferença que um
          atendimento acolhedor faz!</p>
      </div>
    </organism-about-petshop>
    <organism-social-links class="block py-8 px-4 bg-gray-100 text-center">
      <div class="container mx-auto">
        <h3 class="text-xl font-semibold mb-4">Siga-nos nas Redes Sociais</h3>
        <div class="flex justify-center space-x-6">
          <a href="#" class="text-2xl hover:text-blue-600">📘 Facebook</a>
          <a href="#" class="text-2xl hover:text-pink-600">📷 Instagram</a>
          <a href="#" class="text-2xl hover:text-green-600">💬 WhatsApp</a>
        </div>
      </div>
    </organism-social-links>
    <organism-footer-info class="block bg-green-600 text-white py-8 px-4">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h4 class="font-bold mb-2">Contato</h4>
          <p>Endereço: Rua dos Pets, 123</p>
          <p>Telefone: (11) 99999-9999</p>
          <p>E-mail: contato@petshopamigavel.com</p>
        </div>
        <div>
          <h4 class="font-bold mb-2">Links Úteis</h4>
          <a href="#" class="block hover:text-green-200">Política de Privacidade</a>
          <a href="#" class="block hover:text-green-200">Termos de Uso</a>
        </div>
        <div>
          <h4 class="font-bold mb-2">© 2023 Petshop Amigável</h4>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </organism-footer-info>
  </home-100554>
</body>

</html>
    `
}

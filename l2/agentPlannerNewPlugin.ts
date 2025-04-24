/// <mls shortName="agentPlannerNewPlugin" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';

import {
  getNextPendingStepByAgentName,
  getNextInProgressStepByAgentName,
  calculateStepsStatistics,
  updateStepStatus
} from "./_100554_aiAgentHelper";

import {
  startNewAiTask,
  executeNextStep,
  startNewInteractionInAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentPlannerNewPlugin";

export function createAgent(): IAgent {
  return {
    agentName,
    avatar_url:svg_agent,
    agentDescription: "Planejador responsável por definir os detalhes de criação de  um novo plugin no sistema",
    visibility: "public",
    async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _beforePrompt(context);
    },
    async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _afterPrompt(context);
    }
  };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  const taskTitle = "Planning";

  if (!context || !context.message) throw new Error("Invalid context");

  if (!context.task) {
    // using temporary context, create a new task
    const inputs = await getPrompts(context.message.content, null);
    await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
  } else {

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
      throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
    const inputs = await getPrompts(step.prompt, step.rags);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
  }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  if (!context || !context.message || !context.task) throw new Error("Invalid context");
  const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
  const { flexible } = calculateStepsStatistics([step], true);
  if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
  context.task = await updateStepStatus(context.task, step.stepId, "completed");
  await executeNextStep(context);
}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
  if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
  const prompts: mls.msg.IAMessageInputType[] = [];

  prompts.push(systemMainInstruction());
  prompts.push(systemRulesInstruction()); 
  prompts.push(systemRules2Instruction());
  prompts.push(systemOutInstruction());
  prompts.push({
    type: 'human',
    content: prompt
  });
  return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `
Você é um planejador responsável por definir os detalhes de criação de  um novo plugin no sistema.

Com base no prompt original do usuário, sua tarefa é:
1. Entender o propósito do plugin
2. Escolher o melhor nome para o plugin
3. Determinar o tipo da página, usando o enum "PluginType".
6. Definir restrições e requerimentos técnicos ou funcionais.
7. Se os dados forem suficientes, preparar a chamada para o agente "agentCreateNewPlugin".
8. Se faltar qualquer informação, retornar uma "clarificationMessage".
9. Entender se é um plugin interno usado  para configuração do próprio sistema de desenvolvimento  
`
  }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `##Classifique o tipo de plugin de acordo com as informações:
Estamos em um sistema de desenvolvimento(collab.codes) que cria sistemas para o usuario.

Para determinar o tipo adequado de plugin com base no prompt do usuário, utilize as seguintes definições e critérios:

# 1. Development (dev-only)
Descrição: Plugins que rodam  no ambiente de desenvolvimento para ajudar no desenvolvimento de uma página.

Responsabilidades: 
   -Criar scaffolding de código.
   -Validar schema ou estrutura de arquivos.
   -Executar testes e ferramentas de debugging.
   -Definir opções de configuração personalizadas.

Exemplos de Uso:

   - Plugin que gera automaticamente a estrutura de um novo módulo.
   - Plugin que valida a consistência de um schema JSON durante o desenvolvimento.

Publicado:Não (Usado apenas localmente no ambiente de desenvolvimento).

Critérios para Seleção:

   - Se o plugin não for necessário em produção.
   - Se tiver impacto apenas na fase de desenvolvimento e testes ou na configuração do sistema.

# 2. Frontend Plugin (frontend)
Descrição: Plugins que rodam no cliente (navegador), permitindo personalização e extensão da UI/UX.

Responsabilidades:
  - Adicionar ou modificar componentes visuais.
  - Criar novas rotas ou páginas.
  - Injetar lógica de UI dinâmica.

Exemplos de Uso:

  - Plugin que adiciona um tema customizado ao sistema.
  - Plugin que inclui widgets reutilizáveis na interface.
  - Plugin que adiciona um painel de configurações dinâmico.

Publicado? Sim (Distribuído no bundle do frontend).

Critérios para Seleção:

  - Se o comportamento do plugin ocorre apenas no lado do cliente.
  - Se ele interage diretamente com elementos da interface do usuário.

#3. Fullstack Plugin (fullstack)
Descrição: Plugins que operam tanto no frontend quanto no backend, permitindo funcionalidades completas que requerem integração entre ambos.

Responsabilidades:
  - Comunicação entre o frontend e backend.
  - Processamento de dados no backend e exibição no frontend.
  - Sincronização de estado entre cliente e servidor.

Exemplos de Uso:
  - Plugin de chat em tempo real.
  - Plugin que permite criação e envio de formulários com validação server-side.
  - Plugin de dashboards dinâmicos que consomem dados do backend.

Publicado? Sim (Incluído no frontend e backend).

Critérios para Seleção:
  - Se a funcionalidade envolve comunicação entre o cliente e o servidor.
  - Se depende de um backend para processar e armazenar informações.

#4. Middleware Plugin (middleware)
Descrição: Plugins que operam no backend intermediando requisições HTTP, manipulando dados antes que cheguem ao endpoint final.

Responsabilidades:
  - Modificar requisições ou respostas antes de serem processadas.
  - Aplicar regras de segurança e autenticação.
  - Registrar logs ou métricas de uso.

Exemplos de Uso:
  - Plugin de autenticação JWT para proteger rotas.
  - Plugin de rate limiting para controlar requisições excessivas.
  - Plugin de logging que registra acessos e erros.

Publicado? Sim (Executado no backend).

Critérios para Seleção:
  - Se o comportamento ocorre apenas no backend e afeta requisições HTTP.
  - Se lida com autenticação, segurança ou manipulação de headers e cookies.

#5. Config Plugin (config)

Descrição: Plugins responsáveis por definir ou modificar configurações da plataforma de desenvolvimento.

Responsabilidades:

  - Definir opções de configuração personalizadas.
  - Criar ou modificar estruturas de configuração do sistema.

Exemplos de Uso:

  - Plugin que permite a criação dinâmica de novas páginas.
  - Plugin que gera dashboard sobre o projeto.
  - Plugin de criação de templates
  - Plugin de criação de projetos
  - Plugin que adiciona novas configurações ao painel de administração.

Publicado? Não (Usado internamente pelo sistema de desenvolvimento).

Critérios para Seleção:

   - Plugin que permite a criação dinâmica de novas páginas.
   - Plugin que adiciona novas funcionalidades ao próprio sistema de desenvolvimento(collab-codes).
`
  }
}

function systemRules2Instruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Regras adicionais:
	•	O nome da plugin deve ser no formato pluginXxx , onde ‘plugin’ é o sufixo obrigatório.
	•	Se o tipo da plugin estiver ambíguo, retorne uma clarificationMessage solicitando mais detalhes ao usuário.
`
  }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Formato de saída:

Você deve retornar **apenas um dos seguintes formatos** no array JSON:

\`\`\`json
  {{
     "type": "agent",
    "agentName": "agentCreateNewPlugin",
    "taskTitle": string,
    "prompt": string,
    "pluginName": string,
    "pluginDescription": string,
    "pluginIconSvg": string, // retorna um svg para exemplificar esse plugin
    "pluginType": "fullstack" | "dev-only" | "frontend" | "middleware" | "config"
    "requirements": string,
  }
\`\`\`

ou
\`\`\`json
  {{
    "type": "clarification",
    "clarificationMessage": string,
    "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  },
\`\`\`  
`
  }
}

/// <mls shortName="agentPlannerNewPlugin" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { AgentBase, IAgentBase } from './_100554_iaAgentBase';

export class agentPlannerNewPlugin extends AgentBase implements IAgentBase {

    public task: mls.msg.TaskData | undefined;
    public visibility: 'public' | 'private' = 'private';

    public getPrompt(prompt: string | undefined): mls.msg.IAMessageInputType[] {
        return this.getMyImputs(prompt || '');
    }

    public async afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void> {
        return this._afterPrompt(payload);
    }

    //---------IMPLEMENTS-------------

    private async _afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void> {

    }

    private getMyImputs(prompt: string): mls.msg.IAMessageInputType[] {

        return [
            {
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
            },
            {
                type: 'system',
                content: `
## Formato de saída:

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
            },
            {
                type: 'system',
                content: `
## Plugins já existentes no projeto, não utilizar os seguintes nomes:

['pluginNewProject', 'pluginExplore']
`
            },
            {
                type: 'system',
                content: `
##Classifique o tipo de plugin de acordo com as informações:
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
            },
            {
                type: 'system',
                content: `
## Regras adicionais:
	•	O nome da plugin deve ser no formato pluginXxx , onde ‘plugin’ é o sufixo obrigatório.
	•	Se o tipo da plugin estiver ambíguo, retorne uma clarificationMessage solicitando mais detalhes ao usuário.
`
            },
            {
                type: 'human',
                content: prompt || ''
            },
        ]

    }

}
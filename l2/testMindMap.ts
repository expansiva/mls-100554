/// <mls shortName="testMindMap" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

 import { html } from 'lit'; 
 import { customElement, state } from 'lit/decorators.js';
 import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

 @customElement('test-mind-map-100554')
 export class TestMindMap100554 extends StateLitElement {

   @state() result: any = null;

  // Called when component is added to DOM
  async firstUpdated() {
    // Use seu path conforme necessário
    const path = new mls.mindmap.MindMapNodePathInput("project", "100555");
    this.result = await start();
  }
  
  render() {
    return html`<pre>${JSON.stringify(this.result, null, 2)}</pre>`;
  }
 }

 mls.mindmap.addBase('project', {
  id: 'project',
  label: 'Project',
  related: ['pages', 'tables', 'widgets'],
  element: 'widget-mindmap-project'
});

mls.mindmap.addDynamic('project', async (path: mls.mindmap.MindMapNodePathInput): Promise<mls.mindmap.MindMapNodeItem[]> => {
  const results:mls.mindmap.MindMapNodeItem[] = [];
  if (!path || !path.domain || path.domain !== 'project' || !path.entity) {
    throw new Error(`[mindmap addDynamic] Invalid path for project: ${path ? path.toString() : 'undefined'}`);
  }
  const projectId = parseInt(path.entity, 10);
  const selectedProject = mls.l5.getProjectDetails(projectId);
  if (!selectedProject) throw new Error(`[mindmap addDynamic] Project with ID ${projectId} not found, path: ${path.toString()}`);
  const pages: string[] = ['home', 'about', 'contact']; // Example static pages, replace with actual logic
  results.push({
    id: "project/pages",
    label: "Pages",
    position: 'left',
    sizeHint: 'panel',
    children: pages.map(page => `page/${page}`)
  })

  const tables: string[] = ['users', 'orders']; // Example static tables, replace with actual logic
  results.push({
    id: "project/tables",
    label: "Tables",
    position: 'left',
    sizeHint: 'panel',
    children: tables.map(table => `table/${table}`)
  })
  return results;
});


mls.mindmap.addBase('projects', {
  id: 'projects',
  label: 'Projects',
  related: ['project'],
  element: 'widget-mindmap-projects'
});

mls.mindmap.addDynamic('projects', async (path: mls.mindmap.MindMapNodePathInput): Promise<mls.mindmap.MindMapNodeItem[]> => {
  const results: mls.mindmap.MindMapNodeItem[] = [];
  let orgIndex: number = Number.isNaN(Number(path.entity)) 
    ? (mls.l5.actualOrg ?? 0) 
    : Number(path.entity);
  const orgName: string = mls.l5.getOrgsName()[orgIndex] || "?";
  results.push({
    id: `projects`,
    label: `projects from organization (${orgIndex}) ${orgName}`
  });
  const projects = mls.l5.getProjectsInOrg(orgIndex);
  for (const prjID of projects) {
    const prj = mls.l5.getProjectDetails(prjID);
    if (prj) {
      results.push({
        id: `projects/${prj.id.toString()}`,
        label: prj.name,
        position: 'right',
        sizeHint: 'line'
      });
    }
  }
  return results;
});

mls.mindmap.addBase('organizations', {
  id: 'organizations',
  label: 'organizations',
  related: ['projects'],
  element: 'widget-mindmap-organizations'
});

mls.mindmap.addDynamic('organizations', async (path: mls.mindmap.MindMapNodePathInput): Promise<mls.mindmap.MindMapNodeItem[]> => {
  const results: mls.mindmap.MindMapNodeItem[] = [];
  results.push({
    id: `organizations`,
    label: `organizations`
  });
  const organizations: string[] = mls.l5.getOrgsName();
  for (const orgName of organizations) {
      results.push({
        id: `organizations/${orgName.replace(/\//g, "_")}`,
        label: orgName,
        position: 'right',
        sizeHint: 'line'
      });
  }
  return results;
});

const start = async () => {
  return await mls.mindmap.getMindMapNodes(new mls.mindmap.MindMapNodePathInput("projects"));
}


// sugestoes de mind map do gemini
const gemini = {
  "id": "map_root", // ID único do nó raiz
  "text": "Nome do Projeto ou Tópico Central", // O texto principal do nó
  "type": "root", // Indica o tipo de nó (raiz, tópico, tarefa, etc.)
  // Status pode ser útil para o nó raiz se o projeto tiver um status geral
  // "status": "in_progress", 
  "children": [ // Array dos nós filhos/ramos diretos
    {
      "id": "branch_estrutura", 
      "text": "Estrutura do Projeto (Entidades)", 
      "type": "category", // Tipo: uma categoria ou ramo principal
      "children": [
        {
          "id": "entity_usuario",
          "text": "Entidade Usuário",
          "type": "entity", // Tipo: uma entidade
          // Status não se aplica muito a entidades, mas poderia ser "definido"
          "children": [
            {
              "id": "attr_usuario_nome",
              "text": "Atributo: Nome",
              "type": "attribute", // Tipo: um atributo
              "children": [] // Sem filhos
            },
            {
              "id": "attr_usuario_email",
              "text": "Atributo: Email",
              "type": "attribute",
              "children": []
            }
          ]
        },
        {
          "id": "entity_produto",
          "text": "Entidade Produto",
          "type": "entity",
          "children": [] // Pode ter atributos aqui também
        }
      ]
    },
    {
      "id": "branch_tarefas",
      "text": "Planejamento (Tarefas & Workflow)",
      "type": "category",
      "children": [
        {
          "id": "task_design_ui",
          "text": "Desenhar UI Principal",
          "type": "task", // Tipo: uma tarefa
          "status": "todo", // Status da tarefa
          "children": []
        },
        {
          "id": "workflow_cadastro",
          "text": "Workflow de Cadastro de Usuário",
          "type": "workflow", // Tipo: um workflow
          "status": "draft", // Status do workflow
          "children": [
            {
               "id": "step_cadastro_1",
               "text": "Passo 1: Coletar dados",
               "type": "workflow_step",
               "children": []
            },
             {
               "id": "step_cadastro_2",
               "text": "Passo 2: Validar email",
               "type": "workflow_step",
               "children": []
            }
          ]
        },
         {
          "id": "suggestions",
          "text": "Sugestões de Usuário",
          "type": "category",
          "children": [
            {
                "id": "suggestion_1",
                "text": "Permitir login social",
                "type": "suggestion",
                "status": "検討中", // Em consideração (termo comum em gestão de projetos japoneses/asiáticos)
                "children": []
            },
             {
                "id": "suggestion_2",
                "text": "Adicionar tema escuro",
                "type": "suggestion",
                "status": "open",
                "children": []
            }
          ]
        }
      ]
    }
  ]
}
/// <mls shortName="agentAnalyzeNewModuleBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export type Visibility = 'public' | 'client' | 'admin';


export interface IAgentCreateSitePrompt {
    data: ModuleDefinition,
    response : TemplateContent[] | undefined
}

export interface ModelDefinition {
    prisma: string;
    fields: string;
}

export interface UserStory {
    as: string;
    iWant: string;
    soThat: string;
}

export interface NavigationItem {
    to: string;
    action: string;
}

export interface Task {
    id: string;
    name: string;
    agentName: string;
    urlName: string;
    useModels: string[];
    description: string;
    visibleTo?: Visibility[];
    businessRules: string[];
    userStories: UserStory[];
    navigation: NavigationItem[];
}

export interface ModuleDefinition {
    moduleGoal: string;
    stylePreferences: object;
    models: Record<string, ModelDefinition>;
    tasks: Task[];
    moduleConstrains: string[];
}

// Estado de UI
export interface UIState {
  name: string;
  description: string;
}

export interface OrganismOrMolecule {
  name: string;
  description: string;
  attributes: string;
}

export interface ChildElement {
  class: string;
  description: string;
  organismOrMolecule: OrganismOrMolecule;
}

export interface Organism {
  name: string;
  exists: boolean;
  reusable: boolean;
  description: string;
  layoutRole: string;
  childs: ChildElement[];
}

export interface TemplateChild {
  class: string;
  organism: Organism;
}

export interface Template {
  name: string;
  exists: boolean;
  reusable: boolean;
  description: string;
  childs: TemplateChild[];
}

export interface TemplateContent {
  id: string;
  uiStates: UIState[];
  template: Template;
  implementationNotes: string[];
}




/// <mls shortName="agentAnalyzeNewModuleBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export type Visibility = 'public' | 'client' | 'admin';

export interface IAgentCreateSitePrompt {
  data: ModuleDefinition,
  response: TemplateContent[] | undefined
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
  urlName?: string;
  promptToCreatePage?: string;
  pageName?: string;
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

export interface Molecule {
  name: string;
  medias?: Media[];
  description: string;
  attributes: { key: string, value: string }[];
  widget?: string;
}

export interface Media {
  name: string;
  mediaType: 'image' | 'sound' | 'video';
  searchText: string;
}

export interface ChildElement {
  class: string;
  description: string;
  organismOrMolecule: Organism | Molecule;
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
  pageName: string,
  uiStates: UIState[];
  template: Template;
  implementationNotes: string[];
}



// agentAnalyzeNewModule1
export interface ClarificationData {
  json: ClarificationJson,
  taskId: string,
  stepId: number,
  clarificationMessage: string,
  promptUser: string,
}

export interface ClarificationJson {
  goal: string;
  websiteType: string;
  pageFormat: string;
  entities: Entity[];
  features: string[];
  openQuestions: OpenQuestion[];
  constraints: string[];
  stylePreferences: StylePreferences
}

export interface Entity {
  name: string;
  fields: string[];
}

export interface OpenQuestion {
  id: string;
  question: string;
  userResponse: string;
}

export interface StyleAttribute {
  value: number;
  description: string;
}

export interface BrandPersonality {
  sincerity: StyleAttribute;
  excitement: StyleAttribute;
  competence: StyleAttribute;
  sophistication: StyleAttribute;
  ruggedness: StyleAttribute;
}

export interface ToneOfVoice {
  funny_serious: StyleAttribute;
  formal_casual: StyleAttribute;
  respectful_irreverent: StyleAttribute;
  enthusiastic_matterOfFact: StyleAttribute;
}

export interface StylePreferences {
  brandPersonality: BrandPersonality;
  toneOfVoice: ToneOfVoice;
}

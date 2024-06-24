/// <mls shortName="icaBase" project="100554" enhancement="_blank" />
				
export type FormComponent = {
  group: string;
  description: string;
  prompt?: string;
  attributes?: string; 
  events?:string;
};

export type AttributeDefinition = {
  path: string;
  lit: string;
  variations?: boolean
};

export type EventsDefinition = {
  name: string;
  desc: string;
  group?: string[];
};


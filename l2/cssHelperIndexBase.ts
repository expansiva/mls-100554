/// <mls shortName="cssHelperIndexBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export type IMode = 'collapsed' | 'expanded' | 'full';

export interface IHelpers {
    name: string,
    priority: number,
    widget: string,
    tags: string[],
    description: string,
    mode: IMode,
    liked: boolean,
    likedAnimation: boolean,
    showInfo: boolean
}
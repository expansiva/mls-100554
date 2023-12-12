/// <mls shortName="serviceBase" project="100554" enhancement="_100541_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('service-base-100554')
export abstract class ServiceBase extends LitElement implements IServiceMethods {

    @property({ type: String, reflect: true })
    public level: mls.events.Level | undefined;

    @property({ type: String, reflect: true })
    public position: 'left' | 'right' | undefined;

    abstract details: IService | undefined;

}

export interface IService {
    icon: string,
    name: string,
    mode: IServiceMode,
    position: IServicePosition
    readOnly: boolean,
    tooltip: string,
    className: string,
    tags: string[],
    levels: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
}

export type IServicePosition = 'left' | 'right' | 'all';
export type IServiceMode = 'A' | 'H' | 'D' | 'B';// active, hidden, disabled, 

interface IServiceMethods {
   details: IService | undefined;
}

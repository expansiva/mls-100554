/// <mls shortName="icaTypes" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { LitElement } from 'lit';

export type FormComponent = {
    group: string;
    attributes?: string;
    events?: string;
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

export interface IActionsToolbox {
    position: 'p-l0' | 'p-l1' | 'p-l2' | 'p-l3' | 'p-l4' | 'p-l5' | 'p-m0' | 'p-m1' | 'p-m2' | 'p-m3' | 'p-m4' | 'p-r0' | 'p-r1' | 'p-r2' | 'p-r3' | 'p-r4' | 'p-title' | '',
    tp: 'menu' | 'button' | 'back-button' | 'action' | 'event',
    format: 'square' | 'circle' | '',
    title: string | undefined,
    iconSvg: string | undefined,
    onclick: Function | undefined,
    menuItens: IActionsToolboxMenu[],
    menuSubItens: IActionsToolboxMenu[],
    widget: string | undefined,
    cursor: string | undefined,
    attrs: IAttr[] | undefined,
    isDblClick: boolean,
}

export interface IAttr {
    attr: string,
    value: string
}

export interface IActionsToolboxMenu {
    iconSvg: string,
    text: string,
    onclick: Function
}

export interface IActionLevels {
    '1': IActionsToolbox[],
    '2': IActionsToolbox[],
    '3': IActionsToolbox[],
    '4': IActionsToolbox[],
    '5': IActionsToolbox[],
    '6': IActionsToolbox[],
    '7': IActionsToolbox[],
}

export interface ActionTag {
    name: string; // tag name or component name
    position?: 'p-l0' | 'p-l1' | 'p-l2' | 'p-l3' | 'p-l4' | 'p-m0' | 'p-m1' | 'p-m2' | 'p-m3' | 'p-m4' | 'p-r0' | 'p-r1' | 'p-r2' | 'p-r3' | 'p-r4' | 'p-title' ; // suggestion of position, WCD will define
    args?: string; // optional args string, can be a JSON string
    level?: number[]; // levels where this will be visible
    toolboxOptions?: IToolboxOptions
}

export interface IToolboxOptions {
    background?: string,
    border?: string,
}

export interface IcaLitElementBaseMethods extends LitElement {
    level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;
    globalVariation: number | undefined;
    widget: string | undefined;
    overlayRef: HTMLElement | undefined;
    mySymbol: string;
    getActionsTags(): ActionTag[];
    changeStateStyle(info: {}): void;
    changeStateHtml(info: string): void;
    allowCommand(cmd: 'move' | '', scope: HTMLElement, target: HTMLElement): IAllowCommand;
    getICAComponents(scope: HTMLElement): IcaLitElementBaseMethods[];
    getMyScope(): IcaLitElementBaseMethods | HTMLElement | undefined;
    getIcaParent(target: HTMLElement): IcaLitElementBaseMethods | undefined;
    getMyInfos(): { root: string, subGroup: string, finalGroup: string };
    getMyEvents(): string;
    getDefinitionFromEvent(event: string): string;
    getAtributtes(): string[];
}

export interface IICADepths {
    element: IcaLitElementBaseMethods,
    depth: number,
    x: number,
    y: number,
    height: number,
    width: number,
    opacity: string,
}

export interface IAllowCommand {
    inside: boolean,
    before: boolean,
    after: boolean
}
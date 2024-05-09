/// <mls shortName="icaGlobal" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
export const PREFIX = 'ica'
export const PREFIXWCD = 'wcd'
export const ATTRGROUP = 'isicagroup'
export const ICAPAGE = 'ica-page-100554'

export interface IActionsToolbox {
    position: 'p-l1' | 'p-l2' | 'p-l3' | 'p-l4' | 'p-l5' | 'p-m1' | 'p-m2' | 'p-m3' | 'p-m4' | 'p-r1' | 'p-r2' | 'p-r3' | 'p-r4' | '',
    tp: 'menu' | 'button' | 'back-button' | 'action' ,
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

export interface IAttr{
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


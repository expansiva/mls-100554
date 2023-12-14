/// <mls shortName="toolbarService" project="100554" enhancement="_100554_enhancementLit" groupName="navigation" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('toolbar-service-100554')
export class ToolbaarService_100554 extends LitElement {
    
    @property()
    name: string = 'Somebody';

    render() {
        return html`
        <header class="header">
            <div>
                <label class="menu-icon">
                    <input class="menu-btn" type="checkbox"/>					
                    <span class="navicon"></span>
                </label>
                <ul class="icon-menu"></ul>
                <span class="logo">Title</span>
            </div>
            <ul class="menu"></ul>
            <div class="action" style="display:none"></div>
		</header>`;
    }
}


export interface IMenuKeyValue {
	[key: string]: string
}
export interface IIconsKeyValue {
	[key: string]: string
}

export type IClickLinkCallBack = (op: string) => boolean | undefined;
export type IClickIconCallBack = (op: string) => void | undefined;

export type ISetMode = (mode: IMode | null, page?: HTMLElement) => void;
export type IGetLastMode = () => IMode;
export type IMode =
	'initial' // show siblings with hamburguer icon
	| 'page' // show page (About ...) with close icon
	| 'editor'; // show siblings with close icon
export interface IMenu {
	title: string,
	// breadcrumbs: IMenuKeyValue,
	actions: IMenuKeyValue,
	icons: IIconsKeyValue,
	actionDefault: string,
	iconDefault: string,
	onClickLink: IClickLinkCallBack,
	onClickIcon: IClickIconCallBack,
	setMode: ISetMode,
	setIconActive: (op: string) => void
	getLastMode: IGetLastMode,
	lastIcon: string,
	updateTitle: Function,
}

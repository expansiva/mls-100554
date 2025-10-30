/// <mls shortName="collabMenuWithSubMenu" project="100554" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

export interface IMenu {
    name: string;
    icon: string;
    menu: IMenuItem[];
}

export interface IMenuItem {
    title: string;
    icon: string;
    url: string;
    pageName: string;
    children?: IMenuItem[];
}

@customElement('collab-menu-with-sub-menu-100554')
export class WidgetMenuNavigation extends StateLitElement {

    @property() keyFavoritesLocalStorage: string = 'menuFavorites';

    @property() identifier: string = '';

    @property() menuTitle: string = '';

    @state() menuModules: IMenu[] = [
        {

            name: 'MDM',
            icon: '<i class="icon-mdm"></i>',
            menu: [
                {
                    title: 'Pessoas',
                    icon: '👤',
                    url: '/pessoas',
                    pageName: 'pessoas',
                    children: [
                        {
                            title: 'Cadastrar',
                            icon: '➕',
                            url: '/pessoas/add',
                            pageName: 'pessoas_add',
                            children: []
                        },
                        {
                            title: 'Cadastrar2',
                            icon: '➕',
                            url: '/pessoas/add',
                            pageName: 'pessoas_add2',
                            children: []
                        },
                        {
                            title: 'Cadastrar3',
                            icon: '➕',
                            url: '/pessoas/add',
                            pageName: 'pessoas_add3',
                            children: [
                                {
                                    title: 'Cadastrar4',
                                    icon: '➕',
                                    url: '/pessoas/add',
                                    pageName: 'pessoas_add4',
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'MDM2',
            icon: '<i class="icon-mdm"></i>',
            menu: [
                {
                    title: 'Pessoas',
                    icon: '👤',
                    url: '/pessoas',
                    pageName: 'pessoas',
                    children: [
                        {
                            title: 'Cadastrar',
                            icon: '➕',
                            url: '/pessoas/add',
                            pageName: 'pessoas_add',
                            children: []
                        }
                    ]
                }
            ]
        }
    ];

    @state() favorites: string[] = [];


    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        this.loadFavorites();
    }

    private loadFavorites() {
        const saved = localStorage.getItem(this.keyFavoritesLocalStorage);
        if (!saved) {
            this.favorites = [];
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                const currentProject = this.identifier.toString() ?? 'default';
                this.favorites = parsed[currentProject] ?? [];
            }
        } catch (err) {
            console.warn('Erro ao ler favoritos:', err);
            this.favorites = [];
        }
    }


    private getItemPath(moduleItem: IMenu, item: IMenuItem): string {
        const findPath = (menu: IMenuItem[], target: IMenuItem, path: string[]): string[] | null => {
            for (const m of menu) {
                const currentPath = [...path, m.title];
                if (m === target) return currentPath;
                if (m.children) {
                    const found = findPath(m.children, target, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };

        const path = findPath(moduleItem.menu, item, [moduleItem.name]);
        return path ? path.join('/') : moduleItem.name;
    }


    private toggleFavorite(moduleItem: IMenu, item: IMenuItem) {
        const key = this.getItemPath(moduleItem, item);
        const currentProject = this.identifier.toString() ?? 'default';

        let stored: Record<string, string[]> = {};
        try {
            const raw = localStorage.getItem(this.keyFavoritesLocalStorage);
            stored = raw ? JSON.parse(raw) : {};
        } catch {
            stored = {};
        }

        if (!Array.isArray(stored[currentProject])) {
            stored[currentProject] = [];
        }

        const favorites = stored[currentProject];
        const index = favorites.indexOf(key);

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(key);
        }

        stored[currentProject] = favorites;
        localStorage.setItem(this.keyFavoritesLocalStorage, JSON.stringify(stored));

        this.favorites = favorites;
        this.requestUpdate();
    }

    private isFavorite(moduleItem: IMenu, item: IMenuItem): boolean {
        const key = this.getItemPath(moduleItem, item);
        return this.favorites.includes(key);
    }

    private handleMenuClick(item: IMenuItem) {
        this.dispatchEvent(new CustomEvent('menu-selected', { detail: item }));
    }

    private renderMenuItem(moduleItem: IMenu, item: IMenuItem): any {
        const hasChildren = item.children && item.children.length > 0;

        return html`
			<li class="menu-item">
				<div class="menu-item-header" @click=${() => this.handleMenuClick(item)}>
					<span class="icon" .innerHTML=${item.icon}></span>
					<span class="title">${item.title}</span>
					<span
						class="favorite ${this.isFavorite(moduleItem, item) ? 'active' : ''}"
						title="Favoritar"
						@click=${(e: Event) => {
                e.stopPropagation();
                this.toggleFavorite(moduleItem, item);
            }}
					>★</span>
				</div>

				${hasChildren
                ? html`
						<ul class="submenu">
							${item.children!.map(child => this.renderMenuItem(moduleItem, child))}
						</ul>
					`
                : null}
			</li>
		`;
    }

    render() {
        return html`
			<div class="menu-container">
				<h3>Favoritos</h3>
                ${this.favorites.length === 0
                ? html`<p class="empty">Nenhum favorito.</p>`
                : html`
                        <ul class="favorites">
                            ${this.favorites.map(favKey => {
                    const item = this.findItemByPath(favKey);
                    if (!item) return null;

                    const pathDisplay = favKey.replace(/\//g, ' / ');

                    return html`
                        <li 
                            class="favorite-item"
                            title=${pathDisplay}
                            @click=${() => this.handleMenuClick(item)}
                        >
                            <span class="icon" .innerHTML=${item.icon}></span>
                            <span class="title">${pathDisplay}</span>
                        </li>
                    `;
                })}
                        </ul>
                    `}


				<h3>${this.menuTitle}</h3>
				${this.menuModules.map(
                    module => html`
						<details class="menu-module">
							<summary>
								<span class="icon" .innerHTML=${module.icon}></span>
								<span class="name">${module.name}</span>
							</summary>
							<ul class="menu-list">
								${module.menu.map(item => this.renderMenuItem(module, item))}
							</ul>
						</details>
					`
                )}
			</div>
		`;
    }

    private findItemByPath(path: string): IMenuItem | null {
        const parts = path.split('/');
        const moduleName = parts.shift();
        const module = this.menuModules.find(m => m.name === moduleName);
        if (!module) return null;

        let currentItems = module.menu;
        let found: IMenuItem | null = null;

        for (const part of parts) {
            found = currentItems.find(i => i.title === part) || null;
            if (!found) return null;
            currentItems = found.children || [];
        }

        return found;
    }
}

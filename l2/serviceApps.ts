/// <mls shortName="serviceApps" project="100554" enhancement="_100554_enhancementLitService" />

import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { collabImport } from './_100554_collabImport';
import './_100554_collabMenuWithSubMenu';
import { IMenuItem } from './_100554_collabMenuWithSubMenu';

@customElement('service-apps-100554')
export class ServiceApps100554 extends ServiceBase {

	@state() menuModules: IMenuModule[] = [];
	

	public details: IService = {
		icon: '&#xf0ca',
		state: 'foreground',
		position: 'right',
		tooltip: 'Apps',
		visible: true,
		widget: '_100554_serviceApps',
		level: [7]
	}

	public onClickMain(op: string): void {
		if (this.menu.setMode) this.menu.setMode('initial');
	}

	public menu: IServiceMenu = {
		title: '',
		main: {},
		tools: {},
		tabs: undefined,
		onClickMain: this.onClickMain.bind(this),
	}

	onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

		if (visible) {
			this.getModules();
		}

	}

	async firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
		super.firstUpdated(_changedProperties);
		await this.getModules();
	}

	render() {
		return html`
			<div class="menu-container">
				<collab-menu-with-sub-menu-100554
					.menuModules=${this.menuModules} 
					menuTitle="Módulos"
					keyFavoritesLocalStorage="modulesMenuFavorites"
					identifier=${mls.actualProject?.toString() || ''}
					@menu-selected=${(e: CustomEvent) => this.handleMenuClick(e)}
				>
				</collab-menu-with-sub-menu-100554>
			</div>
		`;
	}

	private handleMenuClick(ev: CustomEvent) {
		console.info(ev.detail)
		const item: IMenuItem = ev.detail;
		mls.actual[7].setFullName(item.url);
		window.preview.iframe = undefined;
		mls.services['100554_servicePreview_right']?.onReloader();
	}

	private async getModules() {
		const actualProject = mls.actualProject;
		if (!actualProject) return;

		const moduleProject = await collabImport({ folder: '', project: actualProject, shortName: 'project', extension: '.ts' });
		if (!moduleProject?.modules || !Array.isArray(moduleProject.modules)) return;

		const modules: IMenuModule[] = [];


		for await (let _module of moduleProject.modules) {
			if (!_module) continue;
			const moduleMenu: IMenuModule = {
				menu: [],
				icon: _module.icon || '',
				name: _module.name
			};

			const isDep = _module.path.startsWith('_');
			let prjImport = actualProject;
			let pathImport = _module.path?.replace('/', '_');

			if (isDep) {
				const iPath = mls.l2.getPath(_module.path);
				if (!iPath.project) continue;
				const { folder, project, shortName} = iPath;
				prjImport = project;
				pathImport = folder ? folder + '/' + shortName : shortName;
				pathImport = pathImport.replace('/', '_');
			}


			const moduleInstance = await collabImport({ folder: pathImport, project: prjImport, shortName: 'module', extension: '.ts' });
			const moduleConfig = moduleInstance?.moduleConfig;
			if (!moduleConfig?.menu || moduleConfig.menu.length === 0) continue;
			modules.push(moduleMenu);


			/*
			moduleConfig.menu.forEach((m: IModuleMenuItem) => {
				const url = `_${actualProject}_${_module.path}/${m.pageName}`;
				if (m.children) {

				}
				moduleMenu.menu.push({
					...m,
					url,
				});
			});*/

			moduleConfig.menu.forEach((m: IModuleMenuItem) => {
				const buildUrls = (item: IModuleMenuItem): IModuleMenuItem => {
					const url = `_${actualProject}_${_module.path}/${item.pageName}`;
					const newItem: IModuleMenuItem = { ...item, url };

					if (item.children && item.children.length > 0) {
						newItem.children = item.children.map(child => buildUrls(child));
					}

					return newItem;
				};

				const newItem = buildUrls(m);
				moduleMenu.menu.push(newItem);
			});
		}

		this.menuModules = [...modules]; // força atualização reativa
	}

}

interface IMenuModule {
	name: string;
	icon: string;
	menu: IModuleMenuItem[];
}

interface IModuleMenuItem {
	title: string;
	icon: string;
	url: string,
	pageName: string;
	children: IModuleMenuItem[]
}

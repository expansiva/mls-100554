/// <mls shortName="mlsToolbarService" project="100554" enhancement="_100554_enhancementLit" groupName="navigation" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('mls-toolbar-service-100554')
export class ToolbaarService_100554 extends LitElement {

	@property({ type: String })
	widget = '';

	@property({ type: String })
	msize = '';

	@query('.menu')
	private menu: HTMLElement | undefined;

	@query('.icon-menu')
	private iconMenu: HTMLElement | undefined;

	@query('.menu-icon')
	private menuToogle: HTMLElement | undefined;

	@query('.menu-btn')
	private checkbox: HTMLInputElement | undefined;

	@query('.action')
	private divAction: HTMLElement | undefined;

	@query('.logo')
	private logo: HTMLElement | undefined;

	@property({ type: Object }) menuOptions: IMenu = {} as IMenu;

	createRenderRoot() {
		return this;
	}

	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		super.attributeChangedCallback(name, oldVal, newVal);
		if (name === 'msize') {
			const [width] = newVal.split(',');
			if (this.menu) this.menu.style.width = width + 'px';
			this.msize = newVal;
		}
	}

	connectedCallback() {
		if (!this.widget) {
			this.menuOptions = {
				title: 'Example',
				actions: {
					opAbout: 'About',
					opExample: 'Plugins',
				},
				icons: {},
				actionDefault: 'opExample', // call after close icon clicked
				onClickLink: undefined,
			}
			super.connectedCallback();
			return;
		}
		customElements.whenDefined(this.widget).then(() => {
			this.menuOptions = this.getMenuOptions();
			super.connectedCallback();
		});
	}

	private toogleActionPage(show: boolean, el?: HTMLElement): void {
		if (!this.divAction) return;
		if (show) {
			let element = this as HTMLElement;
			while (element.nextElementSibling) {
				element = element.nextElementSibling as HTMLElement;
				element.style.display = 'none';
			}
			this.divAction.innerHTML = '';
			if (el) this.divAction.appendChild(el);
			this.divAction.style.display = 'block';
		} else {
			let element = this as HTMLElement;
			while (element.nextElementSibling) {
				element = element.nextElementSibling as HTMLElement;
				element.style.display = '';
				element.style.height = '';
			}
			this.divAction.innerHTML = '';
			this.divAction.style.display = 'none';
		}

		if (this.menu) this.menu.style.display = 'none';
		this.layout();
	}

	private handleOnChangeMenu() {
		console.info('handleOnChangeMenu')
		if (!this.checkbox) return;
		if (this.menuToogle) {
			const parentDiv = this.menuToogle.closest('div');
			if (parentDiv) parentDiv.classList.toggle('checked', !!this.checkbox.checked);
		}

		this.layout();

		if (this.checkbox.checked) {
			if (this.menu) this.menu.style.display = 'none';
			// true = x icon (close icon)
			if (this.lastMode === 'editor') {
				this.toogleActionPage(false);
				this.setTitle(this.activeTitle);
			} else {
				this.showMenuItens();
				this.setTitle('');
			}
		} else {

			this.toogleActionPage(false);
			this.lastMode = 'initial';
			this.setTitle(this.menuOptions.title);
			if (this.menu) this.menu.style.display = 'flex';
			if (this.menuOptions.onClickLink && this.menuOptions.actionDefault) this.menuOptions.onClickLink(this.menuOptions.actionDefault);

			if (!!this.menuOptions.onClickIcon && this.menuOptions.iconDefault) {
				this.setIconActive(this.menuOptions.iconDefault);
			}

		}
	}

	private layout() {
		const serviceContent: IServiceContentEl = this.closest('mls-toolbar-content-service-100529') as IServiceContentEl;
		if (serviceContent && serviceContent.layout) serviceContent.layout();
	}

	// return widget service , ex: service_source
	private getServiceWidget(): IService {
		const parent: any = this.closest(this.widget) as any;
		if (!parent) throw new Error(`${this.widget} is not defined`);
		const widget = parent['mlsWidget'];
		return widget;
	}

	// return options menu from widget service
	private getMenuOptions(): IMenu {
		const widget = this.getServiceWidget();
		const menu = widget.menu as IMenu;
		if (!menu || typeof menu !== 'object') throw new Error('error, menu not found in widget, typeof: ' + typeof menu);
		return menu;
	}

	private setTitle(title: string) {
		if (!this.logo) return;
		this.logo.onclick = (e) => { e.preventDefault(); };
		if (this.logo) this.logo.innerText = title;
	}

	private toogleIconHamburger(show: boolean) {
		// falsee = hanburguer icon 
		// true = X icon(close icon)
		if (this.checkbox) {
			this.checkbox.checked = show;
			this.checkbox.dispatchEvent(new Event('change'));
		}
	}

	private setMode(mode: IMode, page?: HTMLElement) {
		if (!mode) mode = this.lastMode; // just update title
		this.lastMode = mode;
		if (mode === 'initial') {
			this.toogleIconHamburger(false);
			this.activeTitle = this.menuOptions.title;
		} else if (mode === 'editor') {
			this.toogleIconHamburger(true);
		} else if (mode === 'page') {
			this.toogleActionPage(true, page);
		} else throw new Error('mode invalid: ' + mode);
		this.setTitle(this.activeTitle);
	}

	private updateTitle() {
		this.activeTitle = this.menuOptions.title;
		this.setTitle(this.activeTitle);
	};

	private getLastMode: IGetLastMode = (): IMode => this.lastMode;
	private lastMode: IMode = 'initial';
	private activeTitle = '';


	private showMenuIcons(): void {
		const ul: HTMLUListElement = this.querySelector('[class="icon-menu"]') as HTMLUListElement;
		const tooltipEl = document.querySelector('mls-tooltip-100529') as any;

		if (!ul) throw new Error('error, ul class=icon-menu dont found in DOM');
		ul.innerHTML = '';

		const onClickIcon = this.getServiceWidget()['onClickIcon'] as IClickIconCallBack;
		if (!onClickIcon || typeof onClickIcon !== 'function') return;

		// prepare links actions
		const menu = this.getMenuOptions();
		const icons = menu.icons || {};
		Object.keys(icons).forEach((key): void => {
			const [title, icon] = icons[key].split(';');

			const li = document.createElement('li');
			li.setAttribute('data-key', key);
			li.setAttribute('data-tooltip', title);

			const span = document.createElement('span');
			span.classList.add('fa');
			const spanText = document.createElement('span');
			spanText.classList.add('title');
			spanText.style.display = 'none';

			spanText.innerHTML = title;
			span.innerHTML = `&#x` + icon;

			if (tooltipEl && tooltipEl.tooltip) tooltipEl.tooltip(li);

			li.onclick = (ev) => {
				ul.querySelectorAll('li').forEach((item) => {
					const text = item.querySelector('.title') as HTMLElement;
					item.classList.remove('active');
					text.style.display = 'none';
				});
				li.classList.add('active');
				spanText.style.display = 'inline';
				ev.preventDefault();
				menu.lastIcon = key;
				onClickIcon(key);
			};

			li.appendChild(span);
			li.appendChild(spanText);
			ul.appendChild(li);
		});

		if (!!menu.onClickIcon) {
			const item = ul.querySelector(`li[data-key="${menu.iconDefault}"`) as HTMLElement;
			if (item) item.click();

		}
	}

	private showMenuItens(): void {
		console.info('showMenuItens')
		if (!this.menu) return;
		this.menu.style.display = 'block';
	}

	private setIconActive(op: string) {
		const ul: HTMLUListElement = this.querySelector('[class="icon-menu"]') as HTMLUListElement;
		if (!ul) return;
		const li = ul.querySelector(`li[data-key="${op}"`) as HTMLElement;
		if (li) li.click();
	}

	onActionClick(key: string) {
		this.activeTitle = this.menuOptions.actions[key];
		if (this.menuOptions.onClickLink) this.menuOptions.onClickLink(key);
	}

	onIconClick(key: string, li: HTMLElement) {
		if (!this.iconMenu) return;
		this.iconMenu.querySelectorAll('li').forEach((item) => {
			const text = item.querySelector('.title') as HTMLElement;
			item.classList.remove('active');
			text.style.display = 'none';
		});
		li.classList.add('active');
		const spanText = li.querySelector('span');
		if (spanText) spanText.style.display = 'inline';
		this.menuOptions.lastIcon = key;
		if (this.menuOptions.onClickIcon) this.menuOptions.onClickIcon(key);
	}

	render() {
		this.setAttribute('mheight', '40');
		this.tabIndex = 0;
		this.menuOptions.setMode = this.setMode.bind(this) as any;
		this.menuOptions.updateTitle = this.updateTitle.bind(this);
		this.menuOptions.getLastMode = this.getLastMode.bind(this);
		this.menuOptions.setIconActive = this.setIconActive.bind(this);

		return html`
        <header class="header">
            <div>
                <label class="menu-icon">
                    <input class="menu-btn" type="checkbox" @change=${this.handleOnChangeMenu}/>					
                    <span class="navicon"></span>
                </label>
                <ul class="icon-menu">
				${Object.keys(this.menuOptions.icons).map(key => {
			const [title, icon] = this.menuOptions.icons[key].split(';');
			return html`
						<li
							data-key="${key}" 
							data-tooltip="${title}" 
							@click=${(e: MouseEvent) => { this.onIconClick(key, e.target as HTMLElement) }}
						>
							<span class="fa">
								<span class="title">${`&#x` + icon}</span>
								${title}
							</span>
						</li>
					`})
			}
				</ul>

				
                <span class="logo">${this.menuOptions.title}</span>
            </div>
            <ul class="menu">
				${Object.keys(this.menuOptions.actions).map(key => html`
						<li>
							<a href="#" @click=${(e: MouseEvent) => { e.preventDefault(); this.onActionClick(key) }}>${this.menuOptions.actions[key]} </a>
						</li>
					`)}
				</ul>
			</ul>
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
	actions: IMenuKeyValue,
	icons: IIconsKeyValue,
	actionDefault?: string,
	iconDefault?: string,
	onClickLink?: IClickLinkCallBack,
	onClickIcon?: IClickIconCallBack,
	setMode?: ISetMode,
	setIconActive?: (op: string) => void,
	getLastMode?: IGetLastMode,
	lastIcon?: string,
	updateTitle?: Function,
}

interface IServiceContentEl extends HTMLElement {
	layout: Function
}

interface IService extends HTMLElement {
	menu: IMenu,
	onClickLink: IClickLinkCallBack,
	onClickIcon: IClickIconCallBack,
}

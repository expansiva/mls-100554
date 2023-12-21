/// <mls shortName="fcaText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * }
 */ 

import { html, unsafeHTML } from 'lit';  
import { customElement } from 'lit/decorators.js';
import { FcaLitElementBase } from './_100554_fcaLitElementBase';
import { IActionLevels, updateHtmlTreeFCA } from './_100554_fcaGlobal'; 

@customElement('fca-text-100554')
export class FCAText extends FcaLitElementBase {

  public teste(el:FcaLitElementBase):void { updateHtmlTreeFCA(el)};

  public allowsChild = (tag: string): boolean => { return false };
  public allowAddBody = false;

  get text(): string {
    return this.getAttribute('text') as any | '';
  }

  set text(_value: string) {
    this.setAttribute('text', _value);
  } 

  //********TOOLBAR*********
  public actions: IActionLevels = {
    '1': [],
    '2': [],
    '3': [],
    '4': [
      this.templateActions.editQuill,            
      this.templateActions.move,
      this.templateActions.buttonPadding,
      this.templateActions.buttonMargin,
      this.templateActions.size,
      {
        position: 'p-m1',
        tp: 'menu',
        format: '',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [
          this.templateActionsMenu.goToParents,
          
        ],
        menuSubItens: [
          this.templateActionsMenu.removeMe
        ],
      }
    ],
    '5': [],
    '6': [],
    '7': [],
  }

  private styleElMain: CSSStyleDeclaration | undefined = undefined;

  //********RENDER*********
  
  public renderPreview = (param:string): any => {

    this.style.display = '';

    if (!this.text) this.text = '';

    let code =
      `<${this.widget} style="${this.styleel}">${this.text}${this.myInnerHTML}</${this.widget}>`
      ;

    const objRender = html`${unsafeHTML(code)}`;
    return objRender;

  }

  public renderTag = (param:string): any =>{
  
    this.style.display = '';

    if (!this.text) this.text = '';

    let code =
      `<${this.widget} style="${this.styleel}">${this.text}${this.myInnerHTML}</${this.widget}>`
      ;

    const objRender = html`${unsafeHTML(code)}`;
    return objRender;

  }

  public renderEdit = (param:string): any => {

    if (!this.text) this.text = '';

    this.style.display = 'block';

    let tag = `<${this.widget} style="${this.styleel}">${this.text}${this.myInnerHTML}</${this.widget}><wcd-toolbox-100554 level="${this.level}" widget="${this.widget}"></wcd-toolbox-100554>`;

    const code = `${tag}`;
    const objRender = html`${unsafeHTML(code)}`;
    return objRender;

  }

  //********FUNCTIONS*********

  firstUpdated(changedProperties: any) {

    super.firstUpdated(changedProperties);

    if (!this.text) this.text = '';
    let elS: HTMLElement;
    if (this.text.startsWith(`<${this.widget}`)) {

      const e = document.createElement('div');
      e.innerHTML = this.text;
      elS = e.children[0] as HTMLElement;

    } else {

      elS = document.createElement('span');

    }
    this.styleElMain = elS.style;

  }

  createRenderRoot() {
    return this;
  }

  public changeStateHtml(html: string): void {

    const s = document.createElement('span');
    s.innerHTML = atob(html);
    if (!s.children[0]) return;
    const el = this.clearStyleTree(s.children[0] as HTMLElement);
    this.text = el.innerHTML;
  }

  public changeStateStyle(style: {}): void {

    if (!this.styleElMain || !style) return;

    const el = this.querySelector(`${this.widget}:first-child`) as HTMLElement
    if (el) {

      this.styleElMain.cssText = el.style.cssText;
      Object.assign(this.styleElMain, style as CSSStyleDeclaration);
      el.style.cssText = this.styleElMain.cssText;
      this.styleel = el.style.cssText

    }

  }

  private clearStyleTree(el: HTMLElement): HTMLElement{

    el.style.cssText.replace(this.styleel as string, '');
    Array.from(el.children).forEach((i) => {

      this.clearStyleTree(i as HTMLElement);

    });

    return el;

  }

}
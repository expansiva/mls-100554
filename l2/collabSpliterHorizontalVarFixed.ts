/// <mls shortName="collabSpliterHorizontalVarFixed" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { collab_chevron_right } from './_100554_collabIcons'

@customElement('collab-spliter-horizontal-var-fixed-100554')
export class CollabSpliterHorizontalVarFixed100554 extends LitElement {

  @property({ type: String }) fixedwidth = '0';
  @property({ type: String }) complementcolor = '#000';
  @property({ type: String }) fixedvisible: 'hidden' | 'visible' = 'visible';
  @property({ type: Number }) spliterWidth = 20;
  @property({ type: String }) actualfixedwidth = this.fixedwidth;
  @property({ type: String }) msize = '';
  @property() isRightPaneOpen: boolean = true;

  @query('[slot="left"]') slotLeft: HTMLElement | undefined;
  @query('[slot="right"]') slotRight: HTMLElement | undefined;


  createRenderRoot() {
    return this;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {

    if (changedProperties.has('msize')) this._applyMSize();
    
    if (changedProperties.has('fixedvisible') && changedProperties.get('fixedvisible') === 'hidden' && this.fixedvisible === 'visible') {
        this._applyMSize();
    } 

    if (changedProperties.has('fixedwidth')) {
      this.actualfixedwidth = this.fixedwidth;
      this.style.setProperty('--fixed-width', this.fixedwidth + 'px');
      if (this.isRightPaneOpen) {
        this.style.setProperty('--right-pane-width', this.fixedwidth + 'px');
      }
      this.updatePanelsMSize();
    }

    if (changedProperties.has('complementcolor')) {
      this.style.setProperty('--complement-color', this.complementcolor);
    }
  }

  firstUpdated() {
    this._distributeContent();
    this._applyMSize();
  }

  private getMSize() {
    const [w, h, t, l] = this.msize.split(',');
    return {
      heigth: h,
      width: w,
      top: t,
      left: l
    }
  }

  private getMSizeLeft() {
    const msize = this.getMSize();
    let newWidth: string = '';
    let newMsize: string[] = [];
    newWidth = this.fixedvisible === 'visible' ? (+(msize.width) - (+this.actualfixedwidth) - (this.spliterWidth)).toString() : msize.width;
    // newWidth = (+(msize.width) - (+this.actualfixedwidth) - (this.spliterWidth)).toString();
    newMsize = [`${newWidth}`, msize.heigth, msize.top, msize.left];
    return newMsize.join(',');
  }

  private getMSizeRight() {
    const msize = this.getMSize();
    let newWidth: string = '';
    let newMsize: string[] = [];
    newWidth = this.fixedvisible === 'visible' ? this.actualfixedwidth : '0';
    newMsize = [`${newWidth}`, msize.heigth, msize.top, msize.left];
    return newMsize.join(',');
  }

  private updatePanelsMSize() {
    if (this.slotLeft) this.slotLeft.setAttribute('msize', this.getMSizeLeft());
    if (this.slotRight) this.slotRight.setAttribute('msize', this.getMSizeRight());
  }

  _applyMSize() {
    const [maxWidth, maxHeight] = this.msize.split(',').map(Number);
    if (!isNaN(maxHeight) && !isNaN(maxWidth)) {
      this.style.setProperty('--max-width', `${maxWidth}px`);
      this.style.setProperty('--max-height', `${maxHeight}px`);
    }
    this.updatePanelsMSize();
  }

  _onSpliterClick(event: MouseEvent) {
    const spliter = event.target as HTMLElement;
    const button = spliter.closest('.spliter-button')

    if (button) {

      const rightPane = this.querySelector('.right-pane') as HTMLElement;
      this.isRightPaneOpen = !this.isRightPaneOpen;
      if (this.isRightPaneOpen) {
        rightPane.classList.remove('closed');
        button.classList.remove('closed');
        this.actualfixedwidth = this.fixedwidth;
        this.style.setProperty('--right-pane-width', this.fixedwidth + 'px');
      } else {
        this.actualfixedwidth = '0';
        rightPane.classList.add('closed');
        button.classList.add('closed');
        this.style.setProperty('--right-pane-width', '0px');
      }
      this.updatePanelsMSize();
    }
  }

  _distributeContent() {
    const leftPane = this.querySelector('.left-pane');
    const rightPane = this.querySelector('.right-pane');
    const children = Array.from(this.children);
    let msizeNew: string = this.msize;

    children.forEach(child => {
      const slotName = child.getAttribute('slot');

      if (slotName === 'left' && leftPane) {
        leftPane.appendChild(child);
        msizeNew = this.getMSizeLeft();
        child.setAttribute('msize', msizeNew);
      } else if (slotName === 'right' && rightPane) {
        msizeNew = this.getMSizeRight();
        child.setAttribute('msize', msizeNew);
        rightPane.appendChild(child);
      }
    });

  }

  render() {
    return html`
      <div class="left-pane"></div>

      ${this.fixedvisible === 'visible' ?
        html`<div class="spliter">
                  <div @click=${this._onSpliterClick} class="spliter-button">
                      <i>${collab_chevron_right}</i>          
                  </div>
              </div>
              <div class="right-pane"></div>`
        :
        html``}
      <style>${this.styles}</style>
    `;
  }

  private styles = `
    collab-spliter-horizontal-var-fixed-100554 {
      display: flex;
      height: var(--max-height);
      width: var(--max-width);
      max-width: var(--max-width);
      max-height: var(--max-height);
      position: relative;
    }
    collab-spliter-horizontal-var-fixed-100554 > .spliter {
      display: flex;
      align-items: center;
      width: 20px;
      background-color: var(--complement-color);
      position: relative;
      z-index: 1;
    }
    collab-spliter-horizontal-var-fixed-100554 > .spliter .spliter-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height:60px;
      background-color: var(--collab-nav-bg-1);
      cursor: pointer;
      position: relative;
      z-index: 1;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    collab-spliter-horizontal-var-fixed-100554 > .spliter .spliter-button i {
      transition: transform 0.8s ease;
    }

    collab-spliter-horizontal-var-fixed-100554 > .spliter .spliter-button.closed i {
      transform: rotate(180deg);
    }

    collab-spliter-horizontal-var-fixed-100554 > .spliter .spliter-button i {
      cursor: pointer;
    }

    collab-spliter-horizontal-var-fixed-100554 > .left-pane, .right-pane {
      overflow: auto;
    }
    collab-spliter-horizontal-var-fixed-100554 > .left-pane {
      background-color: var(--complement-color);
      flex-grow: 1;
    }
    collab-spliter-horizontal-var-fixed-100554 > .right-pane {
      background-color: var(--collab-nav-bg-1);
      transition: width 0.8s;
      max-width: var(--fixed-width);
      width: var(--right-pane-width, var(--fixed-width));
    }
    collab-spliter-horizontal-var-fixed-100554 > .right-pane.closed {
      transition: width 0s;
      width: 0;
    }
  `;

}





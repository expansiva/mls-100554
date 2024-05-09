/// <mls shortName="wcdToolboxItemActionEditQuill" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

declare var Quill: any;
import { html, LitElement, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_icaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';
import { IcaLitElementBase } from './_100554_icaLitElementBase'; 

//version 4
@customElement('wcd-toolbox-item-action-edit-quill-100554')
export class WCDToolboxItemActionQuill extends LitElement {

    @property({ type: String })
    private theme: String = 'snow';//'snow' 'bubble'

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    public elFCA: IcaLitElementBase | undefined;
    private elExternal: HTMLElement | undefined;

    createRenderRoot() {
        return this;
    }

    render() {
        
        this.renderOutdoorScenary();
        return html``;
        /*this.style.cssText = 'background: white; display: block;    position: relative;';
        return html`
            <div id="editor-container"></div>
            <style>${this.styles}</style>
        `;*/
    }

    firstUpdated() {
        //this.init();
    }

    //-----------------
    private async renderOutdoorScenary() {

        if (!this.myParent || this.myParent.level !== '4') return;

        this.elExternal = await this.myParent.getAndSetScenaryOutDoor('Styles');
        if (!this.elExternal) return;

        render(this.renderQuill(), this.elExternal);
        this.init();

    }

    private renderQuill() {
        if (!this.elMain) return html``;
        return html`
            <div id="editor-container"></div>
            <style>${this.styles}</style>
        `;
    }

    //-------------------------------------------

    private isfocus: boolean = false;

    public quill: any;
    private init(): void {

        if (!this.elFCA || !this.elExternal) return;
        let selector = this.elExternal.querySelector('#editor-container');
        this.quill = new Quill(selector, {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    //[{ color: [] }, { background: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['clean'],
                ]
            },
            placeholder: 'Compose an epic...',
            theme: this.theme,  // or 'bubble',
            clipboard: {
                matchVisual: false,
            }

        });

        /*const normalizeNative = (nativeRange: any) => {

            if (nativeRange) {

                const range = nativeRange;

                if (range.baseNode) {
                    range.startContainer = nativeRange.baseNode;
                    range.endContainer = nativeRange.focusNode;
                    range.startOffset = nativeRange.baseOffset;
                    range.endOffset = nativeRange.focusOffset;

                    if (range.endOffset < range.startOffset) {
                        range.startContainer = nativeRange.focusNode;
                        range.endContainer = nativeRange.baseNode;
                        range.startOffset = nativeRange.focusOffset;
                        range.endOffset = nativeRange.baseOffset;
                    }
                }

                if (range.startContainer) {

                    return {
                        start: { node: range.startContainer, offset: range.startOffset },
                        end: { node: range.endContainer, offset: range.endOffset },
                        native: range
                    };
                }
            }

            return null
        };

        this.quill.selection.getNativeRange = () => {

            const dom = this.quill.root.getRootNode();
            if (!dom || !dom.getSelection) return;
            const selection = dom.getSelection();
            const range = normalizeNative(selection);

            return range;
        };


        this.quill.container.querySelector('.ql-editor').onfocus = () => this.isfocus = true;

        document.addEventListener("selectionchange", (...args) => {

            if (!this.isfocus) return;
            const r = this.quill.getSelection();
            if (r.length > 0)
                this.quill.selection.update();
            else this.quill.theme.tooltip.hide();
        });*/

        this.quill.root.innerHTML = this.elFCA.getAttribute('text');
        this.quill.on(Quill.events.EDITOR_CHANGE, (eventType:any, range:any) => { 

            if (!this.elMain || !this.myParent) return;
            this.elMain.innerHTML = this.quill.root.innerHTML;
            this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
            
        })

    }

    public onChanged(): void {
        this.isfocus = false;
        const ret = btoa(this.quill.root.innerHTML);
        const evento = new CustomEvent('onChange', {
            detail: { valor: `{"tp":"html","html":"${ret}" }` },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(evento);
    }


    private styles = `
    .ql-toolbar.ql-snow{
        width: 90%;
        margin: 0 auto;
        margin-top: 1rem;
    }

    .ql-toolbar.ql-snow button{
        box-shadow: none!important;
    }

    .ql-container.ql-snow{
        width: 90%;
        margin: 0 auto;
        min-height: 300px;
        padding:1rem;
    }

    .d-none {
        display: none!important;
    }
    .ql-closed .ql-container {
    border: 0 !important;
    }
    
    .ql-container {
        box-sizing: border-box;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
        height: 100%;
        margin: 0px;
        position: relative;
    }
    .ql-container.ql-disabled .ql-tooltip {
        visibility: hidden;
    }
    .ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
        pointer-events: none;
    }
    .ql-clipboard {
        left: -100000px;
        height: 1px;
        overflow-y: hidden;
        position: absolute;
        top: 50%;
    }
    .ql-clipboard p {
        margin: 0;
        padding: 0;
    }
    .ql-editor {
        box-sizing: border-box;
        line-height: 1.42;
        height: 100%;
        outline: none;
        overflow-y: auto;
        /*padding: 12px 15px;*/
        tab-size: 4;
        -moz-tab-size: 4;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .ql-editor > * {
        cursor: text;
    }

    .ql-editor p,
    .ql-editor ol,
    .ql-editor ul,
    .ql-editor pre,
    .ql-editor blockquote,
    .ql-editor h1,
    .ql-editor h2,
    .ql-editor h3,
    .ql-editor h4,
    .ql-editor h5,
    .ql-editor h6 {
        margin: 0;
        padding: 0;
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }

    .ql-editor ol,
    .ql-editor ul {
        padding-left: 1.5em;
    }

    .ql-editor ol > li,
    .ql-editor ul > li {
        list-style-type: none;
    }

    .ql-editor ul > li::before {
        content: '\\2022';
    }

    .ql-editor ul[data-checked=true],
    .ql-editor ul[data-checked=false] {
        pointer-events: none;
    }
    .ql-editor ul[data-checked=true] > li *,
    .ql-editor ul[data-checked=false] > li * {
        pointer-events: all;
    }
    .ql-editor ul[data-checked=true] > li::before,
    .ql-editor ul[data-checked=false] > li::before {
        color: #777;
        cursor: pointer;
        pointer-events: all;
    }
    .ql-editor ul[data-checked=true] > li::before {
        content: '\\2611';
    }
    .ql-editor ul[data-checked=false] > li::before {
        content: '\\2610';
    }
    .ql-editor li::before {
        display: inline-block;
        white-space: nowrap;
        width: 1.2em;
    }
    .ql-editor li:not(.ql-direction-rtl)::before {
        margin-left: -1.5em;
        margin-right: 0.3em;
        text-align: right;
    }
    .ql-editor li.ql-direction-rtl::before {
        margin-left: 0.3em;
        margin-right: -1.5em;
    }
    .ql-editor ol li:not(.ql-direction-rtl),
    .ql-editor ul li:not(.ql-direction-rtl) {
        padding-left: 1.5em;
    }
    .ql-editor ol li.ql-direction-rtl,
    .ql-editor ul li.ql-direction-rtl {
        padding-right: 1.5em;
    }
    .ql-editor ol li {
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        counter-increment: list-0;
    }
    .ql-editor ol li:before {
        content: counter(list-0, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-1 {
        counter-increment: list-1;
    }
    .ql-editor ol li.ql-indent-1:before {
        content: counter(list-1, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-1 {
        counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-2 {
        counter-increment: list-2;
    }
    .ql-editor ol li.ql-indent-2:before {
        content: counter(list-2, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-2 {
        counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-3 {
        counter-increment: list-3;
    }
    .ql-editor ol li.ql-indent-3:before {
        content: counter(list-3, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-3 {
        counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-4 {
        counter-increment: list-4;
    }
    .ql-editor ol li.ql-indent-4:before {
        content: counter(list-4, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-4 {
        counter-reset: list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-5 {
        counter-increment: list-5;
    }
    .ql-editor ol li.ql-indent-5:before {
        content: counter(list-5, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-5 {
        counter-reset: list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-6 {
        counter-increment: list-6;
    }
    .ql-editor ol li.ql-indent-6:before {
        content: counter(list-6, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-6 {
        counter-reset: list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-7 {
        counter-increment: list-7;
    }
    .ql-editor ol li.ql-indent-7:before {
        content: counter(list-7, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-7 {
        counter-reset: list-8 list-9;
    }
    .ql-editor ol li.ql-indent-8 {
        counter-increment: list-8;
    }
    .ql-editor ol li.ql-indent-8:before {
        content: counter(list-8, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-8 {
        counter-reset: list-9;
    }
    .ql-editor ol li.ql-indent-9 {
        counter-increment: list-9;
    }
    .ql-editor ol li.ql-indent-9:before {
        content: counter(list-9, decimal) '. ';
    }
    .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
        padding-left: 3em;
    }
    .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
        padding-left: 4.5em;
    }
    .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
        padding-right: 3em;
    }
    .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
        padding-right: 4.5em;
    }
    .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
        padding-left: 6em;
    }
    .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
        padding-left: 7.5em;
    }
    .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
        padding-right: 6em;
    }
    .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
        padding-right: 7.5em;
    }
    .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
        padding-left: 9em;
    }
    .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
        padding-left: 10.5em;
    }
    .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
        padding-right: 9em;
    }
    .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
        padding-right: 10.5em;
    }
    .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
        padding-left: 12em;
    }
    .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
        padding-left: 13.5em;
    }
    .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
        padding-right: 12em;
    }
    .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
        padding-right: 13.5em;
    }
    .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
        padding-left: 15em;
    }
    .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
        padding-left: 16.5em;
    }
    .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
        padding-right: 15em;
    }
    .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
        padding-right: 16.5em;
    }
    .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
        padding-left: 18em;
    }
    .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
        padding-left: 19.5em;
    }
    .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
        padding-right: 18em;
    }
    .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
        padding-right: 19.5em;
    }
    .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
        padding-left: 21em;
    }
    .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
        padding-left: 22.5em;
    }
    .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
        padding-right: 21em;
    }
    .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
        padding-right: 22.5em;
    }
    .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
        padding-left: 24em;
    }
    .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
        padding-left: 25.5em;
    }
    .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
        padding-right: 24em;
    }
    .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
        padding-right: 25.5em;
    }
    .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
        padding-left: 27em;
    }
    .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
        padding-left: 28.5em;
    }
    .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
        padding-right: 27em;
    }
    .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
        padding-right: 28.5em;
    }
    .ql-editor .ql-video {
        display: block;
        max-width: 100%;
    }
    .ql-editor .ql-video.ql-align-center {
        margin: 0 auto;
    }
    .ql-editor .ql-video.ql-align-right {
        margin: 0 0 0 auto;
    }
    .ql-editor .ql-bg-black {
        background-color: #000;
    }
    .ql-editor .ql-bg-red {
        background-color: #e60000;
    }
    .ql-editor .ql-bg-orange {
        background-color: #f90;
    }
    .ql-editor .ql-bg-yellow {
        background-color: #ff0;
    }
    .ql-editor .ql-bg-green {
        background-color: #008a00;
    }
    .ql-editor .ql-bg-blue {
        background-color: #06c;
    }
    .ql-editor .ql-bg-purple {
        background-color: #93f;
    }
    .ql-editor .ql-color-white {
        color: #fff;
    }
    .ql-editor .ql-color-red {
        color: #e60000;
    }
    .ql-editor .ql-color-orange {
        color: #f90;
    }
    .ql-editor .ql-color-yellow {
        color: #ff0;
    }
    .ql-editor .ql-color-green {
        color: #008a00;
    }
    .ql-editor .ql-color-blue {
        color: #06c;
    }
    .ql-editor .ql-color-purple {
        color: #93f;
    }
    .ql-editor .ql-font-serif {
        font-family: Georgia, Times New Roman, serif;
    }
    .ql-editor .ql-font-monospace {
        font-family: Monaco, Courier New, monospace;
    }
    .ql-editor .ql-size-small {
        font-size: 0.75em;
    }
    .ql-editor .ql-size-large {
        font-size: 1.5em;
    }
    .ql-editor .ql-size-huge {
        font-size: 2.5em;
    }
    .ql-editor .ql-direction-rtl {
        direction: rtl;
        text-align: inherit;
    }
    .ql-editor .ql-align-center {
        text-align: center;
    }
    .ql-editor .ql-align-justify {
        text-align: justify;
    }
    .ql-editor .ql-align-right {
        text-align: right;
    }
    .ql-editor.ql-blank::before {
        color: rgba(0, 0, 0, 0.6);
        content: attr(data-placeholder);
        font-style: italic;
        left: 15px;
        pointer-events: none;
        position: absolute;
        right: 15px;
    }
    .ql-snow.ql-closed {
        border: none !important;
    }
    .ql-snow.ql-toolbar:after,
    .ql-snow .ql-toolbar:after {
        clear: both;
        content: '';
        display: table;
    }
    .ql-snow.ql-toolbar button,
    .ql-snow .ql-toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 24px;
        padding: 3px 5px;
        width: 28px;
    }
    .ql-snow.ql-toolbar button svg,
    .ql-snow .ql-toolbar button svg {
        float: left;
        height: 100%;
    }
    .ql-snow.ql-toolbar button:active:hover,
    .ql-snow .ql-toolbar button:active:hover {
    outline: none;
    }
    .ql-snow.ql-toolbar input.ql-image[type=file],
    .ql-snow .ql-toolbar input.ql-image[type=file] {
    display: none;
    }
    .ql-snow.ql-toolbar button:hover,
    .ql-snow .ql-toolbar button:hover,
    .ql-snow.ql-toolbar button:focus,
    .ql-snow .ql-toolbar button:focus,
    .ql-snow.ql-toolbar button.ql-active,
    .ql-snow .ql-toolbar button.ql-active,
    .ql-snow.ql-toolbar .ql-picker-label:hover,
    .ql-snow .ql-toolbar .ql-picker-label:hover,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active,
    .ql-snow.ql-toolbar .ql-picker-item:hover,
    .ql-snow .ql-toolbar .ql-picker-item:hover,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: #06c;
    }
    .ql-snow.ql-toolbar button:hover .ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: #06c;
    }
    .ql-snow.ql-toolbar button:hover .ql-stroke,
    .ql-snow .ql-toolbar button:hover .ql-stroke,
    .ql-snow.ql-toolbar button:focus .ql-stroke,
    .ql-snow .ql-toolbar button:focus .ql-stroke,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: #06c;
    }
    @media (pointer: coarse) {
    .ql-snow.ql-toolbar button:hover:not(.ql-active),
    .ql-snow .ql-toolbar button:hover:not(.ql-active) {
        color: #444;
    }
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
        fill: #444;
    }
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
        stroke: #444;
    }
    }
    .ql-snow {
    box-sizing: border-box;
    }
    .ql-snow * {
    box-sizing: border-box;
    }
    .ql-snow .ql-hidden {
    display: none;
    }
    .ql-snow .ql-out-bottom,
    .ql-snow .ql-out-top {
    visibility: hidden;
    }
    .ql-snow .ql-tooltip {
    position: absolute;
    transform: translateY(10px);
    }
    .ql-snow .ql-tooltip a {
    cursor: pointer;
    text-decoration: none;
    }
    .ql-snow .ql-tooltip.ql-flip {
    transform: translateY(-10px);
    }
    .ql-snow .ql-formats {
    display: inline-block;
    vertical-align: middle;
    }
    .ql-snow .ql-formats:after {
    clear: both;
    content: '';
    display: table;
    }
    .ql-snow .ql-stroke {
    fill: none;
    stroke: #444;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    }
    .ql-snow .ql-stroke-miter {
    fill: none;
    stroke: #444;
    stroke-miterlimit: 10;
    stroke-width: 2;
    }
    .ql-snow .ql-fill,
    .ql-snow .ql-stroke.ql-fill {
    fill: #444;
    }
    .ql-snow .ql-empty {
    fill: none;
    }
    .ql-snow .ql-even {
    fill-rule: evenodd;
    }
    .ql-snow .ql-thin,
    .ql-snow .ql-stroke.ql-thin {
    stroke-width: 1;
    }
    .ql-snow .ql-transparent {
    opacity: 0.4;
    }
    .ql-snow .ql-direction svg:last-child {
    display: none;
    }
    .ql-snow .ql-direction.ql-active svg:last-child {
    display: inline;
    }
    .ql-snow .ql-direction.ql-active svg:first-child {
    display: none;
    }
    .ql-snow .ql-editor h1 {
    font-size: 2em;
    }
    .ql-snow .ql-editor h2 {
    font-size: 1.5em;
    }
    .ql-snow .ql-editor h3 {
    font-size: 1.17em;
    }
    .ql-snow .ql-editor h4 {
    font-size: 1em;
    }
    .ql-snow .ql-editor h5 {
    font-size: 0.83em;
    }
    .ql-snow .ql-editor h6 {
    font-size: 0.67em;
    }
    .ql-snow .ql-editor a {
    text-decoration: underline;
    }
    .ql-snow .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
    }
    .ql-snow .ql-editor code,
    .ql-snow .ql-editor pre {
    background-color: #f0f0f0;
    border-radius: 3px;
    }
    .ql-snow .ql-editor pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
    }
    .ql-snow .ql-editor code {
    font-size: 85%;
    padding: 2px 4px;
    }
    .ql-snow .ql-editor pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
    }
    .ql-snow .ql-editor img {
    max-width: 100%;
    }
    .ql-snow .ql-picker {
    color: #444;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
    }
    .ql-snow .ql-picker-label {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    padding-left: 8px;
    padding-right: 2px;
    position: relative;
    width: 100%;
    }
    .ql-snow .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
    }
    .ql-snow .ql-picker-options {
    background-color: #fff;
    display: none;
    min-width: 100%;
    padding: 4px 8px;
    position: absolute;
    white-space: nowrap;
    }
    .ql-snow .ql-picker-options .ql-picker-item {
    cursor: pointer;
    display: block;
    padding-bottom: 5px;
    padding-top: 5px;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label {
    color: #ccc;
    z-index: 2;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
    fill: #ccc;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
    stroke: #ccc;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-options {
    display: block;
    margin-top: -1px;
    top: 100%;
    z-index: 1;
    }
    .ql-snow .ql-color-picker,
    .ql-snow .ql-icon-picker {
    width: 28px;
    }
    .ql-snow .ql-color-picker .ql-picker-label,
    .ql-snow .ql-icon-picker .ql-picker-label {
    padding: 2px 4px;
    }
    .ql-snow .ql-color-picker .ql-picker-label svg,
    .ql-snow .ql-icon-picker .ql-picker-label svg {
    right: 4px;
    }
    .ql-snow .ql-icon-picker .ql-picker-options {
    padding: 4px 0px;
    }
    .ql-snow .ql-icon-picker .ql-picker-item {
    height: 24px;
    width: 24px;
    padding: 2px 4px;
    }
    .ql-snow .ql-color-picker .ql-picker-options {
    padding: 3px 5px;
    width: 152px;
    }
    .ql-snow .ql-color-picker .ql-picker-item {
    border: 1px solid transparent;
    float: left;
    height: 16px;
    margin: 2px;
    padding: 0px;
    width: 16px;
    }
    .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    position: absolute;
    margin-top: -9px;
    right: 0;
    top: 50%;
    width: 18px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
    content: attr(data-label);
    }
    .ql-snow .ql-picker.ql-header {
    width: 98px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: 'Normal';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: 'Heading 1';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: 'Heading 2';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: 'Heading 3';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: 'Heading 4';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: 'Heading 5';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: 'Heading 6';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    font-size: 2em;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    font-size: 1.5em;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    font-size: 1.17em;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    font-size: 1em;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    font-size: 0.83em;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    font-size: 0.67em;
    }
    .ql-snow .ql-picker.ql-font {
    width: 108px;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: 'Sans Serif';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: 'Serif';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: 'Monospace';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    font-family: Georgia, Times New Roman, serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    font-family: Monaco, Courier New, monospace;
    }
    .ql-snow .ql-picker.ql-size {
    width: 98px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: 'Normal';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: 'Small';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: 'Large';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: 'Huge';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    font-size: 10px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    font-size: 18px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    font-size: 32px;
    }
    .ql-snow .ql-color-picker.ql-background .ql-picker-item {
    background-color: #fff;
    }
    .ql-snow .ql-color-picker.ql-color .ql-picker-item {
    background-color: #000;
    }
    .ql-toolbar.ql-snow {
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
    }
    .ql-toolbar.ql-snow .ql-formats {
    margin-right: 15px;
    }
    .ql-toolbar.ql-snow .ql-picker-label {
    border: 1px solid transparent;
    }
    .ql-toolbar.ql-snow .ql-picker-options {
    border: 1px solid transparent;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
    border-color: #ccc;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    border-color: #ccc;
    }
    .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,
    .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {
    border-color: #000;
    }
    .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0px;
    }
    .ql-snow .ql-tooltip {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 5px #ddd;
    color: #444;
    padding: 5px 12px;
    white-space: nowrap;
    }
    .ql-snow .ql-tooltip::before {
    content: "Visit URL:";
    line-height: 26px;
    margin-right: 8px;
    }
    .ql-snow .ql-tooltip input[type=text] {
    display: none;
    border: 1px solid #ccc;
    font-size: 13px;
    height: 26px;
    margin: 0px;
    padding: 3px 5px;
    width: 170px;
    }
    .ql-snow .ql-tooltip a.ql-preview {
    display: inline-block;
    max-width: 200px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    }
    .ql-snow .ql-tooltip a.ql-action::after {
    border-right: 1px solid #ccc;
    content: 'Edit';
    margin-left: 16px;
    padding-right: 8px;
    }
    .ql-snow .ql-tooltip a.ql-remove::before {
    content: 'Remove';
    margin-left: 8px;
    }
    .ql-snow .ql-tooltip a {
    line-height: 26px;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-preview,
    .ql-snow .ql-tooltip.ql-editing a.ql-remove {
    display: none;
    }
    .ql-snow .ql-tooltip.ql-editing input[type=text] {
    display: inline-block;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: 'Save';
    padding-right: 0px;
    }
    .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "Enter link:";
    }
    .ql-snow .ql-tooltip[data-mode=formula]::before {
    content: "Enter formula:";
    }
    .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "Enter video:";
    }
    .ql-snow a {
    color: #06c;
    }
    .ql-container.ql-snow {
    border: 1px solid #ccc;
    }
    .ql-bubble.ql-toolbar:after,
    .ql-bubble .ql-toolbar:after {
    clear: both;
    content: '';
    display: table;
    }
    .ql-bubble.ql-toolbar button,
    .ql-bubble .ql-toolbar button {
    background: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px 5px;
    width: 28px;
    }
    .ql-bubble.ql-toolbar button svg,
    .ql-bubble .ql-toolbar button svg {
    float: left;
    height: 100%;
    }
    .ql-bubble.ql-toolbar button:active:hover,
    .ql-bubble .ql-toolbar button:active:hover {
    outline: none;
    }
    .ql-bubble.ql-toolbar input.ql-image[type=file],
    .ql-bubble .ql-toolbar input.ql-image[type=file] {
    display: none;
    }
    .ql-bubble.ql-toolbar button:hover,
    .ql-bubble .ql-toolbar button:hover,
    .ql-bubble.ql-toolbar button:focus,
    .ql-bubble .ql-toolbar button:focus,
    .ql-bubble.ql-toolbar button.ql-active,
    .ql-bubble .ql-toolbar button.ql-active,
    .ql-bubble.ql-toolbar .ql-picker-label:hover,
    .ql-bubble .ql-toolbar .ql-picker-label:hover,
    .ql-bubble.ql-toolbar .ql-picker-label.ql-active,
    .ql-bubble .ql-toolbar .ql-picker-label.ql-active,
    .ql-bubble.ql-toolbar .ql-picker-item:hover,
    .ql-bubble .ql-toolbar .ql-picker-item:hover,
    .ql-bubble.ql-toolbar .ql-picker-item.ql-selected,
    .ql-bubble .ql-toolbar .ql-picker-item.ql-selected {
    color: #fff;
    }
    .ql-bubble.ql-toolbar button:hover .ql-fill,
    .ql-bubble .ql-toolbar button:hover .ql-fill,
    .ql-bubble.ql-toolbar button:focus .ql-fill,
    .ql-bubble .ql-toolbar button:focus .ql-fill,
    .ql-bubble.ql-toolbar button.ql-active .ql-fill,
    .ql-bubble .ql-toolbar button.ql-active .ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-bubble.ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-bubble.ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-bubble.ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: #fff;
    }
    .ql-bubble.ql-toolbar button:hover .ql-stroke,
    .ql-bubble .ql-toolbar button:hover .ql-stroke,
    .ql-bubble.ql-toolbar button:focus .ql-stroke,
    .ql-bubble .ql-toolbar button:focus .ql-stroke,
    .ql-bubble.ql-toolbar button.ql-active .ql-stroke,
    .ql-bubble .ql-toolbar button.ql-active .ql-stroke,
    .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-bubble.ql-toolbar button:hover .ql-stroke-miter,
    .ql-bubble .ql-toolbar button:hover .ql-stroke-miter,
    .ql-bubble.ql-toolbar button:focus .ql-stroke-miter,
    .ql-bubble .ql-toolbar button:focus .ql-stroke-miter,
    .ql-bubble.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-bubble .ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
    .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: #fff;
    }
    @media (pointer: coarse) {
    .ql-bubble.ql-toolbar button:hover:not(.ql-active),
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) {
        color: #ccc;
    }
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
        fill: #ccc;
    }
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
        stroke: #ccc;
    }
    }
    .ql-bubble {
    box-sizing: border-box;
    }
    .ql-bubble * {
    box-sizing: border-box;
    }
    .ql-bubble .ql-hidden {
    display: none;
    }
    .ql-bubble .ql-out-bottom,
    .ql-bubble .ql-out-top {
    visibility: hidden;
    }
    .ql-bubble .ql-tooltip {
        position: absolute;
        transform: translateY(10px);
        z-index:9999;
    }
    .ql-bubble .ql-tooltip a {
    cursor: pointer;
    text-decoration: none;
    }
    .ql-bubble .ql-tooltip.ql-flip {
    transform: translateY(-10px);
    }
    .ql-bubble .ql-formats {
    display: inline-block;
    vertical-align: middle;
    }
    .ql-bubble .ql-formats:after {
    clear: both;
    content: '';
    display: table;
    }
    .ql-bubble .ql-stroke {
    fill: none;
    stroke: #ccc;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    }
    .ql-bubble .ql-stroke-miter {
    fill: none;
    stroke: #ccc;
    stroke-miterlimit: 10;
    stroke-width: 2;
    }
    .ql-bubble .ql-fill,
    .ql-bubble .ql-stroke.ql-fill {
    fill: #ccc;
    }
    .ql-bubble .ql-empty {
    fill: none;
    }
    .ql-bubble .ql-even {
    fill-rule: evenodd;
    }
    .ql-bubble .ql-thin,
    .ql-bubble .ql-stroke.ql-thin {
    stroke-width: 1;
    }
    .ql-bubble .ql-transparent {
    opacity: 0.4;
    }
    .ql-bubble .ql-direction svg:last-child {
    display: none;
    }
    .ql-bubble .ql-direction.ql-active svg:last-child {
    display: inline;
    }
    .ql-bubble .ql-direction.ql-active svg:first-child {
    display: none;
    }
    .ql-bubble .ql-editor h1 {
    font-size: 2em;
    }
    .ql-bubble .ql-editor h2 {
    font-size: 1.5em;
    }
    .ql-bubble .ql-editor h3 {
    font-size: 1.17em;
    }
    .ql-bubble .ql-editor h4 {
    font-size: 1em;
    }
    .ql-bubble .ql-editor h5 {
    font-size: 0.83em;
    }
    .ql-bubble .ql-editor h6 {
    font-size: 0.67em;
    }
    .ql-bubble .ql-editor a {
    text-decoration: underline;
    }
    .ql-bubble .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
    }
    .ql-bubble .ql-editor code,
    .ql-bubble .ql-editor pre {
    background-color: #f0f0f0;
    border-radius: 3px;
    }
    .ql-bubble .ql-editor pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
    }
    .ql-bubble .ql-editor code {
    font-size: 85%;
    padding: 2px 4px;
    }
    .ql-bubble .ql-editor pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
    }
    .ql-bubble .ql-editor img {
    max-width: 100%;
    }
    .ql-bubble .ql-picker {
    color: #ccc;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
    }
    .ql-bubble .ql-picker-label {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    padding-left: 8px;
    padding-right: 2px;
    position: relative;
    width: 100%;
    }
    .ql-bubble .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
    }
    .ql-bubble .ql-picker-options {
    background-color: #444;
    display: none;
    min-width: 100%;
    padding: 4px 8px;
    position: absolute;
    white-space: nowrap;
    }
    .ql-bubble .ql-picker-options .ql-picker-item {
    cursor: pointer;
    display: block;
    padding-bottom: 5px;
    padding-top: 5px;
    }
    .ql-bubble .ql-picker.ql-expanded .ql-picker-label {
    color: #777;
    z-index: 2;
    }
    .ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-fill {
    fill: #777;
    }
    .ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
    stroke: #777;
    }
    .ql-bubble .ql-picker.ql-expanded .ql-picker-options {
    display: block;
    margin-top: -1px;
    top: 100%;
    z-index: 1;
    }
    .ql-bubble .ql-color-picker,
    .ql-bubble .ql-icon-picker {
    width: 28px;
    }
    .ql-bubble .ql-color-picker .ql-picker-label,
    .ql-bubble .ql-icon-picker .ql-picker-label {
    padding: 2px 4px;
    }
    .ql-bubble .ql-color-picker .ql-picker-label svg,
    .ql-bubble .ql-icon-picker .ql-picker-label svg {
    right: 4px;
    }
    .ql-bubble .ql-icon-picker .ql-picker-options {
    padding: 4px 0px;
    }
    .ql-bubble .ql-icon-picker .ql-picker-item {
    height: 24px;
    width: 24px;
    padding: 2px 4px;
    }
    .ql-bubble .ql-color-picker .ql-picker-options {
    padding: 3px 5px;
    width: 152px;
    }
    .ql-bubble .ql-color-picker .ql-picker-item {
    border: 1px solid transparent;
    float: left;
    height: 16px;
    margin: 2px;
    padding: 0px;
    width: 16px;
    }
    .ql-bubble .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    position: absolute;
    margin-top: -9px;
    right: 0;
    top: 50%;
    width: 18px;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-bubble .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-bubble .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-bubble .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
    content: attr(data-label);
    }
    .ql-bubble .ql-picker.ql-header {
    width: 98px;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item::before {
    content: 'Normal';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: 'Heading 1';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: 'Heading 2';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: 'Heading 3';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: 'Heading 4';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: 'Heading 5';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: 'Heading 6';
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    font-size: 2em;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    font-size: 1.5em;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    font-size: 1.17em;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    font-size: 1em;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    font-size: 0.83em;
    }
    .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    font-size: 0.67em;
    }
    .ql-bubble .ql-picker.ql-font {
    width: 108px;
    }
    .ql-bubble .ql-picker.ql-font .ql-picker-label::before,
    .ql-bubble .ql-picker.ql-font .ql-picker-item::before {
    content: 'Sans Serif';
    }
    .ql-bubble .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: 'Serif';
    }
    .ql-bubble .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: 'Monospace';
    }
    .ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    font-family: Georgia, Times New Roman, serif;
    }
    .ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    font-family: Monaco, Courier New, monospace;
    }
    .ql-bubble .ql-picker.ql-size {
    width: 98px;
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-label::before,
    .ql-bubble .ql-picker.ql-size .ql-picker-item::before {
    content: 'Normal';
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: 'Small';
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: 'Large';
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: 'Huge';
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    font-size: 10px;
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    font-size: 18px;
    }
    .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    font-size: 32px;
    }
    .ql-bubble .ql-color-picker.ql-background .ql-picker-item {
    background-color: #fff;
    }
    .ql-bubble .ql-color-picker.ql-color .ql-picker-item {
    background-color: #000;
    }
    .ql-bubble .ql-toolbar .ql-formats {
    margin: 8px 12px 8px 0px;
    }
    .ql-bubble .ql-toolbar .ql-formats:first-child {
    margin-left: 12px;
    }
    .ql-bubble .ql-color-picker svg {
    margin: 1px;
    }
    .ql-bubble .ql-color-picker .ql-picker-item.ql-selected,
    .ql-bubble .ql-color-picker .ql-picker-item:hover {
    border-color: #fff;
    }
    .ql-bubble .ql-tooltip {
    background-color: #444;
    border-radius: 25px;
    color: #fff;
    }
    .ql-bubble .ql-tooltip-arrow {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    content: " ";
    display: block;
    left: 50%;
    margin-left: -6px;
    position: absolute;
    }
    .ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
    border-bottom: 6px solid #444;
    top: -6px;
    }
    .ql-bubble .ql-tooltip.ql-flip .ql-tooltip-arrow {
    border-top: 6px solid #444;
    bottom: -6px;
    }
    .ql-bubble .ql-tooltip.ql-editing .ql-tooltip-editor {
    display: block;
    }
    .ql-bubble .ql-tooltip.ql-editing .ql-formats {
    visibility: hidden;
    }
    .ql-bubble .ql-tooltip-editor {
    display: none;
    }
    .ql-bubble .ql-tooltip-editor input[type=text] {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 13px;
    height: 100%;
    outline: none;
    padding: 10px 20px;
    position: absolute;
    width: 100%;
    }
    .ql-bubble .ql-tooltip-editor a {
    top: 10px;
    position: absolute;
    right: 20px;
    }
    .ql-bubble .ql-tooltip-editor a:before {
    color: #ccc;
    content: "\D7";
    font-size: 16px;
    font-weight: bold;
    }
    .ql-container.ql-bubble:not(.ql-disabled) a {
    position: relative;
    white-space: nowrap;
    }
    .ql-container.ql-bubble:not(.ql-disabled) a::before {
    background-color: #444;
    border-radius: 15px;
    top: -5px;
    font-size: 12px;
    color: #fff;
    content: attr(href);
    font-weight: normal;
    overflow: hidden;
    padding: 5px 15px;
    text-decoration: none;
    z-index: 1;
    }
    .ql-container.ql-bubble:not(.ql-disabled) a::after {
    border-top: 6px solid #444;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    top: 0;
    content: " ";
    height: 0;
    width: 0;
    }
    .ql-container.ql-bubble:not(.ql-disabled) a::before,
    .ql-container.ql-bubble:not(.ql-disabled) a::after {
    left: 0;
    margin-left: 50%;
    position: absolute;
    transform: translate(-50%, -100%);
    transition: visibility 0s ease 200ms;
    visibility: hidden;
    }
    .ql-container.ql-bubble:not(.ql-disabled) a:hover::before,
    .ql-container.ql-bubble:not(.ql-disabled) a:hover::after {
    visibility: visible;
    }
    .hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    background: #1e1e1e;
    color: #dcdcdc;
    }
    .hljs-keyword,
    .hljs-literal,
    .hljs-name,
    .hljs-symbol {
    color: #569cd6;
    }
    .hljs-link {
    color: #569cd6;
    text-decoration: underline;
    }
    .hljs-built_in,
    .hljs-type {
    color: #4ec9b0;
    }
    .hljs-class,
    .hljs-number {
    color: #b8d7a3;
    }
    .hljs-meta-string,
    .hljs-string {
    color: #d69d85;
    }
    .hljs-regexp,
    .hljs-template-tag {
    color: #9a5334;
    }
    .hljs-formula,
    .hljs-function,
    .hljs-params,
    .hljs-subst,
    .hljs-title {
    color: #dcdcdc;
    }
    .hljs-comment,
    .hljs-quote {
    color: #57a64a;
    font-style: italic;
    }
    .hljs-doctag {
    color: #608b4e;
    }
    .hljs-meta,
    .hljs-meta-keyword,
    .hljs-tag {
    color: #9b9b9b;
    }
    .hljs-template-variable,
    .hljs-variable {
    color: #bd63c5;
    }
    .hljs-attr,
    .hljs-attribute,
    .hljs-builtin-name {
    color: #9cdcfe;
    }
    .hljs-section {
    color: gold;
    }
    .hljs-emphasis {
    font-style: italic;
    }
    .hljs-strong {
    font-weight: 700;
    }
    .hljs-bullet,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id,
    .hljs-selector-pseudo,
    .hljs-selector-tag {
    color: #d7ba7d;
    }
    .hljs-addition {
    background-color: #144212;
    display: inline-block;
    width: 100%;
    }
    .hljs-deletion {
    background-color: #600;
    display: inline-block;
    width: 100%;
    }
    `;

}

export const getTemplate = (mode: string = '', position: string = ''): IActionsToolbox => {

    let ret: IActionsToolbox = templateActionQuill.editQuill as IActionsToolbox;
    if (position !== '') ret.position = position as any;
    return ret as IActionsToolbox;

}

const templateActionQuill = {
    backButton: {
        position: '',
        tp: 'back-button',
        format: '',
        title: 'Back',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {
            
            if (wc.shadowRoot) {
                const elFca = wc.shadowRoot.querySelector('wcd-toolbox-item-action-edit-quill-100554');
                if (elFca && (elFca as any)['onChanged']) {
                    (elFca as any)['onChanged']();
                    //elFca.remove();
                }
            }
            wc.setIconsWcdToolbox([], true);
            wc.backNavigationScenaryOutdoor();
        },
        menuItens: [],
        menuSubItens: [],
        widget: '',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick: false,
    },
    editQuill: {
        position: 'p-r3',
        tp: 'action',
        format: '',
        title: '',
        iconSvg: '',
        onclick: (e: MouseEvent, wc: WCDToolbox, fc: Function) => {

            const elQuill = wc.shadowRoot?.querySelector('wcd-toolbox-item-action-edit-quill-100554');

            if (elQuill) return;

            wc.setIconsWcdToolbox([templateActionQuill.backButton as IActionsToolbox]);

            const el = document.createElement('wcd-toolbox-item-action-edit-quill-100554');

            (el as any).myParent = wc;
            (el as any).elMain = (wc as any).elMain;
            (el as any).elFCA = wc.parentElement;

            el.addEventListener("onChange", (obj: any) => {

                if (!obj || !obj.detail || !obj.detail.valor) return;
                if (fc) fc(obj.detail.valor);

            });

            if (wc.shadowRoot) wc.shadowRoot.appendChild(el);
        },
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-edit-quill-100554',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick: true,
    },
}
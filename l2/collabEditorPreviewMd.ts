/// <mls fileReference="_100554_/l2/collabEditorPreviewMd.ts" enhancement="_102027_/l2/enhancementLit"/>

import { html, css, unsafeHTML } from 'lit';
import { customElement, state } from 'lit/decorators.js'; 
import { CollabLitElement } from '/_102027_/l2/collabLitElement.js';


// ─── Component ────────────────────────────────────────────────────────────────

@customElement('collab-editor-preview-md-100554')
export class PageMdPreview extends CollabLitElement {

    @state() private _tree: any = null;
    @state() private _error = '';
    @state() _html = '';

    private _rawMd = '';

    connectedCallback() {
        this._rawMd = this.innerHTML;
        this.innerHTML = '';
        super.connectedCallback();
    }

    firstUpdated() {
        try {
            this._tree = this.parseMd(this._rawMd);
            this._html = this.renderNode(this._tree);
            this._error = '';
            console.log('[page-md-preview] tree:', this._tree);
        } catch (e: any) {
            this._error = e.message;
        }
    }

    render() {
        if (this._error) return html`<pre class="err">${this._error}</pre>`;
        if (!this._tree) return html`<pre>parsing...</pre>`;
        return html`${unsafeHTML(this._html)}`;
    }


    // ─── Parser ───────────────────────────────────────────────────────────────────

    private parseAttrs(raw: any) {
        // ex: "main {cols: 2/3}" => { name:'main', cols:'2/3' }
        const attrs: any = {};
        const m = raw.match(/^([^\{]+)(?:\{([^\}]*)\})?/);
        if (!m) return attrs;
        attrs.name = m[1].trim();
        if (m[2]) {
            m[2].split(',').forEach((p: any) => {
                const [k, v] = p.split(':');
                if (k && v) attrs[k.trim()] = v.trim();
            });
        }
        return attrs;
    }

    private parseFieldProps(lines: any, i: any) {

        // lê propriedades indentadas após um "> field:"
        const props: any = {};
        while (i < lines.length && /^\s{2,}/.test(lines[i])) {
            const m = lines[i].trim().match(/^(\w+):\s*(.*)/);
            if (m) props[m[1]] = m[2];
            i++;
        }
        return { props, newI: i };
    }


    private parseMd(md: string) {

        const lines = md.split('\n');
        let i = 0;


        const root: NodeFather = { molecule: 'div', cols: 1, child: [], name:"root" };

        const stack = [root];

        const currentParent = (level: any) => {
            return stack[level - 1] || root;
        }

        const pushNode = (level: any, node: any) => {
            const parent = currentParent(level);
            if (!parent.child) parent.child = [];
            parent.child.push(node as never);
            stack[level] = node;
            for (let l = level + 1; l < stack.length; l++) (stack as any)[l] = undefined;
        }

        while (i < lines.length) {

            const line = lines[i];
            i++;

            if (!line.trim()) continue;

            // ── Headings → div container ─────────────────────────────────────
            const hm = line.match(/^(#{1,6})\s+(.*)/);
            if (hm) {
                const level = hm[1].length;
                const attrs = this.parseAttrs(hm[2]);
                const molecule = attrs.molecule ? attrs.molecule : 'div';
                if (attrs.molecule) delete attrs.molecule;
                const node: NodeFather = {
                    name: attrs.name || '',
                    molecule,
                    ...attrs,
                    child: [],
                };

                pushNode(level, node);
                continue;
            }

            // ── > field: → campo ─────────────────────────────────────────────
            if (line.startsWith('> field:') || line.startsWith('&gt; field:')) {
                const fieldId = line.replace('> field:', '').replace('&gt; field:', '').trim();
                const { props, newI }: any = this.parseFieldProps(lines, i);
                i = newI;
                const molecule = props.molecule || 'span';
                if (props.molecule) delete props.molecule;
                const field = { molecule, field: fieldId, atrs: props };
                const parent = (stack.filter(Boolean) as any).at(-1) || root;
                if (!parent.child) parent.child = [];
                parent.child.push(field);
                continue;
            }

            // ── > callout ────────────────────────────────────────────────────
            if (line.startsWith('> ')) {
                const parent = (stack.filter(Boolean) as any).at(-1) || root;
                if (!parent.child) parent.child = [];
                parent.child.push({ molecule: 'callout', label: line.slice(2).trim() });
                continue;
            }

            // ── ## actions / lista numerada ───────────────────────────────────
            if (/^\d+\./.test(line)) {
                const al = line.replace(/^\d+\.\s*/, '');
                const parts = al.split('|').map((s: any) => s.trim());
                const [id, label] = (parts[0] || '').split(':').map((s: any) => s.trim());
                const parent = (stack.filter(Boolean) as any).at(-1) || root;
                if (!parent.child) parent.child = [];
                parent.child.push({ molecule: 'action', atrs: { name: id, label, style: parts[1] || 'secondary', condition: parts[2] } });
                continue;
            }
        }

        return root;
    }


    // ─── Renderer ─────────────────────────────────────────────────────────────────

    private attrsStr(atrs = {}) {
        return Object.entries(atrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(' ');
    }

    private renderNode(node: NodeField ) {
        let { molecule, child = [] } = node;

        // nós sem tag própria → só renderiza filhos
        if (!molecule) return this.renderChildren(child);
        const nodeAttrs = this.attrsStr(node.atrs ? node.atrs : {})

        const inner = this.renderChildren(child);

        // self-closing se não tiver filhos nem label inline
        if (!inner) {

            if (['action'].includes(molecule) ) {
                return `<button ${nodeAttrs}>${node.atrs.label}</button>`;
            }

            
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'span'].includes(molecule) && node.atrs.label) {
                return `<${molecule} ${nodeAttrs}>${node.atrs.label}</${molecule}>`;
            }
            return `<${molecule} ${nodeAttrs}></${molecule}>`;
        }

    
        let style = "";
        let name = (node as any as NodeFather).name;
        if ((node as any as NodeFather).cols> 1 ) { 
            style = `style="display:flex"`;
        }
        

        return `<${molecule} ${nodeAttrs} ${style} name="${name}">${inner}</${molecule}>`;
    }

    private renderChildren(children: any = []) {
        return children.map((n: NodeField) => this.renderNode(n)).join('')
    }



}



interface NodeFather {
    name:string
    molecule: string,
    child: Node[] | NodeField[],
    cols: number
}

interface NodeField {
    molecule: string,
    field: string,
    atrs: Record<string, string>
    child: NodeField[]
}
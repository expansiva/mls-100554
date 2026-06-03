/// <mls fileReference="_100554_/l2/collabEditorPreviewMd.ts" enhancement="_102027_/l2/enhancementLit"/>

import { html, css,  } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { CollabLitElement } from '/_102027_/l2/collabLitElement.js';
import { getDependenciesByHtmlFile } from '/_102027_/l2/libCompile.js';


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
            this._error = '';
            this.configHTML();
        } catch (e: any) {
            this._error = e.message;
        }
    }

    render() {
        if (this._error) return html`<pre class="err">${this._error}</pre>`;
        if (!this._tree) return html`<pre>parsing...</pre>`;
        return html`${unsafeHTML(this._html)}`;
    }


    //--------IMPLEMENTES-----------------------------------------------------------

    private async configHTML() {

        this._tree = this.parseMd(this._rawMd);
        const _html = this.renderNode(this._tree);
        const json = await getDependenciesByHtmlFile(mls.actual[2].left || {} as mls.stor.IFileInfo, _html, 'Default');



        if (json && json.importsJs) {
            json.importsJs.forEach((i) => {
                if (!i.startsWith('/_')) return;
                const s = document.createElement('script');
                s.src = i;
                s.type = 'module';
                s.id = i;
                this.appendChild(s);
            });
        }

        setTimeout(() => { this._html = _html; }, 500)


    }

    // ─── Parser ───────────────────────────────────────────────────────────────────

    private parseAttrs(lines: string[], i: number): { attrs: any, newI: number } {
        const attrs: any = {};
        const line = lines[i];


        // extrai nome e conteúdo inline do heading  "## name {k:v, k:v}"
        const headingMatch = line.match(/^#+\s+([^\{]*)(?:\{([^\}]*)\})?/);
        if (!headingMatch) return { attrs, newI: i };

        attrs.name = headingMatch[1].trim();

        if (headingMatch[2]) {
            // inline: "## name {k:v, k:v}"
            headingMatch[2].split(',').forEach((p: string) => {
                const idx = p.indexOf(':');
                if (idx === -1) return;
                const k = p.slice(0, idx).trim();
                const v = p.slice(idx + 1).trim();
                if (k) attrs[k] = v;
            });
        } else if (/\{\s*$/.test(line)) {
            // multiline: "## name {" → lê linhas indentadas até "}"
            while (i < lines.length) {
                const cur = lines[i];
                if (/^\s*\}/.test(cur)) { i++; break; }
                if (/^\s{2,}/.test(cur)) {
                    const m = cur.trim().match(/^([\w-]+)\s*:\s*(.*)/);
                    if (m) attrs[m[1].trim()] = m[2].trim();
                }
                i++;
            }
        }

        return { attrs, newI: i };
    }

    private parseAttrs_old(raw: any) {
        // ex: "main {cols: 2/3}"        => { name: 'main', cols: '2/3' }
        // ex: "{molecule: content-item}" => { name: '', molecule: 'content-item' }
        // ex: ## actions {
        //  col: 0, 
        //  style: gap:.5rem; display:flex
        // }
        const attrs: any = {};

        const m = raw.match(/^([^\{]*)(?:\{([^\}]*)\})?/);
        if (!m) return attrs;

        attrs.name = m[1].trim();

        if (m[2]) {
            m[2].split(',').forEach((p: any) => {
                const idx = p.indexOf(':');          // split only on FIRST colon
                if (idx === -1) return;
                const k = p.slice(0, idx).trim();
                const v = p.slice(idx + 1).trim();
                if (k) attrs[k] = v;
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
        let i = -1;


        const root: NodeFather = { molecule: 'div', cols: 1, child: [], name: "root", attrs: {} };

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
            i++
            const line = lines[i];


            if (!line || !line.trim()) continue;

            // ── Headings → div container ─────────────────────────────────────
            const hm = line.match(/^(#{1,6})\s+(.*)/);
            if (hm) {
                const level = hm[1].length;
                const { attrs, newI } = this.parseAttrs(lines, i);
                i = newI;
                //const  attrs = this.parseAttrs_old(hm[2]);
                const molecule = attrs.molecule ? attrs.molecule : 'div';
                const cols = attrs.cols ? attrs.cols : '0';
                if (attrs.molecule) delete attrs.molecule;
                if (attrs.cols) delete attrs.cols;
                const node: NodeFather = {
                    name: attrs.name || '',
                    molecule,
                    attrs,
                    cols,
                    child: [],
                };

                pushNode(level, node);
                continue;
            }

            // ── > field: → campo ─────────────────────────────────────────────
            if (line.startsWith('> field:') || line.startsWith('&gt; field:')) {
                const fieldId = line.replace('> field:', '').replace('&gt; field:', '').trim();
                const { props, newI }: any = this.parseFieldProps(lines, i + 1);
                i = newI;
                const molecule = props.molecule || 'span';
                if (props.molecule) delete props.molecule;
                const field = { molecule, field: fieldId, attrs: props };
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
                parent.child.push({ molecule: 'action', attrs: { name: id, label, style: parts[1] || 'secondary', condition: parts[2] } });
                continue;
            }
        }

        return root;
    }


    // ─── Renderer ─────────────────────────────────────────────────────────────────

    private attrsStr(attrs = {}) {
        return Object.entries(attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(' ');
    }

    private renderNode(node: NodeField) {
        let { molecule, child = [] } = node;

        // nós sem tag própria → só renderiza filhos
        if (!molecule) return this.renderChildren(child);
        const nodeAttrs = this.attrsStr(node.attrs ? node.attrs : {})

        const inner = this.renderChildren(child);

        // self-closing se não tiver filhos nem label inline
        if (!inner) {

            if (['action'].includes(molecule)) {
                return `<button ${nodeAttrs}>${node.attrs.label}</button>`;
            }


            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'span'].includes(molecule) && node.attrs.label) {
                return `<${molecule} ${nodeAttrs}>${node.attrs.label}</${molecule}>`;
            }

            if (node.attrs && node.attrs.innerHTML) {
                return `<${molecule} ${nodeAttrs}>${node.attrs.innerHTML}</${molecule}>`;
            }

            return `<${molecule} ${nodeAttrs}></${molecule}>`;
        }


        let style = "";
        let name = (node as any as NodeFather).name;
        if ((node as any as NodeFather).cols && (node as any as NodeFather).cols > 1) {
            style = `style="${this.colsToGrid((node as any as NodeFather).cols)}"`;
        }


        return `<${molecule} ${nodeAttrs} ${style} name="${name}">${inner}</${molecule}>`;
    }


    private colsToGrid(cols: string | number): string {
        if (!cols) return '';
        const s = String(cols).trim();

        // "2"   → "1fr 1fr"
        // "1/3" → "1fr 3fr"
        const template = s.includes('/')
            ? s.split('/').map(v => v.trim() + 'fr').join(' ')
            : Array(Number(s)).fill('1fr').join(' ');

        return `display:grid; grid-template-columns: ${template};`;
    }

    private renderChildren(children: any = []) {
        return children.map((n: NodeField) => this.renderNode(n)).join('')
    }



}



interface NodeFather {
    name: string
    molecule: string,
    child: Node[] | NodeField[],
    cols: number,
    attrs: Record<string, string>
}

interface NodeField {
    molecule: string,
    field: string,
    attrs: Record<string, string>
    child: NodeField[]
}
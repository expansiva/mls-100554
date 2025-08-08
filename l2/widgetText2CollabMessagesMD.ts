/// <mls shortName="widgetText2CollabMessagesMD" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, unsafeHTML, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaApresentationTextRichBase } from './_100554_icaApresentationTextRichBase';
import { propertyDataSource } from './_100554_collabDecorators';
/**
* Widget that receives a Slack-style markdown text and renders it as safe and styled HTML.
* @example
* <widget-text2-collab-messages-m-d-100554 text="Olá **mundo**! @lucas #geral" />
*/
@customElement('widget-text2-collab-messages-m-d-100554')
export class WidgetText2CollabMessagesMD extends IcaApresentationTextRichBase {
    private _abortController = new AbortController();
    /**
    * Text in standard Slack-style markdown to be rendered as HTML.
    * @example
    * "Olá **mundo**! @lucas #geral"
    */
    @propertyDataSource({ type: String }) text: string = '';
    // Implementation of the abstract members from the base class
    get content(): string | undefined {
        return this.text;
    }
    set content(val: string | undefined) {
        this.text = val ?? '';
    }
    @propertyDataSource({ type: Boolean }) editable?: boolean;
    
    /**
    * Helper function to extract and protect code blocks (```...```).
    * Now uses <widget-text-code-100554> for rendering code blocks.
    */
    private extractCodeBlocks(input: string): { input: string, codeBlocks: string[] } {
        const codeBlocks: string[] = [];
        // Replace code blocks with placeholders and store the HTML using WidgetTextCode
        input = input.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
            const key = `__CODE_BLOCK_${codeBlocks.length}__`;
            // Escape HTML special chars inside code block for attribute safety
            const safeCode = code.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
            // Create a unique id for the code block for copy button
            const codeId = `cb_${Math.random().toString(36).substr(2, 9)}`;
            // Language label (default to 'bash' if not specified)
            const language = lang ? lang : 'bash';
            // Use the WidgetTextCode component
            codeBlocks.push(`
<div class="collab-md-codeblock-card">
  <div class="collab-md-codeblock-header">
    <span class="collab-md-codeblock-lang">${language}</span>
    <button class="collab-md-codeblock-copy" data-code-id="${codeId}" title="Copiar código" onclick="(function(e){
      const code = document.getElementById('${codeId}').innerText;
      if (navigator && navigator.clipboard) { navigator.clipboard.writeText(code); } else { const t=document.createElement('textarea'); t.value=code; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
      e.target.innerText='Copiado!'; setTimeout(()=>{e.target.innerText='Copiar';},1200);
    })(event)">Copiar</button>
  </div>
  <widget-text-code-100554 class="github"  id="${codeId}" language="${language}" text='${safeCode.replace(/\n/g, "&#10;")}'></widget-text-code-100554>  
</div>            
            `
            );
            return key;
        });
        return { input, codeBlocks };
    }
    /**
    * Helper function to extract and protect inline code (`...`).
    * Now uses <widget-text-code-100554> for rendering inline code.
    */
    private extractInlineCodes(input: string): { input: string, inlineCodes: string[] } {
        const inlineCodes: string[] = [];
        // Replace inline code with placeholders and store the HTML using WidgetTextCode
        input = input.replace(/`([^`\n]+)`/g, (_m, code) => {
            const key = `__INLINE_CODE_${inlineCodes.length}__`;
            // Unique id for inline code
            const codeId = `icb_${Math.random().toString(36).substr(2, 9)}`;
            // Escape HTML special chars inside inline code for attribute safety
            const safeCode = code.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
            // Use the WidgetTextCode component for inline code, always language="inline"
            inlineCodes.push(`
<span class="collab-md-inlinecode-card">
  <span class="collab-md-inlinecode-header">
    <span class="collab-md-inlinecode-lang">bash</span>
    <button class="collab-md-inlinecode-copy" data-code-id="${codeId}" title="Copiar código" onclick="(function(e){
      const code = document.getElementById('${codeId}').innerText;
      if (navigator && navigator.clipboard) { navigator.clipboard.writeText(code); } else { const t=document.createElement('textarea'); t.value=code; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
      e.target.innerText='Copiado!'; setTimeout(()=>{e.target.innerText='Copiar';},1200);
    })(event)">Copiar</button>
  </span>
  <widget-text-code-100554 class="github" language="bash" id="${codeId}" text='${safeCode}' inline></widget-text-code-100554>
</span>            
            `
            ); 
            return key; 
        });
        return { input, inlineCodes };
    }

    private parseMentions(input: string): string {
        // @user
        return input.replace(/(^|\s)@([a-zA-Z0-9_]+)/g, (_m, pre, user) => {
            return `${pre}<span class="mention">@${user}</span>`;
        });
    }

    private parseChannelRefs(input: string): string {
        // #channel
        return input.replace(/(^|\s)#([a-zA-Z0-9_]+)/g, (_m, pre, channel) => {
            return `${pre}<span class="channel-ref">#${channel}</span>`;
        });
    }

    private parseAgentMentions(input: string): string {
        // @@agent
        return input.replace(/@@([a-zA-Z0-9_]+)/g, (_m, agent) => {
            return `<span class="mention-agent">@@${agent}</span>`;
        });
    }

    private parseCommands(input: string): string {
        // /command
        return input.replace(/(^|\s)\/(\w+)/g, (_m, pre, cmd) => {
            return `${pre}<span class="command">/${cmd}</span>`;
        });    
    }

    private parseObjectRefs(input: string): string {
        // _object → <span class="object-ref">_object</span>
        return input.replace(/\b_([a-zA-Z0-9_]+)\b/g, (_m, obj) => {
            return `<span class="object-ref">_${obj}</span>`;
        });
    }

    private parseHelpRefs(input: string): string {
        // ?ajuda → <span class="help-ref">?ajuda</span>
        return input.replace(/\?([a-zA-Z0-9_]+)/g, (_m, help) => {
            return `<span class="help-ref">?${help}</span>`;
        });
    }

    private parseMarkdownLinks(input: string): string {
        // [Texto](https://link.com) → <a href="https://link.com" ...>Texto</a>
        return input.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, text, url) => {
            return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
        });
    }
    /**
    * Parse Slack-style markdown to safe HTML.
    * Order of replacements is important to avoid nested/overlapping tags.
    *
    * Blockquote improvement: blockquote starts with '>' and ends with two newlines or end of text.
    * Now also supports ordered lists (1. Item, 2. Item, ...)
    *
    * Now supports strikethrough using ~~text~~.
    */
    private parseSlackMarkdown(input: string): string {
        if (!input) return '';
        // 🔐 Protect code blocks so they are not affected by other markdown replacements
        const codeBlockResult = this.extractCodeBlocks(input);
        input = codeBlockResult.input;
        const codeBlocks = codeBlockResult.codeBlocks;
        // 🔐 Protect inline code so they are not affected by other markdown replacements
        const inlineCodeResult = this.extractInlineCodes(input);
        input = inlineCodeResult.input;
        const inlineCodes = inlineCodeResult.inlineCodes;
        // --- Blockquote improvement ---
        // We want to match blockquotes that start with '>' and continue as long as the next line also starts with '>' or is indented (markdown style),
        // but if the next line does NOT start with '>', it should not be included in the blockquote.
        // We'll process blockquotes before other block-level elements.
        //
        // Implementation: We'll split the input into lines, group consecutive lines starting with '>' as a blockquote, and join the rest as normal text.
        // Split input into lines
        const lines = input.split(/\r?\n/);
        const outputLines: string[] = [];
        let inBlockquote = false;
        let blockquoteLines: string[] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (/^> ?/.test(line)) {
                // This line is part of a blockquote
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines = [];
                }
                // Remove '> ' or '>' from start
                blockquoteLines.push(line.replace(/^> ?/, ''));
            } else {
                // This line is NOT part of a blockquote
                if (inBlockquote) {
                    // End of blockquote, flush it
                    outputLines.push(`<blockquote>${blockquoteLines.join('<br>')}</blockquote>`);
                    inBlockquote = false;
                    blockquoteLines = [];
                }
                outputLines.push(line);
            }
        }
        // If ended in a blockquote, flush it
        if (inBlockquote) {
            outputLines.push(`<blockquote>${blockquoteLines.join('<br>')}</blockquote>`);
        }
        input = outputLines.join('\n');
        // --- Ordered lists (numbered lists) ---
        // This block will match consecutive lines starting with "1. ...", "2. ..." etc, and wrap them in <ol>...</ol>
        // We process ordered lists before unordered lists to avoid conflicts.
        //
        // Implementation: Use a regex to match blocks of lines that start with a number and a dot, then process each block.
        input = input.replace(/((?:^\d+\. .*(?:\n|$))+)/gm, (m) => {
            // Split block into lines
            const items = m.trim().split(/\n/).map(line => {
                const match = /^\d+\. (.*)/.exec(line);
                return match ? `<li>${match[1]}</li>` : '';
            }).filter(Boolean);
            // Only return <ol> if at least one item found
            return items.length ? `<ol>${items.join('')}</ol>` : m;
        });
        // --- Unordered lists ---
        input = input.replace(/((?:^- .*(?:\n|$))+)/gm, (m) => {
            const items = m.trim().split(/\n/).map(line => {
                const match = /^- (.*)/.exec(line);
                return match ? `<li>${match[1]}</li>` : '';
            }).filter(Boolean);
            return items.length ? `<ul>${items.join('')}</ul>` : m;
        });
        // Bold
        input = input.replace(/\*\*([^*]+)\*\*/g, (_m, bold) => `<strong>${bold}</strong>`);
        // Italic
        input = input.replace(/(^|\s)_([^_\s][^_]*?)_(?=\s|$)/g, (_m, pre, italic) => `${pre}<em>${italic}</em>`);
        // Strikethrough (tachado) - NEW FEATURE
        // This regex matches ~~text~~ and wraps it in <del>...</del>
        // We do this after code blocks and inline code are protected
        input = input.replace(/~~([^~]+)~~/g, (_m, striked) => `<del>${striked}</del>`);
        // Mentions and commands
        input = this.parseMentions(input);
        input = this.parseChannelRefs(input);
        input = this.parseCommands(input)
        input = this.parseAgentMentions(input);
        input = this.parseObjectRefs(input);
        input = this.parseHelpRefs(input);
        input = this.parseMarkdownLinks(input);
        // 🚫 Do NOT escape <, >, & here — this would break the generated HTML
        // Convert line breaks
        input = input.replace(/\n/g, '<br>');
        // Restore protected code blocks
        codeBlocks.forEach((html, i) => {
            input = input.replace(`__CODE_BLOCK_${i}__`, html);
        });
        inlineCodes.forEach((html, i) => {
            input = input.replace(`__INLINE_CODE_${i}__`, html);
        });
        return input;
    }
    render() {        
        return html`<div class="collab-md-message">${unsafeHTML(this.parseSlackMarkdown(this.text))}</div>`;
    }

    private attachDynamicEvents() {
        this._abortController.abort(); // limpa eventos anteriores
        this._abortController = new AbortController();

        const emit = (el: Element, type: string) => {
            const value = el.textContent?.trim().replace(/^[@#/?]+/, ''); // remove prefixos
            el.dispatchEvent(new CustomEvent(type, {
                detail: { value, element: el },
                bubbles: true,
                composed: true,
            }));
        };

        const eventMap: { selector: string, base: string }[] = [
            { selector: '.mention', base: 'mention' },
            { selector: '.channel-ref', base: 'channel' },
            { selector: '.command', base: 'command' },
            { selector: '.help-ref', base: 'help' },
            { selector: '.mention-agent', base: 'mention-agent' },
        ];

        eventMap.forEach(({ selector, base }) => {
            this.renderRoot.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseover', () => emit(el, `${base}-hover`), { signal: this._abortController.signal });
                el.addEventListener('click', () => emit(el, `${base}-click`), { signal: this._abortController.signal });
            });
        });
    }
    updated() {
        this.attachDynamicEvents();
    }
    disconnectedCallback() {
        this._abortController.abort();
        super.disconnectedCallback(); 
    }
}

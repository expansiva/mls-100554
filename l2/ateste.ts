/// <mls fileReference="_100554_/l2/ateste.js" enhancement="_100554_enhancementLit" />

import { html, when, repeat, classMap, styleMap, ifDefined } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

 
@customElement('ateste-100554')
export class SimpleGreeting extends CollabLitElement {
  //test
  @query('#teste') teste: HTMLTextAreaElement | undefined;
  @state() list: string[] = []
  @state() current = 0;
  @state() tot = 0;


  render() {
    return html` 
    <div>
      <h2>${this.current}/${this.tot}</h2>
      <button style="border:1px solid gray;" @click=${this.clickBusca}> Rodar</button>
      <ol style="background:black;color:white; height:150px; overflow:auto" id="list">
      ${this.list.map((l) => html`<li>${l}</li>`)}
      </ol>
      <textarea style="border:1px solid gray; margin-top:1rem; width:100%; min-height:300px" id="teste"></textarea>
    </div>
  `;
  }

  async clickBusca() {

    let itens: string[] = [];
    let erros: string[] = [];

    Object.keys(mls.stor.files).forEach((key) => {

      const f = mls.stor.files[key];
      if (f && f.level === 2 && f.shortName.toLocaleLowerCase().startsWith('w') && f.project === mls.actualProject && !['.html'].includes(f.extension)) itens.push(key); 


    })

    this.tot = itens.length;
    for await (const key of itens) {

      this.current = this.current + 1;
      const f = mls.stor.files[key];
      if (!f) continue;

      let newSource = await this.changeSource(f);


      if (!newSource || !this.teste) {
        if (this.teste) this.teste.value = 'Nada';
        continue;
      }

      this.teste.value = newSource;

      const info: mls.stor.IFileInfoValue = {
        contentType: 'string',
        content: newSource,
      }

      f.status = 'changed';
      await mls.stor.localStor.setContent(f, info);
      this.list.push(key);
      this.list = [... this.list];

    }

    console.info('---------ERROS---------', erros);
  }

  async changeSource(file: mls.stor.IFileInfo): Promise<string> {

    try {
      if (!file) throw new Error(`[beforePromptStep] invalid args, file dont exists`)
      const source = (await file.getContent()) as string | null;
      if (typeof source !== 'string' || !source) throw new Error(`[beforePromptAtomic] invalid source`)

      const array = source.split("\n");
      if (!array) return '';

      const fileReference = mls.stor.convertFileToFileReference(file);
    
      if (!array[0].includes('fileReference') || array[0].includes('groupName')) {
        const tp = this.parseXMLTripleSlash(array[0]).variables;
        array[0] = `/// <mls fileReference="${fileReference}" enhancement="${tp.enhancement || "_blank"}" />`
      } else {
        return '';
      }

      return array.join("\n");
    } catch (e) {
      return '';
    }

  }

  private parseXMLTripleSlash(line: string): ITripleSlash {
    if (!line.startsWith('/// <')) throw new Error('line must start with "/// <" (triple slash and xml');
    const tagName = 'mls'
    const requiredVars = ['enhancement', 'fileReference'];
    const optionalVars = ['author', 'groupName'];
    const res = this.parseXML(line.substring(3).trim());
    if (typeof res === 'string') throw new Error(`invalid triple slash: ${res}`);
    if (res.tagName !== tagName) throw new Error(`invalid tag name: '${res.tagName}', use '${tagName}'`);
    /*requiredVars.forEach((varName) => {
      if (!res.variables[varName]) throw new Error(`missing required variable: "${varName}"`);
    });
    for (const varName in res.variables) {
      if (!requiredVars.includes(varName) && !optionalVars.includes(varName)) throw new Error(`invalid variable name: "${varName}"`);
    }*/
    return res;
  }

  private parseXML(str: string): string | ITripleSlash {
    const regex = /<(\w+)((?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*\/?>/;
    const match = str.match(regex);
    if (!match) return "XML invalid: use ex: <mls variable='text' />";
    const tagName2 = match[1];
    const variables: ITripleSlashVariables = {};
    const attributes = match[2].match(/\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?/g) || [];
    for (let i = 0; i < attributes.length; i++) {
      const [name, value] = attributes[i].split('=');
      variables[(name || '?')] = value ? value.replace(/(^['"]|['"]$)/g, '') : '';
    }
    const text = str.replace(match[0], "").trim();
    if (text) return `XML text invalid: '${text}' use ex: <mls variable='text' />`;
    return { tagName: tagName2, variables };
  }

}

export interface ITripleSlashVariables {
  [key: string]: string;
}

export interface ITripleSlash {
  tagName: string;
  variables: ITripleSlashVariables;
}


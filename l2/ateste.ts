/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, when, repeat, classMap, styleMap, ifDefined } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { updateHTML } from '/_100554_/l2/collabDOMSync.js';
import { createModel } from '/_100554_/l2/collabLibModel.js'

@customElement('ateste-100554')
export class SimpleGreeting extends CollabLitElement {

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

      /*if (f && f.level === 2 && ['.ts'].includes(f.extension) &&
        (
          f.shortName.startsWith('c') ||
          f.shortName.startsWith('d') ||
          f.shortName.startsWith('l') ||
          f.shortName.startsWith('e') ||
          f.shortName.startsWith('m') ||
          f.shortName.startsWith('a') ||
          f.shortName.startsWith('validate') ||
          f.shortName.startsWith('process') ||
          f.shortName.startsWith('stateLit') ||
          f.shortName.startsWith('pluginTask') ||
          f.shortName.startsWith('icaApresentationTextRichBase') ||
          f.shortName.startsWith('icaLitElementBase') ||
          f.shortName.startsWith('icaTypes') ||
          f.shortName.startsWith('widgetTextCode') ||
          f.shortName.startsWith('icaApresentationTextCodeBase') ||
          f.shortName.startsWith('pluginStyleIndexItem') ||
          f.shortName.startsWith('collabMessagesThreadModal') ||
          f.shortName.startsWith('previewModeUtil')
        )
      ) return;

      itens.push(key);*/

      /*if (f && f.level === 2 && ['.ts'].includes(f.extension) &&
        (

          f.shortName.startsWith('service') ||
          f.shortName.startsWith('pluginPreview') ||
          f.shortName.startsWith('tsTest') ||
          f.shortName.startsWith('previewModeSinglePage') ||
          f.shortName.startsWith('previewModeMinimum') || 
          f.shortName.startsWith('widgetDefs') ||
          f.shortName.startsWith('saveAddBranch') ||
          f.shortName.startsWith('pluginCreateProjectLocalToDriver') ||
          f.shortName.startsWith('pluginNewProjectLog') 

        )

      ) itens.push(key);*/

      if (f && f.level === 2 && ['.ts'].includes(f.extension) &&

        (
          f.shortName.startsWith('p')

        ) &&

        !f.shortName.startsWith('pluginPreview') &&
        !f.shortName.startsWith('previewModeSinglePage') &&
        !f.shortName.startsWith('previewModeMinimum') &&
        !f.shortName.startsWith('pluginCreateProjectLocalToDriver') &&
        !f.shortName.startsWith('pluginNewProjectLog') && 
        !f.shortName.startsWith('process') &&
        !f.shortName.startsWith('pluginTask') &&
        !f.shortName.startsWith('pluginStyleIndexItem') &&
        !f.shortName.startsWith('previewModeUtil')



      ) itens.push(key);


    })

    //itens = ['100554_2_collabInit.ts'];
    this.tot = itens.length;
    for await (const key of itens) {

      this.current = this.current + 1;
      const f = mls.stor.files[key];
      if (!f) continue;

      let source = await f.getContent() as string;

      if (!source || !this.teste) return;

      let newSource = this.tratarFinalImportMultiLinha(source);
      newSource = this.tratarImportLateralExclusivo(newSource);
      newSource = this.tratarAwaitImportDinamico(newSource);
      newSource = newSource.replace(`enhancement="_100554_enhancementLit"`, `enhancement="_100554_enhancementLit"`)

      this.teste.value = newSource;

      const info: mls.stor.IFileInfoValue = {
        contentType: 'string',
        content: newSource,
      }

      f.status = 'changed';
      await mls.stor.localStor.setContent(f, info);

      const m = await createModel(f, true, true) as mls.editor.IModelTS;

      if (m && m.compilerResults && m.compilerResults.errors.length > 0) {
        erros.push(key);
        f.hasError = true;
      } else if (m && !m.model.isDisposed) {
        mls.editor.deleteModels(f.project, f.shortName, f.folder, true, f.level)
      }

      if (m) {
        //  mls.editor.deleteModels(f.project, f.shortName, f.folder, true, f.level)
      }

      this.list.push(key);

      this.list = [... this.list];

    }

    console.info('---------ERROS---------', erros);
  }

  tratarAwaitImportDinamico(source: string): string {
    // Expressão Regular para encontrar:
    // 1: 'await import("'
    // 2: O caminho do arquivo (após o prefixo do projeto e caminhos relativos, que são descartados)
    // 3: '")'
    const regex = /(await\s+import\s*\(\s*['"])(?:\.\/|\.\.\/|\/)?_?100554_?[\/\_]*([\w\-\/\.]+)(['"]\s*\))/g;

    const sourceTratado = source.replace(regex, (match, prefix, path, suffix) => {
      // O `path` captura o nome do arquivo e suas pastas, sem o prefixo do projeto

      // 1. Limpa o caminho de restos de extensão (.js, .ts) e barras extras
      let caminhoLimpo = path.replace(/\.(?:js|ts|jsx|tsx)$/i, '');
      caminhoLimpo = caminhoLimpo.replace(/^\/|\/$/g, '');

      // 2. Trata caminhos que usavam '_' como separador de pasta/arquivo
      caminhoLimpo = caminhoLimpo.replace(/_/g, '/');

      // 3. Constrói o novo caminho padronizado: '/_100554_/l2/caminho/do/arquivo.js'
      const novoCaminho = `/_100554_/l2/${caminhoLimpo}.js`;

      // Retorna a linha completa com o caminho tratado
      return `${prefix}${novoCaminho}${suffix}`;
    });

    return sourceTratado;
  }

  tratarImportLateralExclusivo(source: string): string {
    // Expressão Regular para encontrar o padrão exato de importação lateral:
    // 1: Captura 'import '
    // 2: Captura o caminho, removendo './', '_100554_', e o que for necessário.
    // 3: Captura ';
    const regex = /(import\s+['"])(?:\.\/)?_?100554_?[\/\_]*([\w\-\/\.]+)(['"];)/g;

    const sourceTratado = source.replace(regex, (match, prefix, path, suffix) => {
      // Limpa o caminho de restos de extensão (.js, .ts)
      let caminhoLimpo = path.replace(/\.(?:js|ts|jsx|tsx)$/i, '');

      // Remove underscores iniciais que possam ter restado
      caminhoLimpo = caminhoLimpo.replace(/^_/, '');

      // Constrói o novo caminho padronizado: '/_100554_/l2/caminho/do/arquivo.js'
      const novoCaminho = `/_100554_/l2/${caminhoLimpo}.js`;

      return `${prefix}${novoCaminho}${suffix}`;
    });

    return sourceTratado;
  }


  tratarFinalImportMultiLinha(source: string): string {
    // Expressão Regular focada na linha que começa com '}' seguido por 'from' e o caminho.
    // 1: Captura '\} from "'
    // 2: Captura o caminho do arquivo (após o prefixo do projeto, que é descartado)
    // 3: Captura o ';' final
    // O prefixo do projeto (_100554_) e o caminho relativo (./) são removidos do match principal
    const regex = /(from\s+['"])(?:\.\/|\.\.\/|\/)?_?100554_?[\/\_]*([\w\-\/\.]+)(['"])/g;

    const sourceTratado = source.replace(regex, (match, prefix, path, suffix) => {
      // O `path` captura o nome do arquivo e suas pastas, sem o prefixo do projeto

      // 1. Limpa o caminho de restos de extensão (.js, .ts) e barras extras
      let caminhoLimpo = path.replace(/\.(?:js|ts|jsx|tsx)$/i, '');
      caminhoLimpo = caminhoLimpo.replace(/^\/|\/$/g, '');

      // 2. Trata caminhos que usavam '_' como separador de pasta no nome do arquivo
      caminhoLimpo = caminhoLimpo.replace(/_/g, '/');

      // 3. Constrói o novo caminho padronizado: '/_100554_/l2/caminho/do/arquivo.js'
      const novoCaminho = `/_100554_/l2/${caminhoLimpo}.js`;

      // Retorna a linha completa com o caminho tratado
      return `${prefix}${novoCaminho}${suffix}`;
    });

    return sourceTratado;
  }

}



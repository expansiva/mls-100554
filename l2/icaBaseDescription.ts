/// <mls shortName="icaBaseDescription" project="100554" enhancement="_blank" />

import * as icaBase from "./_100554_icaBase";

const icaDescriptions: icaBase.FormComponent[] = [
  // definition principal group 
  { group: "Forms", description: "Componentes para criação e manipulação de formulários, permitindo a entrada de dados pelo usuário de forma estruturada." },
  { group: "Navigation", description: "Componentes projetados para facilitar a movimentação do usuário pela aplicação, englobando tanto a navegação entre diferentes páginas quanto a manipulação de conteúdo dentro de uma mesma página." },
  { group: "Apresentation", description: "Componentes projetados para apresentar conteúdo estático em diferentes formatos, como texto, imagens, vídeos, sons e gráficos." },
  { group: "Layout", description: "Define a estrutura e a organização visual dos elementos na interface do usuário. Engloba componentes e técnicas para arranjar o conteúdo de forma lógica e esteticamente agradável, melhorando a experiência do usuário ao navegar e interagir com a aplicação." },
  {group: "Blocks", description: "Agrupa componentes complexos que encapsulam funcionalidades específicas e são compostos por múltiplos elementos. Esses blocos são projetados para oferecer recursos interativos avançados, como calendários, visualizadores de documentos e sistemas de agendamento, enriquecendo a experiência do usuário com funcionalidades integradas e personalizáveis." },  

  // definition sub group 1 (2 itens 'a / b')
  { group: "Forms / Input", description: "Campos de entrada para coleta de informações do usuário, incluindo texto, números, datas, seleções e mais." },
  { group: "Forms / Records", description: "Visualizadores de registros para apresentar dados ao usuário em diferentes formatos como tabelas, listas, cartões e mapas geográficos." },
  { group: "Forms / Tree", description: "Componentes para visualização e edição de dados em estrutura hierárquica, como árvores de dados, breadcrumbs adaptados e mapas mentais." },
   { group: "Forms / Submit", description: "Componentes focados na finalização de interações do usuário com formulários. Inclui botões para submeter, cancelar ou limpar formulários, bem como mecanismos para enviar dados para sistemas externos. Essencial para facilitar ações conclusivas dentro de formulários, garantindo uma interface clara e eficiente para coleta de dados e outras ações relacionadas. Considerações especiais para feedback ao usuário e questões de segurança e privacidade são fundamentais neste grupo." },
  { group: "Navigation / Links", description: "Conjunto de componentes focados na navegação entre páginas ou recursos, seja dentro da própria aplicação ou para sites externos. Inclui menus, botões, links diretos e âncoras para navegação interna." },
  { group: "Navigation / Content", description: "Componentes especializados na apresentação e interação com diferentes tipos de conteúdo dentro de uma página, como tabs, accordions e popups, permitindo uma experiência de usuário mais dinâmica e interativa." },
  { group: "Apresentation / Text", description: "Componentes para apresentação de conteúdo textual, incluindo textos simples, banners, citações e textos ricos." },
  { group: "Apresentation / Images", description: "Componentes para apresentar imagens, ícones, avatares, galerias, carrosséis, sliders e mapas." },
  { group: "Apresentation / Video", description: "Componentes para incorporar vídeos, apresentar vídeos imagem (como GIFs ou vídeos animados) e listas de reprodução de vídeo." },
  { group: "Apresentation / Sound", description: "Componentes para reprodução de sons, incluindo players de áudio, efeitos sonoros e players de podcast." },
  { group: "Apresentation / Charts", description: "Componentes para exibir gráficos em 2D ou 3D, facilitando a visualização de dados." },
  { group: "Apresentation / Animations", description: "Animações para enriquecer a interação do usuário, incluindo carregamentos, cliques e animações JavaScript." },
  { group: "Apresentation / Embeds", description: "Componentes para incorporar conteúdos de redes sociais, como posts e feeds." },
  { group: "Apresentation / Messages", description: "Componentes destinados a fornecer feedback ao usuário através de mensagens, alertas e notificações. Inclui desde toasts e snackbars, que oferecem feedback breve e direto, até alertas modais e notificações mais persistentes. Ideal para informar os usuários sobre o resultado de ações, avisos importantes, ou novas mensagens recebidas. Esses componentes são projetados para serem intuitivos e minimamente intrusivos, garantindo uma comunicação eficaz sem prejudicar a experiência do usuário." },
  { group: "Layout / Flow", description: "Componentes e técnicas focados na disposição sequencial ou estruturada do conteúdo, como seções, grupos, linhas, colunas e grades. Inclui abordagens adaptativas e responsivas para garantir uma apresentação ótima em diferentes dispositivos e tamanhos de tela." },
  { group: "Layout / Group", description: "Ferramentas e componentes dedicados a agrupar elementos relacionados para destacar informações ou organizar o conteúdo de forma coesa. Inclui tabelas para dados tabulares e cartões para representações visuais compactas de informações." },
  { group: "Blocks / Viewer", description: "Subgrupo dedicado a componentes para visualização de conteúdo, como documentos PDF, planilhas, e outros formatos de arquivo. Permite aos usuários acessar e interagir com uma variedade de dados diretamente dentro da aplicação." },
  { group: "Blocks / Plugins", description: "Inclui componentes de terceiros integráveis, oferecendo funcionalidades adicionais prontas para uso. Estende as capacidades da aplicação com soluções especializadas, como mapas, análises, e widgets de mídia social." },
  { group: "Blocks / Projects", description: "Agrupa componentes internos customizados, como páginas de pesquisa e visualizações de detalhes específicos. Esses blocos são projetados para complementar a aplicação com funcionalidades específicas e visões detalhadas de dados ou processos." },


  // definition final group (3 itens 'a / b / c')
  // Input
  { group: "Forms / Input / Number", description: "Permite ao usuário inserir valores numéricos, com suporte a limites mínimo e máximo.", prompt: "O componente, um 'Input / Form / Number', deve apresentar uma combinação de uma caixa de entrada de texto e um controle deslizante (slider). Ele deve permitir que os usuários digitem um número diretamente na caixa de entrada, ajustando o controle deslizante de acordo dentro de um intervalo mínimo e máximo pré-definido. Se o usuário inserir um número inválido, uma mensagem de erro vermelha deve aparecer abaixo do componente.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,maxvalue,minvalue,step,placeholder,pattern,errormessage,autofocus" },
  { group: "Forms / Input / String", description: "Campo para texto livre, podendo configurar validações como tamanho máximo e expressões regulares.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,maxlength,minlength,placeholder,pattern,errormessage,autofocus" },
  { group: "Forms / Input / Boolean", description: "Componente para escolha binária, como switches ou checkboxes, ideal para configurações de sim/não.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,autofocus" },
  { group: "Forms / Input / Date", description: "Seletor de datas, com opções de configuração para limitar períodos.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,minvalue,maxvalue,placeholder,pattern,errormessage,autofocus" },
  { group: "Forms / Input / Time", description: "Permite ao usuário selecionar um horário, com suporte a diferentes formatos de hora.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,minvalue,maxvalue,placeholder,pattern,errormessage,autofocus" },
  { group: "Forms / Input / Date Range", description: "Componente para seleção de intervalos de datas, útil para filtros de períodos.", attributes: "hint,label,required,disabled,startdatabind,enddatabind,minvalue,maxvalue,placeholder,pattern,errormessage,autofocus" },
  { group: "Forms / Input / Select One", description: "Seletor para uma única opção dentre várias, podendo ser apresentado como dropdown, combobox, etc.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,placeholder,errormessage,autofocus" },
  { group: "Forms / Input / MultiSelect", description: "Permite a seleção de múltiplas opções, ideal para filtros ou configurações avançadas.", attributes: "hint,label,required,disabled,databind,searchdatabind,widget,errormessage,autofocus,databindtype" },
  { group: "Forms / Input / Color", description: "Seletor de cores, com suporte a diferentes formatos de cor (RGB, HEX, etc.)." },
  { group: "Forms / Input / Editor", description: "Editor de texto rico, permitindo formatação básica (negrito, itálico) e inserção de elementos como listas e tabelas." },
  { group: "Forms / Input / Feedback", description: "Para rating, ou joinha (aprovação ou não aprovação), permitindo ao usuário expressar opiniões de forma simples." },
  { group: "Forms / Input / File", description: "Para anexar um arquivo, com suporte a arrastar e soltar e visualização de progresso de upload." },

  // Records
  { group: "Forms / Records / Table", description: "Exibe dados em formato de tabela, com suporte a ordenação e filtragem." },
  { group: "Forms / Records / Table", description: "Exibe dados em formato de tabela, com suporte a ordenação e filtragem." },
  { group: "Forms / Records / List", description: "Lista de itens, customizável para exibir informações resumidas ou detalhadas." },
  { group: "Forms / Records / Timeline", description: "Apresenta eventos ou registros em linha do tempo, facilitando a visualização de sequências ou históricos." },
  { group: "Forms / Records / Cards", description: "Dados apresentados em cartões, ideal para resumos visuais com imagens ou ícones." },
  { group: "Forms / Records / Map (Geo)", description: "Exibe informações geográficas em um mapa, suportando marcadores e regiões personalizadas." },
  { group: "Forms / Records / Table with Pagination", description: "Tabela de dados com paginação, para gerenciar grandes conjuntos de dados sem sobrecarregar a interface." },
  { group: "Forms / Records / Table with Infinite Scroll", description: "Tabela que carrega mais dados automaticamente conforme o usuário rola a página, para uma navegação fluida em grandes conjuntos de dados." },

  // Tree
  { group: "Forms / Tree / Tree View", description: "Estrutura hierárquica de dados que permite expansão e contração de nós, útil para categorias ou estruturas organizacionais." },
  { group: "Forms / Tree / Breadcrumbs", description: "Sequência hierárquica de links que representam a navegação ou localização atual do usuário, aqui adaptada para edição de estruturas hierárquicas." },
  { group: "Forms / Tree / Nested Dropdown", description: "Dropdowns aninhados que permitem a seleção em múltiplos níveis de uma hierarquia." },
  { group: "Forms / Tree / Nested Accordions", description: "Acordions aninhados para organizar conteúdo ou categorias em múltiplas camadas, facilitando a navegação em estruturas complexas." },
  { group: "Forms / Tree / Tag Cloud", description: "Conjunto de tags ou palavras-chave que representam frequência ou importância, permitindo edição e organização dinâmica." },
  { group: "Forms / Tree / Mind Map", description: "Mapa mental para organização e visualização de ideias ou conceitos em estrutura radial, facilitando a edição e expansão de conceitos relacionados." },

  // Submit
  { group: "Forms / Submit / Submit", description: "Botão para submeter o formulário. Ao ser clicado, coleta e envia os dados do formulário para o servidor ou manipulador designado. Essencial para finalizar a entrada de dados pelo usuário." },
  { group: "Forms / Submit / Cancel", description: "Botão para cancelar a operação do formulário, permitindo ao usuário interromper sua ação e, geralmente, voltar ao estado ou tela anterior. Ajuda a garantir uma navegação segura sem submissão de dados." },
  { group: "Forms / Submit / Clear", description: "Botão para limpar todos os campos do formulário, removendo as entradas do usuário. Útil em formulários longos ou complexos onde o reinício pode ser necessário." },
  { group: "Forms / Submit / Send External", description: "Mecanismo para enviar dados do formulário para um sistema ou site externo. Utilizado para integrações com APIs de terceiros ou para coletar informações em diferentes plataformas. Deve garantir a segurança e a privacidade dos dados do usuário." },


  // Links
  { group: "Navigation / Links / Menus", description: "Menus que oferecem navegação principal através da aplicação ou para sites externos. Suportam estruturas hierárquicas para organizar as opções de navegação." },
  { group: "Navigation / Links / Button", description: "Botões utilizados para ações de navegação, como submeter formulários ou redirecionar para outras páginas internas ou externas." },
  { group: "Navigation / Links / Links", description: "Links para navegação direta entre páginas da aplicação ou para recursos externos, com suporte a abertura em nova aba dependendo do contexto (target)." },
  { group: "Navigation / Links / Breadcrumbs", description: "Caminhos de navegação hierárquicos que indicam a localização atual do usuário dentro da aplicação e facilitam o retorno a níveis anteriores." },
  { group: "Navigation / Links / Anchors", description: "Âncoras que permitem a navegação interna em uma página, direcionando o usuário para seções específicas sem recarregar a página." },

  // Content
  { group: "Navigation / Content / Tab", description: "Abas que organizam conteúdo relacionado em seções separadas, permitindo a troca entre elas sem recarregar a página." },
  { group: "Navigation / Content / Scenary", description: "Componentes que guiam o usuário através de cenários ou passos sequenciais dentro de uma mesma página, ideal para tutoriais ou configurações passo a passo." },
  { group: "Navigation / Content / Stepper", description: "Indicadores de passo (steppers) que mostram progresso através de uma sequência de passos, úteis para processos de múltiplas etapas como checkouts ou formulários longos." },
  { group: "Navigation / Content / Toolbar", description: "Barras de ferramentas que oferecem acesso rápido a ações e ferramentas frequentemente usadas, podendo ser parte da navegação de conteúdo ou ação." },
  { group: "Navigation / Content / Accordion", description: "Acordeões que permitem a expansão e contração de seções de conteúdo, organizando grandes quantidades de informação em um espaço compacto." },
  { group: "Navigation / Content / Popup", description: "Popups que fornecem informações adicionais, mensagens ou conteúdo interativo, aparecendo sobre o conteúdo existente sem redirecionar o usuário." },
  { group: "Navigation / Content / Scrollspy", description: "Um componente que atualiza links de navegação baseados na rolagem, indicando qual seção do conteúdo está atualmente visível na tela." },

  // Text
  { group: "Apresentation / Text / Text", description: "Para apresentar blocos de texto simples." },
  { group: "Apresentation / Text / Banner", description: "Para exibir banners promocionais ou informativos." },
  { group: "Apresentation / Text / Quote", description: "Para destacar citações ou depoimentos." },
  { group: "Apresentation / Text / Rich Text", description: "Para apresentar texto com formatação rica." },

  // Images
  { group: "Apresentation / Images / Images", description: "Para apresentar imagens individuais ou em grupo." },
  { group: "Apresentation / Images / Icons", description: "Para exibir ícones representativos." },
  { group: "Apresentation / Images / Avatar", description: "Para mostrar avatares de usuários ou personagens." },
  { group: "Apresentation / Images / Gallery", description: "Para exibir coleções de imagens em formato de galeria." },
  { group: "Apresentation / Images / Carousel", description: "Para apresentar imagens em um carrossel rotativo." },
  { group: "Apresentation / Images / Sliders", description: "Para mostrar imagens ou banners em um slider." },
  { group: "Apresentation / Images / Maps", description: "Para exibir mapas estáticos ou interativos." },

  // Video
  { group: "Apresentation / Video / Embedded Video", description: "Para incorporar vídeos de plataformas externas." },
  { group: "Apresentation / Video / Image Video", description: "Para mostrar vídeos em formato de imagem, como GIFs ou vídeos animados." },
  { group: "Apresentation / Video / Video Playlist", description: "Para listar vídeos em uma sequência ou coleção." },

  // Sound
  { group: "Apresentation / Sound / Player", description: "Para reproduzir arquivos de áudio ou música." },
  { group: "Apresentation / Sound / Sound Effects", description: "Para executar efeitos sonoros em ações específicas." },
  { group: "Apresentation / Sound / Podcast Player", description: "Para reproduzir episódios de podcast." },

  // Charts
  { group: "Apresentation / Charts / 2D", description: "Para exibir gráficos bidimensionais." },
  { group: "Apresentation / Charts / 3D", description: "Para mostrar gráficos tridimensionais." },

  // Animations
  { group: "Apresentation / Animations / Loading", description: "Animações que indicam carregamento de conteúdo." },
  { group: "Apresentation / Animations / OnClick", description: "Animações ativadas por cliques ou interações do usuário." },
  { group: "Apresentation / Animations / JavaScript Animations", description: "Animações complexas criadas com JavaScript." },
  { group: "Apresentation / Indicators", description: "Componentes projetados para informar o usuário sobre o estado ou progresso de uma operação. Inclui barras de progresso, indicadores de carregamento, luzes de status e outros elementos visuais que comunicam informações essenciais de forma clara e concisa. Esses componentes são fundamentais para melhorar a experiência do usuário, fornecendo feedback visual imediato sobre as ações em andamento." },

  // Embeds
  { group: "Apresentation / Embeds / Social Media Posts", description: "Para incorporar posts de redes sociais diretamente na página." },
  { group: "Apresentation / Embeds / Social Media Feeds", description: "Para mostrar feeds ao vivo de redes sociais na aplicação." },
  { group: "Apresentation / Messages / Toast", description: "Mensagens breves que aparecem e desaparecem automaticamente, ideais para feedback de ações não intrusivas." },

  // Messages
  { group: "Apresentation / Messages / Alert", description: "Alertas são notificações importantes que requerem a atenção do usuário, podendo ser usadas para erros críticos, avisos ou confirmações." },
  { group: "Apresentation / Messages / Snackbar", description: "Snackbars fornecem mensagens breves com a opção de uma ação pelo usuário, como desfazer uma ação ou fechar a mensagem." },
  { group: "Apresentation / Messages / Modal", description: "Modais são janelas que aparecem em cima do conteúdo da página para comunicar mensagens importantes ou exigir uma ação do usuário antes de prosseguir." },
  { group: "Apresentation / Messages / Notification", description: "Notificações são mensagens que podem ser enviadas a usuários mesmo quando não estão ativamente usando a aplicação, úteis para atualizações importantes ou lembretes." },
  { group: "Apresentation / Messages / Badge", description: "Badges indicam status ou contam itens, como mensagens não lidas ou notificações, geralmente sobrepostos a ícones ou botões." },

  // Flow
  { group: "Layout / Flow / Section", description: "Divide o conteúdo em seções lógicas e distintas, facilitando a organização e a compreensão pelo usuário." },
  { group: "Layout / Flow / Group", description: "Agrupa elementos relacionados, promovendo uma visualização organizada e coesa do conteúdo." },
  { group: "Layout / Flow / Row", description: "Organiza itens em uma sequência horizontal, ideal para listar elementos que compartilham um contexto." },
  { group: "Layout / Flow / Column", description: "Organiza itens em uma sequência vertical, suportando estruturas hierárquicas ou listagens ordenadas." },
  { group: "Layout / Flow / Grid", description: "Apresenta coleções de itens em uma estrutura bidimensional, facilitando a comparação e visualização." },
  { group: "Layout / Flow / Adaptive", description: "Layouts que se ajustam dinamicamente ao tamanho do dispositivo, mantendo a acessibilidade e a usabilidade." },
  { group: "Layout / Flow / Split", description: "Divide a tela em áreas distintas para interação simultânea com diferentes conteúdos." },

  // Group
  { group: "Layout / Group / Table", description: "Apresenta dados em formato tabular, permitindo fácil análise e comparação de informações." },
  { group: "Layout / Group / Cards", description: "Destaca conjuntos de informações ou itens individuais em formato de cartões, oferecendo uma visão geral acessível." },

  // Viewer
  { group: "Blocks / Viewer / PDF Viewer", description: "Componente para visualizar documentos PDF dentro da aplicação. Permite aos usuários ler e interagir com conteúdo PDF diretamente na interface, sem necessidade de downloads ou aplicativos externos." },
  { group: "Blocks / Viewer / Spreadsheet Viewer", description: "Visualizador de planilhas que suporta formatos como Excel. Facilita a visualização e manipulação de dados de planilhas dentro da aplicação, permitindo análises e revisões diretas." },
  { group: "Blocks / Viewer / Document Viewer", description: "Permite a visualização de vários formatos de documentos, como Word, PowerPoint e PDF, integrando uma visão de conteúdo rico sem a necessidade de software adicional." },
  
  // Plugins
  { group: "Blocks / Plugins / Calendar", description: "Plugin de calendário que oferece visualizações e interações com eventos e agendas. Integra-se com sistemas externos para sincronização e gerenciamento de eventos." },
  { group: "Blocks / Plugins / Schedule", description: "Componente para planejamento e visualização de agendas pessoais ou profissionais. Permite aos usuários organizar e visualizar compromissos, tarefas e eventos em um layout claro e interativo." },
  { group: "Blocks / Plugins / External API", description: "Facilita a integração com APIs externas para buscar ou enviar dados. Ideal para funcionalidades como visualizar condições climáticas, cotações de ações ou atualizações de redes sociais diretamente na aplicação." },
  
  // Projects
  { group: "Blocks / Projects / Pages", description: "Permite a incorporação de páginas inteiras ou componentes específicos dentro da aplicação atual. Útil para integrar funcionalidades ou informações adicionais sem a necessidade de navegação externa." },

];

const attributeDefinitions: icaBase.AttributeDefinition[] = [
  { path: "hint", lit: "@property({ type: String }) hint: string = '${hint}'; // An optional descriptive hint for the field" },
  { path: "label", lit: "@property({ type: String }) label: string = '${label}'; // A label to identify this field" },
  { path: "required", lit: "@property({ type: Boolean }) required: boolean = false; // Whether the field is required or optional" },
  { path: "disabled", lit: "@property({ type: Boolean }) disabled: boolean = false; // Whether the field is ready for input or disabled" },
  { path: "databind", lit: "@property({ type: String }) databind: string = ''; // The path in the global JSON to view or change data" },
  { path: "databindtype", lit: "@property({ type: String }) databindtype: 'string' | 'number' | 'object' |'array' | undefined = undefined; // Only accept databinds with this type, or undefined" },
  { path: "startdatabind", lit: "@property({ type: String }) startdatabind: string = ''; // The path in the global JSON to view or change data" },
  { path: "enddatabind", lit: "@property({ type: String }) enddatabind: string = ''; // The path in the global JSON to view or change data" },
  { path: "searchdatabind", lit: "@property({ type: String }) searchdatabind: string = ''; // Optional path in the global JSON for a list of options" },
  { path: "widget", lit: "@property({ type: String }) widget: string = ''; // The widget selected in this group/subgroup" },
  { path: "maxvalue", lit: "@property({ type: Number }) maxvalue: number | undefined = undefined; // Maximum value restriction for the input" },
  { path: "minvalue", lit: "@property({ type: Number }) minvalue: number | undefined = undefined; // Minimum value restriction for the input" },
  { path: "step", lit: "@property({ type: Number }) step: number | undefined = undefined; // The step increment between values" },
  { path: "placeholder", lit: "@property({ type: String }) placeholder: string = ''; // Placeholder text for the input field" },
  { path: "pattern", lit: "@property({ type: String }) pattern: string = ''; // A regular expression that the input's value must match" },
  { path: "errormessage", lit: "@property({ type: String }) errormessage: string = ''; // Custom error message to display when input validation fails" },
  { path: "autofocus", lit: "@property({ type: Boolean }) autofocus: boolean = false; // Whether the field should be automatically focused on page load" },
  { path: "maxlength", lit: "@property({ type: Number }) maxlength: number | undefined = undefined; // Maximum length restriction for the input" },
  { path: "minlength", lit: "@property({ type: Number }) minlength: number | undefined = undefined; // Minimum length restriction for the input" },
];

export function getDescriptionsRootGroup(): string[] {
  const rootGroups = new Set<string>();
  icaDescriptions.forEach(component => {
    const groupName = component.group.split('/')[0].trim();
    rootGroups.add(groupName);
  });
  return Array.from(rootGroups);
}

export function getDescriptionsSubGroup(root: string): string[] {
  const rc = new Set<string>();
  icaDescriptions.forEach(component => {
    const parts = component.group.split('/');
    if (parts.length > 1 && parts[0].trim() === root) rc.add(parts[1].trim());
  });
  return Array.from(rc);
}

export function getDescriptionsFinalGroup(root: string, subGroup: string): string[] {
  const rc = new Set<string>();
  icaDescriptions.forEach(component => {
    const parts = component.group.split('/');
    if (parts.length > 2 && parts[0].trim() === root && parts[1].trim() === subGroup) rc.add(parts[2].trim());
  });
  return Array.from(rc);
}

export function getFormComponentsDescription(root: string, subGroup: string | null, finalGroup: string | null): string {
  let len = 3;
  if (subGroup === null) len = 1;
  else if (finalGroup === null) len = 2;
  for (const component of icaDescriptions) {
    const parts = component.group.split('/');
    if (parts.length === len &&
      parts[0].trim() === root &&
      (subGroup === null || parts[1].trim() === subGroup) &&
      (finalGroup === null || parts[2].trim() === finalGroup)) return component.description;
  };
  return "";
}

export function getFormComponentsPrompt(root: string, subGroup: string, finalGroup: string): string {
  for (const component of icaDescriptions) {
    const parts = component.group.split('/');
    if (parts.length === 3 &&
      parts[0].trim() === root &&
      parts[1].trim() === subGroup &&
      parts[2].trim() === finalGroup) return component.prompt || "";
  };
  return "";
}

export function getFormComponentsAttributes(root: string, subGroup: string, finalGroup: string): string {
  for (const component of icaDescriptions) {
    const parts = component.group.split('/');
    if (parts.length === 3 &&
      parts[0].trim() === root &&
      parts[1].trim() === subGroup &&
      parts[2].trim() === finalGroup) return component.attributes || "";
  };
  return "";
}

export function getAttributeDefinitions(root: string, subGroup: string, finalGroup: string): string[] {
  const rc = new Set<string>();
  const atts: string = getFormComponentsAttributes(root, subGroup, finalGroup);
  if (!atts) return [];
  const obj1 = attributeDefinitions.find(def => def.path === atts);
  if (obj1) rc.add(obj1.lit)
  else rc.add('// ' + atts + ' dont exists')
  return Array.from(rc);
}



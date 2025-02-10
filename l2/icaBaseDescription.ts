/// <mls shortName="icaBaseDescription" project="100554" enhancement="_blank" />

import * as icaTypes from "./_100554_icaTypes";
import { getMessageKey } from "./_100554_collabLitElement";

/// **collab_i18n_start**
const message_pt = {
  dForms: "Componentes para criação e manipulação de formulários, permitindo a entrada de dados pelo usuário de forma estruturada.",
  dNavigation: "Componentes projetados para facilitar a movimentação do usuário pela aplicação, englobando tanto a navegação entre diferentes páginas quanto a manipulação de conteúdo dentro de uma mesma página.",
  dApresentation: "Componentes projetados para apresentar conteúdo estático em diferentes formatos, como texto, imagens, vídeos, sons e gráficos.",
  dLayout: "Define a estrutura e a organização visual dos elementos na interface do usuário. Engloba componentes e técnicas para arranjar o conteúdo de forma lógica e esteticamente agradável, melhorando a experiência do usuário ao navegar e interagir com a aplicação.",
  dBlocks: "Agrupa componentes complexos que encapsulam funcionalidades específicas e são compostos por múltiplos elementos. Esses blocos são projetados para oferecer recursos interativos avançados, como calendários, visualizadores de documentos e sistemas de agendamento, enriquecendo a experiência do usuário com funcionalidades integradas e personalizáveis.",

  // definition sub group 1 (2 itens 'a / b')
  dFInput: "Campos de entrada para coleta de informações do usuário, incluindo texto, números, datas, seleções e mais.",
  dFRecords: "Visualizadores de registros para apresentar dados ao usuário em diferentes formatos como tabelas, listas, cartões e mapas geográficos.",
  dFTree: "Componentes para visualização e edição de dados em estrutura hierárquica, como árvores de dados, breadcrumbs adaptados e mapas mentais.",
  dFSubmit: "Componentes focados na finalização de interações do usuário com formulários. Inclui botões para submeter, cancelar ou limpar formulários, bem como mecanismos para enviar dados para sistemas externos. Essencial para facilitar ações conclusivas dentro de formulários, garantindo uma interface clara e eficiente para coleta de dados e outras ações relacionadas. Considerações especiais para feedback ao usuário e questões de segurança e privacidade são fundamentais neste grupo.",
  dNLinks: "Conjunto de componentes focados na navegação entre páginas ou recursos, seja dentro da própria aplicação ou para sites externos. Inclui menus, botões, links diretos e âncoras para navegação interna.",
  dNContent: "Componentes especializados na apresentação e interação com diferentes tipos de conteúdo dentro de uma página, como tabs, accordions e popups, permitindo uma experiência de usuário mais dinâmica e interativa.",
  dAText: "Componentes para apresentação de conteúdo textual, incluindo textos simples, banners, citações e textos ricos.",
  dAImages: "Componentes para apresentar imagens, ícones, avatares, galerias, carrosséis, sliders e mapas.",
  dAVideos: "Componentes para incorporar vídeos, apresentar vídeos imagem (como GIFs ou vídeos animados) e listas de reprodução de vídeo.",
  dASound: "Componentes para reprodução de sons, incluindo players de áudio, efeitos sonoros e players de podcast.",
  dACharts: "Componentes para exibir gráficos em 2D ou 3D, facilitando a visualização de dados.",
  dAAnimations: "Animações para enriquecer a interação do usuário, incluindo carregamentos, cliques e animações JavaScript.",
  dAEmbeds: "Componentes para incorporar conteúdos de redes sociais, como posts e feeds.",
  dAMessages: "Componentes destinados a fornecer feedback ao usuário através de mensagens, alertas e notificações. Inclui desde toasts e snackbars, que oferecem feedback breve e direto, até alertas modais e notificações mais persistentes. Ideal para informar os usuários sobre o resultado de ações, avisos importantes, ou novas mensagens recebidas. Esses componentes são projetados para serem intuitivos e minimamente intrusivos, garantindo uma comunicação eficaz sem prejudicar a experiência do usuário.",
  dLFlow: "Componentes e técnicas focados na disposição sequencial ou estruturada do conteúdo, como seções, grupos, linhas, colunas e grades. Inclui abordagens adaptativas e responsivas para garantir uma apresentação ótima em diferentes dispositivos e tamanhos de tela.",
  dLGroup: "Ferramentas e componentes dedicados a agrupar elementos relacionados para destacar informações ou organizar o conteúdo de forma coesa. Inclui tabelas para dados tabulares e cartões para representações visuais compactas de informações.",
  dBView: "Subgrupo dedicado a componentes para visualização de conteúdo, como documentos PDF, planilhas, e outros formatos de arquivo. Permite aos usuários acessar e interagir com uma variedade de dados diretamente dentro da aplicação.",
  dBPlugins: "Inclui componentes de terceiros integráveis, oferecendo funcionalidades adicionais prontas para uso. Estende as capacidades da aplicação com soluções especializadas, como mapas, análises, e widgets de mídia social.",
  dBProjects: "Agrupa componentes internos customizados, como páginas de pesquisa e visualizações de detalhes específicos. Esses blocos são projetados para complementar a aplicação com funcionalidades específicas e visões detalhadas de dados ou processos.",

  // definition final group (3 itens 'a / b / c')
  dFINumber: "Permite ao usuário inserir valores numéricos, com suporte a limites mínimo e máximo.",
  dFIString: "Campo para texto livre, podendo configurar validações como tamanho máximo e expressões regulares.",
  dFIBoolean: "Componente para escolha binária, como switches ou checkboxes, ideal para configurações de sim/não.",
  dFIDate: "Seletor de datas, com opções de configuração para limitar períodos.",
  dFITime: "Permite ao usuário selecionar um horário, com suporte a diferentes formatos de hora.",
  dFIDateRange: "Componente para seleção de intervalos de datas, útil para filtros de períodos.",
  dFISelectOne: "Seletor para uma única opção dentre várias, podendo ser apresentado como dropdown, combobox, etc.",
  dFIMultSelect: "Permite a seleção de múltiplas opções, ideal para filtros ou configurações avançadas.",
  dFIColor: "Seletor de cores, com suporte a diferentes formatos de cor (RGB, HEX, etc.).",
  dFIEditor: "Editor de texto rico, permitindo formatação básica (negrito, itálico) e inserção de elementos como listas e tabelas.",
  dFIFeedBack: "Para rating, ou joinha (aprovação ou não aprovação), permitindo ao usuário expressar opiniões de forma simples.",
  dFIFile: "Para anexar um arquivo, com suporte a arrastar e soltar e visualização de progresso de upload.",
  dFRTable: "Exibe dados em formato de tabela, com suporte a ordenação e filtragem.",
  dFRList: "Lista de itens, customizável para exibir informações resumidas ou detalhadas.",
  dFRTimeline: "Apresenta eventos ou registros em linha do tempo, facilitando a visualização de sequências ou históricos.",
  dFRCards: "Dados apresentados em cartões, ideal para resumos visuais com imagens ou ícones.",
  dFRMap: "Exibe informações geográficas em um mapa, suportando marcadores e regiões personalizadas.",
  dFRPagination: "Tabela de dados com paginação, para gerenciar grandes conjuntos de dados sem sobrecarregar a interface.",
  dFRInfinity: "Tabela que carrega mais dados automaticamente conforme o usuário rola a página, para uma navegação fluida em grandes conjuntos de dados.",
  dFTView: "Estrutura hierárquica de dados que permite expansão e contração de nós, útil para categorias ou estruturas organizacionais.",
  dFTBreadcrumbs: "Sequência hierárquica de links que representam a navegação ou localização atual do usuário, aqui adaptada para edição de estruturas hierárquicas.",
  dFTDropdown: "Dropdowns aninhados que permitem a seleção em múltiplos níveis de uma hierarquia.",
  dFTAccordions: "Acordions aninhados para organizar conteúdo ou categorias em múltiplas camadas, facilitando a navegação em estruturas complexas.",
  dFTTags: "Conjunto de tags ou palavras-chave que representam frequência ou importância, permitindo edição e organização dinâmica.",
  dFTMap: "Mapa mental para organização e visualização de ideias ou conceitos em estrutura radial, facilitando a edição e expansão de conceitos relacionados.",
  dFSSubmit: "Botão para submeter o formulário. Ao ser clicado, coleta e envia os dados do formulário para o servidor ou manipulador designado. Essencial para finalizar a entrada de dados pelo usuário.",
  dFSCancel: "Botão para cancelar a operação do formulário, permitindo ao usuário interromper sua ação e, geralmente, voltar ao estado ou tela anterior. Ajuda a garantir uma navegação segura sem submissão de dados.",
  dFSClear: "Botão para limpar todos os campos do formulário, removendo as entradas do usuário. Útil em formulários longos ou complexos onde o reinício pode ser necessário.",
  dFSSend: "Mecanismo para enviar dados do formulário para um sistema ou site externo. Utilizado para integrações com APIs de terceiros ou para coletar informações em diferentes plataformas. Deve garantir a segurança e a privacidade dos dados do usuário.",
  dNLMenus: "Menus que oferecem navegação principal através da aplicação ou para sites externos. Suportam estruturas hierárquicas para organizar as opções de navegação.",
  dNLButtons: "Botões utilizados para ações de navegação, como submeter formulários ou redirecionar para outras páginas internas ou externas.",
  dNLLinks: "Links para navegação direta entre páginas da aplicação ou para recursos externos, com suporte a abertura em nova aba dependendo do contexto (target).",
  dNLBreadcrumbs: "Caminhos de navegação hierárquicos que indicam a localização atual do usuário dentro da aplicação e facilitam o retorno a níveis anteriores.",
  dNLAnchors: "Âncoras que permitem a navegação interna em uma página, direcionando o usuário para seções específicas sem recarregar a página.",
  dNCTab: "Abas que organizam conteúdo relacionado em seções separadas, permitindo a troca entre elas sem recarregar a página.",
  dNCScenary: "Componentes que guiam o usuário através de cenários ou passos sequenciais dentro de uma mesma página, ideal para tutoriais ou configurações passo a passo.",
  dNCStepper: "Indicadores de passo (steppers) que mostram progresso através de uma sequência de passos, úteis para processos de múltiplas etapas como checkouts ou formulários longos.",
  dNCToolbar: "Barras de ferramentas que oferecem acesso rápido a ações e ferramentas frequentemente usadas, podendo ser parte da navegação de conteúdo ou ação.",
  dNCAccordion: "Acordeões que permitem a expansão e contração de seções de conteúdo, organizando grandes quantidades de informação em um espaço compacto.",
  dNCPopup: "Popups que fornecem informações adicionais, mensagens ou conteúdo interativo, aparecendo sobre o conteúdo existente sem redirecionar o usuário.",
  dNCScrollspy: "Um componente que atualiza links de navegação baseados na rolagem, indicando qual seção do conteúdo está atualmente visível na tela.",
  dATText: "Para apresentar blocos de texto simples.",
  dATCode: "Para apresentar blocos de códigos simples.",
  dATBanner: "Para exibir banners promocionais ou informativos.",
  dATQuote: "Para destacar citações ou depoimentos.",
  dATRich: "Para apresentar texto com formatação rica.",
  dAIImages: "Para apresentar imagens individuais ou em grupo.",
  dAIIcons: "Para exibir ícones representativos.",
  dAIAvatar: "Para mostrar avatares de usuários ou personagens.",
  dAIGallery: "Para exibir coleções de imagens em formato de galeria.",
  dAICarousel: "Para apresentar imagens em um carrossel rotativo.",
  dAISliders: "Para mostrar imagens ou banners em um slider.",
  dAIMaps: "Para exibir mapas estáticos ou interativos.",
  dAVEmbedded: "Para incorporar vídeos de plataformas externas.",
  dAVImage: "Para mostrar vídeos em formato de imagem, como GIFs ou vídeos animados.",
  dAVVideo: "Para listar vídeos em uma sequência ou coleção.",
  dASPlayer: "Para reproduzir arquivos de áudio ou música.",
  dASSound: "Para executar efeitos sonoros em ações específicas.",
  dASPodcast: "Para reproduzir episódios de podcast.",
  dAC2d: "Para exibir gráficos bidimensionais.",
  dAC3d: "Para mostrar gráficos tridimensionais.",
  dAALoading: "Animações que indicam carregamento de conteúdo.",
  dAAClick: "Animações ativadas por cliques ou interações do usuário.",
  dAAJava: "Animações complexas criadas com JavaScript.",
  dAAIndicators: "Componentes projetados para informar o usuário sobre o estado ou progresso de uma operação. Inclui barras de progresso, indicadores de carregamento, luzes de status e outros elementos visuais que comunicam informações essenciais de forma clara e concisa. Esses componentes são fundamentais para melhorar a experiência do usuário, fornecendo feedback visual imediato sobre as ações em andamento.",
  dAEPost: "Para incorporar posts de redes sociais diretamente na página.",
  dAEFeed: "Para mostrar feeds ao vivo de redes sociais na aplicação.",
  dAMToast: "Mensagens breves que aparecem e desaparecem automaticamente, ideais para feedback de ações não intrusivas.",
  dAMAlert: "Alertas são notificações importantes que requerem a atenção do usuário, podendo ser usadas para erros críticos, avisos ou confirmações.",
  dAMSneackbar: "Snackbars fornecem mensagens breves com a opção de uma ação pelo usuário, como desfazer uma ação ou fechar a mensagem.",
  dAMModal: "Modais são janelas que aparecem em cima do conteúdo da página para comunicar mensagens importantes ou exigir uma ação do usuário antes de prosseguir.",
  dAMNotification: "Notificações são mensagens que podem ser enviadas a usuários mesmo quando não estão ativamente usando a aplicação, úteis para atualizações importantes ou lembretes.",
  dAMBadges: "Badges indicam status ou contam itens, como mensagens não lidas ou notificações, geralmente sobrepostos a ícones ou botões.",
  dLFSection: "Divide o conteúdo em seções lógicas e distintas, facilitando a organização e a compreensão pelo usuário.",
  dLFGroup: "Agrupa elementos relacionados, promovendo uma visualização organizada e coesa do conteúdo.",
  dLFRow: "Organiza itens em uma sequência horizontal, ideal para listar elementos que compartilham um contexto.",
  dLFColumn: "Organiza itens em uma sequência vertical, suportando estruturas hierárquicas ou listagens ordenadas.",
  dLFGrid: "Apresenta coleções de itens em uma estrutura bidimensional, facilitando a comparação e visualização.",
  dLFAdaptive: "Layouts que se ajustam dinamicamente ao tamanho do dispositivo, mantendo a acessibilidade e a usabilidade.",
  dLFSplit: "Divide a tela em áreas distintas para interação simultânea com diferentes conteúdos.",
  dLFDivider: "Insere divisores visuais que separam conteúdos sem modificar a estrutura lógica ou hierárquica da página, melhorando a clareza visual.",
  dLGTable: "Apresenta dados em formato tabular, permitindo fácil análise e comparação de informações.",
  dLGCards: "Destaca conjuntos de informações ou itens individuais em formato de cartões, oferecendo uma visão geral acessível.",
  dBVPdf: "Componente para visualizar documentos PDF dentro da aplicação. Permite aos usuários ler e interagir com conteúdo PDF diretamente na interface, sem necessidade de downloads ou aplicativos externos.",
  dBVViwer: "Visualizador de planilhas que suporta formatos como Excel. Facilita a visualização e manipulação de dados de planilhas dentro da aplicação, permitindo análises e revisões diretas.",
  dBVDocument: "Permite a visualização de vários formatos de documentos, como Word, PowerPoint e PDF, integrando uma visão de conteúdo rico sem a necessidade de software adicional.",
  dBPCalendar: "Plugin de calendário que oferece visualizações e interações com eventos e agendas. Integra-se com sistemas externos para sincronização e gerenciamento de eventos.",
  dBPSchedule: "Componente para planejamento e visualização de agendas pessoais ou profissionais. Permite aos usuários organizar e visualizar compromissos, tarefas e eventos em um layout claro e interativo.",
  dBPExternal: "Facilita a integração com APIs externas para buscar ou enviar dados. Ideal para funcionalidades como visualizar condições climáticas, cotações de ações ou atualizações de redes sociais diretamente na aplicação.",
  dBPPages: "Permite a incorporação de páginas inteiras ou componentes específicos dentro da aplicação atual. Útil para integrar funcionalidades ou informações adicionais sem a necessidade de navegação externa.",

  eventDescClick: "Evento é disparado quando o elemento é clicado",
  eventDescDoubleClick: "Evento é disparado quando o elemento é clicado duas vezes",
  eventDescSubmit: "Este evento é disparado quando um formulário é submetido. Normalmente, o evento submit é acionado pelo próprio formulário, mas o botão de submit pode desencadear Evento.",
  eventDescChange: "Evento é disparado quando o valor do campo de entrada é alterado e o usuário sai do campo (por exemplo, clicando fora ou pressionando a tecla Enter). É útil para detectar quando o valor final de um campo foi definido.",
  eventDescInput: "Evento é disparado imediatamente quando o valor do campo de entrada é alterado, enquanto o usuário está digitando. Ele é útil para validações e atualizações em tempo real do valor inserido.",
  eventDescFocus: "Evento é disparado quando o campo de entrada recebe o foco, ou seja, quando o usuário clica no campo ou navega até ele usando o teclado. Ele pode ser usado para executar ações quando o campo é ativado, como destacar o campo ou exibir uma dica de preenchimento.",
  eventDescBlur: "Evento é disparado quando o campo de entrada perde o foco, ou seja, quando o usuário clica fora do campo ou navega para outro elemento. Ele pode ser usado para validar o valor do campo ou para esconder dicas de preenchimento.",
  eventDescInvalid: "Evento é disparado quando um elemento que pode ser enviado foi verificado quanto à validade e não atende às suas restrições.",
  eventDescMouseLeave: "Evento é disparado quando um dispositivo de apontamento (geralmente um mouse) se move sobre para fora do elemento",
  eventDescMouseEnter: "Evento é disparado quando um dispositivo de apontamento (geralmente um mouse) se move sobre um elemento (para dentro do mesmo).",
  eventDescScroll: "Evento acionado quando ocorre um scroll na página.",
  eventDescLoad: "Evento é disparado quando um recurso e seus recursos dependentes terminaram de carregar.",
  eventDescTableRowClick: "Evento disparado quando uma linha da tabela é clicada. É útil para permitir a seleção de linhas ou para exibir detalhes adicionais da linha.",
  eventDescTableCellClick: "Evento disparado quando uma célula específica da tabela é clicada. Pode ser usado para interações mais granulares com dados da tabela.",
  eventDescTableSort: "Evento disparado quando uma coluna da tabela é ordenada. Útil para permitir que a página reordene ou atualize os dados exibidos na tabela.",
  eventDescTableFilter: "Evento disparado quando filtros na tabela são aplicados ou removidos. Pode ser usado para atualizar a exibição dos dados conforme os critérios de filtragem selecionados.",
  eventDescTablePagination: "Evento disparado quando a página atual da tabela é alterada. Essencial para tabelas com muitos dados, permitindo a navegação entre páginas de resultados.",
  eventDescTableLoadMore: "Evento é disparado quando mais dados são carregados na tabela, geralmente quando o usuário rola até o final da tabela ou quando é acionado um botão para carregar mais dados.",
  eventDescListItemSelected: "Evento pode ser disparado quando um item da lista é selecionado pelo usuário. É útil para interações onde o usuário precisa saber qual item foi escolhido.",
  eventDescTimelineItemSelected: "Evento é disparado quando um item da linha do tempo é clicado pelo usuário. Pode ser usado para capturar interações com itens específicos da linha do tempo.",
  eventDescMapLoad: "Evento é disparado quando o mapa é carregado e está pronto para ser interagido pelo usuário.",
  eventDescMapClick: "Evento é disparado quando o usuário clica em qualquer parte do mapa. Pode ser usado para capturar cliques para interações específicas, como exibir informações adicionais sobre uma localização.",
  eventDescMapDragStart: "Evento é disparado quando o usuário começa a arrastar o mapa. Pode ser útil para preparar ações ou atualizações de interface enquanto o mapa está sendo movido.",
  eventDescMapDragEnd: "Evento é disparado quando o usuário termina de arrastar o mapa. Pode ser usado para finalizar ações de atualização de interface ou para ajustar a visualização do mapa após o movimento.",
  eventDescMapZoom: "Evento é disparado quando o nível de zoom do mapa é alterado. Pode ser útil para atualizar conteúdo relacionado à visualização do mapa.",
  eventDescMapResize: "Evento é disparado quando o tamanho do mapa é alterado, seja por redimensionamento da janela do navegador ou outras ações que afetem o espaço disponível para o mapa.",
  eventDescMapError: "Evento é disparado quando ocorre um erro durante o carregamento ou processamento do mapa. Pode ser útil para lidar com falhas na exibição ou interação com o mapa.",
  eventDescTreeClick: "Evento é disparado quando um nó (item) da árvore é clicado pelo usuário. Pode ser usado para capturar interações com nós específicos da árvore.",
  eventDescTreeToggle: "Evento é disparado quando o usuário expande ou recolhe um nó da árvore. Pode ser útil para carregar dinamicamente subnós ou para atualizar a interface de usuário relacionada à expansão/recuo de nós.",
  eventDescTreeSelectionChange: "Evento é disparado quando há uma mudança na seleção de nós da árvore, seja por clique, teclado ou outro método de seleção.",
  eventDescDropdownChange: "Evento é disparado quando há uma mudança no valor selecionado do dropdown. Pode ser usado para atualizar dados relacionados à seleção do usuário.",
  eventDescAccordionToogle: "Evento é disparado quando uma seção do accordion é expandida ou recolhida. O evento pode incluir informações sobre qual seção foi afetada e seu estado atual (expandido ou recolhido).",
  eventDescMenuSelect: "Evento pode ser acionado quando um item do menu é selecionado pelo usuário. É fundamental para determinar qual opção o usuário escolheu.",
  eventDescMenuOpen: "Evento é acionado quando o menu é aberto. Pode ser útil para realizar animações ou outras ações quando o menu é exibido.",
  eventDescMenuClose: "Evento ocorre quando o menu é fechado. Também pode ser usado para animações ou para limpar estados",
  eventDescBreadcrumbClick: "Evento disparado quando um usuário clica em um item do breadcrumb. A página pode usar este evento para navegar para a seção correspondente.",
  eventDescTabScenerieChanged: "Evento disparado quando um tab/cenário for selecionado.",
  eventDescAccordionOpen: "Emitido quando um painel do Accordion é aberto.",
  eventDescAccordionClose: "Emitido quando um painel do Accordion é fechado.",
  eventDescAccordionChange: "Emitido quando o estado de abertura/fechamento de um painel muda.",
  eventDescPopupOpen: " Evento disparado quando o popup é aberto.",
  eventDescPopupClose: "Evento disparado quando o popup é fechado.",
  eventDescPopupConfirm: "Evento disparado quando o usuário confirma alguma ação dentro do popup.",
  eventDescPopupCancel: " Evento disparado quando o usuário cancela alguma ação dentro do popup.",
  eventDescScrollPsyActivate: "Evento disparado quando uma seção específica é ativada no Scrollspy, ou seja, quando uma nova seção se torna visível na área de visualização.",
  eventDescGalleryItemSelected: "Evento disparado quando um item da galeria é selecionado..",
  eventDescGalleryNext: "Evento disparado quando o usuário navega para o próximo item.",
  eventDescGalleryPrevious: "Evento disparado quando o usuário navega para o item anterior",
  eventDescCarouselChange: "Evento disparado quando o slide ativo é alterado.",
  eventDescCarouselClick: "Evento disparado quando um slide específico é clicado.",
  eventDescCarouselStart: "Evento disparado  quando a transição para o próximo slide começa.",
  eventDescCarouselEnd: "Evento disparado quando a transição para o próximo slide termina",
  eventDescMidiaPlay: "Evento disparado quando a mídia começa a ser reproduzido.",
  eventDescMidiaPause: "Evento disparado  quando a mídia é pausado.",
  eventDescMidiaEnded: "Evento disparado quando a mídia chega ao fim.",
  eventDescDocLoad: " Evento disparado quando o documento é carregado e pronto para visualização.",
  eventDescCalendarChange: "Evento disparado quando a data selecionada muda. Este é um dos eventos mais importantes, pois indica que o usuário escolheu uma nova data.",
  eventDescCalendarMonthChange: "Evento disparado quando o usuário navega para um mês diferente. Isso pode ser útil para carregar eventos ou dados adicionais conforme o usuário navega pelo calendário",
  eventDescCalendarYearChange: "Evento disparado quando o usuário navega para um ano diferente. Isso pode ser útil para carregar eventos ou dados adicionais conforme o usuário navega pelo calendário",
  eventDescCalendarOpen: "Evento disparado quando o calendário é aberto",
  eventDescCalendarClose: "Evento disparado quando o calendário é fechado.",
  eventDescApreMessageOpen: "Evento disparado quando o elemento de messagem é exibido",
  eventDescApreMessageClose: "Evento disparado quando o elemento de messagem é fechado.",
  eventDescApreMessageDismiss: "Evento disparado quando o elemento é descartado pelo usuário.",
  attrDescName: "The name of the input, used for form submissions.",
  attrDesc_name: "O nome do campo de entrada, usado para submissões de formulário.",
  attrDesc_hint: "Uma dica ou texto auxiliar exibido para orientar o usuário.",
  attrDesc_label: "O rótulo do campo de entrada, fornecendo contexto ao usuário.",
  attrDesc_required: "Indica se o campo de entrada é obrigatório.",
  attrDesc_disabled: "Desativa o campo de entrada, tornando-o não editável.",
  attrDesc_maxvalue: "O valor máximo permitido para o campo de entrada.",
  attrDesc_minvalue: "O valor mínimo permitido para o campo de entrada.",
  attrDesc_step: "O intervalo entre os valores válidos para o campo de entrada.",
  attrDesc_placeholder: "Texto de espaço reservado exibido quando o campo está vazio.",
  attrDesc_pattern: "Uma expressão regular para validação do campo de entrada.",
  attrDesc_errormessage: "Mensagem de erro personalizada exibida quando a validação falha.",
  attrDesc_autofocus: "Foca automaticamente no campo de entrada quando a página é carregada.",
  attrDesc_maxlength: "Especifica o número máximo de caracteres permitidos.",
  attrDesc_minlength: "Especifica o número mínimo de caracteres exigidos.",
  attrDesc_autoCapitalize: "Controla o comportamento de capitalização do texto ('off', 'none', 'on', 'sentences', 'words', 'characters').",
  attrDesc_autocorrect: "Habilita ou desabilita a correção automática de texto ('off' ou 'on').",
  attrDesc_autocomplete: "Fornece sugestões de preenchimento automático com base no contexto do campo.",
  attrDesc_validationMessage: "Uma mensagem personalizada exibida se o campo falhar na validação.",
  attrDesc_debounce: "Especifica um atraso (em milissegundos) para o evento `input`.",
  attrDesc_value: "O valor atual do campo de entrada.",
  attrDesc_options: "Uma lista de opções para o campo de entrada, geralmente usada para dropdowns ou elementos de seleção.",
  attrDesc_selectedvalue: "O valor da opção selecionada em um dropdown ou elemento de seleção.",
  attrDesc_inputmode: "Sugere o tipo de dado que pode ser inserido ('none', 'text', 'decimal', etc.).",
  attrDesc_title: "O atributo título para o componente, frequentemente usado para dicas ou contexto adicional.",
  attrDesc_icon: "Especifica um ícone a ser exibido dentro do componente.",
  attrDesc_form: "Especifica o ID do formulário ao qual o campo de entrada está associado.",
  attrDesc_text: "Conteúdo textual a ser exibido dentro do componente.",
  attrDesc_src: "Especifica o URL de origem para elementos de mídia, como imagens ou vídeos.",
  attrDesc_alt: "Texto alternativo para imagens, usado quando a imagem não pode ser exibida.",
  attrDesc_width: "Especifica a largura do componente (por exemplo, imagens, vídeos).",
  attrDesc_height: "Especifica a altura do componente (por exemplo, imagens, vídeos).",
  attrDesc_autoplay: "Inicia automaticamente a reprodução de mídia quando o componente é carregado.",
  attrDesc_controls: "Exibe controles de reprodução de mídia para elementos de vídeo ou áudio.",
  attrDesc_loop: "Indica se a mídia deve ser reproduzida em loop ao atingir o final.",
  attrDesc_preload: "Especifica como o navegador deve pré-carregar mídia ('auto', 'metadata', 'none').",
  attrDesc_open: "Indica se um elemento expansível ou modal está atualmente aberto.",
  attrDesc_language: "Especifica o idioma do conteúdo ou do componente.",
  attrDesc_languages: "Uma lista de idiomas suportados pelo componente.",
  attrDesc_framework: "Especifica o framework sendo usado para renderizar o componente.",
  attrDesc_renderer: "Define o renderizador ou mecanismo de renderização usado pelo componente.",
  attrDesc_readonly: "Torna o campo de entrada somente leitura, impedindo modificações pelo usuário.",
};

const message_en = {
  attrDescName: "The name of the input, used for form submissions.",
  dForms: "Components for creating and manipulating forms, allowing structured data entry by the user.",
  dNavigation: "Components designed to facilitate user movement through the application, encompassing both navigation between different pages and content manipulation within the same page.",
  dApresentation: "Components designed to present static content in different formats, such as text, images, videos, sounds, and graphics.",
  dLayout: "Defines the structure and visual organization of elements in the user interface. It encompasses components and techniques to arrange content in a logical and aesthetically pleasing manner, enhancing the user's experience while navigating and interacting with the application.",
  dBlocks: "Groups complex components that encapsulate specific functionalities and are composed of multiple elements. These blocks are designed to offer advanced interactive features, such as calendars, document viewers, and scheduling systems, enriching the user experience with integrated and customizable functionalities.",

  // definition sub group 1 (2 itens 'a / b')
  dFInput: "Input fields for collecting user information, including text, numbers, dates, selections, and more.",
  dFRecords: "Record viewers to present data to the user in different formats such as tables, lists, cards, and geographic maps.",
  dFTree: "Components for viewing and editing data in a hierarchical structure, such as data trees, adapted breadcrumbs, and mind maps.",
  dFSubmit: "Components focused on finalizing user interactions with forms. Includes buttons to submit, cancel, or clear forms, as well as mechanisms to send data to external systems. Essential for facilitating conclusive actions within forms, ensuring a clear and efficient interface for data collection and related actions. Special considerations for user feedback and security and privacy issues are fundamental in this group.",
  dNLinks: "Set of components focused on navigation between pages or resources, either within the application itself or to external sites. Includes menus, buttons, direct links, and anchors for internal navigation.",
  dNContent: "Components specialized in presenting and interacting with different types of content within a page, such as tabs, accordions, and popups, allowing for a more dynamic and interactive user experience.",
  dAText: "Components for presenting textual content, including plain text, banners, quotes, and rich text.",
  dAImages: "Components for displaying images, icons, avatars, galleries, carousels, sliders, and maps.",
  dAVideos: "Components for embedding videos, displaying image videos (like GIFs or animated videos), and video playlists.",
  dASound: "Components for sound playback, including audio players, sound effects, and podcast players.",
  dACharts: "Components for displaying charts in 2D or 3D, facilitating data visualization.",
  dAAnimations: "Animations to enrich user interaction, including loadings, clicks, and JavaScript animations.",
  dAEmbeds: "Components for embedding social media content, such as posts and feeds.",
  dAMessages: "Components designed to provide user feedback through messages, alerts, and notifications. Includes everything from toasts and snackbars, which offer brief and direct feedback, to modal alerts and more persistent notifications. Ideal for informing users about action results, important warnings, or new messages received. These components are designed to be intuitive and minimally intrusive, ensuring effective communication without compromising the user experience.",
  dLFlow: "Components and techniques focused on the sequential or structured arrangement of content, such as sections, groups, rows, columns, and grids. Includes adaptive and responsive approaches to ensure optimal presentation on different devices and screen sizes.",
  dLGroup: "Tools and components dedicated to grouping related elements to highlight information or organize content cohesively. Includes tables for tabular data and cards for compact visual representations of information.",
  dBView: "Subgroup dedicated to components for content viewing, such as PDF documents, spreadsheets, and other file formats. Allows users to access and interact with a variety of data directly within the application.",
  dBPlugins: "Includes third-party integrable components, offering ready-to-use additional functionalities. Extends the application's capabilities with specialized solutions, such as maps, analytics, and social media widgets.",
  dBProjects: "Groups custom internal components, such as search pages and specific detail views. These blocks are designed to complement the application with specific functionalities and detailed views of data or processes.",

  // definition final group (3 itens 'a / b / c')
  dFINumber: "Allows the user to input numerical values, with support for minimum and maximum limits.",
  dFIString: "Field for free text, with configurable validations such as maximum length and regular expressions.",
  dFIBoolean: "Component for binary choice, like switches or checkboxes, ideal for yes/no settings.",
  dFIDate: "Date selector, with configuration options to limit periods.",
  dFITime: "Allows the user to select a time, with support for different time formats.",
  dFIDateRange: "Component for selecting date ranges, useful for period filters.",
  dFISelectOne: "Selector for a single option among many, which can be presented as a dropdown, combobox, etc.",
  dFIMultSelect: "Allows multiple option selection, ideal for filters or advanced settings.",
  dFIColor: "Color picker, with support for different color formats (RGB, HEX, etc.).",
  dFIEditor: "Rich text editor, allowing basic formatting (bold, italic) and insertion of elements like lists and tables.",
  dFIFeedBack: "For rating or thumbs up/down (approval or disapproval), allowing the user to express opinions simply.",
  dFIFile: "For attaching a file, with support for drag and drop and upload progress visualization.",
  dFRTable: "Displays data in table format, with support for sorting and filtering.",
  dFRList: "List of items, customizable to display summarized or detailed information.",
  dFRTimeline: "Presents events or records in a timeline, facilitating the visualization of sequences or histories.",
  dFRCards: "Data presented in cards, ideal for visual summaries with images or icons.",
  dFRMap: "Displays geographic information on a map, supporting markers and custom regions.",
  dFRPagination: "Data table with pagination, to manage large data sets without overloading the interface.",
  dFRInfinity: "Table that automatically loads more data as the user scrolls the page, for smooth navigation through large data sets.",
  dFTView: "Hierarchical data structure that allows for expansion and contraction of nodes, useful for categories or organizational structures.",
  dFTBreadcrumbs: "Hierarchical sequence of links representing the user's navigation or current location, here adapted for editing hierarchical structures.",
  dFTDropdown: "Nested dropdowns that allow selection at multiple levels of a hierarchy.",
  dFTAccordions: "Nested accordions to organize content or categories into multiple layers, facilitating navigation in complex structures.",
  dFTTags: "Set of tags or keywords representing frequency or importance, allowing dynamic editing and organization.",
  dFTMap: "Mind map for organizing and visualizing ideas or concepts in a radial structure, facilitating editing and expansion of related concepts.",
  dFSSubmit: "Button to submit the form. When clicked, it collects and sends the form data to the server or designated handler. Essential for finalizing user data entry.",
  dFSCancel: "Button to cancel the form operation, allowing the user to abort their action and typically return to the previous state or screen. Helps ensure safe navigation without data submission.",
  dFSClear: "Button to clear all form fields, removing user inputs. Useful in long or complex forms where reset may be necessary.",
  dFSSend: "Mechanism for sending form data to an external system or website. Used for integrations with third-party APIs or for collecting information across different platforms. Must ensure user data security and privacy.",
  dNLMenus: "Menus that provide primary navigation through the application or to external sites. Support hierarchical structures to organize navigation options.",
  dNLButtons: "Buttons used for navigation actions, such as submitting forms or redirecting to other internal or external pages.",
  dNLLinks: "Links for direct navigation between application pages or external resources, with support for opening in a new tab depending on the context (target).",
  dNLBreadcrumbs: "Hierarchical navigation paths that indicate the user's current location within the application and facilitate returning to previous levels.",
  dNLAnchors: "Anchors that allow internal navigation on a page, directing the user to specific sections without reloading the page.",
  dNCTab: "Tabs that organize related content into separate sections, allowing switching between them without reloading the page.",
  dNCScenary: "Components that guide the user through scenarios or sequential steps within the same page, ideal for tutorials or step-by-step configurations.",
  dNCStepper: "Step indicators (steppers) that show progress through a sequence of steps, useful for multi-step processes such as checkouts or long forms.",
  dNCToolbar: "Toolbars that offer quick access to frequently used actions and tools, which can be part of content or action navigation.",
  dNCAccordion: "Accordions that allow expanding and collapsing sections of content, organizing large amounts of information in a compact space.",
  dNCPopup: "Popups that provide additional information, messages, or interactive content, appearing over the existing content without redirecting the user.",
  dNCScrollspy: "A component that updates navigation links based on scrolling, indicating which section of the content is currently visible on the screen.",
  dATText: "To present blocks of simple text.",
  dATCode: "To present blocks of code.",
  dATBanner: "To display promotional or informational banners.",
  dATQuote: "To highlight quotations or testimonials.",
  dATRich: "To present text with rich formatting.",
  dAIImages: "To present individual or grouped images.",
  dAIIcons: "To display representative icons.",
  dAIAvatar: "To show user or character avatars.",
  dAIGallery: "To display collections of images in gallery format.",
  dAICarousel: "To present images in a rotating carousel.",
  dAISliders: "To display images or banners in a slider.",
  dAIMaps: "To display static or interactive maps.",
  dAVEmbedded: "To embed videos from external platforms.",
  dAVImage: "To display videos in image format, such as GIFs or animated videos.",
  dAVVideo: "To list videos in a sequence or collection.",
  dASPlayer: "To play audio files or music.",
  dASSound: "To play sound effects on specific actions.",
  dASPodcast: "To play podcast episodes.",
  dAC2d: "To display two-dimensional charts.",
  dAC3d: "To show three-dimensional charts.",
  dAALoading: "Animations indicating content loading.",
  dAAClick: "Animations triggered by clicks or user interactions.",
  dAAJava: "Complex animations created with JavaScript.",
  dAAIndicators: "Components designed to inform the user about the state or progress of an operation. Includes progress bars, loading indicators, status lights, and other visual elements that communicate essential information clearly and concisely. These components are essential for improving the user experience by providing immediate visual feedback on ongoing actions.",
  dAEPost: "To embed social media posts directly on the page.",
  dAEFeed: "To display live social media feeds in the application.",
  dAMToast: "Brief messages that appear and disappear automatically, ideal for non-intrusive action feedback.",
  dAMAlert: "Alerts are important notifications that require the user's attention, and can be used for critical errors, warnings, or confirmations.",
  dAMSneackbar: "Snackbars provide brief messages with the option for user action, such as undoing an action or closing the message.",
  dAMModal: "Modals are windows that appear on top of the page content to communicate important messages or require user action before proceeding.",
  dAMNotification: "Notifications are messages that can be sent to users even when they are not actively using the application, useful for important updates or reminders.",
  dAMBadges: "Badges indicate status or count items, such as unread messages or notifications, usually overlaid on icons or buttons.",
  dLFSection: "Divides content into logical and distinct sections, facilitating organization and understanding by the user.",
  dLFGroup: "Groups related elements, promoting an organized and cohesive view of the content.",
  dLFRow: "Organizes items in a horizontal sequence, ideal for listing elements that share a context.",
  dLFColumn: "Organizes items in a vertical sequence, supporting hierarchical structures or ordered listings.",
  dLFGrid: "Presents collections of items in a two-dimensional structure, facilitating comparison and visualization.",
  dLFAdaptive: "Layouts that dynamically adjust to the device size, maintaining accessibility and usability.",
  dLFSplit: "Divides the screen into distinct areas for simultaneous interaction with different content.",
  dLFDivider: "Insere divisores visuais que separam conteúdos sem modificar a estrutura lógica ou hierárquica da página, melhorando a clareza visual.",
  dLGTable: "Displays data in tabular format, allowing easy analysis and comparison of information.",
  dLGCards: "Highlights sets of information or individual items in card format, providing an accessible overview.",
  dBVPdf: "Component for viewing PDF documents within the application. Allows users to read and interact with PDF content directly in the interface, without the need for downloads or external applications.",
  dBVViwer: "Spreadsheet viewer that supports formats such as Excel. Facilitates the visualization and manipulation of spreadsheet data within the application, allowing for direct analysis and reviews.",
  dBVDocument: "Allows the visualization of various document formats, such as Word, PowerPoint, and PDF, integrating a rich content view without the need for additional software.",
  dBPCalendar: "Calendar plugin that offers views and interactions with events and schedules. Integrates with external systems for event synchronization and management.",
  dBPSchedule: "Component for planning and viewing personal or professional schedules. Allows users to organize and view appointments, tasks, and events in a clear and interactive layout.",
  dBPExternal: "Facilitates integration with external APIs to fetch or send data. Ideal for features such as viewing weather conditions, stock quotes, or social media updates directly in the application.",
  dBPPages: "Allows the embedding of entire pages or specific components within the current application. Useful for integrating additional functionality or information without the need for external navigation.",

  eventDescClick: "Event is triggered when the element is clicked",
  eventDescDoubleClick: "Event is triggered when the element is clicked twice",
  eventDescSubmit: "Event is triggered when a form is submitted. Typically, the submit event is fired by the form itself, but the submit button can also trigger this event.",
  eventDescChange: "Event is triggered when the value of the input field is changed and the user leaves the field (for example, by clicking outside or pressing the Enter key). It is useful for detecting when the final value of a field has been set.",
  eventDescInput: "Event is triggered immediately when the value of the input field is changed, while the user is typing. It is useful for real-time validations and updates of the entered value.",
  eventDescFocus: "Event is triggered when the input field receives focus, that is, when the user clicks on the field or navigates to it using the keyboard. It can be used to perform actions when the field is activated, such as highlighting the field or displaying a filling tip.",
  eventDescBlur: "Event is triggered when the input field loses focus, that is, when the user clicks outside the field or navigates to another element. It can be used to validate the field value or to hide filling tips.",
  eventDescInvalid: "Event is triggered when a submittable element has been checked for validity and doesn't satisfy its constraints.",
  eventDescMouseLeave: "Event is triggered when a pointing device (typically a mouse) moves out of the element.",
  eventDescMouseEnter: "Event is triggered when a pointing device (typically a mouse) moves over an element (into it).",
  eventDescScroll: "Event triggered when a scroll occurs on the page.",
  eventDescTableRowClick: "Event triggered when a table row is clicked. Useful for enabling row selection or displaying additional details of the row.",
  eventDescTableCellClick: "Event triggered when a specific cell in the table is clicked. Can be used for more granular interactions with table data.",
  eventDescTableSort: "Event triggered when a table column is sorted. Useful for allowing the page to reorder or update the displayed data in the table.",
  eventDescTableFilter: "Event triggered when filters in the table are applied or removed. Can be used to update the data display based on selected filtering criteria.",
  eventDescTablePagination: "Event triggered when the current page of the table is changed. Essential for tables with large datasets, allowing navigation between result pages.",
  eventDescTableLoadMore: "Event is triggered when more data is loaded into the table, typically when the user scrolls to the bottom of the table or when a button is clicked to load more data.",
  eventDescListItemSelected: "Event is triggered when a list item is selected by the user. It's useful for interactions where the user needs to know which item was chosen.",
  eventDescTimelineItemSelected: "Event is triggered when a timeline item is clicked by the user. It can be used to capture interactions with specific timeline items.",
  eventDescMapLoad: "Event is triggered when the map is loaded and ready for user interaction.",
  eventDescMapClick: "Event is triggered when the user clicks anywhere on the map. It can be used to capture clicks for specific interactions, such as displaying additional information about a location.",
  eventDescMapDragStart: "Event is triggered when the user starts dragging the map. It can be useful for preparing actions or interface updates while the map is being moved.",
  eventDescMapDragEnd: "Event is triggered when the user finishes dragging the map. It can be used to finalize interface update actions or to adjust the map view after movement.",
  eventDescMapZoom: "Event is triggered when the map zoom level is changed. It can be useful for updating content related to the map view.",
  eventDescMapResize: "Event is triggered when the map size is changed, either by resizing the browser window or other actions affecting the available space for the map.",
  eventDescMapError: "Event is triggered when an error occurs during map loading or processing. It can be useful for handling display failures or interaction issues with the map.",
  eventDescTreeClick: "Event is triggered when a node (item) in the tree is clicked by the user. It can be used to capture interactions with specific tree nodes.",
  eventDescTreeToggle: "Event is triggered when the user expands or collapses a node in the tree. It can be useful for dynamically loading child nodes or updating the user interface related to node expansion/collapse.",
  eventDescTreeSelectionChange: "Event is triggered when there is a change in the selection of tree nodes, either by click, keyboard, or another selection method.",
  eventDescDropdownChange: "Event is triggered when there is a change in the selected value of the dropdown. It can be used to update data related to user selection.",
  eventDescAccordionToogle: "Event is triggered when a section of the accordion is expanded or collapsed. The event can include information about which section was affected and its current state (expanded or collapsed).",
  eventDescMenuSelect: "Event istriggered when a menu item is selected by the user. It is essential for determining which option the user chose.",
  eventDescMenuOpen: "Event is triggered when the menu is opened. It can be useful for performing animations or other actions when the menu is displayed.",
  eventDescMenuClose: "Event occurs when the menu is closed. It can also be used for animations or to clear states.",
  eventDescBreadcrumbClick: "Event is triggered when a user clicks on a breadcrumb item. The page can use this event to navigate to the corresponding section.",
  eventDescTabScenerieChanged: "Event is triggered when a tab/scenary is selected.",
  eventDescAccordionOpen: "Event triggered when an Accordion panel is opened.",
  eventDescAccordionClose: "Event triggered when an Accordion panel is closed.",
  eventDescAccordionChange: "Event triggered when the open/close state of an Accordion panel changes.",
  eventDescPopupOpen: "Event triggered when the popup is opened.",
  eventDescPopupClose: "Event triggered when the popup is closed.",
  eventDescPopupConfirm: "Event triggered when the user confirms an action within the popup.",
  eventDescPopupCancel: "Event triggered when the user cancels an action within the popup.",
  eventDescScrollPsyActivate: "Event triggered when a specific section is activated in Scrollspy, i.e., when a new section becomes visible in the viewport.",
  eventDescGalleryItemSelected: "Event triggered when a gallery item is selected.",
  eventDescGalleryNext: "Event triggered when the user navigates to the next item.",
  eventDescGalleryPrevious: "Event triggered when the user navigates to the previous item.",
  eventDescCarouselChange: "Event triggered when the active slide is changed.",
  eventDescCarouselClick: "Event triggered when a specific slide is clicked.",
  eventDescCarouselStart: "Event triggered when the transition to the next slide begins.",
  eventDescCarouselEnd: "Event triggered when the transition to the next slide ends.",
  eventDescMidiaPlay: "Event triggered when the midia starts playing.",
  eventDescMidiaPause: "Event triggered when the midia is paused.",
  eventDescMidiaEnded: "Event triggered when the midia ends.",
  eventDescDocLoad: "Event triggered when the document is loaded and ready for viewing.",
  eventDescCalendarChange: "Event triggered when the selected date changes. This is one of the most important events as it indicates that the user has chosen a new date.",
  eventDescCalendarMonthChange: "Event triggered when the user navigates to a different month. This can be useful for loading additional events or data as the user navigates through the calendar.",
  eventDescCalendarYearChange: "Event triggered when the user navigates to a different year. This can be useful for loading additional events or data as the user navigates through the calendar.",
  eventDescCalendarOpen: "Event triggered when the calendar is opened.",
  eventDescCalendarClose: "Event triggered when the calendar is closed.",
  eventDescApreMessageOpen: "Event triggered when the message element is displayed.",
  eventDescApreMessageClose: "Event triggered when the message element is closed.",
  eventDescApreMessageDismiss: "Event triggered when the message element is dismissed by the user.",
  attrDesc_name: "The name of the input, used for form submissions.",
  attrDesc_hint: "A hint or helper text displayed to guide the user.",
  attrDesc_label: "The label for the input field, providing context to the user.",
  attrDesc_required: "Indicates whether the input is required.",
  attrDesc_disabled: "Disables the input field, making it uneditable.",
  attrDesc_maxvalue: "The maximum value allowed for the input.",
  attrDesc_minvalue: "The minimum value allowed for the input.",
  attrDesc_step: "The interval between legal numbers in the input.",
  attrDesc_placeholder: "Placeholder text displayed when the input is empty.",
  attrDesc_pattern: "A regular expression for input validation.",
  attrDesc_errormessage: "Custom error message displayed when validation fails.",
  attrDesc_autofocus: "Automatically focuses the input field when the page loads.",
  attrDesc_maxlength: "Specifies the maximum number of characters allowed.",
  attrDesc_minlength: "Specifies the minimum number of characters required.",
  attrDesc_autoCapitalize: "Controls text capitalization behavior ('off', 'none', 'on', 'sentences', 'words', or 'characters').",
  attrDesc_autocorrect: "Enables or disables automatic text correction ('off' or 'on').",
  attrDesc_autocomplete: "Provides autocomplete suggestions based on the input's context.",
  attrDesc_validationMessage: "A custom message displayed if the field fails validation.",
  attrDesc_debounce: "Specifies a delay (in milliseconds) for the `input` event.",
  attrDesc_value: "The current value of the input field.",
  attrDesc_options: "A list of options for the input, typically used for dropdowns or select elements.",
  attrDesc_selectedvalue: "The value of the selected option in a dropdown or select element.",
  attrDesc_inputmode: "Hints at the type of data that might be entered ('none', 'text', 'decimal', etc.).",
  attrDesc_title: "The title attribute for the component, often used for tooltips or additional context.",
  attrDesc_icon: "Specifies an icon to be displayed within the component.",
  attrDesc_form: "Specifies the ID of the form that the input is associated with.",
  attrDesc_text: "Text content to be displayed within the component.",
  attrDesc_src: "Specifies the source URL for media elements such as images or videos.",
  attrDesc_alt: "Alternative text for images, used when the image cannot be displayed.",
  attrDesc_width: "Specifies the width of the component (e.g., images, videos).",
  attrDesc_height: "Specifies the height of the component (e.g., images, videos).",
  attrDesc_autoplay: "Automatically starts playback of media when the component is loaded.",
  attrDesc_controls: "Displays media playback controls for video or audio elements.",
  attrDesc_loop: "Indicates whether the media should loop when it reaches the end.",
  attrDesc_preload: "Specifies how the browser should preload media ('auto', 'metadata', 'none').",
  attrDesc_open: "Indicates whether a collapsible or modal element is currently open.",
  attrDesc_language: "Specifies the language of the content or component.",
  attrDesc_languages: "A list of supported languages for the component.",
  attrDesc_framework: "Specifies the framework being used for rendering the component.",
  attrDesc_renderer: "Defines the renderer or rendering engine used for the component.",
  attrDesc_readonly: "Makes the input field read-only, preventing user modifications."
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'en-us': message_en,
  'pt-br': message_pt
}
/// **collab_i18n_end**

let lang = getMessageKey(messages);
let msg: MessageType = messages[lang];

const icaDescriptions: icaTypes.FormComponent[] = [
  // definition principal group 
  { group: "Forms" },
  { group: "Navigation" },
  { group: "Apresentation" },
  { group: "Layout" },
  { group: "Blocks" },

  // definition sub group 1 (2 itens 'a / b')
  { group: "Forms / Input" },
  { group: "Forms / Records" },
  { group: "Forms / Tree" },
  { group: "Forms / Submit" },

  { group: "Navigation / Links" },
  { group: "Navigation / Content" },

  { group: "Apresentation / Text" },
  { group: "Apresentation / Images" },
  { group: "Apresentation / Video" },
  { group: "Apresentation / Sound" },
  { group: "Apresentation / Charts" },
  { group: "Apresentation / Animations" },
  { group: "Apresentation / Embeds" },
  { group: "Apresentation / Messages" },

  { group: "Layout / Flow" },
  { group: "Layout / Group" },

  { group: "Blocks / Viewer" },
  { group: "Blocks / Plugins" },
  { group: "Blocks / Projects" },


  // definition final group (3 itens 'a / b / c')
  // Input
  {
    group: "Forms / Input / Number",
    attributes: "name,value,placeholder,label,pattern,errormessage,maxvalue,minvalue,step,required,disabled,readonly,autofocus,hint,inputmode",
    events: "change,input,focus,blur"
  },
  {
    group: "Forms / Input / String",
    attributes: "name,hint,label,required,disabled,readonly,maxlength,minlength,placeholder,pattern,errormessage,autofocus,autoCapitalize,autocorrect,autocomplete,value,validationMessage,debounce",
    events: "change,input,focus,blur,invalid"
  },
  {
    group: "Forms / Input / Boolean",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,checked,errormessage",
    events: "change,focus,blur"
  },
  {
    group: "Forms / Input / Date",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,value,pattern,errormessage,maxvalue,minvalue",
    events: "change,input,focus,blur,invalid"
  },
  {
    group: "Forms / Input / Time",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,value,pattern,errormessage,placeholder",
    events: "change,input,focus,blur,invalid"
  },
  {
    group: "Forms / Input / Date Range",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,pattern,errormessage,startValue,endValue",
    events: "change,input,focus,blur,invalid"
  },
  {
    group: "Forms / Input / Select One",
    attributes: "hint,label,required,disabled,options,selectedvalue",
    events: "change,focus,blur"
  },
  {
    group: "Forms / Input / MultiSelect",
    attributes: "hint,label,required,disabled,options,selectedvalue",
    events: "change,focus,blur"
  },
  {
    group: "Forms / Input / Color",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,value,pattern,errormessage,placeholder",
    events: "change,input,focus,blur,invalid"
  },
  {
    group: "Forms / Input / Editor",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,value,errormessage",
    events: "change,input,focus,blur"
  },
  {
    group: "Forms / Input / Feedback",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,value,errormessage",
    events: "change,input,focus,blur"
  },
  {
    group: "Forms / Input / File",
    attributes: "name,label,hint,required,disabled,readonly,autofocus,errormessage,accept,multiple",
    events: "change,focus,blur"
  },

  {
    group: "Forms / Records / Table",
    attributes: "data,columns,selectedRow,filterable,sortable",
    events: "row-click,cell-click,sort,filter"
  },
  {
    group: "Forms / Records / List",
    attributes: "items,selectedItem",
    events: "item-selected,focus"
  },
  {
    group: "Forms / Records / Timeline",
    attributes: "data,selectedItem",
    events: "item-selected,focus"
  },
  {
    group: "Forms / Records / Cards",
    attributes: "cardsData,selectedCard",
    events: "click,mouseenter,mouseleave"
  },
  {
    group: "Forms / Records / Map (Geo)",
    attributes: "latitude,longitude,zoom,markers,mapType",
    events: "click,load,dragstart,dragend,zoom,resize,error"
  },
  {
    group: "Forms / Records / Table with Pagination",
    attributes: "data,columns,selectedRow,filterable,sortable,pageable",
    events: "row-click,cell-click,sort,filter,pagination"
  },
  {
    group: "Forms / Records / Table with Infinite Scroll",
    attributes: "data,columns,selectedRow,filterable,sortable,infiniteScroll",
    events: "row-click,cell-click,sort,filter,loadmore"
  },

  // Tree
  {
    group: "Forms / Tree / Tree View",
    attributes: "data,selectedNode,expandedNodes",
    events: "tree-click,tree-toggle,selection-change"
  },
  {
    group: "Forms / Tree / Nested Dropdown",
    attributes: "data,selectedValue,disabled,required,placeholder",
    events: "change,blur,focus"
  },
  {
    group: "Forms / Tree / Nested Accordions",
    attributes: "data,expandedSections,multiExpand,disabled",
    events: "toggle"
  },
  {
    group: "Forms / Tree / Tag Cloud",
    attributes: "tagsData,selectedTags",
    events: "tag-click,selection-change"
  },
  {
    group: "Forms / Tree / Mind Map",
    attributes: "data,selectedNode,layout",
    events: "node-click,expand,collapse"
  },

  // Submit
  {
    group: "Forms / Submit / Submit",
    attributes: "name,title,icon,text,disabled,form",
    events: "click,submit,focus,blur"
  },
  {
    group: "Forms / Submit / Cancel",
    attributes: "name,title,icon,text,disabled,form,clicked-value,clicked-action",
    events: "click,submit,focus,blur"
  },
  {
    group: "Forms / Submit / Clear",
    attributes: "name,title,icon,text,disabled,form",
    events: "click,submit,focus,blur"
  },
  {
    group: "Forms / Submit / Send External",
    attributes: "name,title,icon,text,disabled,form",
    events: "click,submit,focus,blur"
  },

  // Links
  {
    group: "Navigation / Links / Menus",
    attributes: "items,selectedItem,openState,disabled",
    events: "select,open,close,focus,blur"
  },
  {
    group: "Navigation / Links / Button",
    attributes: "name,label,disabled,icon",
    events: "click,dblclick,focus,blur,mouseenter,mouseleave"
  },
  {
    group: "Navigation / Links / Links",
    attributes: "href,target,rel,disabled",
    events: "click,focus,blur"
  },
  {
    group: "Navigation / Links / Breadcrumbs",
    attributes: "items,separator",
    events: "breadcrumb-click"
  },
  {
    group: "Navigation / Links / Anchors",
    attributes: "href,target,rel,disabled",
    events: "click,focus,blur"
  },
  // Content
  {
    group: "Navigation / Content / Tab",
    attributes: "tabs,selectedTab,disabled",
    events: "tab-changed"
  },
  {
    group: "Navigation / Content / Scenary",
    attributes: "scenes,selectedScene,disabled",
    events: "scenary-changed"
  },
  {
    group: "Navigation / Content / Stepper",
    attributes: "steps,currentStep,disabled"
  },
  {
    group: "Navigation / Content / Toolbar",
    attributes: "items,orientation,disabled",
    events: "click"
  },
  {
    group: "Navigation / Content / Accordion",
    attributes: "open,text,multiple,disabled",
    events: "open,close,change"
  },
  {
    group: "Navigation / Content / Popup",
    attributes: "open,title,content,modal",
    events: "open,close,confirm,cancel"
  },
  {
    group: "Navigation / Content / Scrollspy",
    attributes: "targets,activeTarget,offset",
    events: "scroll,activate"
  },

  // Text
  {
    group: "Apresentation / Text / Text",
    attributes: "text,type",
    events: "click,focus,blur"
  },
  {
    group: "Apresentation / Text / Code",
    attributes: "text,language,languages",
    events: "click"
  },
  {
    group: "Apresentation / Text / Banner",
    attributes: "text,src,alt",
    events: "click,focus,blur"
  },
  {
    group: "Apresentation / Text / Quote",
    attributes: "text,cite",
    events: "click,focus,blur"
  },
  {
    group: "Apresentation / Text / Rich Text",
    attributes: "content,editable",
    events: "click,focus,blur"
  },

  // Images
  {
    group: "Apresentation / Images / Images",
    attributes: "src,alt,width,height",
    events: "click"
  },
  {
    group: "Apresentation / Images / Icons",
    attributes: "icon,name,size,color,alt",
    events: "click"
  },
  {
    group: "Apresentation / Images / Avatar",
    attributes: "src,alt,size,shape",
    events: "click"
  },
  {
    group: "Apresentation / Images / Gallery",
    attributes: "images,selectedIndex,thumbnails,showNavigation",
    events: "item-selected,navigate-previous,navigate-next"
  },
  {
    group: "Apresentation / Images / Carousel",
    attributes: "slides,autoplay,interval,loop",
    events: "slide-click,slide-change,slide-start,slide-end"
  },
  {
    group: "Apresentation / Images / Sliders",
    attributes: "slides,autoplay,interval,loop",
    events: "slide-click,slide-change,slide-start,slide-end"
  },
  {
    group: "Apresentation / Images / Maps",
    attributes: "latitude,longitude,zoom,markers,mapType",
    events: "click,load,zoom,resize"
  },

  // Video
  {
    group: "Apresentation / Video / Embedded Video",
    attributes: "src,autoplay,controls,loop,preload",
    events: "click,play,pause,ended"
  },
  {
    group: "Apresentation / Video / Image Video",
    attributes: "src,poster,autoplay,controls,loop,preload",
    events: "click,play,pause,ended"
  },
  {
    group: "Apresentation / Video / Video Playlist",
    attributes: "videos,selectedVideo,autoplay,controls,loop",
    events: "click,play,pause,ended"
  },

  // Sound
  {
    group: "Apresentation / Sound / Player",
    attributes: "src,autoplay,controls,loop,preload",
    events: "click,play,pause,ended"
  },
  {
    group: "Apresentation / Sound / Sound Effects",
    attributes: "sounds,selectedSound,autoplay",
    events: "click,play,pause,ended"
  },
  {
    group: "Apresentation / Sound / Podcast Player",
    attributes: "podcastEpisodes,selectedEpisode,autoplay,controls,loop,preload",
    events: "click,play,pause,ended"
  },

  // Charts
  {
    group: "Apresentation / Charts / 2D",
    attributes: "framework,data,renderer",
    events: "click,focus,blur"
  },
  {
    group: "Apresentation / Charts / 3D",
    attributes: "framework,data,renderer,options3d",
    events: "click,focus,blur"
  },

  // Animations
  {
    group: "Apresentation / Animations / Loading",
    attributes: "type,size,color,duration,autoplay",
    events: "start,end"
  },
  {
    group: "Apresentation / Animations / OnClick",
    attributes: "animationType,duration,trigger,iterations",
    events: "animation-start,animation-end"
  },
  {
    group: "Apresentation / Animations / JavaScript Animations",
    attributes: "script,options",
    events: "animation-start,animation-end"
  },
  {
    group: "Apresentation / Indicators",
    attributes: "type,value,max,label",
    events: "change"
  },

  // Embeds
  {
    group: "Apresentation / Embeds / Social Media Posts",
    attributes: "url,width,height",
    events: "load,error,click"
  },
  {
    group: "Apresentation / Embeds / Social Media Feeds",
    attributes: "url,refreshInterval,limit",
    events: "load,refresh,error"
  },

  // Messages
  {
    group: "Apresentation / Messages / Toast",
    attributes: "message,type,duration,closable",
    events: "open,close,dismiss"
  },
  {
    group: "Apresentation / Messages / Alert",
    attributes: "message,type,closable",
    events: "open,close,dismiss"
  },
  {
    group: "Apresentation / Messages / Snackbar",
    attributes: "message,actionText,duration",
    events: "open,close,dismiss"
  },
  {
    group: "Apresentation / Messages / Modal",
    attributes: "title,content,open,closable",
    events: "open,close,dismiss"
  },
  {
    group: "Apresentation / Messages / Notification",
    attributes: "message,type,duration,closable",
    events: "open,close,dismiss"
  },
  {
    group: "Apresentation / Messages / Badge",
    attributes: "text,type,icon",
    events: "click"
  },

  // Flow
  {
    group: "Layout / Flow / Section",
    attributes: "id,class",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Group",
    attributes: "id,class,direction,gap",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Row",
    attributes: "id,class,gap",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Column",
    attributes: "id,class,gap",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Grid",
    attributes: "rows,columns,gap",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Adaptive",
    attributes: "breakpoints,layout",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Split",
    attributes: "direction,ratio,gutter",
    events: "click,focus,blur"
  },
  {
    group: "Layout / Flow / Divider",
    attributes: "text",
    events: "click"
  },

  // Group
  {
    group: "Layout / Group / Table",
    attributes: "data,columns,striped,bordered",
    events: "item-selected,click,focus,blur"
  },
  {
    group: "Layout / Group / Cards",
    attributes: "cardsData,layout,spacing",
    events: "click,focus,blur"
  },

  // Viewer
  {
    group: "Blocks / Viewer / PDF Viewer",
    attributes: "src,page,zoom",
    events: "load,click"
  },
  {
    group: "Blocks / Viewer / Spreadsheet Viewer",
    attributes: "data,activeSheet,readonly",
    events: "load,click"
  },
  {
    group: "Blocks / Viewer / Document Viewer",
    attributes: "src,type,readonly",
    events: "load,click"
  },

  // Plugins
  {
    group: "Blocks / Plugins / Calendar",
    attributes: "value,disabled,min,max",
    events: "change,month-change,year-change,open,close,hover"
  },
  {
    group: "Blocks / Plugins / Schedule",
    attributes: "eventsData,view,selectedDate",
    events: "click"
  },
  {
    group: "Blocks / Plugins / External API",
    attributes: "endpoint,params,method",
    events: "load,error"
  },

  // Projects
  {
    group: "Blocks / Projects / Pages",
    attributes: "data,selectedPage,editable",
    events: "page-change,load,error"
  }
];

const attributeDefinitions: icaTypes.AttributeDefinition[] = [
  { path: "name", lit: "@property({ type: String }) name: string | undefined;" },
  { path: "hint", lit: "@property({ type: String }) hint: string | undefined;", variations: true },
  { path: "label", lit: "@property({ type: String }) label: string | undefined;", variations: true },
  { path: "required", lit: "@property({ type: Boolean }) required: boolean;" },
  { path: "disabled", lit: "@property({ type: Boolean }) disabled: boolean;" },
  { path: "maxvalue", lit: "@property({ type: Number }) maxvalue: number | undefined;" },
  { path: "minvalue", lit: "@property({ type: Number }) minvalue: number | undefined;" },
  { path: "step", lit: "@property({ type: Number }) step: number | undefined;" },
  { path: "placeholder", lit: "@property({ type: String }) placeholder: string| undefined;", variations: true },
  { path: "pattern", lit: "@property({ type: String }) pattern: string| undefined;" },
  { path: "errormessage", lit: "@property({ type: String }) errormessage: string| undefined;", variations: true },
  { path: "autofocus", lit: "@property({ type: Boolean }) autofocus: boolean;" },
  { path: "maxlength", lit: "@property({ type: Number }) maxlength: number | undefined;" },
  { path: "minlength", lit: "@property({ type: Number }) minlength: number | undefined;" },
  { path: "autoCapitalize", lit: "@property({ type: String }) autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';" },
  { path: "autocorrect", lit: "@property({ type: String }) autocorrect: 'off' | 'on';" },
  { path: "autocomplete", lit: "@property({ type: String }) autocomplete: string | undefined;" },
  { path: "validationMessage", lit: "@property({ type: String}) validationMessage: string | undefined" },
  { path: "debounce", lit: "@property({ type: Number}) debounce: number | undefined" },
  { path: "value", lit: "@property({ type: String }) value: string | undefined;", variations: true },
  { path: "options", lit: "@property() options: OptionItem[] | undefined; // Optional path in the global JSON or a valid JSON for a list of options " },
  { path: "selectedvalue", lit: "@property() selectedvalue: string | undefined;" },
  { path: "inputmode", lit: " @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';" },
  { path: "title", lit: "@property({ type: String }) title: string;", variations: true },
  { path: "icon", lit: "@property({ type: String }) icon: string | undefined;" },
  { path: "form", lit: "@property({ type: String }) form: string | undefined;" },

  { path: "text", lit: "@property({ type: String }) text: string | undefined;", variations: true },
  { path: "src", lit: "@property({ type: String }) src: string | undefined;" },
  { path: "alt", lit: "@property() alt: string | undefined;", variations: true },
  { path: "width", lit: "@property() width: string | undefined;" },
  { path: "height", lit: "@property() height: string | undefined;" },
  { path: "autoplay", lit: "@property() autoplay: boolean = false;" },
  { path: "controls", lit: "@property() controls: boolean = true;" },
  { path: "loop", lit: "@property() loop: boolean = false;" },
  { path: "preload", lit: "@property() loop: 'auto' | 'metadata' | 'none' = 'auto';" },

  { path: "open", lit: "@property({ type: Boolean }) open = false;" },

  { path: "language", lit: "@property({ type: String ) language: string | undefined;" },
  { path: "languages", lit: "@property({ type: Array ) languages: string[] | undefined;" },

  { path: "framework", lit: "@property({ type: String }) framework: string | undefined;" },
  { path: "renderer", lit: "@property({ type: String }) renderer: string | undefined;" },
  { path: "readonly", lit: "@property({ type: Boolean }) readonly: boolean | undefined;" },

  { path: "clicked-action", lit: "@propertyDataSource({ type: String, attribute: 'clicked-action' }) clickedAction: string | undefined;" },
  { path: "clicked-value", lit: "@propertyDataSource({ type: String, attribute: 'clicked-value' }) clickedValue: string | undefined;" }


];

const eventsDefinitions: icaTypes.EventsDefinition[] = [
  { name: "change", desc: msg.eventDescChange },
  { name: "click", desc: msg.eventDescClick },
  { name: "dblclick", desc: msg.eventDescDoubleClick },
  { name: "submit", desc: msg.eventDescSubmit },
  { name: "input", desc: msg.eventDescInput },
  { name: "blur", desc: msg.eventDescBlur },
  { name: "focus", desc: msg.eventDescFocus },
  { name: "invalid", desc: msg.eventDescInvalid },
  { name: "mouseleave", desc: msg.eventDescMouseLeave },
  { name: "mouseenter", desc: msg.eventDescMouseEnter },
  { name: "scroll", desc: msg.eventDescScroll },
  { name: "row-click", group: ["Forms / Records / Table", "Forms / Records / Table with Pagination", "Forms / Records / Table with Infinite Scroll"], desc: msg.eventDescTableRowClick },
  { name: "cell-click", group: ["Forms / Records / Table", "Forms / Records / Table with Pagination", "Forms / Records / Table with Infinite Scroll"], desc: msg.eventDescTableCellClick },
  { name: "sort", group: ["Forms / Records / Table", "Forms / Records / Table with Pagination", "Forms / Records / Table with Infinite Scroll"], desc: msg.eventDescTableSort },
  { name: "filter", group: ["Forms / Records / Table", "Forms / Records / Table with Pagination", "Forms / Records / Table with Infinite Scroll"], desc: msg.eventDescTableFilter },
  { name: "pagination", group: ["Forms / Records / Table", "Forms / Records / Table with Pagination", "Forms / Records / Table with Infinite Scroll"], desc: msg.eventDescTablePagination },
  { name: "loadmore", group: ["Forms / Records / Table with Infinite Scroll"], desc: msg.eventDescTableLoadMore },
  { name: "item-selected", group: ["Forms / Records / List"], desc: msg.eventDescListItemSelected },
  { name: "item-selected", group: ["Forms / Records / Timeline"], desc: msg.eventDescTimelineItemSelected },
  { name: "load", group: ["Forms / Records / Map (Geo)", "Apresentation / Images / Maps"], desc: msg.eventDescMapLoad },
  { name: "click", group: ["Forms / Records / Map (Geo)", "Apresentation / Images / Maps"], desc: msg.eventDescMapClick },
  { name: "dragstart", group: ["Forms / Records / Map (Geo)"], desc: msg.eventDescMapDragStart },
  { name: "dragend", group: ["Forms / Records / Map (Geo)"], desc: msg.eventDescMapDragEnd },
  { name: "zoom", group: ["Forms / Records / Map (Geo)", "Apresentation / Images / Maps"], desc: msg.eventDescMapZoom },
  { name: "resize", group: ["Forms / Records / Map (Geo)", "Apresentation / Images / Maps"], desc: msg.eventDescMapResize },
  { name: "error", group: ["Forms / Records / Map (Geo)", "Apresentation / Images / Maps"], desc: msg.eventDescMapError },
  { name: "tree-click", group: ["Forms / Tree / Tree View"], desc: msg.eventDescTreeClick },
  { name: "tree-toggle", group: ["Forms / Tree / Tree View"], desc: msg.eventDescTreeToggle },
  { name: "selection-change", group: ["Forms / Tree / Tree View"], desc: msg.eventDescTreeSelectionChange },
  { name: "change", group: ["Forms / Tree / Nested Dropdown"], desc: msg.eventDescDropdownChange },
  { name: "toogle", group: ["Forms / Tree / Nested Accordions"], desc: msg.eventDescAccordionToogle },
  { name: "select", group: ["Navigation / Links / Menus"], desc: msg.eventDescMenuSelect },
  { name: "open", group: ["Navigation / Links / Menus"], desc: msg.eventDescMenuOpen },
  { name: "close", group: ["Navigation / Links / Menus"], desc: msg.eventDescMenuClose },
  { name: "breadcrumb-click", group: ["Navigation / Links / Breadcrumbs"], desc: msg.eventDescBreadcrumbClick },
  { name: "tab-changed", group: ["Navigation / Content / Tab"], desc: msg.eventDescTabScenerieChanged },
  { name: "scenary-changed", group: ["Navigation / Content / Scenary"], desc: msg.eventDescTabScenerieChanged },
  { name: "open", group: ["Navigation / Content / Accordion"], desc: msg.eventDescAccordionOpen },
  { name: "close", group: ["Navigation / Content / Accordion"], desc: msg.eventDescAccordionClose },
  { name: "change", group: ["Navigation / Content / Accordion"], desc: msg.eventDescAccordionChange },
  { name: "open", group: ["Navigation / Content / Popup"], desc: msg.eventDescPopupOpen },
  { name: "close", group: ["Navigation / Content / Popup"], desc: msg.eventDescPopupClose },
  { name: "confirm", group: ["Navigation / Content / Popup"], desc: msg.eventDescPopupConfirm },
  { name: "cancel", group: ["Navigation / Content / Popup"], desc: msg.eventDescPopupCancel },
  { name: "activate", group: ["Navigation / Content / Scrollspy"], desc: msg.eventDescScrollPsyActivate },
  { name: "item-selected", group: ["Apresentation / Images / Gallery"], desc: msg.eventDescGalleryItemSelected },
  { name: "navigate-previous", group: ["Apresentation / Images / Gallery"], desc: msg.eventDescGalleryPrevious },
  { name: "slide-click", group: ["Apresentation / Images / Carousel", "Apresentation / Images / Sliders"], desc: msg.eventDescCarouselClick },
  { name: "slide-change", group: ["Apresentation / Images / Carousel", "Apresentation / Images / Sliders"], desc: msg.eventDescCarouselChange },
  { name: "slide-start", group: ["Apresentation / Images / Carousel", "Apresentation / Images / Sliders"], desc: msg.eventDescCarouselStart },
  { name: "slide-end", group: ["Apresentation / Images / Carousel", "Apresentation / Images / Sliders"], desc: msg.eventDescCarouselEnd },
  { name: "play", group: ["Apresentation / Video / Embedded Video", "Apresentation / Video / Image Video", "Apresentation / Video / Video Playlis", "Apresentation / Sound / Player", "Apresentation / Sound / Sound Effects", "Apresentation / Sound / Podcast Player"], desc: msg.eventDescCarouselEnd },
  { name: "pause", group: ["Apresentation / Video / Embedded Video", "Apresentation / Video / Image Video", "Apresentation / Video / Video Playlis", "Apresentation / Sound / Player", "Apresentation / Sound / Sound Effects", "Apresentation / Sound / Podcast Player"], desc: msg.eventDescCarouselEnd },
  { name: "ended", group: ["Apresentation / Video / Embedded Video", "Apresentation / Video / Image Video", "Apresentation / Video / Video Playlis", "Apresentation / Sound / Player", "Apresentation / Sound / Sound Effects", "Apresentation / Sound / Podcast Player"], desc: msg.eventDescCarouselEnd },
  { name: "load", group: ["Blocks / Viewer / PDF Viewer", "Blocks / Viewer / Spreadsheet Viewer", "Blocks / Viewer / Document Viewer"], desc: msg.eventDescDocLoad },
  { name: "change", group: ["Blocks / Plugins / Calendar"], desc: msg.eventDescCalendarChange },
  { name: "month-change", group: ["Blocks / Plugins / Calendar"], desc: msg.eventDescCalendarMonthChange },
  { name: "year-change", group: ["Blocks / Plugins / Calendar"], desc: msg.eventDescCalendarYearChange },
  { name: "open", group: ["Blocks / Plugins / Calendar"], desc: msg.eventDescCalendarOpen },
  { name: "close", group: ["Blocks / Plugins / Calendar"], desc: msg.eventDescCalendarClose },
  { name: "open", group: ["Apresentation / Messages / Toast", "Apresentation / Messages / Alert", "Apresentation / Messages / Snackbar", "Apresentation / Messages / Modal", "Apresentation / Messages / Notification"], desc: msg.eventDescApreMessageOpen },
  { name: "close", group: ["Apresentation / Messages / Toast", "Apresentation / Messages / Alert", "Apresentation / Messages / Snackbar", "Apresentation / Messages / Modal", "Apresentation / Messages / Notification"], desc: msg.eventDescApreMessageClose },
  { name: "dismiss", group: ["Apresentation / Messages / Toast", "Apresentation / Messages / Alert", "Apresentation / Messages / Snackbar", "Apresentation / Messages / Modal", "Apresentation / Messages / Notification"], desc: msg.eventDescApreMessageDismiss },

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
  //   group: "Blocks / Projects / Pages",
  //  description: msg.dBPPages,
  // key = d (prefix) , B (Block) , P (Projects) e Pages -> dBPPages

  lang = getMessageKey(messages); // update 
  msg = messages[lang];

  if (!subGroup) {
    const key = `d${root.trim()}`;
    return (msg as any)[key] || '';
  }
  const rootPrefix = root.trim().charAt(0).toUpperCase();
  if (!finalGroup) {
    const key = `d${rootPrefix}${subGroup.trim()}`;
    return (msg as any)[key] || '';
  }
  const subGroupPrefix = subGroup.trim().charAt(0).toUpperCase();
  const key = `d${rootPrefix}${subGroupPrefix}${finalGroup.trim()}`;
  return (msg as any)[key] || '';

  // let len = 3;
  // if (subGroup === null) len = 1;
  // else if (finalGroup === null) len = 2;
  // for (const component of icaDescriptions) {
  //   const parts = component.group.split('/');
  //   if (parts.length === len &&
  //     parts[0].trim() === root &&
  //     (subGroup === null || parts[1].trim() === subGroup) &&
  //     (finalGroup === null || parts[2].trim() === finalGroup)) return component.description;
  // };
  // return "";
}

// export function getFormComponentsPrompt(root: string, subGroup: string, finalGroup: string): string {
//   for (const component of icaDescriptions) {
//     const parts = component.group.split('/');
//     if (parts.length === 3 &&
//       parts[0].trim() === root &&
//       parts[1].trim() === subGroup &&
//       parts[2].trim() === finalGroup) return component.prompt || "";
//   };
//   return "";
// }

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
  const attrs = getFormComponentsAttributes(root, subGroup, finalGroup)
  for (const att of attrs.split(',')) {
    rc.add(att)
  };
  return Array.from(rc);

}

export function getAttributeDefinitionsLit(root: string, subGroup: string, finalGroup: string): string[] {
  const rc = new Set<string>();
  const attrs = getFormComponentsAttributes(root, subGroup, finalGroup)
  for (const att of attrs.split(',')) {
    const def = attributeDefinitions.find((item) => item.path.trim() === att.trim());
    if (def) rc.add(def.lit);
  };
  return Array.from(rc);
}

export function getAttributeDefinitionsDesc(attribute: string): string {
  const key = `attrDesc_${attribute}`;
  const desc = (msg as { [key: string]: string })[key] || '';
  return desc;
}

export function checkAttributteHasVariation(attribute: string): boolean {
  const attr = attributeDefinitions.find((attr) => attr.path === attribute);
  if (!attr) return false;
  return attr.variations === true;
}

export function getFormComponentsEvents(root: string, subGroup: string, finalGroup: string): string {
  for (const component of icaDescriptions) {
    const parts = component.group.split('/');
    if (parts.length === 3 &&
      parts[0].trim().toLowerCase() === (root).toLowerCase() &&
      parts[1].trim().toLowerCase() === (subGroup).toLowerCase() &&
      parts[2].trim().toLowerCase() === (finalGroup).toLowerCase()) return component.events || "";
  };
  return "";
}

export function getEventDescription(root: string, subGroup: string, finalGroup: string, event: string): string {

  let desc: string = '';

  for (const event of eventsDefinitions) {
    if (!event.group) continue;
    for (const group of event.group) {
      const parts = group.split('/');
      if (parts.length === 3 &&
        parts[0].trim().toLowerCase() === (root).toLowerCase() &&
        parts[1].trim().toLowerCase() === (subGroup).toLowerCase() &&
        parts[2].trim().toLowerCase() === (finalGroup).toLowerCase()) {
        desc = event.desc || "";
        break;
      }
    }
    if (desc) break;
  };

  if (desc) return desc;
  const eventInfo = eventsDefinitions.find((ev) => ev.name === event);
  if (!eventInfo) return '';
  return eventInfo.desc;
}

export function getAtributtes(root: string, subGroup: string, finalGroup: string): string[] {
  for (const component of icaDescriptions) {
    const parts = component.group.split('/');
    if (parts.length === 3 &&
      parts[0].trim().toLowerCase() === (root).toLowerCase() &&
      parts[1].trim().toLowerCase() === (subGroup).toLowerCase() &&
      parts[2].trim().toLowerCase() === (finalGroup).toLowerCase()) return component.attributes?.split(',') || [];
  };
  return [];
}

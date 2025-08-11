/// <mls shortName="icaBaseDescription" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';

const attributeDefinitions = [
  { path: "name", lit: "@property({ type: String }) name: string | undefined;", desc: "Identifier name of the element." },
  { path: "hint", lit: "@property({ type: String }) hint: string | undefined;", "variations": true, desc: "Hint or suggestion displayed to the user." },
  { path: "label", lit: "@property({ type: String }) label: string | undefined;", "variations": true, desc: "Label associated with the element." },
  { path: "required", lit: "@property({ type: Boolean }) required: boolean;", desc: "Indicates if the field is required." },
  { path: "disabled", lit: "@property({ type: Boolean }) disabled: boolean;", desc: "Defines whether the element is disabled." },
  { path: "maxvalue", lit: "@property({ type: Number }) maxvalue: number | undefined;", desc: "Maximum allowed value for the field." },
  { path: "minvalue", lit: "@property({ type: Number }) minvalue: number | undefined;", desc: "Minimum allowed value for the field." },
  { path: "step", lit: "@property({ type: Number }) step: number | undefined;", desc: "Defines the step interval for allowed values." },
  { path: "placeholder", lit: "@property({ type: String }) placeholder: string| undefined;", "variations": true, desc: "Text displayed in the field before user input." },
  { path: "pattern", lit: "@property({ type: String }) pattern: string| undefined;", desc: "Regular expression for field validation." },
  { path: "errormessage", lit: "@property({ type: String }) errormessage: string| undefined;", "variations": true, desc: "Error message displayed when validation fails." },
  { path: "autofocus", lit: "@property({ type: Boolean }) autofocus: boolean;", desc: "Indicates if the field receives automatic focus." },
  { path: "maxlength", lit: "@property({ type: Number }) maxlength: number | undefined;", desc: "Maximum number of characters allowed." },
  { path: "minlength", lit: "@property({ type: Number }) minlength: number | undefined;", desc: "Minimum number of characters required." },
  { path: "autocapitalize", lit: "@property({ type: String }) autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';", desc: "Controls automatic text capitalization." },
  { path: "autocorrect", lit: "@property({ type: String }) autocorrect: 'off' | 'on';", desc: "Defines whether autocorrect is enabled." },
  { path: "autocomplete", lit: "@property({ type: String }) autocomplete: string | undefined;", desc: "Suggests values based on previous inputs." },
  { path: "validationMessage", lit: "@property({ type: String}) validationMessage: string | undefined", desc: "Custom validation error message." },
  { path: "debounce", lit: "@property({ type: Number}) debounce: number | undefined", desc: "Delay time before executing events." },
  { path: "value", lit: "@property({ type: String }) value: string | undefined;", "variations": true, desc: "Current value of the field." },
  { path: "options", lit: "@property() options: OptionItem[] | undefined;", desc: "List of available options for selection." },
  { path: "selectedvalue", lit: "@property() selectedvalue: string | undefined;", desc: "Currently selected value from options." },
  { path: "inputmode", lit: "@property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';", desc: "Expected input type for the field." },
  { path: "title", lit: "@property({ type: String }) title: string;", "variations": true, desc: "Title or tooltip of the element." },
  { path: "icon", lit: "@property({ type: String }) icon: string | undefined;", desc: "Icon associated with the element." },
  { path: "form", lit: "@property({ type: String }) form: string | undefined;", desc: "Identifier of the form the element belongs to." },
  { path: "text", lit: "@property({ type: String }) text: string | undefined;", "variations": true, desc: "Text displayed in the element." },
  { path: "src", lit: "@property({ type: String }) src: string | undefined;", desc: "URL of the media or image source." },
  { path: "alt", lit: "@property() alt: string | undefined;", "variations": true, desc: "Alternative text for images." },
  { path: "width", lit: "@property() width: string | undefined;", desc: "Width of the element." },
  { path: "height", lit: "@property() height: string | undefined;", desc: "Height of the element." },
  { path: "autoplay", lit: "@property() autoplay: boolean = false;", desc: "Defines whether media starts automatically." },
  { path: "controls", lit: "@property() controls: boolean = true;", desc: "Defines whether media controls are displayed." },
  { path: "loop", lit: "@property() loop: boolean = false;", desc: "Indicates if media should repeat." },
  { path: "preload", lit: "@property() loop: 'auto' | 'metadata' | 'none' = 'auto';", desc: "Defines how media is preloaded." },
  { path: "open", lit: "@property({ type: Boolean }) open = false;", desc: "Defines whether an element (like a modal) is open." }
];

function removeProjectNumberSegment(input: string): string {
  return input.replace(/-\d+$/, '');
}

export function getAtributtes(root: string, subGroup: string, finalGroup: string): string[] {
  return getAtributtesByTag(`ica-${root}-${subGroup}-${finalGroup}`);
}

export function getAtributtesByTag(tag: string): string[] {

  tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
  if (!tag.toLocaleLowerCase().startsWith('ica-')) return [];
  tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
  const json = parseMarkdownToJson(descriptionForPrompt);
  let ret: string[] = [];
  json.forEach((i) => {
    if (i.base === tag) {
      ret = i.attr as string[];
    }
  })

  return ret;

}

export function getAtributtesByEl(el: IcaLitElementBaseMethods): string[] {

  /*const firstClass = Object.getPrototypeOf(el);
  const superClass = Object.getPrototypeOf(firstClass); 

  if (!superClass || !superClass.constructor || !superClass.constructor.nameclass) return [];*/

  const tag = classNameToKebabCase(el.baseName);

  const json = parseMarkdownToJson(descriptionForPrompt);
  let ret: string[] = [];
  json.forEach((i) => {
    if (i.base === tag) {
      ret = i.attr as string[];
    }
  })

  return ret;

}

function classNameToKebabCase(className: string): string {
  // Remove sufixos comuns como "Base" ou "Component" (personalize conforme necessário)
  const cleanedName = className.replace(/(Base|Component)$/, '');

  // Converte PascalCase para kebab-case
  const kebab = cleanedName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')  // insere '-' entre camelCase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // lida com acrônimos (e.g., ICA -> ICA-Presentation)
    .toLowerCase();

  return kebab;
}

export function getDefinitionByTag(tag: string): any | undefined {
  tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
  if (!tag.toLocaleLowerCase().startsWith('ica-')) return;

  const json = parseMarkdownToJson(descriptionForPrompt);
  let ret: any;
  json.forEach((i) => {
    if (i.base === tag) {
      ret = i;
    }
  })

  return ret;

}

export function getDescriptionAttr(attribute: string): string {
  const attr = attributeDefinitions.find((attr) => attr.path === attribute);
  if (!attr) return '';
  return attr.desc;

}

export function checkAttributteHasVariation(attribute: string): boolean {
  const attr = attributeDefinitions.find((attr) => attr.path === attribute);
  if (!attr) return false;
  return attr.variations === true;
}

export function getAttributeDefinitions(tag: string): string[] {

  tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
  const json = parseMarkdownToJson(descriptionForPrompt);
  let ret: string[] = [];
  json.forEach((i) => {
    if (i.base === tag) {
      ret = i.attr as string[];
    }
  })

  return ret;

}

export function getAttributeDefinitionsLit(tag: string): string[] {
  const rc = new Set<string>();
  tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
  const attrs = getAttributeDefinitions(tag);
  for (const att of attrs) {
    const def = attributeDefinitions.find((item) => item.path.trim() === att.trim());
    if (def) rc.add(def.lit);
  };
  return Array.from(rc);
}

export function getGroups(): Record<string, Record<string, string[]>> {
  return transformIcaDescriptions(widgetsDefault)
}

function transformIcaDescriptions(icaDescriptions: any): Record<string, Record<string, string[]>> {
  const result: Record<string, Record<string, string[]>> = {};

  Object.keys(icaDescriptions).forEach((key) => {
    const parts = key.split("-").slice(1);

    if (parts.length < 2) return;
    const [category, type] = parts;
    const rest = parts.slice(2).join("-");

    if (!result[category]) {
      result[category] = {};
    }

    if (!result[category][type]) {
      result[category][type] = [];
    }

    result[category][type].push(rest || type);
  });

  return result;
}


export function canMoveElement(element: IcaLitElementBaseMethods, newParent: IcaLitElementBaseMethods): boolean {

  return true;

}


export const widgetsDefault: Record<string, string> = {
  'ica-apresentation-text': 'widget-default-text',
  'ica-apresentation-text-rich': 'widget-default-text-rich',
  'ica-forms-records': 'widget-default-records',
  'ica-apresentation-image': 'widget-default-image',
  'ica-forms-content-form': 'widget-default-content-form',
  'ica-forms-input-number': 'widget-default-input-number',
  'ica-forms-input-string': 'widget-default-input-string',
  'ica-forms-input-masked': 'widget-default-input-masked',
  'ica-forms-input-boolean': 'widget-default-input-boolean',
  'ica-forms-input-date': 'widget-default-input-date',
  'ica-forms-input-time': 'widget-default-input-time',
  'ica-forms-input-date-range': 'widget-default-input-date-range',
  'ica-forms-input-select-one': 'widget-default-input-select-one',
  'ica-forms-input-multiselect': 'widget-default-input-multiselect',
  'ica-forms-input-color': 'widget-default-input-color',
  'ica-forms-input-editor': 'widget-default-input-editor',
  'ica-forms-input-feedback': 'widget-default-input-feedback',
  'ica-forms-input-file': 'widget-default-input-file',
  'ica-forms-records-grid': 'widget-default-records-grid',
  'ica-forms-records-map': 'widget-default-records-map',
  'ica-forms-tree': 'widget-default-tree',
  'ica-forms-submit': 'widget-default-submit',
  'ica-navigation-links': 'widget-default-navigation-links',
  'ica-navigation-content': 'widget-default-navigation-content',
  'ica-navigation-multi-content': 'widget-default-navigation-multi-content',
  'ica-apresentation-text-code': 'widget-default-text-code',
  'ica-apresentation-gallery': 'widget-default-gallery',
  'ica-apresentation-maps': 'widget-default-maps',
  'ica-apresentation-video': 'widget-default-video',
  'ica-apresentation-sound': 'widget-default-sound',
  'ica-apresentation-chart': 'widget-default-chart',
  'ica-apresentation-animation': 'widget-default-animation',
  'ica-apresentation-animation-fullpage': 'widget-default-animation-fullpage',
  'ica-navigation-transition': 'widget-default-transition',
  'ica-apresentation-indicator': 'widget-default-indicator',
  'ica-apresentation-embed-social': 'widget-default-embed-social',
  'ica-navigation-toolbar-social': 'widget-default-toolbar-social',
  'ica-apresentation-message': 'widget-default-message',
  'ica-apresentation-canvas': 'widget-default-canvas',
  'ica-blocks-viewer': 'widget-default-block-viewer',
  'ica-interaction-button': 'widget-default-interaction-button'
}

export const descriptionForPrompt: string = `
# Atomic Design – Molecules

These are base class specifications describing the intent and allowed attributes of each molecule.
Each base class can have multiple specialized child widgets (each implementing a single visual style or behavior).
Choose the appropriate widget for your use case; do not combine multiple behaviors in a single widget.

In the future, the user may mutate or swap a widget for another specialized child, since all widgets in the same base class share the same properties and config structure.
This allows easy migration between visual styles or navigation patterns with minimal changes.
All configuration and attribute definitions are described using JSON format for clarity and consistency.

General attributes (common to almost all molecules):
- name, id, class, style
- Attributes A11y (optional): role, ariaLabel, ariaDescribedBy, ariaExpanded, ariaSelected …

Attributes Text:
Display fixed or dynamic text.
Accept simple text or composite binding (ex: label="Welcome {{ui.user.name}}").

Attributes Cfg:
Control molecule behavior or appearance.
Accept fixed text or pure binding (no additional text).
Ex:
- readonly="true"
- disabled="{{ui.ReadyForInput}}"

Attributes Bind:
Used to read or write dynamic data.
Accept fixed text or pure binding.
Ex:
- value="dog"
- value="{{ui.choice.animal}}"


## ica-forms-content-form
Form component provides enhanced control over form submission, validation, and customization.
- Cfg: action, method, novalidate, autocomplete, disabled, enctype, name, target, validateonchange, autosave, formId
- Example: action="/api/save" method="post" validateonchange
## ica-forms-input-number
Allows the user to input numerical values, with support for minimum and maximum limits.
- Text: label, placeholder, hint
- Bind: name, value
- Cfg: required, disabled, readonly, autofocus, pattern, errormessage, maxvalue, minvalue, step, inputmode, suffix, prefix
- Example: name="quantidade" value="1" minvalue="0" maxvalue="10"
## ica-forms-input-string
Field for free text, with configurable validations such as maxlength, minlength, and pattern.
Use for general text input without visual formatting.
- Text: label, placeholder, hint, errormessage
- Bind: name, value
- Cfg: required, disabled, readonly, maxlength, minlength, pattern, autofocus, autocapitalize, autocorrect, autocomplete, validationmessage, debounce
- Example: name="nome" value="{{ui.form.nome}}" maxlength="50"
## ica-forms-input-masked
Input field with visual masking during typing.
Ideal for CPF, phone numbers, postal codes, etc.
- Text: label, placeholder, hint
- Bind: name, value
- Cfg: mask, required, disabled, readonly, autocomplete
- Example: name="cpf" value="{{ui.form.cpf}}" mask="999.999.999-99"
## ica-forms-input-boolean
Component for binary choice, like switches or checkboxes.
Ideal for yes/no settings or enabling/disabling features.
- Text: label, hint, errormessage
- Bind: name, checked
- Cfg: required, disabled, readonly, autofocus
- Example: name="aceita" checked="{{ui.config.termos}}"
## ica-forms-input-date
Date selector, with configuration options to limit periods.
- Text: label, hint, errormessage
- Bind: name, value
- Cfg: required, disabled, readonly, autofocus, pattern, maxvalue, minvalue
- Example: name="dataNascimento" value="{{ui.user.birthdate}}" minvalue="1900-01-01" maxvalue="2025-12-31"
## ica-forms-input-time
Allows the user to select a time, with support for different time formats.
- Text: label, hint, errormessage, placeholder
- Bind: name, value
- Cfg: required, disabled, readonly, autofocus, pattern
- Example: name="horario" value="{{ui.agenda.hora}}" placeholder="00:00"
## ica-forms-input-date-range
Component for selecting date ranges, useful for period filters.
- Text: label, hint, errormessage
- Bind: name, startvalue, endvalue
- Cfg: required, disabled, readonly, autofocus
- Example: name="filtroPeriodo" startvalue="{{ui.filtro.inicio}}" endvalue="{{ui.filtro.fim}}"
## ica-forms-input-select-one
Selector for a single option among many.
Can be presented as a dropdown, combobox, etc.
- Text: label, hint
- Bind: selectedvalue
- Cfg: required, disabled, options
- Example: selectedvalue="{{ui.form.estado}}" options="['SP','RJ','MG']"
## ica-forms-input-multiselect
Selector for multiple options from a list.
Ideal for tags, categorias ou filtros múltiplos.
- Text: label, name, hint
- Bind: selectedvalue
- Cfg: required, disabled, options
- Example: selectedvalue="{{ui.form.categorias}}" options="['Tecnologia','Design','Marketing']"
## ica-forms-input-color
Color picker, with support for different color formats (RGB, HEX, etc.).
- Text: label, hint, errormessage, placeholder
- Bind: name, value
- Cfg: required, disabled, readonly, autofocus, pattern
- Example: name="corFavorita" value="{{ui.pref.cor}}" placeholder="#RRGGBB"
## ica-forms-input-editor
Rich text editor with basic formatting (bold, italic), lists, and tables.
- Text: label, hint, errormessage
- Bind: name, value
- Cfg: required, disabled, readonly, autofocus
- Example: name="descricao" value="{{ui.produto.descricao}}"
## ica-forms-input-feedback
Rating component for expressing opinions (stars, thumbs up/down, etc.).
- Text: label, hint, errormessage
- Bind: name, value
- Cfg: required, disabled, readonly, autofocus
- Example: name="avaliacao" value="{{ui.feedback.nota}}"
## ica-forms-input-file
File upload field, supports drag and drop and upload progress.
- Text: label, hint, errormessage
- Bind: name
- Cfg: required, disabled, readonly, autofocus, accept, multiple
- Example: name="anexo" accept=".pdf,.jpg" multiple
## ica-forms-records
Displays records in various visual formats.
- Cfg: name, config
- Bind: selected
- Text: title, subtitle, line1, line2, bottom, image, icon, badge
- Example:  config={
    "table": "db.produtos", "range": { "start": 0, "end": 10 },
    "selectedField": "id" },
  title="{{.nome}}" subtitle="{{.descricao}}" bottom="R\${{.preco}}"
Specialized widget examples:
- "cards"
- "table"
- "list"
- "timeline"
## ica-forms-records-grid
Data-grid capable of multiple behaviours.
- Cfg: config
- Bind: selectedRows, editedRows
- interface config {
  table: string,                 // DB ou endpoint
  range?: { start: number, end: number },
  columns: {
    field: string,
    header?: string,
    width?: string,
    resizable?: boolean,
    sortable?: boolean,
    filterable?: boolean,
    editable?: boolean,
    expandable?: boolean         // tree grid
  }[],
  pageable?: boolean,
  pageSize?: number,
  rowHeight?: number,
  selection?: "single" | "multi",
  aggregation?: "sum" | "avg" | string
}
Specialized widget examples:
- "readonly"
- "editable"
- "grouping"
- "pivot"
- "tree"
- "virtual-scroll"
## ica-forms-records-map
Displays geographic information on a map, supporting markers and custom regions.
The config attribute defines center point, zoom level, and list of markers.
- Cfg: config
- Example: config={ "latitude": -23.5505, "longitude": -46.6333, "zoom": 12, "markers": [ { "lat": -23.55, "lng": -46.63, "label": "SP" } ], "maptype": "roadmap" }
## ica-forms-tree
Visual components for hierarchical data (tree, dropdown, accordions, mind map, tag cloud).
All variations share the same config structure. Rendering style depends on the widget.
- Cfg: config
- Bind: selectedvalues, selectedkeys
- Example:
  config={ "table": "db.categorias",
    "columns": { "key": "id", "value": "cidade", "icon": "icon" },
    "multiexpand": true,  "multiselect": false, "cascadeSelect": true }
## ica-forms-submit
Group of form action buttons (submit, cancel, clear).
Each button is configured via an array inside the config.
When clicked, the 'value' is sent to the configured state in notify.
value = "save" | "cancel" | "clear".
- Cfg: config
- Bind: notify
- Example: config={ "buttons": [ { "label": "Salvar", "value": "save" },
      { "label": "Cancelar", "value": "cancel" } ]}
## ica-navigation-links
Flexible navigation base molecule for implementing navigation structures.
- Cfg: config
- Bind: selected (auto-updated when scrolling or clicking)
- Interface Config {
  scrollSync?: boolean,      // if true, updates selected as the user scrolls
  offset?: number,           // pixels from top to consider section active
  items: {
    label: string,
    href: string,            // can be external ("/produtos") or anchor ("#faq")
    icon?: string,
    badge?: string | number,
    disabled?: boolean
  }[]
}
Specialized widget examples:
- 'link': Simple navigation link list (horizontal or vertical)
- 'dropdown menu': Dropdown navigation
- 'breadcrumb': Breadcrumb trail
- 'button bar': Navigation as a set of buttons
- 'scrollspy': Anchor sidebar with auto-highlight on scroll
## ica-navigation-content
Organizes content into multiple sections (tabs, steps, scenarios, accordions, etc.).
Each section points to external content via 'ref'.
Supports logical grouping with or without visible headers.
Supports showing content in popup style with automatic close when using widget "popup"
- Cfg: config
- Bind: selected // ex: {{ui.tab1.selected}}
- interface config {
  headerVisible?: boolean,
  sections: {
    id: number,
    ref: string,               // local ref (ex: "#form1") or external (ex: "./page2")
    prefetch?: "hover",
    label?: string,            // section label
    icon?: string,             // optional icon
    badge?: string | number,   // optional badge (count, status, etc.)
    visible?: boolean,         // false = hidden from header, but content remains accessible
    disabled?: boolean         // disables interaction
  }[]
}
Specialized widget examples:
- "tab"
- "stepper"
- "scenary"
- "accordion"
- "toolbar"
- "popup"
## ica-navigation-multi-content
Displays multiple content blocks at once, using a flexible layout like grid or overlay.
Each content block can reference internal components or external pages.
Useful for dashboards, side-by-side editing, or tile-based interfaces.
- Cfg: config
- Bind: selected (optional, for focus or context)
- interface config {
  layout: "horizontal" | "vertical" | "grid" | "overlay" | "tiles",
  sections: {
    id: string | number,
    ref: string, // local ref (ex: "#form1") or external (ex: "./page2")
    prefetch?: "hover",
    label?: string,
    icon?: string,
    visible?: boolean,
    resizable?: boolean,
    width?: string,  // optional width/height hints
    height?: string
  }[]
}
## ica-apresentation-text-code
Used to present blocks of code with optional syntax highlighting.
- Text: text, language?: "ts" | "js" | "html" | "css" | "json" | "bash" | "sql" | "python" | string
## ica-apresentation-text-rich
Used to present or edit text with rich formatting (bold, italic, lists, links, etc.).
Can be used in view or editable mode.
- Text: content,editable?: boolean
## ica-apresentation-text
Presents formatted text content like simple text, quotes, or banners.
Allows inline HTML (innerHTML) and multiple visual styles based on 'type'.
Styling and animations should be handled via CSS or themes.
- Text: text, type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "blockquote" | "span"
## ica-apresentation-image
Displays a single image, icon, or avatar.
Type defines the visual variation and styling.
- Cfg: config
- interface config {
  type: "image" | "icon" | "avatar",
  src?: string,         // for image or avatar
  icon?: string,        // for icon
  alt?: string,
  width?: string,
  height?: string,
  srcset?: string,
  sizes?:string,
  size?: string,        // icon or avatar
  color?: string,       // icon only
  shape?: "circle" | "square" // avatar only
}
## ica-apresentation-gallery
Displays collections of images in formats like gallery, carousel, or slider.
- Cfg: config
- Bind: selectedindex (optional, for navigation)
- interface config {
  images: string[],               // array of image URLs
  thumbnails?: boolean,           // for gallery
  shownavigation?: boolean,       // for carousel/slider
  autoplay?: boolean,
  interval?: number,              // ms
  loop?: boolean
}
Specialized widget examples:
- "gallery"
- "carousel"
- "slider"
## ica-apresentation-maps
Displays static or interactive maps with markers and zoom level.
- Cfg: config
- interface config {
  latitude: number,
  longitude: number,
  zoom?: number,
  markers?: { lat: number, lng: number, label?: string }[],
  maptype?: "roadmap" | "satellite" | "terrain"
}
## ica-apresentation-video
Displays videos in different formats such as embedded players, inline (image-style), or playlists.
- Cfg: config
- Bind: selectedvideo (for playlist)
- interface config {
  src?: string,              // for single video (embed/inline)
  poster?: string,           // for inline (placeholder image)
  videos?: string[],         // for playlist
  autoplay?: boolean,
  controls?: boolean,
  loop?: boolean,
  preload?: "auto" | "metadata" | "none"
}
Specialized widget examples:
- "embed"
- "inline"
- "playlist"
## ica-apresentation-sound
Plays audio content in various contexts such as music tracks, sound effects, or podcast episodes.
- Cfg: config
- Bind: selected (for playlist/effects)
- interface config {
  src?: string,                  // for single audio
  sounds?: string[],            // for sound effects
  podcastepisodes?: string[],   // for podcast playlists
  autoplay?: boolean,
  controls?: boolean,
  loop?: boolean,
  preload?: "auto" | "metadata" | "none"
}
Specialized widget examples:
- "player"
- "effects"
- "podcast"
## ica-apresentation-chart
Displays visual charts in 2D or 3D using external frameworks like TreeD3.js.
The config defines rendering behavior; the 'chartdata' must be provided via binding for interactivity.
- Cfg: config
- Bind: chartdata  // ex: chartdata="{{ui.relatorio.vendas}}"
- interface config {
  renderer?: string,               // optional custom render strategy
  options3d?: object               // used only if type "3d"
}
- interface ChartData {
  type: "bar" | "line" | "pie" | "scatter" | "tree" | string,
  title?: string,
  xAxis?: string[],
  yAxis?: string[],
  series: {
    name: string,
    data: number[] | { x: string, y: number }[] | object[],
    type?: string,  // optional override per series
    style?: object
  }[],
  options?: object
}
Specialized widget examples:
- "treed3"
- "echarts"
- "chartjs"
## ica-apresentation-animation
Applies CSS-based animations to inline or block elements.
The animation can be triggered by a state value, load, click, or hover.
- Cfg: config
- Text: content
- Bind: state  // optional, ex: state="{{ui.effectTrigger}}"
- interface config {
  animation: "fadeIn" | "zoomIn" | "slideLeft" | string,
  trigger?: "onload" | "onclick" | "hover" | "manual" | "state",
  triggerValue?: string | number | boolean,  // activate only when state == triggerValue
  inverted?: boolean,                        // show when state != triggerValue
  duration?: number,     // in ms
  delay?: number,
  repeat?: number        // default = 1
}
## ica-apresentation-animation-fullpage
Fullscreen or large-area visual animations, triggered by actions or state changes.
The widget defines the visual effect (e.g., confetti, fireworks, radial, curtains, etc.).
- Cfg: config
- Bind: state  // optional, ex: state="{{ui.action}}"
- interface config {
  trigger: "manual" | "onload" | "onclick" | "page-enter" | "page-exit" | "state",
  triggerValue?: string | number | boolean,
  inverted?: boolean,
  duration?: number,
  intensity?: number,
  once?: boolean
}
Specialized widget examples:
- "confetti"
- "fireworks"
- "radial-splash"
- "balloon-explode"
## ica-navigation-transition
Animates page transitions using slide, fade, or custom effects.
- Cfg: config
- interface config {
  type: "slide" | "fade" | "push-left" | "push-right" | "zoom",
  duration?: number,
  reverseOnBack?: boolean   // reverses direction if going back
}
## ica-apresentation-indicator
Visual indicator for communicating the state or progress of an operation.
Can react to changes in bound states, useful for feedback like "loading", "in progress", or "success".
- Cfg: config
- Text: label
- Bind: state  // ex: state="{{ui.action}}"
- interface config {
  type: "progress" | "loading" | "status" | "badge" | string,
  value?: number,         // for progress
  max?: number,           // optional, default 100
  color?: string,         // optional: for status, badge
  size?: "sm" | "md" | "lg" | string,
  triggerValue?: string | boolean | number,  // optional: activate only when state == triggerValue
  inverted?: boolean      // optional: reverse behavior if state != triggerValue
}
## ica-apresentation-embed-social
Displays embedded social media content, either as a specific post or a live feed/timeline.
Ideal for showcasing engagement or highlighting external communications.
- Cfg: config
- interface config {
  url: string,                    // required: post or profile URL
  width?: string,                 // optional dimensions (ex: "100%", "300px")
  height?: string,
  refreshInterval?: number,      // in seconds, only for feeds
  limit?: number                 // max items, only for feeds
}
Specialized widget examples:
- "post"
- "feed"
## ica-navigation-toolbar-social
Toolbar with icons and links to social media profiles.
- Cfg: config
- interface config {
  items: {
    platform: "twitter" | "linkedin" | "github" | "facebook" | string,
    href: string,
    icon?: string,     // default: inferred by platform
    label?: string     // optional text for accessibility
  }[],
  layout?: "horizontal" | "vertical",
  size?: "sm" | "md" | "lg"
}
## ica-apresentation-message
Displays transient or interruptive messages to inform the user about application events.
Message type and behavior are controlled via state and config.
- Cfg: config
- Text: state  // ex: state="{{ui.feedback}}", use type MessageState
- interface config {
  duration?: number,              // in ms; optional if not transient
  closable?: boolean,
  actionText?: string,           // for snackbar-like interaction
  queue?: boolean,               // if true, messages stack or enqueue
  defaultType?: "info" | "warning" | "error" | "success" | string
}
- type MessageState = string | { // simplest case: just the message
  message: string,
  type?: "info" | "warning" | "error" | "success",
  action?: string,
  id?: string | number  // for queue management
}
Specialized widget examples:
- "toast"
- "snackbar"
- "notification"
- "alert"
- "modal"
## ica-apresentation-canvas
Canvas area for rendering dynamic visual scenes, games, simulations, or interactive business tools.
Ideal for applications where visuals are generated via custom scripts or engines.
- Cfg: config
- Bind: state (optional — can be used to send commands or track status)
- interface config {
  width?: string,                  // ex: "100%", "800px"
  height?: string,
  pixelRatio?: number,             // optional for high-DPI displays
  autoResize?: boolean,
  runOnLoad?: boolean,             // auto-start on render
  scriptRef: string                // required JS module that will run the logic
}
Specialized widget examples:
- "carGame"
- "floorPlanEditor"
- "inventory3D"
- "whiteboard"
## ica-blocks-viewer
Renders document and data files like PDF, spreadsheets, and Office documents inside the application.
The viewer type and behavior depend on the selected widget.
- Cfg: config
- Text: data
- interface config {
  page?: number,              // pdf only
  zoom?: number,              // pdf only
  activesheet?: string,       // spreadsheet only
  type?: "docx" | "pptx" | "pdf" | string,  // for document viewer fallback
  readonly?: boolean
}
Specialized widget examples:
- "pdf"
- "spreadsheet"
- "document"
## ica-interaction-button
Reusable button for interface actions.  
Can be placed in toolbars, cards, modals or item lists.  
Supports different visual variants, icons and click behaviors.

- Cfg: config  
- Bind: notifyPath (optional — state path to update on click, e.g. '{{ ui.action }}'),  
        notifyValue (optional — value to assign to that state on click)

- interface config {
  label?: string,              // text displayed on the button
  icon?: string,               // icon name (e.g. "save", "edit")
  type?: "onlyText" | "onlyIcon" | "full",
  disabled?: boolean,          // disables the button when true
  tooltip?: string             // text shown on hover
}

`
  ;

function parseMarkdownToJson(md: string) {

  const lines = md.split('\n');
  const components = [];

  let currentComponent = null;

  const attrTypes = ['Text', 'Bind', 'Cfg'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detecta o início de um componente
    const matchComponent = line.match(/^##\s+(ica-[\w-]+)/);
    if (matchComponent) {
      if (currentComponent) {
        components.push(currentComponent);
      }
      currentComponent = {
        base: matchComponent[1],
        attr: new Set()
      };
      continue;
    }

    if (currentComponent) {
      // Verifica se a linha contém atributos por tipo
      for (const type of attrTypes) {
        const attrMatch = line.match(new RegExp(`^-\\s+${type}:\\s*(.+)`, 'i'));
        if (attrMatch) {
          const attrs = attrMatch[1].split(',').map(a => a.trim());
          for (const attr of attrs) {
            if (attr) {
              const v = attr.split('//');
              currentComponent.attr.add(v[0].trim());
            }
          }
        }
      }
    }
  }

  // Adiciona o último componente
  if (currentComponent) {
    components.push(currentComponent);
  }

  // Converte o Set em array
  return components.map(c => ({
    base: c.base,
    attr: Array.from(c.attr)
  }));
}

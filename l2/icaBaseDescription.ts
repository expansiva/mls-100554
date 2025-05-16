/// <mls shortName="icaBaseDescription" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';

export const icaDescriptions: IIcaDescriptions = {

    //-----ICA-FORMS-----
    "ica-forms-content-form": {
        attributes: ["action", "method", "novalidate", "autocomplete", "disabled", "enctype", "name", "target", "validateonchange", "autosave"],
        allowedChildren: ["ica-forms-*", "ica-layout-flow-section"],
        allowedParents: [],
        description: "form component provides enhanced control over form submission, validation, and customization"
    },
    "ica-forms-input-number": {
        attributes: ["name", "value", "placeholder", "label", "pattern", "errormessage", "maxvalue", "minvalue", "step", "required", "disabled", "readonly", "autofocus", "hint", "inputmode"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Allows the user to input numerical values, with support for minimum and maximum limits."
    },
    "ica-forms-input-string": {
        attributes: ["name", "hint", "label", "required", "disabled", "readonly", "maxlength", "minlength", "placeholder", "pattern", "errormessage", "autofocus", "autocapitalize", "autocorrect", "autocomplete", "value", "validationmessage", "debounce"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Field for free text, with configurable validations such as maximum length and regular expressions."
    },
    "ica-forms-input-boolean": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "checked", "errormessage"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Component for binary choice, like switches or checkboxes, ideal for yes/no settings."
    },
    "ica-forms-input-date": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "pattern", "errormessage", "maxvalue", "minvalue"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Date selector, with configuration options to limit periods."
    },
    "ica-forms-input-time": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "pattern", "errormessage", "placeholder"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Allows the user to select a time, with support for different time formats."
    },
    "ica-forms-input-date-range": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "errormessage", "startvalue", "endvalue"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Component for selecting date ranges, useful for period filters."
    },
    "ica-forms-input-select-one": {
        attributes: ["hint", "label", "required", "disabled", "options", "selectedvalue"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Selector for a single option among many, which can be presented as a dropdown, combobox, etc."
    },
    "ica-forms-input-multiselect": {
        attributes: ["hint", "label", "required", "disabled", "options", "selectedvalue"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Allows multiple option selection, ideal for filters or advanced settings."
    },
    "ica-forms-input-color": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "pattern", "errormessage", "placeholder"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Color picker, with support for different color formats (RGB, HEX, etc.)."
    },
    "ica-forms-input-editor": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "errormessage"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Rich text editor, allowing basic formatting (bold, italic) and insertion of elements like lists and tables."
    },
    "ica-forms-input-feedback": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "errormessage"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "For rating or thumbs up/down (approval or disapproval), allowing the user to express opinions simply."
    },
    "ica-forms-input-file": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "errormessage", "accept", "multiple"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "For attaching a file, with support for drag and drop and upload progress visualization."
    },
    "ica-forms-records-table": {
        attributes: ["data", "columns", "selectedrow", "filterable", "sortable"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Displays data in table format, with support for sorting and filtering."
    },
    "ica-forms-records-list": {
        attributes: ["items", "selecteditem"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "List of items, customizable to display summarized or detailed information."
    },
    "ica-forms-records-timeline": {
        attributes: ["data", "selecteditem"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Presents events or records in a timeline, facilitating the visualization of sequences or histories."
    },
    "ica-forms-records-cards": {
        attributes: ["cardsdata", "selectedcard"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Data presented in cards, ideal for visual summaries with images or icons."
    },
    "ica-forms-records-map": {
        attributes: ["latitude", "longitude", "zoom", "markers", "maptype"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Displays geographic information on a map, supporting markers and custom regions."
    },
    "ica-forms-records-table-with-pagination": {
        attributes: ["data", "columns", "selectedrow", "filterable", "sortable", "pageable"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Data table with pagination, to manage large data sets without overloading the interface."
    },
    "ica-forms-records-table-with-infinite-scroll": {
        attributes: ["data", "columns", "selectedrow", "filterable", "sortable", "infinitescroll"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Table that automatically loads more data as the user scrolls the page, for smooth navigation through large data sets."
    },
    "ica-forms-tree-tree-view": {
        attributes: ["data", "selectednode", "expandednodes"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Hierarchical data structure that allows for expansion and contraction of nodes, useful for categories or organizational structures."
    },
    "ica-forms-tree-nested-dropdown": {
        attributes: ["data", "selectedvalue", "disabled", "required", "placeholder"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Nested dropdowns that allow selection at multiple levels of a hierarchy."
    },
    "ica-forms-tree-nested-accordions": {
        attributes: ["data", "expandedsections", "multiexpand", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Nested accordions to organize content or categories into multiple layers, facilitating navigation in complex structures."
    },
    "ica-forms-tree-tag-cloud": {
        attributes: ["tagsdata", "selectedtags"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Set of tags or keywords representing frequency or importance, allowing dynamic editing and organization."
    },
    "ica-forms-tree-mind-map": {
        attributes: ["data", "selectednode", "layout"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Mind map for organizing and visualizing ideas or concepts in a radial structure, facilitating editing and expansion of related concepts."
    },
    "ica-forms-submit-submit": {
        attributes: ["name", "title", "icon", "text", "disabled", "form"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Button to submit the form. When clicked, it collects and sends the form data to the server or designated handler. Essential for finalizing user data entry."
    },
    "ica-forms-submit-cancel": {
        attributes: ["name", "title", "icon", "text", "disabled", "form", "clickedvalue", "clickedaction"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Button to cancel the form operation, allowing the user to abort their action and typically return to the previous state or screen. Helps ensure safe navigation without data submission."
    },
    "ica-forms-submit-clear": {
        attributes: ["name", "title", "icon", "text", "disabled", "form"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Button to clear all form fields, removing user inputs. Useful in long or complex forms where reset may be necessary."
    },
    "ica-forms-submit-send-external": {
        attributes: ["name", "title", "icon", "text", "disabled", "form"],
        allowedChildren: ["!*"],
        allowedParents: ["**ica-forms-content-form"],
        description: "Mechanism for sending form data to an external system or website. Used for integrations with third-party APIs or for collecting information across different platforms. Must ensure user data security and privacy."
    },

    //-------ICA-NAVIGATION---------
    "ica-navigation-content-nav": {
        attributes: [],
        allowedChildren: ["ica-navigation-"],
        allowedParents: [],
        description: ""
    },
    "ica-navigation-links-menus": {
        attributes: ["items", "selecteditem", "openstate", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Menus that provide primary navigation through the application or to external sites. Support hierarchical structures to organize navigation options."
    },
    "ica-navigation-links-button": {
        attributes: ["name", "label", "disabled", "icon"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Buttons used for navigation actions, such as submitting forms or redirecting to other internal or external pages."
    },
    "ica-navigation-links-links": {
        attributes: ["href", "target", "rel", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Links for direct navigation between application pages or external resources, with support for opening in a new tab depending on the context (target)."
    },
    "ica-navigation-links-breadcrumbs": {
        attributes: ["items", "separator"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Hierarchical navigation paths that indicate the user's current location within the application and facilitate returning to previous levels."
    },
    "ica-navigation-links-anchors": {
        attributes: ["href", "target", "rel", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Anchors that allow internal navigation on a page, directing the user to specific sections without reloading the page."
    },
    "ica-navigation-content-tab": {
        attributes: ["tabs", "selectedtab", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Tabs that organize related content into separate sections, allowing switching between them without reloading the page."
    },
    "ica-navigation-content-scenary": {
        attributes: ["scenes", "selectedscene", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Components that guide the user through scenarios or sequential steps within the same page, ideal for tutorials or step-by-step configurations."
    },
    "ica-navigation-content-stepper": {
        attributes: ["steps", "currentstep", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Step indicators (steppers) that show progress through a sequence of steps, useful for multi-step processes such as checkouts or long forms."
    },
    "ica-navigation-content-toolbar": {
        attributes: ["items", "orientation", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Toolbars that offer quick access to frequently used actions and tools, which can be part of content or action navigation."
    },
    "ica-navigation-content-accordion": {
        attributes: ["open", "text", "multiple", "disabled"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Accordions that allow expanding and collapsing sections of content, organizing large amounts of information in a compact space."
    },
    "ica-navigation-content-popup": {
        attributes: ["open", "title", "content", "modal"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Popups that provide additional information, messages, or interactive content, appearing over the existing content without redirecting the user."
    },
    "ica-navigation-content-scrollspy": {
        attributes: ["targets", "activetarget", "offset"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "A component that updates navigation links based on scrolling, indicating which section of the content is currently visible on the screen."
    },

    //-------ICA-NAVIGATION---------
    "ica-apresentation-text-text": {
        attributes: ["text", "type"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present blocks of simple text."
    },
    "ica-apresentation-text-code": {
        attributes: ["text", "language", "languages"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present blocks of code."
    },
    "ica-apresentation-text-banner": {
        attributes: ["text", "src", "alt"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display promotional or informational banners."
    },
    "ica-apresentation-text-quote": {
        attributes: ["text", "cite"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To highlight quotations or testimonials."
    },
    "ica-apresentation-text-rich": {
        attributes: ["content", "editable"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present text with rich formatting."
    },
    "ica-apresentation-images-images": {
        attributes: ["src", "alt", "width", "height"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present individual or grouped images."
    },
    "ica-apresentation-images-icons": {
        attributes: ["icon", "name", "size", "color", "alt"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display representative icons."
    },
    "ica-apresentation-images-avatar": {
        attributes: ["src", "alt", "size", "shape"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To show user or character avatars."
    },
    "ica-apresentation-images-gallery": {
        attributes: ["images", "selectedindex", "thumbnails", "shownavigation"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display collections of images in gallery format."
    },
    "ica-apresentation-images-carousel": {
        attributes: ["slides", "autoplay", "interval", "loop"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present images in a rotating carousel."
    },
    "ica-apresentation-images-sliders": {
        attributes: ["slides", "autoplay", "interval", "loop"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display images or banners in a slider."
    },
    "ica-apresentation-images-maps": {
        attributes: ["latitude", "longitude", "zoom", "markers", "maptype"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display static or interactive maps."
    },
    "ica-apresentation-video-embedded-video": {
        attributes: ["src", "autoplay", "controls", "loop", "preload"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To embed videos from external platforms."
    },
    "ica-apresentation-video-image-video": {
        attributes: ["src", "poster", "autoplay", "controls", "loop", "preload"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display videos in image format, such as GIFs or animated videos."
    },
    "ica-apresentation-video-video-playlist": {
        attributes: ["videos", "selectedvideo", "autoplay", "controls", "loop"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To list videos in a sequence or collection."
    },
    "ica-apresentation-sound-player": {
        attributes: ["src", "autoplay", "controls", "loop", "preload"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To play audio files or music."
    },
    "ica-apresentation-sound-sound-effects": {
        attributes: ["sounds", "selectedsound", "autoplay"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To play sound effects on specific actions."
    },
    "ica-apresentation-sound-podcast-player": {
        attributes: ["podcastepisodes", "selectedepisode", "autoplay", "controls", "loop", "preload"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To play podcast episodes."
    },
    "ica-apresentation-charts-2d": {
        attributes: ["framework", "data", "renderer"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display two-dimensional charts."
    },
    "ica-apresentation-charts-3d": {
        attributes: ["framework", "data", "renderer", "options3d"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To show three-dimensional charts."
    },
    "ica-apresentation-animations-loading": {
        attributes: ["type", "size", "color", "duration", "autoplay"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Animations indicating content loading."
    },
    "ica-apresentation-animations-onclick": {
        attributes: ["animationtype", "duration", "trigger", "iterations"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Animations triggered by clicks or user interactions."
    },
    "ica-apresentation-animations-javascript-animations": {
        attributes: ["script", "options"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Complex animations created with JavaScript."
    },
    "ica-apresentation-indicators": {
        attributes: ["type", "value", "max", "label"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Components designed to inform the user about the state or progress of an operation. Includes progress bars, loading indicators, status lights, and other visual elements that communicate essential information clearly and concisely. These components are essential for improving the user experience by providing immediate visual feedback on ongoing actions."
    },
    "ica-apresentation-embeds-social-media-posts": {
        attributes: ["url", "width", "height"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To embed social media posts directly on the page."
    },
    "ica-apresentation-embeds-social-media-feeds": {
        attributes: ["url", "refreshinterval", "limit"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display live social media feeds in the application."
    },
    "ica-apresentation-messages-toast": {
        attributes: ["message", "type", "duration", "closable"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Brief messages that appear and disappear automatically, ideal for non-intrusive action feedback."
    },
    "ica-apresentation-messages-alert": {
        attributes: ["message", "type", "closable"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Alerts are important notifications that require the user's attention, and can be used for critical errors, warnings, or confirmations."
    },
    "ica-apresentation-messages-snackbar": {
        attributes: ["message", "actiontext", "duration"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Snackbars provide brief messages with the option for user action, such as undoing an action or closing the message."
    },
    "ica-apresentation-messages-modal": {
        attributes: ["title", "content", "open", "closable"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Modals are windows that appear on top of the page content to communicate important messages or require user action before proceeding."
    },
    "ica-apresentation-messages-notification": {
        attributes: ["message", "type", "duration", "closable"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Notifications are messages that can be sent to users even when they are not actively using the application, useful for important updates or reminders."
    },
    "ica-apresentation-messages-badge": {
        attributes: ["text", "type", "icon"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Badges indicate status or count items, such as unread messages or notifications, usually overlaid on icons or buttons."
    },


    //-----ICA-LAYOUT----------
    "ica-layout-flow-section": {
        attributes: ["id", "class"],
        allowedChildren: ["ica-layout-*"],
        allowedParents: [],
        description: "Divides content into logical and distinct sections, facilitating organization and understanding by the user."
    },
    "ica-layout-flow-group": {
        attributes: ["id", "class", "direction", "gap"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Groups related elements, promoting an organized and cohesive view of the content."
    },
    "ica-layout-flow-row": {
        attributes: ["id", "class", "gap"],
        allowedChildren: ["ica-layout-flow-column"],
        allowedParents: ["ica-layout-flow-section"],
        description: "Organizes items in a horizontal sequence, ideal for listing elements that share a context."
    },
    "ica-layout-flow-column": {
        attributes: ["id", "class", "gap"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-row"],
        description: "Organizes items in a vertical sequence, supporting hierarchical structures or ordered listings."
    },
    "ica-layout-flow-grid": {
        attributes: ["rows", "columns", "gap"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Presents collections of items in a two-dimensional structure, facilitating comparison and visualization."
    },
    "ica-layout-flow-adaptive": {
        attributes: ["breakpoints", "layout"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Layouts that dynamically adjust to the device size, maintaining accessibility and usability."
    },
    "ica-layout-flow-split": {
        attributes: ["direction", "ratio", "gutter"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Divides the screen into distinct areas for simultaneous interaction with different content."
    },
    "ica-layout-flow-divider": {
        attributes: ["text"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Insere divisores visuais que separam conteúdos sem modificar a estrutura lógica ou hierárquica da página, melhorando a clareza visual."
    },
    "ica-layout-group-table": {
        attributes: ["data", "columns", "striped", "bordered", "maxcolumn"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Displays data in tabular format, allowing easy analysis and comparison of information."
    },
    "ica-layout-group-cards": {
        attributes: ["cardsdata", "layout", "spacing"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Highlights sets of information or individual items in card format, providing an accessible overview."
    },


    //------ICA-BLOCKS-----------

    "ica-blocks-viewer-pdf-viewer": {
        attributes: ["src", "page", "zoom"],
        allowedChildren: [],
        allowedParents: [],
        description: "Component for viewing PDF documents within the application. Allows users to read and interact with PDF content directly in the interface, without the need for downloads or external applications."
    },
    "ica-blocks-viewer-spreadsheet-viewer": {
        attributes: ["data", "activesheet", "readonly"],
        allowedChildren: [],
        allowedParents: [],
        description: "Spreadsheet viewer that supports formats such as Excel. Facilitates the visualization and manipulation of spreadsheet data within the application, allowing for direct analysis and reviews."
    },
    "ica-blocks-viewer-document-viewer": {
        attributes: ["src", "type", "readonly"],
        allowedChildren: [],
        allowedParents: [],
        description: "Allows the visualization of various document formats, such as Word, PowerPoint, and PDF, integrating a rich content view without the need for additional software."
    },
    "ica-blocks-plugins-calendar": {
        attributes: ["value", "disabled", "min", "max"],
        allowedChildren: [],
        allowedParents: [],
        description: "Calendar plugin that offers views and interactions with events and schedules. Integrates with external systems for event synchronization and management."
    },
    "ica-blocks-plugins-schedule": {
        attributes: ["eventsdata", "view", "selecteddate"],
        allowedChildren: [],
        allowedParents: [],
        description: "Component for planning and viewing personal or professional schedules. Allows users to organize and view appointments, tasks, and events in a clear and interactive layout."
    },
    "ica-blocks-plugins-external-api": {
        attributes: ["endpoint", "params", "method"],
        allowedChildren: [],
        allowedParents: [],
        description: "Facilitates integration with external APIs to fetch or send data. Ideal for features such as viewing weather conditions, stock quotes, or social media updates directly in the application."
    },
    "ica-blocks-projects-pages": {
        attributes: ["data", "selectedpage", "editable"],
        allowedChildren: [],
        allowedParents: [],
        description: "Allows the embedding of entire pages or specific components within the current application. Useful for integrating additional functionality or information without the need for external navigation."
    }

}

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
    if (!icaDescriptions[tag]) return [];
    return icaDescriptions[tag].attributes;

}

export function getDefinitionByTag(tag: string): ComponentDescription | undefined {
    tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
    if (!tag.toLocaleLowerCase().startsWith('ica-')) return;
    if (!icaDescriptions[tag]) return;
    return icaDescriptions[tag];

}

export function getDescriptionAttr(attribute: string): string  {
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
    const rc = new Set<string>();
    tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
    if (!tag.toLocaleLowerCase().startsWith('ica-')) return [];
    if (!icaDescriptions[tag]) return [];
    const attrs = icaDescriptions[tag].attributes;
    for (const att of attrs) {
        rc.add(att)
    };
    return Array.from(rc);
}

export function getAttributeDefinitionsLit(tag: string): string[] {
    const rc = new Set<string>();
    tag = removeProjectNumberSegment(tag.toLocaleLowerCase());
    if (!tag.toLocaleLowerCase().startsWith('ica-')) return [];
    if (!icaDescriptions[tag]) return [];
    const attrs = icaDescriptions[tag].attributes;

    for (const att of attrs) {
        const def = attributeDefinitions.find((item) => item.path.trim() === att.trim());
        if (def) rc.add(def.lit);
    };
    return Array.from(rc);
}

export function getGroups(): Record<string, Record<string, string[]>> {
    return transformIcaDescriptions(icaDescriptions)
}

function transformIcaDescriptions(icaDescriptions: IIcaDescriptions): Record<string, Record<string, string[]>> {
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

    const elementTag = removeProjectNumberSegment(element.tagName.toLocaleLowerCase());
    const newParentTag = removeProjectNumberSegment(newParent.tagName.toLocaleLowerCase());

    const dElement = icaDescriptions[elementTag];
    const dNewParent = icaDescriptions[newParentTag];

    if (!dElement || !dNewParent) return false;
    if (dNewParent.allowedChildren.includes("!*")) {
        return false;
    }

    const parentCanHaveChild = dNewParent.allowedChildren.some(childPattern => {

        if (childPattern.endsWith("-*")) {
            return elementTag.startsWith(childPattern.slice(0, -1));
        }

        return childPattern === elementTag;
    });

    if (!parentCanHaveChild && dNewParent.allowedChildren.length > 0) return false;

    const childCanHaveParent = dElement.allowedParents.some(parentPattern => {

        const searchParents = parentPattern.startsWith('**');
        parentPattern = parentPattern.replace('**', '');

        if (parentPattern.endsWith("-*")) {
            return newParentTag.startsWith(parentPattern.slice(0, -1));
        }

        if (searchParents && parentPattern !== newParentTag) {
            return hasParentWithPrefix(newParent, parentPattern);
        }

        return parentPattern === newParentTag;
    });

    if (!childCanHaveParent && dElement.allowedParents.length > 0) return false;

    return true;

}

function hasParentWithPrefix(element: HTMLElement, prefix: string): boolean {

    let parent = element.parentElement;
    while (parent) {
        if (parent.tagName.toLowerCase().startsWith(prefix)) {
            return true;
        }
        parent = parent.parentElement;
    }
    return false;
}

interface ComponentDescription {
    attributes: string[];
    allowedChildren: string[];
    allowedParents: string[];
    description: string;
}

interface IIcaDescriptions {
    [key: string]: ComponentDescription;
}

export const descriptionForPrompt: string = `
## Atomic Design – Moléculas (Molecules)

General attributes (aplicáveis em quase todas as moléculas):
- name, id, class, style
- Attributes A11y (opcionais): role, ariaLabel, ariaDescribedBy, ariaExpanded, ariaSelected …

Attributes Text:
Exibem textos fixos ou dinâmicos.
Aceitam texto simples ou **composite binding**.
Exemplos:
- label="Digite o CPF"
- label="Bem-vindo {{ui.user.name}}"

Attributes Cfg:
Controlam o comportamento ou aparência da molécula.
Aceitam texto fixo ou **binding puro** (sem texto adicional).
Exemplos:
- readonly="true"
- disabled="{{ui.ReadyForInput}}"

Attributes Bind:
São usados para ler e/ou gravar dados dinâmicos.
Aceitam texto fixo ou **binding puro**.
Exemplos:
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
- Text: label, hint
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
Displays records in various visual formats: table, cards, list, timeline, etc.
The layout is defined by 'recommendedWidget', and the values shown via direct attributes.
- Cfg: config
- Bind: selected
- Text: title, subtitle, line1, line2, bottom, image, icon, badge
- Example:  config={
    "table": "db.produtos", "range": { "start": 0, "end": 10 },
    "recommendedWidget": "cards", "selectedField": "id" },
  title="{{nome}}" subtitle="{{descricao}}" bottom="R\${{preco}}"
## ica-forms-records-grid
Data-grid capable of multiple behaviours.
Behaviour is picked via 'recommendedWidget'.
- Cfg: config
- Bind: selectedRows, editedRows
- interface config {
  table: string,                 // DB ou endpoint
  range?: { start: number, end: number },
  recommendedWidget: "readonly" | "editable" | "grouping" | "pivot" | "tree" | "virtual-scroll",
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
Flexible navigation widget that can display links, menus, breadcrumbs, buttons, or anchor-based sidebars.
It supports external links, in-page navigation ('#id') and optional auto-highlighting on scroll.
- Cfg: config
- Bind: selected (auto-updated when scrolling or clicking)
- Interface Config {
  recommendedWidget: "link" | "menu" | "button" | "breadcrumb" | "anchor", // default = "link"
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
## ica-navigation-content
Organizes content into multiple sections (tabs, steps, scenarios, accordions, etc.).
Each section points to external content via 'ref'.
Supports logical grouping with or without visible headers.
Supports showing content in popup style with automatic close when using widget "popup"
- Cfg: config
- Bind: selected // ex: {{ui.tab1.selected}}
- interface config {
  recommendedWidget: "tab" | "stepper" | "scenary" | "accordion" | "toolbar" | "popup" | "none" ,
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
- Cfg: config
- Text: text
- interface config {
  language?: "ts" | "js" | "html" | "css" | "json" | "bash" | "sql" | "python" | string
}
## ica-apresentation-text-rich
Used to present or edit text with rich formatting (bold, italic, lists, links, etc.).
Can be used in view or editable mode.
- Cfg: config
- Text: content
- interface config {
  editable?: boolean
}
## ica-apresentation-text
Presents formatted text content like simple text, quotes, or banners.
Allows inline HTML (innerHTML) and multiple visual styles based on 'type'.
Styling and animations should be handled via CSS or themes.
- Cfg: config
- Text: text
- interface config {
  type: "text" | "quote" | "banner",
  multiline?: boolean,
  // quote-specific
  cite?: string,
  citeHref?: string,
  // banner-specific
  src?: string,
  alt?: string,
  href?: string, // optional link on click
  target?: "_blank" | "_self"
}
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
  size?: string,        // icon or avatar
  color?: string,       // icon only
  shape?: "circle" | "square" // avatar only
}
## ica-apresentation-gallery
Displays collections of images in formats like gallery, carousel, or slider.
- Cfg: config
- Bind: selectedindex (optional, for navigation)
- interface config {
  recommendedWidget: "gallery" | "carousel" | "slider",
  images: string[],               // array of image URLs
  thumbnails?: boolean,           // for gallery
  shownavigation?: boolean,       // for carousel/slider
  autoplay?: boolean,
  interval?: number,              // ms
  loop?: boolean
}
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
The layout and interaction style is defined by 'recommendedWidget'.
- Cfg: config
- Bind: selectedvideo (for playlist)
- interface config {
  recommendedWidget: "embed" | "inline" | "playlist",
  src?: string,              // for single video (embed/inline)
  poster?: string,           // for inline (placeholder image)
  videos?: string[],         // for playlist
  autoplay?: boolean,
  controls?: boolean,
  loop?: boolean,
  preload?: "auto" | "metadata" | "none"
}
## ica-apresentation-sound
Plays audio content in various contexts such as music tracks, sound effects, or podcast episodes.
The layout and behavior are defined by 'recommendedWidget'.
- Cfg: config
- Bind: selected (for playlist/effects)
- interface config {
  recommendedWidget: "player" | "effects" | "podcast",
  src?: string,                  // for single audio
  sounds?: string[],            // for sound effects
  podcastepisodes?: string[],   // for podcast playlists
  autoplay?: boolean,
  controls?: boolean,
  loop?: boolean,
  preload?: "auto" | "metadata" | "none"
}
## ica-apresentation-chart
Displays visual charts in 2D or 3D using external frameworks like TreeD3.js.
The config defines rendering behavior; the 'chartdata' must be provided via binding for interactivity.
- Cfg: config
- Bind: chartdata  // ex: chartdata="{{ui.relatorio.vendas}}"
- interface config {
  recommendedWidget: "treed3" | "echarts" | "chartjs" | string,
  renderer?: string,               // optional custom render strategy
  options3d?: object               // used only if recommendedWidget = "3d"
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
  recommendedWidget: "confetti" | "fireworks" | "radial-splash" | "balloon-explode" | string,
  trigger: "manual" | "onload" | "onclick" | "page-enter" | "page-exit" | "state",
  triggerValue?: string | number | boolean,
  inverted?: boolean,
  duration?: number,
  intensity?: number,
  once?: boolean
}
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
  recommendedWidget: "post" | "feed",
  url: string,                    // required: post or profile URL
  width?: string,                 // optional dimensions (ex: "100%", "300px")
  height?: string,
  refreshInterval?: number,      // in seconds, only for feeds
  limit?: number                 // max items, only for feeds
}
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
  recommendedWidget: "toast" | "snackbar" | "notification" | "alert" | "modal",
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
## ica-apresentation-canvas
Canvas area for rendering dynamic visual scenes, games, simulations, or interactive business tools.
Ideal for applications where visuals are generated via custom scripts or engines.
- Cfg: config
- Bind: state (optional — can be used to send commands or track status)
- interface config {
  recommendedWidget: string,       // ex: "carGame", "floorPlanEditor", "inventory3D", "whiteboard"
  width?: string,                  // ex: "100%", "800px"
  height?: string,
  pixelRatio?: number,             // optional for high-DPI displays
  autoResize?: boolean,
  runOnLoad?: boolean,             // auto-start on render
  scriptRef: string                // required JS module that will run the logic
}
## ica-blocks-viewer
Renders document and data files like PDF, spreadsheets, and Office documents inside the application.
The viewer type and behavior depend on the selected widget.
- Cfg: config
- Text: data
- interface config {
  recommendedWidget: "pdf" | "spreadsheet" | "document",
  page?: number,              // pdf only
  zoom?: number,              // pdf only
  activesheet?: string,       // spreadsheet only
  type?: "docx" | "pptx" | "pdf" | string,  // for document viewer fallback
  readonly?: boolean
}
`;



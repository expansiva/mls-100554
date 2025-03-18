/// <mls shortName="icaBaseDescription2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';

interface ComponentDescription {
    attributes: string[];
    allowedChildren: string[];
    allowedParents: string[];
    description: string;
}

interface IIcaDescriptions {
    [key: string]: ComponentDescription;
}

export const icaDescriptions: IIcaDescriptions = {

    //-----ICA-FORMS-----
    "ica-forms-content-form": {
        attributes: ["action", "method", "novalidate", "autocomplete", "disabled", "enctype", "name", "target", "validateOnChange", "autosave"],
        allowedChildren: ["ica-forms-", "ica-layout-flow-section"],
        allowedParents: [],
        description: "form component provides enhanced control over form submission, validation, and customization"
    },
    "ica-forms-input-number": {
        attributes: ["name", "value", "placeholder", "label", "pattern", "errormessage", "maxvalue", "minvalue", "step", "required", "disabled", "readonly", "autofocus", "hint", "inputmode", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Allows the user to input numerical values, with support for minimum and maximum limits."
    },
    "ica-forms-input-string": {
        attributes: ["name", "hint", "label", "required", "disabled", "readonly", "maxlength", "minlength", "placeholder", "pattern", "errormessage", "autofocus", "autoCapitalize", "autocorrect", "autocomplete", "value", "validationMessage", "debounce", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Field for free text, with configurable validations such as maximum length and regular expressions."
    },
    "ica-forms-input-boolean": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "checked", "errormessage", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Component for binary choice, like switches or checkboxes, ideal for yes/no settings."
    },
    "ica-forms-input-date": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "pattern", "errormessage", "maxvalue", "minvalue", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Date selector, with configuration options to limit periods."
    },
    "ica-forms-input-time": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "pattern", "errormessage", "placeholder", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Allows the user to select a time, with support for different time formats."
    },
    "ica-forms-input-date-range": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "pattern", "errormessage", "startValue", "endValue", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Component for selecting date ranges, useful for period filters."
    },
    "ica-forms-input-select-one": {
        attributes: ["hint", "label", "required", "disabled", "options", "selectedvalue", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Selector for a single option among many, which can be presented as a dropdown, combobox, etc."
    },
    "ica-forms-input-multiselect": {
        attributes: ["hint", "label", "required", "disabled", "options", "selectedvalue", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Allows multiple option selection, ideal for filters or advanced settings."
    },
    "ica-forms-input-color": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "pattern", "errormessage", "placeholder", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Color picker, with support for different color formats (RGB, HEX, etc.)."
    },
    "ica-forms-input-editor": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "errormessage", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Rich text editor, allowing basic formatting (bold, italic) and insertion of elements like lists and tables."
    },
    "ica-forms-input-feedback": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "value", "errormessage", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "For rating or thumbs up/down (approval or disapproval), allowing the user to express opinions simply."
    },
    "ica-forms-input-file": {
        attributes: ["name", "label", "hint", "required", "disabled", "readonly", "autofocus", "errormessage", "accept", "multiple", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "For attaching a file, with support for drag and drop and upload progress visualization."
    },
    "ica-forms-records-table": {
        attributes: ["data", "columns", "selectedRow", "filterable", "sortable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Displays data in table format, with support for sorting and filtering."
    },
    "ica-forms-records-list": {
        attributes: ["items", "selectedItem", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "List of items, customizable to display summarized or detailed information."
    },
    "ica-forms-records-timeline": {
        attributes: ["data", "selectedItem", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Presents events or records in a timeline, facilitating the visualization of sequences or histories."
    },
    "ica-forms-records-cards": {
        attributes: ["cardsData", "selectedCard", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Data presented in cards, ideal for visual summaries with images or icons."
    },
    "ica-forms-records-map": {
        attributes: ["latitude", "longitude", "zoom", "markers", "mapType", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Displays geographic information on a map, supporting markers and custom regions."
    },
    "ica-forms-records-table-with-pagination": {
        attributes: ["data", "columns", "selectedRow", "filterable", "sortable", "pageable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Data table with pagination, to manage large data sets without overloading the interface."
    },
    "ica-forms-records-table-with-infinite-scroll": {
        attributes: ["data", "columns", "selectedRow", "filterable", "sortable", "infiniteScroll", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Table that automatically loads more data as the user scrolls the page, for smooth navigation through large data sets."
    },
    "ica-forms-tree-tree-view": {
        attributes: ["data", "selectedNode", "expandedNodes", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Hierarchical data structure that allows for expansion and contraction of nodes, useful for categories or organizational structures."
    },
    "ica-forms-tree-nested-dropdown": {
        attributes: ["data", "selectedValue", "disabled", "required", "placeholder", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Nested dropdowns that allow selection at multiple levels of a hierarchy."
    },
    "ica-forms-tree-nested-accordions": {
        attributes: ["data", "expandedSections", "multiExpand", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Nested accordions to organize content or categories into multiple layers, facilitating navigation in complex structures."
    },
    "ica-forms-tree-tag-cloud": {
        attributes: ["tagsData", "selectedTags", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Set of tags or keywords representing frequency or importance, allowing dynamic editing and organization."
    },
    "ica-forms-tree-mind-map": {
        attributes: ["data", "selectedNode", "layout", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Mind map for organizing and visualizing ideas or concepts in a radial structure, facilitating editing and expansion of related concepts."
    },
    "ica-forms-submit-submit": {
        attributes: ["name", "title", "icon", "text", "disabled", "form", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Button to submit the form. When clicked, it collects and sends the form data to the server or designated handler. Essential for finalizing user data entry."
    },
    "ica-forms-submit-cancel": {
        attributes: ["name", "title", "icon", "text", "disabled", "form", "clicked-value", "clicked-action", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Button to cancel the form operation, allowing the user to abort their action and typically return to the previous state or screen. Helps ensure safe navigation without data submission."
    },
    "ica-forms-submit-clear": {
        attributes: ["name", "title", "icon", "text", "disabled", "form", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
        description: "Button to clear all form fields, removing user inputs. Useful in long or complex forms where reset may be necessary."
    },
    "ica-forms-submit-send-external": {
        attributes: ["name", "title", "icon", "text", "disabled", "form", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["^ica-forms-content-form"],
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
        attributes: ["items", "selectedItem", "openState", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Menus that provide primary navigation through the application or to external sites. Support hierarchical structures to organize navigation options."
    },
    "ica-navigation-links-button": {
        attributes: ["name", "label", "disabled", "icon", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Buttons used for navigation actions, such as submitting forms or redirecting to other internal or external pages."
    },
    "ica-navigation-links-links": {
        attributes: ["href", "target", "rel", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Links for direct navigation between application pages or external resources, with support for opening in a new tab depending on the context (target)."
    },
    "ica-navigation-links-breadcrumbs": {
        attributes: ["items", "separator", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Hierarchical navigation paths that indicate the user's current location within the application and facilitate returning to previous levels."
    },
    "ica-navigation-links-anchors": {
        attributes: ["href", "target", "rel", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Anchors that allow internal navigation on a page, directing the user to specific sections without reloading the page."
    },
    "ica-navigation-content-tab": {
        attributes: ["tabs", "selectedTab", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Tabs that organize related content into separate sections, allowing switching between them without reloading the page."
    },
    "ica-navigation-content-scenary": {
        attributes: ["scenes", "selectedScene", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Components that guide the user through scenarios or sequential steps within the same page, ideal for tutorials or step-by-step configurations."
    },
    "ica-navigation-content-stepper": {
        attributes: ["steps", "currentStep", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Step indicators (steppers) that show progress through a sequence of steps, useful for multi-step processes such as checkouts or long forms."
    },
    "ica-navigation-content-toolbar": {
        attributes: ["items", "orientation", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Toolbars that offer quick access to frequently used actions and tools, which can be part of content or action navigation."
    },
    "ica-navigation-content-accordion": {
        attributes: ["open", "text", "multiple", "disabled", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Accordions that allow expanding and collapsing sections of content, organizing large amounts of information in a compact space."
    },
    "ica-navigation-content-popup": {
        attributes: ["open", "title", "content", "modal", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "Popups that provide additional information, messages, or interactive content, appearing over the existing content without redirecting the user."
    },
    "ica-navigation-content-scrollspy": {
        attributes: ["targets", "activeTarget", "offset", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: ["ica-navigation-content-nav"],
        description: "A component that updates navigation links based on scrolling, indicating which section of the content is currently visible on the screen."
    },

    //-------ICA-NAVIGATION---------
    "ica-apresentation-text-text": {
        attributes: ["text", "type", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present blocks of simple text."
    },
    "ica-apresentation-text-code": {
        attributes: ["text", "language", "languages", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present blocks of code."
    },
    "ica-apresentation-text-banner": {
        attributes: ["text", "src", "alt", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display promotional or informational banners."
    },
    "ica-apresentation-text-quote": {
        attributes: ["text", "cite", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To highlight quotations or testimonials."
    },
    "ica-apresentation-text-rich": {
        attributes: ["content", "editable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present text with rich formatting."
    },
    "ica-apresentation-images-images": {
        attributes: ["src", "alt", "width", "height", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present individual or grouped images."
    },
    "ica-apresentation-images-icons": {
        attributes: ["icon", "name", "size", "color", "alt", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display representative icons."
    },
    "ica-apresentation-images-avatar": {
        attributes: ["src", "alt", "size", "shape", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To show user or character avatars."
    },
    "ica-apresentation-images-gallery": {
        attributes: ["images", "selectedIndex", "thumbnails", "showNavigation", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display collections of images in gallery format."
    },
    "ica-apresentation-images-carousel": {
        attributes: ["slides", "autoplay", "interval", "loop", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To present images in a rotating carousel."
    },
    "ica-apresentation-images-sliders": {
        attributes: ["slides", "autoplay", "interval", "loop", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display images or banners in a slider."
    },
    "ica-apresentation-images-maps": {
        attributes: ["latitude", "longitude", "zoom", "markers", "mapType", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display static or interactive maps."
    },
    "ica-apresentation-video-embedded-video": {
        attributes: ["src", "autoplay", "controls", "loop", "preload", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To embed videos from external platforms."
    },
    "ica-apresentation-video-image-video": {
        attributes: ["src", "poster", "autoplay", "controls", "loop", "preload", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display videos in image format, such as GIFs or animated videos."
    },
    "ica-apresentation-video-video-playlist": {
        attributes: ["videos", "selectedVideo", "autoplay", "controls", "loop", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To list videos in a sequence or collection."
    },
    "ica-apresentation-sound-player": {
        attributes: ["src", "autoplay", "controls", "loop", "preload", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To play audio files or music."
    },
    "ica-apresentation-sound-sound-effects": {
        attributes: ["sounds", "selectedSound", "autoplay", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To play sound effects on specific actions."
    },
    "ica-apresentation-sound-podcast-player": {
        attributes: ["podcastEpisodes", "selectedEpisode", "autoplay", "controls", "loop", "preload", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To play podcast episodes."
    },
    "ica-apresentation-charts-2d": {
        attributes: ["framework", "data", "renderer", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display two-dimensional charts."
    },
    "ica-apresentation-charts-3d": {
        attributes: ["framework", "data", "renderer", "options3d", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To show three-dimensional charts."
    },
    "ica-apresentation-animations-loading": {
        attributes: ["type", "size", "color", "duration", "autoplay", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Animations indicating content loading."
    },
    "ica-apresentation-animations-onclick": {
        attributes: ["animationType", "duration", "trigger", "iterations", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Animations triggered by clicks or user interactions."
    },
    "ica-apresentation-animations-javascript-animations": {
        attributes: ["script", "options", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Complex animations created with JavaScript."
    },
    "ica-apresentation-indicators": {
        attributes: ["type", "value", "max", "label", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Components designed to inform the user about the state or progress of an operation. Includes progress bars, loading indicators, status lights, and other visual elements that communicate essential information clearly and concisely. These components are essential for improving the user experience by providing immediate visual feedback on ongoing actions."
    },
    "ica-apresentation-embeds-social-media-posts": {
        attributes: ["url", "width", "height", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To embed social media posts directly on the page."
    },
    "ica-apresentation-embeds-social-media-feeds": {
        attributes: ["url", "refreshInterval", "limit", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "To display live social media feeds in the application."
    },
    "ica-apresentation-messages-toast": {
        attributes: ["message", "type", "duration", "closable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Brief messages that appear and disappear automatically, ideal for non-intrusive action feedback."
    },
    "ica-apresentation-messages-alert": {
        attributes: ["message", "type", "closable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Alerts are important notifications that require the user's attention, and can be used for critical errors, warnings, or confirmations."
    },
    "ica-apresentation-messages-snackbar": {
        attributes: ["message", "actionText", "duration", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Snackbars provide brief messages with the option for user action, such as undoing an action or closing the message."
    },
    "ica-apresentation-messages-modal": {
        attributes: ["title", "content", "open", "closable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Modals are windows that appear on top of the page content to communicate important messages or require user action before proceeding."
    },
    "ica-apresentation-messages-notification": {
        attributes: ["message", "type", "duration", "closable", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Notifications are messages that can be sent to users even when they are not actively using the application, useful for important updates or reminders."
    },
    "ica-apresentation-messages-badge": {
        attributes: ["text", "type", "icon", "eventBinding"],
        allowedChildren: ["!*"],
        allowedParents: [],
        description: "Badges indicate status or count items, such as unread messages or notifications, usually overlaid on icons or buttons."
    },


    //-----ICA-LAYOUT----------
    "ica-layout-flow-section": {
        attributes: ["id", "class", "eventBinding"],
        allowedChildren: ["ica-layout-"],
        allowedParents: [],
        description: "Divides content into logical and distinct sections, facilitating organization and understanding by the user."
    },
    "ica-layout-flow-group": {
        attributes: ["id", "class", "direction", "gap", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Groups related elements, promoting an organized and cohesive view of the content."
    },
    "ica-layout-flow-row": {
        attributes: ["id", "class", "gap", "eventBinding"],
        allowedChildren: ["ica-layout-flow-column"],
        allowedParents: ["ica-layout-flow-section"],
        description: "Organizes items in a horizontal sequence, ideal for listing elements that share a context."
    },
    "ica-layout-flow-column": {
        attributes: ["id", "class", "gap", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-row"],
        description: "Organizes items in a vertical sequence, supporting hierarchical structures or ordered listings."
    },
    "ica-layout-flow-grid": {
        attributes: ["rows", "columns", "gap", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Presents collections of items in a two-dimensional structure, facilitating comparison and visualization."
    },
    "ica-layout-flow-adaptive": {
        attributes: ["breakpoints", "layout", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Layouts that dynamically adjust to the device size, maintaining accessibility and usability."
    },
    "ica-layout-flow-split": {
        attributes: ["direction", "ratio", "gutter", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Divides the screen into distinct areas for simultaneous interaction with different content."
    },
    "ica-layout-flow-divider": {
        attributes: ["text", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Insere divisores visuais que separam conteúdos sem modificar a estrutura lógica ou hierárquica da página, melhorando a clareza visual."
    },
    "ica-layout-group-table": {
        attributes: ["data", "columns", "striped", "bordered", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Displays data in tabular format, allowing easy analysis and comparison of information."
    },
    "ica-layout-group-cards": {
        attributes: ["cardsData", "layout", "spacing", "eventBinding"],
        allowedChildren: [],
        allowedParents: ["ica-layout-flow-section"],
        description: "Highlights sets of information or individual items in card format, providing an accessible overview."
    },


    //------ICA-BLOCKS-----------

    "ica-blocks-viewer-pdf-viewer": {
        attributes: ["src", "page", "zoom", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Component for viewing PDF documents within the application. Allows users to read and interact with PDF content directly in the interface, without the need for downloads or external applications."
    },
    "ica-blocks-viewer-spreadsheet-viewer": {
        attributes: ["data", "activeSheet", "readonly", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Spreadsheet viewer that supports formats such as Excel. Facilitates the visualization and manipulation of spreadsheet data within the application, allowing for direct analysis and reviews."
    },
    "ica-blocks-viewer-document-viewer": {
        attributes: ["src", "type", "readonly", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Allows the visualization of various document formats, such as Word, PowerPoint, and PDF, integrating a rich content view without the need for additional software."
    },
    "ica-blocks-plugins-calendar": {
        attributes: ["value", "disabled", "min", "max", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Calendar plugin that offers views and interactions with events and schedules. Integrates with external systems for event synchronization and management."
    },
    "ica-blocks-plugins-schedule": {
        attributes: ["eventsData", "view", "selectedDate", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Component for planning and viewing personal or professional schedules. Allows users to organize and view appointments, tasks, and events in a clear and interactive layout."
    },
    "ica-blocks-plugins-external-api": {
        attributes: ["endpoint", "params", "method", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Facilitates integration with external APIs to fetch or send data. Ideal for features such as viewing weather conditions, stock quotes, or social media updates directly in the application."
    },
    "ica-blocks-projects-pages": {
        attributes: ["data", "selectedPage", "editable", "eventBinding"],
        allowedChildren: [],
        allowedParents: [],
        description: "Allows the embedding of entire pages or specific components within the current application. Useful for integrating additional functionality or information without the need for external navigation."
    }

}

const attributeDefinitions = [
    { path: "eventBinding", lit: "@propertyDataSource() eventBinding: EventBinding | undefined;" },
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

export function checkAttributteHasVariation(attribute: string): boolean {
  const attr = attributeDefinitions.find((attr) => attr.path === attribute);
  if (!attr) return false;
  return attr.variations === true;
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

export function canMoveElement( element: IcaLitElementBaseMethods, newParent: IcaLitElementBaseMethods): boolean {

    const elementTag = removeProjectNumberSegment(element.tagName.toLocaleLowerCase());
    const newParentTag = removeProjectNumberSegment(newParent.tagName.toLocaleLowerCase());

    const dElement = icaDescriptions[elementTag];
    const dNewParent = icaDescriptions[newParentTag];

    if (!dElement || !dNewParent) return false; 

    if (dNewParent.allowedChildren.includes("!*")) {
        return false;
    }
    
    const parentCanHaveChild = dNewParent.allowedChildren.some(childPattern => {
        
        if (childPattern.endsWith("-")) {
            return elementTag.startsWith(childPattern.slice(0, -1));
        }

        return childPattern === elementTag;
    });

    if (!parentCanHaveChild && dNewParent.allowedChildren.length > 0) return false;
    
    const childCanHaveParent = dElement.allowedParents.some(parentPattern => {

        const searchParents = parentPattern.startsWith('^');
        parentPattern = parentPattern.replace('^', '');

        if (parentPattern.endsWith("-")) {
            return newParentTag.startsWith(parentPattern.slice(0, -1));
        }

        if (searchParents && parentPattern !== newParentTag) {
            return hasParentWithPrefix(newParent,parentPattern);    
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

//-------FUNCTIONS OLDS

export function getDescriptionsRootGroup(): string[] {
    return ['Descriptions Root Group obsolete'];
}

export function getDescriptionsSubGroup(root: string): string[] {
  return ['Descriptions Sub Group obsolete'];
}

export function getDescriptionsFinalGroup(root: string, subGroup: string): string[] {
  return ['Descriptions Final Group obsolete'];
}

export function getFormComponentsDescription(root: string, subGroup: string | null, finalGroup: string | null): string {
  return 'Form Components Description obsolete'
}



export function getFormComponentsAttributes(root: string, subGroup: string, finalGroup: string): string {
  return "Form Components Attributes obsolete";
}

export function getEventDescription(root: string, subGroup: string, finalGroup: string, event: string): string {
    return 'Event description obsolete'
}

export function getFormComponentsEvents(root: string, subGroup: string, finalGroup: string): string {
    return 'Event obsolete'
}

export function getAttributeDefinitionsDesc(attribute: string): string {
  return 'Attribute Definitions obsolete'
}
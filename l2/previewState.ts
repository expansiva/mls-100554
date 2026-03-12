/// <mls fileReference="_100554_/l2/previewState.ts" enhancement="_100554_/l2/enhancementLit" />

// import {WCDToolboxMethodos} from '/_100554_/l2/wcdTypes.js';
import { } from "/_100554_/l2/aiAgentBase";

declare global {
    interface Window {
        preview: {
            editor: monaco.editor.IStandaloneCodeEditor | undefined;
            iframe: HTMLIFrameElement | undefined
        }
    }
}


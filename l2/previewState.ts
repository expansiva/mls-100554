/// <mls shortName="previewState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {WCDToolboxMethodos} from './_100554_wcdTypes';

declare global {
    interface Window {
        preview: {
            editor: monaco.editor.IStandaloneCodeEditor | undefined;
            iframe: HTMLIFrameElement | undefined
        }
    }
}


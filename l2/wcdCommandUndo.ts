/// <mls shortName="wcdCommandUndo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';

export function execute(param: IWCDCommand) {

    // if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    if (!param.args || !(param.args instanceof KeyboardEvent)) throw new Error('invalid param.args');

    const e = param.args as KeyboardEvent;
    e.preventDefault();
    if (!e.ctrlKey && !e.metaKey) return;
    if (e.key.toLocaleLowerCase() !== 'z') return;

    const { shortName, project } = (mls.actual[2] as any)?.left;

    if (!shortName || !project) throw new Error('invalid file selected');
    const uri = getUri(`_${project}_${shortName}`, '.html');
    let model = monaco.editor.getModel(uri);
    if (!model) throw new Error('invalid model');
    if ((model as any).undo) {
        localStorage.setItem('servicePreviewScrool', window.scrollY.toString());
        (model as any).undo();
    }

}

function getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html'): monaco.Uri {
    return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
}


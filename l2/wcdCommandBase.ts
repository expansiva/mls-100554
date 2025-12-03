/// <mls shortName="wcdCommandBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { convertTagToFileName } from '/_100554_/l2/utilsLit.js';

export function dispatchEventConciliate() {
    mls.events.fire([2], ['DomAction']);
}

export async function importFilesIfNeeded(files: string[]) {
    for await (const file of files) {
        const importInfo = convertTagToFileName(file);
        if (!importInfo) continue;
        await import(`./_${importInfo.project}_${importInfo.shortName}`);
    }
}

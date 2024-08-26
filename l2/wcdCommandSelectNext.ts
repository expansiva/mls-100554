/// <mls shortName="wcdCommandSelectNext" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';

var keys:any = {
    'ArrowDown': 'botton',
    'ArrowLeft': 'left',
    'ArrowUp': 'top',
    'ArrowRight': 'right'
}

export function execute(param: IWCDCommand) {

    const e = param.args as KeyboardEvent;
    const info = {} as ISelectNext;

    if (!keys[e.key]) return;
    info.position = keys[e.key];
    info.positionMode = e.shiftKey ? 'visual' : 'tree';

    console.info(info);   
    
}

interface ISelectNext{
    position: 'left' | 'right' | 'top' | 'botton',
    positionMode: 'visual' | 'tree'

}
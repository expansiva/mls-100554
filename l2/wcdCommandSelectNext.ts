/// <mls shortName="wcdCommandSelectNext" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';

export function execute(param: IWCDCommand) {

    console.info(param.args);   
    
}

interface ISelectNext{
    position: 'left' | 'right' | 'top' | 'botton',
    positionMode: 'visual' | 'tree'

}
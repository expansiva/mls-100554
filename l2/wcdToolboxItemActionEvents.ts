/// <mls shortName="wcdToolboxItemActionEvents" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WCDToolbox } from './_100554_wcdToolbox';
import * as icaGlobal from './_100554_icaGlobal';
import {initCollabSelectOneWithDescription} from './_100554_collabSelectOneWithDescription'

//version 4

export const getTemplate = (mode: string = '', position: string = ''): icaGlobal.IActionsToolbox => {

    let ret: icaGlobal.IActionsToolbox = templateActionEvents.event as icaGlobal.IActionsToolbox;
    if (position !== '') ret.position = position as any;
    const a = initCollabSelectOneWithDescription;
    return ret as icaGlobal.IActionsToolbox;

}

const templateActionEvents = {
    event: {
        position: 'p-r1',
        tp: 'event',
        format: '',
        title: '',
        iconSvg: '',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {
            if (wc.level === '2') {

                if (!(e as any).elICA || !(e as any).elICA.id) return;

                mls.events.fire(2, 'WidgetAction' as any, `{"op":"OpenScenario", "widget":"_100554_scenarioInsertEventOrChange", "value":"${e.detail}", "id":"${(e as any).elICA.id}"}`);
            }
        },
        menuItens: [],
        menuSubItens: [],
        widget: 'collab-select-one-with-description-100554',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick: false
    }
}


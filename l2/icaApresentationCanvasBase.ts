/// <mls shortName="icaApresentationCanvasBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationCanvasBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract state: string | undefined;

    public baseName: string = 'IcaApresentationCanvasBase';
    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "title" },
        ]
    }

}

export interface IConfig {
    recommendedWidget: string,       // ex: "carGame", "floorPlanEditor", "inventory3D", "whiteboard"
    width?: string,                  // ex: "100%", "800px"
    height?: string,
    pixelRatio?: number,             // optional for high-DPI displays
    autoResize?: boolean,
    runOnLoad?: boolean,             // auto-start on render
    scriptRef: string                // required JS module that will run the logic
}
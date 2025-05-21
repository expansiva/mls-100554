/// <mls shortName="icaApresentationCanvasBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationCanvasBase extends StateLitElement {

    abstract config: string | undefined;
    abstract state: string | undefined;


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
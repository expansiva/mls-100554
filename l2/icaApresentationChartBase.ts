/// <mls shortName="icaApresentationChartBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationChartBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract chartdata: string | undefined;

    public baseName:string=  'IcaApresentationChartBase';
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
    recommendedWidget: "treed3" | "echarts" | "chartjs" | string,
    renderer?: string,               // optional custom render strategy
    options3d?: object               // used only if recommendedWidget = "3d"
}

export interface IChartData {
    type: "bar" | "line" | "pie" | "scatter" | "tree" | string,
    title?: string,
    xAxis?: string[],
    yAxis?: string[],
    series: {
        name: string,
        data: number[] | { x: string, y: number }[] | object[],
        type?: string,  // optional override per series
        style?: object
    }[],
    options?: object
}
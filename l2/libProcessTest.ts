/// <mls shortName="libProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState } from './_100554_icaState';
import { ICANTest, ICANIntegration } from "./_100554_tsTestAST";

export function getScriptTest(ica: IcaState): { func: string, exe: any } | undefined {

    const stateHistories = ica.getHistory();
    if (stateHistories.length <= 0) return undefined;

    const params: Record<string, IParams> = {};
    const keysCont: Record<string, number> = {};

    let lastParam = '';

    stateHistories.forEach((stateHistory, index) => {

        const paramKey = stateHistory.key.split('.').pop();
        const paramType = typeof stateHistory.value;
        const paramValue = processValue(stateHistory.value);

        if (!paramKey) return;
        if (stateHistory.system) {
            lastParam = paramKey;
            return;
        }

        let resultKey = paramKey;
        if (!keysCont[paramKey]) keysCont[paramKey] = 0;

        if (params[paramKey] && lastParam && lastParam !== resultKey) {
            keysCont[paramKey] += 1;
            resultKey = `${paramKey}_${keysCont[paramKey]}`;
        }

        params[resultKey] = {
            paramValue,
            paramType,
            paramOri: stateHistory.key,
            history: stateHistory
        };


        (stateHistory as any).paramKey = resultKey;
        lastParam = resultKey;

    });


    const lines: string[] = [];

    let lastPath = '';
    let lastKey = '';

    let lastInteraction = '';
    let lastIndex = -1;


    stateHistories.forEach((history) => {

        const interationType = history.system ? "System" : "User";
        const vl = processValue(history.value);
        let row = '';

        if (!history.system) {

            const param = getParam(params, (history as any).paramKey);
            if (!param) return;
            row = `setState('${history.key}', args.${param})`;

        } else {

            row = `verifyState('${history.key}', ${vl})`;
            if (typeof vl === "string") row = `verifyState('${history.key}', '${vl}')`;
        }

        if (lastInteraction === interationType && lastPath === history.key && lastKey === (history as any).paramKey && lastIndex >= 0) {

            lines[lastIndex] = row;

        } else {
            lines.push(row);
            lastInteraction = interationType;
            lastPath = history.key;
            lastKey = (history as any).paramKey;
            lastIndex = lines.length - 1;
        }

    });

    // array.forEach((h) => {

    //     const tipo = h.system ? "System" : "User";
    //     const vl = processValue(h.value);
    //     let row = '';

    //     if (!h.system) {

    //         const param = getParam(params, h.key);
    //         if (!param) return;
    //         row = `setState('${h.key}', args.${param});`;

    //     } else {

    //         row = `verifyState('${h.key}', ${vl})`;
    //         if (typeof vl === "string") row = `verifyState('${h.key}', '${vl}')`;

    //     }

    //     if (lastInteraction === tipo && lastkey === h.key && lastIndex >= 0) {
    //         lines[lastIndex] = row;

    //     } else {

    //         lines.push(row);
    //         lastInteraction = tipo;
    //         lastkey = h.key;
    //         lastIndex = lines.length - 1;

    //     }

    // });

    const exe: any = {
        functionName: '',
        description: '',
        page: '',
        enabled: true,
        schema: {}
    };

    Object.keys(params).forEach((k) => {

        const p = params[k];
        if (!p) return;
        exe.schema[k] = { type: p.paramType, value: p.paramValue };

    });

    let name = '';
    if (mls.actual[2]) name = (mls.actual[2] as any).left.shortName;
    if (name !== '') name = `watchState('[pathTo].labelError', '[Expected Value]');`;

    const func = `export function @funcname(args: Record<string, any>): string {\n${name}\n${lines.join(';\n')}\nreturn 'ok';\n}`

    return { func, exe };

}

function getParam(params: any, key: string) {
    const keys = Object.keys(params);
    let ret = '';
    keys.forEach((i) => {
        if (i !== key) return;
        ret = i;
    });
    return ret;
}

function processValue(vl: any): string | number {
    if (typeof vl === "string" || typeof vl === "number") {
        return vl;
    }
    return JSON.stringify(vl);
}


interface IParams {
    paramValue: string | number,
    paramType: string,
    paramOri: string,
    history: {
        timestamp: number;
        system: boolean;
        key: string;
        value: any;
    }
}

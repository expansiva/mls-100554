/// <mls shortName="libProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState } from './_100554_icaState';
import { ICANTest, ICANIntegration } from "./_100554_tsTestAST";

export function getScriptTest(ica: IcaState): { func: string, exe: any } | undefined {

    const array = ica.getHistory();
    if (array.length <= 0) return undefined;

    const params: any = {};
    array.forEach((h) => {

        if (h.system) return;
        const key = h.key.split('.').pop();
        const tp = typeof h.value;
        const vl = processValue(h.value);

        if (!key) return;
        params[key] = { vl, tp, ori: h.key };

    });


    const lines: string[] = [];
    let lastkey = '';
    let lastInteraction = '';
    let lastIndex = -1;
    array.forEach((h) => {

        const tipo = h.system ? "System" : "User";
        const vl = processValue(h.value);
        let row = '';

        if (!h.system) {

            const param = getParam(params, h.key);
            if (!param) return;
            row = `setState('${h.key}', args.${param});`;

        } else {

            row = `verifyState('${h.key}', ${vl})`;
            if (typeof vl === "string") row = `verifyState('${h.key}', '${vl}')`;

        }

        if (lastInteraction === tipo && lastkey === h.key && lastIndex >= 0) {
            lines[lastIndex] = row;

        } else {

            lines.push(row);
            lastInteraction = tipo;
            lastkey = h.key;
            lastIndex = lines.length - 1;

        }

    });

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
        exe.schema[k] = { type: p.tp, value: p.vl };

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
        if (params[i].ori !== key) return;
        ret = i;
    })

    return ret;
}

function processValue(vl: any): string | number {
    if (typeof vl === "string" || typeof vl === "number") {
        return vl;
    }
    return JSON.stringify(vl);
}


export function runTest(iframe: HTMLIFrameElement, script: string) {
    return;
}
/// <mls shortName="libProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState } from './_100554_icaState';

export function getScriptTest(ica: IcaState): string {

    const array = ica.getHistory();
    if (array.length <= 0) return '';

    const params:any = {};
    array.forEach((h) => {

        if (h.system) return;
        const key = h.key.split('.').pop();
        const tp = typeof h.value;
        const vl = processValue(h.value);

        if (!key) return;
        params[key] = { vl, tp, ori:h.key };

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
            if (typeof vl === "string")row = `verifyState('${h.key}', '${vl}')`;

        }

        if (lastInteraction === tipo && lastkey === h.key && lastIndex >= 0) {
            lines[lastIndex] = row;

        }else {

            lines.push(row);
            lastInteraction = tipo;
            lastkey = h.key;
            lastIndex = lines.length - 1;

        }

    });

    let exe = '';
    Object.keys(params).forEach((k) => {

        const p = params[k];
        if (!p) return;
        if (exe !== '') exe += ', ';
        if (p.tp === 'string') exe += `${k}: '${p.vl}'`;
        else if (p.tp === 'object') exe += `${k}: ${JSON.stringify(p.vl)}`;
        else exe += `${k}: ${p.vl}`;

        
    })

    exe = `{${exe}}`;

    const jsdoc = `/**\n* Description\n*\n* @example\n* { page: @page, integrationName: @integration, params: ${exe} };\n*/`;

    const func = ` function @integration(args: any): string {\ntry{\n${lines.join('\n')}\nreturn 'ok';\n}catch(e:any){\nreturn e.message;\n}\n}\n\nargs1 = ${exe};\naddTest(@integration, () => {\nconst result = @integration(args1);\nconsole.log('Test Result: ' + result);\n});`


    return `${jsdoc}\n\n${func}`;

}

function getParam(params:any, key: string) {

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


export function runTest(iframe: HTMLIFrameElement, script:string) {
    return;
}
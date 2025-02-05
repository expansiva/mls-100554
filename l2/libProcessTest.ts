/// <mls shortName="libProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState } from './_100554_icaState';

export function getScriptTest(ica: IcaState): string {

    const array = ica.getHistory();
    if (array.length <= 0) return '';

    const ret:string[] = [];

    let lastkey = '';
    let lastInteraction = '';
    let lastIndex = -1;

    array.forEach((h) => {

        const tipo = h.system ? "System" : "User";
        const vl = processValue(h.value);
        let row = '';

        if (h.system) {

            row = `${vl} -> {{${h.key}}}  // ${tipo}`;
            if (typeof vl === "string") {
                row = `'${vl}' -> {{${h.key}}}  // ${tipo}`;
            }
            

        } else {

            row = `{{${h.key}}} -> ${vl}  // ${tipo}`;
            if (typeof vl === "string") {
                row = `{{${h.key}}} -> '${vl}'  // ${tipo}`;
            }
        }

        if (lastInteraction === tipo && lastkey === h.key && lastIndex >= 0) {
            ret[lastIndex] = row;

        } else {
            ret.push(row);
            lastInteraction = tipo;
            lastkey = h.key;
            lastIndex = ret.length - 1;

        }

    });

    return ret.join('\n');
}

function processValue(vl: any): string | number {

    if (typeof vl === "string" || typeof vl === "number") {
        return vl;
    }

    return JSON.stringify(vl);

}
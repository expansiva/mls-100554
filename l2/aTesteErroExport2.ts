/// <mls shortName="aTesteErroExport2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITeste } from './_100554_aTesteErroExport1';

export function teste(): ITeste {
    const obj: ITeste = {
        args: '',
        param: '',
        el: undefined
    }

    console.info(obj.el)
    return obj;
}
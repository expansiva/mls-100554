/// <mls shortName="libManagementCan" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export function setState(path: string, value: any) {
    if (!window.preview.iframe) throw new Error('Invalid preview iframe');
    if (!window.preview.iframe.contentWindow) throw new Error('Invalid preview iframe contentWindow');
    if (!((window.preview.iframe.contentWindow as any)['globalStateManagment'])) throw new Error('Invalid preview stateManagment');
    try {
        (window.preview.iframe.contentWindow as any)['globalStateManagment'].setValue(path, value);
        return true;
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export function verifyState(path: string, value: any) {

    if (!window.preview.iframe) throw new Error('Invalid preview iframe');
    if (!window.preview.iframe.contentWindow) throw new Error('Invalid preview iframe contentWindow');
    if (!((window.preview.iframe.contentWindow as any)['globalStateManagment'])) throw new Error('Invalid preview stateManagment');
    try {
        let oldValue = (window.preview.iframe.contentWindow as any)['globalStateManagment'].getValue(path);
        let newValue = value;
        if (typeof newValue === 'object') newValue = JSON.stringify(value);
        if (typeof oldValue === 'object') newValue = JSON.stringify(oldValue);
        if (oldValue !== newValue) throw new Error(`Test failed = result: ${newValue} expect: ${oldValue}`);
        return true;
    } catch (err: any) {
        throw new Error(err.message);
    }
}
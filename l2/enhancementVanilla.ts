/// <mls shortName="enhancementVanilla" project="100554" enhancement="_100541_enhancementBase" />
				
export const description = "Use this enhancement for model using lit - a simple and fast web component.\nRef: https://lit.dev/"

export const example = ``;

export const requires: mls.l2.editor.IRequire[] = [
];


const getDefaultHtmlExamplePreview = (model: mls.l2.editor.IMFile): string => {
    // const tag = convertFileNameToTag(`_${model.storFile.project}_${model.storFile.shortName}`);
    return ``;
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            ret.defaultHtmlExamplePreview = getDefaultHtmlExamplePreview(model);
            ret.properties = [];
            ret.webComponentDependencies = [];
            ret['servicePreviewDefault'] = '_100532_service_preview';
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })
}

export const prepareAdd = (prompt: string): { sourceTS: string, aiHeader: string, aiBody: string, aiDelimiter: string } => {
    const aiHeader = ``;
    const aiBody = prompt;
    const aiDelimiter = ':::';
    const sourceTS = '';
    const ret = { sourceTS, aiHeader, aiBody, aiDelimiter }
    return ret;
}

export const onAfterChange = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    try {
        
    } catch (e) {
        return e.message;
    }
};

export const getPromptDefault = (): string => {
    return ``;
}

export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    return;
}



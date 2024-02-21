/// <mls shortName="enhancementPage" project="100554" enhancement="_100554_enhancementVanilla" />

import { injectStyle } from './_100554_processCssLit'

export const description = "Use this enhancement for pages"

export const example = ``;

export const requires: mls.l2.editor.IRequire[] = [];

export const getExample = (project: number, shortname: string): string => {
    let newExample = example;
    return newExample;
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            ret.defaultHtmlExamplePreview = '<h1>Simple page</h1>';
            ret.properties = [];
            ret.webComponentDependencies = [];
            (ret as any)['servicePreviewDefault'] = '_100554_servicePreview';
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
        return;
    } catch (e: any) {
        return e.message || e;
    }
};

export const getPromptDefault = (): string => {
    return ``;
}

export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    await injectStyle(mfile, 0);
    return;
}

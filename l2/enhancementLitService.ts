/// <mls fileReference="_100554_/l2/enhancementLitService.ts" enhancement="_blank" />
import {
    getDesignDetails as getDesignDetailsDefault,
    getDefaultHtmlExamplePreview as getDefaultHtmlExamplePreviewDefault,
    onAfterChange as onAfterChangeDefault,
    onAfterCompile as onAfterCompileDefault,
    requires as requiresDefault,
} from '/_100554_/l2/enhancementLit.js';

export const requires = requiresDefault;

export const getDefaultHtmlExamplePreview = (modelTS: mls.editor.IModelTS): string => {
    return getDefaultHtmlExamplePreviewDefault(modelTS)
}

export const getDesignDetails = (modelTS: mls.editor.IModelTS): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return getDesignDetailsDefault(modelTS);
}

export const onAfterChange = async (modelTS: mls.editor.IModelTS): Promise<void> => {
    return onAfterChangeDefault(modelTS);
};

export const onAfterCompile = async (modelTS: mls.editor.IModelTS): Promise<void> => {
    return onAfterCompileDefault(modelTS);
}

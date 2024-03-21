/// <mls shortName="enhancementLitService" project="100554" enhancement="_blank" />

import {
    getDesignDetails as getDesignDetailsDefault,
    getDefaultHtmlExamplePreview as getDefaultHtmlExamplePreviewDefault,
    getPromptDefault as getPromptDefaultDefault,
    onAfterChange as onAfterChangeDefault,
    onAfterCompile as onAfterCompileDefault,
    prepareAdd as prepareAddDefault,
    requires as requiresDefault,
    setStylesProcessed as setStylesProcessedDefault,
    changeTagName
} from './_100554_enhancementLit';

import { convertFileNameToTag } from './_100554_utilsLit';

export const description = "Use this enhancement for create a service collab using lit"

export const getExample = (project: number, shortname: string): string => {
    let newExample = example;
    newExample = changeTagName(newExample, convertFileNameToTag(`_${project}_${shortname}`));
    newExample = changeClassName(newExample, project, shortname);
    newExample = changeWidget(newExample, project, shortname);
    return newExample;
}

export const example = `
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-example-100554')
export class ServiceExample100554 extends ServiceBase {

    static styles = css${'`[[mls_getDefaultDesignSystem]]`'};

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Service Example',
        visible: true,
        widget: '_100554_serviceExample',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Example',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }


    @property() 
    name: string = 'Somebody';

    render() {
        return html\`<p> Hello, \${ this.name } !</p>\`;
    }
}`;

export const requires = requiresDefault;

export const getDefaultHtmlExamplePreview = (model: mls.l2.editor.IMFile): string => {
    return getDefaultHtmlExamplePreviewDefault(model)
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return getDesignDetailsDefault(model);
}

export const prepareAdd = (prompt: string): { sourceTS: string, aiHeader: string, aiBody: string, aiDelimiter: string } => {
    return prepareAddDefault(prompt)
}

export const onAfterChange = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    return onAfterChangeDefault(mfile);
};

export const getPromptDefault = (): string => {
    return getPromptDefaultDefault();
}

export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    return onAfterCompileDefault(mfile);
}

export const setStylesProcessed = async (newCss: string, el: HTMLElement, tag: string): Promise<void> => {
    return setStylesProcessedDefault(newCss, el, tag);
}

const changeClassName = (source: string, project: number, shortname: string): string => {
    const regex = /export\s+class\s+(\w+)\s+extends/g;
    const match = regex.exec(source);
    const newClassName = shortname.charAt(0).toUpperCase() + shortname.substring(1, shortname.length) + project.toString();
    if (match) {
        const originalTag = match[1];
        const replacedSource = source.replace(originalTag, newClassName);
        return replacedSource;
    }
    return source;
}

const changeWidget = (source: string, project: number, shortname: string): string => {
    const regex = /widget:\s*'([^']+)'/g;
    const match = regex.exec(source);
    const newWidget = `_${project.toString()}_${shortname}`;
    if (match) {
        const originalTag = match[1];
        const replacedSource = source.replace(originalTag, newWidget);
        return replacedSource;
    }
    return source;
}
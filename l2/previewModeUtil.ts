/// <mls shortName="previewModeUtil" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IJSONDependence } from './_100554_libCompile';
import { convertFileNameToTag } from './_100554_utilsLit';
import { ServiceBase } from './_100554_serviceBase'

export function mountJSImporMap(info: IJSONDependence, ifr: HTMLIFrameElement): void {

    try {
        if (info.importsMap.length <= 0 || !ifr.contentDocument) return;
        const js = '{"imports": { ' + info.importsMap.join(',\n') + '} }';
        const script = document.createElement('script');
        script.type = 'importmap';
        script.textContent = js;
        ifr.contentDocument.head.appendChild(script);
    } catch (e: any) {
        console.info('Error mountJSImporMap: ' + e.message);
        return;
    }

}

export function mountCSS(ifr: HTMLIFrameElement): void {
    try {
        if (!ifr.contentDocument) return;
        const style = document.createElement('style');
        ifr.contentDocument.body.className = 'scroll-custom';
        ifr.contentDocument.body.style.width = '100%';

        ifr.contentDocument.body.style.background = 'var(--bg-primary-color)';
        ifr.contentDocument.body.style.color = 'var(--text-primary-color)';


        ifr.contentDocument.body.appendChild(style);
    } catch (e: any) {
        console.info('Error mountCSS: ' + e.message);
    }
}

export function mountTokens(tokens: string, models: mls.editor.IModels): void {
    try {
        const iframe = window.preview.iframe;
        if (!iframe || !iframe.contentDocument) return;
        removeOlderTokens(iframe, models);
        const css = tokens || '';
        if (!css) return;
        const style = document.createElement('style');
        style.textContent = css;
        style.id = getIdTokens(models);
        iframe.contentDocument.head.appendChild(style);

    } catch (e: any) {
        console.info('Error mountTokens: ' + e.message);
    }
}

export function removeOlderTokens(ifr: HTMLIFrameElement, models: mls.editor.IModels) {
    const id = getIdTokens(models);
    if (!ifr.contentDocument || !id) return;
    const st = ifr.contentDocument.head.querySelectorAll(`#${id}`);
    st.forEach((s) => s.remove());
}

export function getIdTokens(models: mls.editor.IModels) {
    if (!models || !models.ts) return 'ds_tokens';
    const { project } = models.ts.storFile
    return '_' + project + '_ds_tokens';
}

export async function simulateService(info: IJSONDependence, ifr: HTMLIFrameElement, file: mls.stor.IFileInfo) {

    if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;

    addFA(ifr);
    addTooltip(ifr);
    addStyleMls(ifr);
    addNav3(ifr, file);

}

export function addFA(ifr: HTMLIFrameElement) {
    if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
    const styleFA = document.createElement('link');
    styleFA.rel = 'stylesheet';
    styleFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css';
    styleFA.type = 'text/css';
    ifr.contentDocument.head.appendChild(styleFA);
}

export function addTooltip(ifr: HTMLIFrameElement) {
    if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
    if (!ifr.contentWindow.customElements.get('collab-tooltip')) {
        ifr.contentWindow.customElements.define('collab-tooltip', (window as any)['l4_html'].MlsTooltip);
    }
    ifr.contentWindow.customElements.whenDefined('collab-tooltip').then(() => {
        if (!ifr.contentDocument) return;
        const collaTbTooltip = document.createElement('collab-tooltip');
        ifr.contentDocument.body.appendChild(collaTbTooltip);
    });
}

export function addStyleMls(ifr: HTMLIFrameElement) {
    const styleMls = document.querySelector('style#mls-style');
    if (!styleMls || !ifr || !ifr.contentDocument || !ifr.contentWindow) return;
    const newStyle = styleMls.cloneNode(true);
    ifr.contentDocument.head.appendChild(newStyle);
}

export function addNav3(ifr: HTMLIFrameElement, file: mls.stor.IFileInfo) {

    const wcToAdd = [
        { name: '_100529_collab_nav_3', tag: 'collab-nav-3' },
        { name: '_100529_collabNav3Menu', tag: 'collab-nav-3-menu' },
        { name: '_100529_collab_nav_3_tools_link', tag: 'collab-nav-3-menu-tools-link' },
        { name: '_100529_collab_nav_3_tools_cycle', tag: 'collab-nav-3-menu-tools-cycle' },
        { name: '_100529_collab_nav_3_tools_dropdown', tag: 'collab-nav-3-menu-tools-dropdown' },
    ]

    if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
    wcToAdd.forEach((wc) => {
        if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        if (!ifr.contentWindow.customElements.get(wc.tag)) ifr.contentWindow.customElements.define(wc.tag, (window as any)['l4_html'][wc.name]);
    });

    const allTags = wcToAdd.map((item) => item.tag);
    waitForComponents(ifr.contentWindow, allTags).then(async () => {

        if (!ifr.contentDocument || !file) return;

        const dataService = `_${file?.project}_${file?.shortName}`
        const tag = convertFileNameToTag({ project: file.project, shortName: file.shortName, folder: file.folder });
        const old = ifr.contentDocument.querySelector(tag);
        if (!old) return;
        await import(`./_${file.project}_${file.shortName}`);

        const instance = old.cloneNode() as ServiceBase;
        const lvl = instance.getAttribute('level') || '2';
        old?.remove();
        const collabNav = document.createElement('collab-nav-3');
        collabNav.setAttribute('toolbarposition', instance.position || 'right');
        collabNav.setAttribute('data-service', dataService);

        collabNav.setAttribute('level', lvl);
        instance.setAttribute('level', lvl);

        const collabNavService = document.createElement('collab-nav-3-service');
        collabNavService.setAttribute('data-service', dataService);
        collabNavService.className = 'active';

        collabNav.style.position = 'relative';
        collabNav.style.width = '100%';
        collabNav.style.display = 'block';

        (collabNavService as any).mlsWidget = instance;
        const mlsnav3 = document.createElement('collab-nav-3-menu');
        mlsnav3.setAttribute('is-mls2', 'true');
        mlsnav3.setAttribute('toolbarposition', instance.position || 'right');

        collabNav.appendChild(collabNavService);
        collabNavService.appendChild(mlsnav3);

        ifr.contentDocument.body.appendChild(collabNav);
        mlsnav3.after(instance);

    });

}

export function waitForComponents(context: Window, componentNames: string[]) {
    const promises = componentNames.map(name =>
        context.customElements.whenDefined(name)
    );
    return Promise.all(promises);
}

export function addJsReference(ifr: HTMLIFrameElement, level: string) {

    const s = document.createElement('script') as HTMLScriptElement;
    s.textContent = `
				window['mls'] = window['mls']  ? window['mls']  : parent.mls ? parent.mls : top['mls'];
				window['globalVariation'] = window['globalVariation']  ? window['globalVariation']  : parent.globalVariation ? parent.globalVariation : top['globalVariation'];
				window['latest'] = window['latest']  ? window['latest']  : parent.latest ? parent.latest : top['latest'];
				window['Quill'] = window['Quill']  ? window['Quill']  : parent.Quill ? parent.Quill : top['Quill'];
				window['EasyMDE'] = window['EasyMDE']  ? window['EasyMDE']  : parent.EasyMDE ? parent.EasyMDE : top['EasyMDE'];
				window['l2_html'] = window['l2_html']  ? window['l2_html']  : parent.l2_html ? parent.l2_html : top['l2_html'];
                window['monaco'] = window['monaco']  ? window['monaco']  : parent.monaco ? parent.monaco : top['monaco'];
				window['l2_fieldTypes'] = window['l2_fieldTypes']  ? window['l2_fieldTypes']  : parent.l2_fieldTypes ? parent.l2_fieldTypes : top['l2_fieldTypes'];window['litDisableBundleWarning'] = true; window['collabActualLevel'] = ${level};

                window['previewL1'] = window['previewL1']  ? window['previewL1']  : parent.previewL1 ? parent.previewL1 : top['previewL1'];

                window['preview'] = window['preview']  ? window['preview']  : parent.preview ? parent.preview : top['preview'];

                window['getMatchingRulesForElement'] = function (element) {
                    const matchingRules = [];

                    for (const sheet of document.styleSheets) {
                        let rules;
                        try {
                        rules = sheet.cssRules;
                        } catch (e) {
                        continue;
                        }

                        for (const rule of rules) {
                        if (rule.type === CSSRule.STYLE_RULE && rule instanceof CSSStyleRule) {
                            const selector = rule.selectorText;

                            try {

                            const baseSelector = selector.replace(/:(hover|active|focus|visited|checked|disabled|focus-visible|focus-within)\b/g, '');

                            if (element.matches(baseSelector)) {
                                matchingRules.push({
                                selector,
                                style: rule.style,
                                origin: sheet.href || 'inline <style>',
                                });
                                continue;
                            }

                            const found = Array.from(doc.querySelectorAll(selector)).includes(element);
                            if (found) {
                                matchingRules.push({
                                selector,
                                style: rule.style,
                                origin: sheet.href || 'inline <style>',
                                });
                            }

                            } catch (e) {
                            continue;
                            }
                        }
                        }
                    }

                    return matchingRules;
                }`;

    ifr.contentDocument?.body.appendChild(s);
}
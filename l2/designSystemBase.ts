/// <mls shortName="designSystemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


export async function getTokens(project: number): Promise<IDesignSystemTokens[]> {
    const fileName = `./_${project}_designSystem`;
    const instance: IDesignSystem = await import(fileName);
    if (!instance) throw new Error(`Invalid ds file: ${fileName}`);
    return instance.tokens || [];
}

export async function getTokensLess(project: number, theme: string): Promise<string> {
    const tokens = await getTokens(project)
    const tokenByTheme = tokens.find((item) => item.themeName === theme);
    if (!tokenByTheme) throw new Error(`no find theme: ${theme}`);
    let tokensLess = '';
    tokensLess += Object.keys(tokenByTheme.color).map((key) => {
        let token = '';
        if (!key.startsWith('_dark-')) token = `@${key}: ${tokenByTheme.color[key]};`
        return token;
    }).filter((item) => !!item).join('\n')
    tokensLess += '\n' + Object.keys(tokenByTheme.typography).map((key) => `@${key}: ${tokenByTheme.typography[key]};`).join('\n');
    tokensLess += '\n' + Object.keys(tokenByTheme.global).map((key) => `@${key}: ${tokenByTheme.global[key]};`).join('\n');
    return Promise.resolve(tokensLess);
}

export async function getTokensCss(project: number, theme: string): Promise<string> {
    const tokens = await getTokens(project)
    const tokensLess = await getTokensLess(project, theme);
    try {
        const tokensCss = await preCompileLess('', tokensLess, theme, tokens, ':root');
        return tokensCss;
    } catch (err: any) {
        throw new Error(`Error on compile tokens Less: ${err.message}`);
    }
}

export function preCompileLess(less: string, tokensLess: string, theme: string, tokens: IDesignSystemTokens[], prefix: ':host' | ':root', includeTokens: boolean = true) {
    try {
        const fullLess = `${tokensLess}\n${less}`;
        compileLess(fullLess);
        return _preCompileLess(less, tokens, theme, prefix, includeTokens);

    } catch (err: any) {
        throw new Error(err.message);
    }
}

async function compileLess(str: string): Promise<string> {

    return new Promise((resolve, reject) => {
        if (!str || str.trim().length < 1) resolve('');
        mls.l2.less.compile(str).then(async (css) => {
            resolve(css);
        }).catch((err) => {
            reject(new Error('Error LESS: ' + err));
        });
    });
}

async function _preCompileLess(less: string, tokens: IDesignSystemTokens[], theme: string, prefix: ':host' | ':root', includeTokens: boolean): Promise<string> {
    let newLess = '';
    for (let tokenInfo of tokens) {
        if (tokenInfo.themeName !== theme) continue;
        const allTokens = { ...tokenInfo.color, ...tokenInfo.typography, ...tokenInfo.global };
        const darkAndLight = getDarkAndLight(allTokens);
        const cssVars = getCssVars(darkAndLight, prefix);
        newLess = replaceTokens(less, darkAndLight, cssVars, includeTokens);
    }
    return newLess;
}

function getDarkAndLight(allTokens: IKeyValueToken): IDarkLight {
    const themes: IDarkLight = {};

    Object.entries(allTokens).forEach((entry) => {
        const [key, value] = entry;
        const [theme] = key.split('-');
        let themeName = 'root';
        if (theme === '_dark') themeName = 'dark';
        if (!themes[themeName]) themes[themeName] = {};
        themes[themeName][key] = value;
    });

    return themes;
}

function getCssVars(themes: IDarkLight, prefix: ':host' | ':root') {

    const cssArr: string[] = [];
    Object.entries(themes).forEach((entry) => {
        const [key, value] = entry;
        if (key === 'root') {

            const cssVars: string[] = [];
            Object.entries(value).forEach((entryTokens) => {
                const [keyToken, valueToken] = entryTokens;
                const cssVar = `--${keyToken}: ${valueToken};`;
                cssVars.push(cssVar);
            });
            const cssFinal = `${prefix}{\n\t${cssVars.join('\n\t')}\n}`;
            cssArr.push(cssFinal);

        } else {

            const cssVars: string[] = [];
            Object.entries(value).forEach((entryTokensDark) => {
                const [keyToken, valueToken] = entryTokensDark;
                const tokenKey = keyToken.substring(1 + key.length + 1, keyToken.length);
                const cssVar = `--${tokenKey}: ${valueToken};`;
                cssVars.push(cssVar);
            });
            const cssFinal = `[data-theme="dark"] {\n\t${cssVars.join('\n\t')}\n}`;
            cssArr.push(cssFinal);

        }
    });

    return cssArr.join('\n');

}

function replaceTokens(less: string, themes: IDarkLight, cssVars: string, includeTokens: boolean) {

    const { root } = themes;
    if (!root) return less;

    let newLess: string;
    if (includeTokens) newLess = cssVars + '\n' + less;
    else newLess = less;

    Object.keys(root).forEach((key) => {

        const variableName = `@${key};`;
        const escapedVariableName = getEscapedVariable(variableName);
        const pattern = new RegExp(escapedVariableName, 'g');
        const replacement = `var(--${key});`;
        newLess = newLess.replace(pattern, replacement);

        const variableName2 = `@${key},`;
        const escapedVariableName2 = getEscapedVariable(variableName2);
        const pattern2 = new RegExp(escapedVariableName2, 'g');
        const replacement2 = `var(--${key}),`;
        newLess = newLess.replace(pattern2, replacement2);

        const variableName3 = `(@${key}`;
        const escapedVariableName3 = getEscapedVariable(variableName3);
        const pattern3 = new RegExp(escapedVariableName3, 'g');
        const replacement3 = `(var(--${key})`;
        newLess = newLess.replace(pattern3, replacement3);

        const variableName4 = `@${key} `;
        const escapedVariableName4 = getEscapedVariable(variableName4);
        const pattern4 = new RegExp(escapedVariableName4, 'g');
        const replacement4 = `var(--${key}) `;
        newLess = newLess.replace(pattern4, replacement4);
    });

    return newLess;
}

function getEscapedVariable(variableName: string): string {
    return variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export interface IDesignSystemTokens {
    description: string,
    themeName: string,
    color: Record<string, string>,
    global: Record<string, string>,
    typography: Record<string, string>,
}

export interface IDesignSystem {
    tokens: IDesignSystemTokens[]
}

interface IKeyValueToken {
    [x: string]: string
}

export interface IDarkLight {
    [theme: string]: IKeyValueToken
}



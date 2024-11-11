/// <mls shortName="configDsDefaultPreCompileLess" project="100554" enhancement="_blank" groupName="other" />

import { ITokens } from './_100554_libDesignSystem';

export class PreCompileLess {

    public execute(less: string, tokensLess: string, theme: string, tokens: ITokens[], prefix: ':host' | ':root', includeTokens: boolean = true): Promise<string> {

        try {
            const fullLess = `${tokensLess}\n${less}`;
            this.compileLess(fullLess);
            return this.preCompileLess(less, tokens, theme, prefix, includeTokens);

        } catch (err: any) {
            throw new Error(err.message);
        }

    }

    public async compileLess(str: string): Promise<string> {

        return new Promise((resolve, reject) => {
            if (!str || str.trim().length < 1) resolve('');
            const options = {
                compress: true,
                errorReporting: 'function'
            };

            mls.l2.less.compile(str).then(async (css) => {
                resolve(css);
            }).catch((err) => {
                reject(new Error('Error LESS: ' + err));
            });

            // (window as any)['less'].render(str, options)
            //     .then((output: any) => {
            //         resolve(output.css);
            //     }, (error: any) => {
            //         reject(new Error('Error LESS: ' + error));
            //     });
        });

    }

    private async preCompileLess(less: string, tokens: ITokens[], theme: string, prefix: ':host' | ':root', includeTokens: boolean): Promise<string> {
        let newLess = '';
        for (let tokenInfo of tokens) {
            if (tokenInfo.themeName !== theme) continue;
            const allTokens = { ...tokenInfo.color, ...tokenInfo.typography, ...tokenInfo.global };
            const darkAndLight = this.getDarkAndLight(allTokens);
            const cssVars = this.getCssVars(darkAndLight, prefix);
            newLess = this.replaceTokens(less, darkAndLight, cssVars, includeTokens);
        }
        return newLess;
    }

    private getDarkAndLight(allTokens: IKeyValueToken): IDarkLight {
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

    private getCssVars(themes: IDarkLight, prefix: ':host' | ':root') {

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
                // const cssFinal = `@media (prefers-color-scheme: dark) {\n\t${prefix}{\n\t${cssVars.join('\n\t')}\n}`;
                const cssFinal = `[data-theme="dark"] {\n\t${cssVars.join('\n\t')}\n}`;
                cssArr.push(cssFinal);

            }
        });

        return cssArr.join('\n');

    }

    private replaceTokens(less: string, themes: IDarkLight, cssVars: string, includeTokens: boolean) {

        const { root } = themes;
        if (!root) return less;

        let newLess: string;
        if (includeTokens) newLess = cssVars + '\n' + less;
        else newLess = less;

        Object.keys(root).forEach((key) => {

            const variableName = `@${key};`;
            const escapedVariableName = this.getEscapedVariable(variableName);
            const pattern = new RegExp(escapedVariableName, 'g');
            const replacement = `var(--${key});`;
            newLess = newLess.replace(pattern, replacement);

            const variableName2 = `@${key},`;
            const escapedVariableName2 = this.getEscapedVariable(variableName2);
            const pattern2 = new RegExp(escapedVariableName2, 'g');
            const replacement2 = `var(--${key}),`;
            newLess = newLess.replace(pattern2, replacement2);

            const variableName3 = `(@${key}`;
            const escapedVariableName3 = this.getEscapedVariable(variableName3);
            const pattern3 = new RegExp(escapedVariableName3, 'g');
            const replacement3 = `(var(--${key})`;
            newLess = newLess.replace(pattern3, replacement3);

            const variableName4 = `@${key} `;
            const escapedVariableName4 = this.getEscapedVariable(variableName4);
            const pattern4 = new RegExp(escapedVariableName4, 'g');
            const replacement4 = `var(--${key}) `;
            newLess = newLess.replace(pattern4, replacement4);
        });

        return newLess;
    }

    private getEscapedVariable(variableName: string): string {
        return variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}

interface IKeyValueToken {
    [x: string]: string
}

export interface IDarkLight {
    [theme: string]: IKeyValueToken
}

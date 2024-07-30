/// <mls shortName="configDsDefaultPreCompileLess" project="100554" enhancement="_blank" groupName="other" />
import { IThemes } from './_100554_configDsDefaultCommon';

export class PreCompileLess {

    public execute(less: string, tokensLess: string, tokens: mls.l3.ITokenInfo[], prefix: ':host' | ':root', includeTokens: boolean = true): Promise<string> {

        try {
            const fullLess = `${tokensLess}\n${less}`;
            this.compileLess(fullLess);
            return this.preCompileLess(less, tokens, prefix, includeTokens);

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

            (window as any)['less'].render(str, options)
                .then((output: any) => {
                    resolve(output.css);
                }, (error: any) => {
                    reject(new Error('Error LESS: ' + error));
                });
        });

    }

    private async preCompileLess(less: string, tokens: mls.l3.ITokenInfo[], prefix: ':host' | ':root', includeTokens: boolean): Promise<string> {
        const themes = this.getThemes(tokens);
        const cssVars = this.getCssVars(themes, prefix);
        const newLess = this.replaceTokens(less, themes, cssVars, includeTokens);
        return newLess;
    }

    private getThemes(tokens: mls.l3.ITokenInfo[]) {
        const themes: IThemes = {};

        tokens.forEach((token) => {
            const [theme] = token.key.split('-');
            let themeName = 'root';
            if (theme.startsWith('_')) themeName = theme.substring(1, theme.length);
            if (!themes[themeName]) themes[themeName] = [];
            themes[themeName].push(token);
            return theme;
        });

        return themes;
    }

    private getCssVars(themes: IThemes, prefix: ':host' | ':root') {

        const themesKeys = Object.keys(themes);
        const cssArr: string[] = [];

        themesKeys.forEach((key) => {

            if (key === 'root') {

                const cssVars:string[] = [];
                themes[key].forEach((token) => {
                    const tokenKey = token.key;
                    const cssVar = `--${tokenKey}: ${token.value};`;
                    cssVars.push(cssVar);
                });
                const cssFinal = `${prefix}{\n\t${cssVars.join('\n\t')}\n}`;
                cssArr.push(cssFinal);

            } else {

                const cssVars:string[] = [];
                themes[key].forEach((token) => {

                    const tokenKey = token.key.substring(1 + key.length + 1, token.key.length);
                    const cssVar = `--${tokenKey}: ${token.value};`;
                    cssVars.push(cssVar);
                });
                const cssFinal = `[data-theme="${key}"]{\n\t${cssVars.join('\n\t')}\n}`;
                cssArr.push(cssFinal);
            }

        });

        return cssArr.join('\n');

    }

    private replaceTokens(less: string, themes: IThemes, cssVars: string, includeTokens: boolean) {

        const { root } = themes;
        if (!root) return less;

        let newLess: string;
        if (includeTokens) newLess = cssVars + '\n' + less;
        else newLess = less;

        root.forEach((token) => {

            const variableName = `@${token.key};`;
            const escapedVariableName = this.getEscapedVariable(variableName);
            const pattern = new RegExp(escapedVariableName, 'g');
            const replacement = `var(--${token.key});`;
            newLess = newLess.replace(pattern, replacement);

            const variableName2 = `@${token.key},`;
            const escapedVariableName2 = this.getEscapedVariable(variableName2);
            const pattern2 = new RegExp(escapedVariableName2, 'g');
            const replacement2 = `var(--${token.key}),`;
            newLess = newLess.replace(pattern2, replacement2);

            const variableName3 = `(@${token.key}`;
            const escapedVariableName3 = this.getEscapedVariable(variableName3);
            const pattern3 = new RegExp(escapedVariableName3, 'g');
            const replacement3 = `(var(--${token.key})`;
            newLess = newLess.replace(pattern3, replacement3);

            const variableName4 = `@${token.key} `;
            const escapedVariableName4 = this.getEscapedVariable(variableName4);
            const pattern4 = new RegExp(escapedVariableName4, 'g');
            const replacement4 = `var(--${token.key}) `;
            newLess = newLess.replace(pattern4, replacement4);
        });

        return newLess;
    }

    private getEscapedVariable(variableName: string): string {
        return variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}
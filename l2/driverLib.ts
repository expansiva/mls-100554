/// <mls fileReference="_100554_/l2/driverLib.ts" group="other" enhancement="_100554_enhancementLit" />


export function myFetchQL(info: IFetchQl): Promise<{ status: number, ret: any }> {

    return new Promise<{ status: number, ret: any }>((resolve, reject) => {

        try {

            const body: { query: string, variables?: {} } = { query: info.query };

            if (info.variables) body.variables = info.variables;

            let status = 0;
            fetch(info.url, {
                method: info.method,
                headers: info.headers,
                body: JSON.stringify(body)

            }).then((r) => {
                status = r.status;
                return r.json();
            }).then((data) => {
                resolve({ status, ret: data });
            }).catch((e) => reject(e));

        } catch (er) {

            reject(er);

        }

    });

}

export function getMyKeysBranch(project: number, needVerifyBranch: boolean = false): { branch: string, owner: string, repo: string } {

    try {

        if (!mls.stor.projects[project]) throw new Error('Not found projectInfo:' + project);

        if (needVerifyBranch) {
            const uB = getBranchCurrent(project);
            if (uB) return { branch: uB.branch, owner: uB.owner, repo: uB.repo };
        }

        const obj = mls.l5.getProjectDetails(project);
        if (!obj || !obj.value) throw new Error('Error getProjectDetails in:' + project);

        const json = JSON.parse(obj.value);
        if (!json) throw new Error('Error getProjectDetails .value json in:' + project);

        let info = '';

        if (!json.projectURL && json.l5_actionPrjSettings) {

            info = json.l5_actionPrjSettings.projectURL;

        } else if (json.projectURL) {

            info = json.projectURL;

        } else {
            throw new Error('Error project info:' + project);
        }

        if (info.endsWith('/')) {
            info = info.substring(0, info.length - 1);
        }

        const array = info.split('/');

        if (array.length < 3) {
            throw new Error('Insufficient information to progress');
        }

        return { branch: array[array.length - 3], owner: array[array.length - 2], repo: array[array.length - 1] };

    } catch (e: any) {

        throw new Error('Error get info branch: ' + e.message);

    }

}

function getBranchCurrent(prj: number): { owner: string, repo: string, branch: string } | undefined {

    let str = localStorage.getItem('InfoCurrentDriver');
    if (!str) str = '{}';

    const info = JSON.parse(str);

    if (!info[prj]) return undefined;

    return info[prj] as any

}

//--------LIB---------------

export async function base64ToBlob(content: string, tp: string, name: string) {

    try {

        const byteCharacters = atob(content); // Decodifica a string base64
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        tp = getMimeType(tp);
        return new Blob([byteArray], { type: tp });

    } catch (e) {
        return content;
    }

}

export function fileToBase64(file: Blob | File): Promise<string> {

    return new Promise<string>((resolve, reject) => {

        if (!file) {
            reject(new Error('File not exist'));
            return;
        }

        const FR = new FileReader();

        FR.addEventListener("load", (evt: any) => {
            resolve(evt.target.result)
        });

        FR.readAsDataURL(file);

    });

}

export function base64EncodeUnicode(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        (match, p1) => {
            return String.fromCharCode(Number.parseInt('0x' + p1));
        }
    )
    );
}

export function base64DecodeUnicode(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str),
        (c: string) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
    );
}

function getMimeType(extension: string): string {

    const ext = extension.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'zip': 'application/zip',
        'mp4': 'video/mp4',
        'mp3': 'audio/mpeg',
        // Adicione mais tipos conforme necessário
    };

    return mimeTypes[ext || ''] || 'application/octet-stream'; // Padrão genérico
}
//---------------------------

interface IFetchQl {
    query: string,
    variables: any,

    url: string,
    method: string,
    headers: any

}
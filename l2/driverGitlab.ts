/// <mls shortName="driverGitlab" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import * as dL from '/_100554_/l2/driverLib.js';

let mKey = "";

export function init(initString: string) {
	mKey = atob(initString);
}

export class DriverGitLab extends mls.stor.others.DriverIOBase {

    public shortName: mls.cbe.Provider = 'gitlab';
    public project: number = 100554;
    public driverVersion: string = '1.0.0.2';

    constructor() {

        super();
        if (mls.istrace) console.info('gitDriver: ' + this.driverVersion);
		mKey = localStorage.getItem('keyGitLab') || mKey;

    }

    public getContents = (project: number, fileInfos: mls.stor.IFileInfo[]): Promise<mls.stor.IRegGetContents[]> => {
        return this._getContents(project, fileInfos);
    }

    public setContents = (project: number, fileInfos: mls.stor.IFileInfo[], comments: string | null): Promise<boolean> => {
        return this._setContents(project, fileInfos, comments);
    };

    public loadFilesInfo(project: number): Promise<mls.cbe.IPrjSourcesFiles[]> {
        return this._loadFilesInfo(project);
    }

    public getHistory(fileInfo: mls.stor.IFileInfo): Promise<mls.stor.IHistory[] | null> {
        return this._getHistoryIO(fileInfo)
    }

    public getHistoryContent(fileInfo: mls.stor.IFileInfo, ref: string): Promise<string | null> {
        return this._getHistoryContentIO(fileInfo, ref)
    }

    public getUrl(file: mls.stor.IFileInfo): string {
        return this._getUrl(file);
    }

    public getVersionFromFiles(options: { owner: string; repo: string; branchName: string; files: mls.stor.IFileInfo[]; }): Promise<{ [key: string]: string; } | undefined> {
        return this.getVersionFromFilesIO(options);
    }

    public checkBranchExistence(owner: string, repo: string, branchName: string): Promise<boolean> {
        return this.checkBranchExistenceIO(owner, repo, branchName);
    }

    public createNewBranch(option: { owner: string; repo: string; branch: string; newBranch: string; }): Promise<boolean> {
        return this.createNewBranchIO(option);
    }

    public createPullRequest(options: { owner: string; repo: string; title: string; branch: string; description: string; }): Promise<boolean> {
        return this.createPullRequestIO(options);
    }

    public reviewPullRequest(options: { owner: string; repo: string; branch: string; idRequest: string; isApproved: boolean; }): Promise<boolean> {
        return this.reviewPullRequestIO(options);
    }

    public listPullRequests(owner: string, repo: string): Promise<mls.stor.others.IPullRequest[]> {
        return this.listPullRequestsIO(owner, repo);
    }

    public listForks(owner: string, repo: string): Promise<mls.stor.others.IFork[]> {
        return this.listForksIO(owner, repo);
    }

    public listBranches(owner: string, repo: string): Promise<mls.stor.others.IBranch[]> {
        return this.listBranchesIO(owner, repo);
    }

    public getUserInfo(): Promise<mls.stor.others.IInfo> {
        return this.getUserInfoIO();
    }

    public getOrganizations(login: string): Promise<mls.stor.others.IOrg[]> {
        return this.getOrganizationsIO(login);
    }

    public createRepository(login: string, repo: string, organization: string, description: string, visibility: "PUBLIC" | "PRIVATE" | "INTERNAL"): Promise<boolean> {
        return this.createRepositoryIO(login, repo, organization, description, visibility);
    }

    public deleteRepository(repo: string, organization: string): Promise<boolean> {
        return this.deleteRepositoryIO(repo, organization);
    }

    public createFork(login: string, repoOri: string, orgOri: string, orgDest: string): Promise<boolean> {
        return this.createForkIO(login, repoOri, orgOri, orgDest);
    }

    public renameRepository(owner: string, repo: string, newName: string): Promise<boolean> {
        return this.renameRepositoryIO(owner, repo, newName);
    }

    public createFileInRepo(owner: string, repo: string, path: string, content: string | Uint8Array): Promise<boolean> {
        return this.createFileInRepoIO(owner, repo, path, content);
    }

    public changeVisibility(owner: string, repo: string, visibility: "PUBLIC" | "PRIVATE" | "INTERNAL"): Promise<boolean> {
        return this.changeVisibilityIO(owner, repo, visibility);
    }

    public verifyRepositoryNew(owner: string, repo: string, user: string): Promise<"free" | "reuse" | "wait" | "error"> {
        return this.verifyRepositoryNewIO(owner, repo, user);
    }

    public verifyPermission(owner: string, repo: string, login: string): Promise<mls.stor.others.IPermission> {
        return this.verifyPermissionIO(owner, repo, login);
    }

    public addVariable(name: string, value: string): Promise<boolean> {
        return this.addVariableIO(name, value);
    }

    public updateVariable(name: string, value: string): Promise<boolean> {
        return this.updateVariableIO(name, value);
    }

    public listVariables(): Promise<{ variables: { name: string; value: string; created_at: string; updated_at: string; }[]; total_count: number; }> {
        return this.listVariablesIO();
    }

    public delVariable(name: string): Promise<boolean> {
        return this.delVariableIO(name);
    }

    public checkFork(ownerOrigin: string, repoOrigin: string, login: string): Promise<boolean> {
        return this.checkForkIO(ownerOrigin, repoOrigin, login);
    }

    public syncFork(options: { repoOrigin: string, ownerOrigin: string, branchOrigin: string, repoDest: string, ownerDest: string, branchDest: string }): Promise<boolean> {
        return this.syncForkIO(options);
    }

    //---------IMPLEMENTS-----------

    private _getUrl(file: mls.stor.IFileInfo) {

        const { branch, owner, repo } = dL.getMyKeysBranch(file.project);

        if (!branch || !owner || !repo) return 'https://gitlab.com/';
        const url = `https://gitlab.com/${owner}/${repo}/-/blob/${branch}/l${file.level}${file.folder ? '/' + file.folder : ''}/${file.shortName}${file.extension}`;
        return url;

    }

    private async _getContents(project: number, fileInfos: mls.stor.IFileInfo[]): Promise<mls.stor.IRegGetContents[]> {

        try {

            return this.getContents2(fileInfos, []);

        } catch (e: any) {

            throw new Error('_getContents:' + e.message);

        }

    }

    private async getContents2(fileInfos: mls.stor.IFileInfo[], father: mls.stor.IRegGetContents[]) {

        if (fileInfos.length <= 0) return father;

        const r = await this.getContent(fileInfos[0]);
        father.push({
            fileInfo: fileInfos[0],
            content: r
        });

        if (fileInfos.length >= 1) {

            fileInfos.splice(0, 1);
            father = await this.getContents2(fileInfos, father);

        }

        return father;

    }

    private getContent(fileInfo: mls.stor.IFileInfo): Promise<string | Blob | null> {

        return new Promise<string | Blob | null>(async (resolve, reject) => {

            try {

                const auxLevel = fileInfo.level === 0 ? '' : `l${fileInfo.level}/`;
                const aux = fileInfo.folder === '' || fileInfo.folder.endsWith('/') ? '' : '/';
                const ext = fileInfo.extension ? fileInfo.extension : '.ts';
                const fileName = auxLevel + fileInfo.folder.replace(/\\/g, '/') + aux + fileInfo.shortName + ext;

                const ret = await this.getFilesIO(fileInfo.project, fileName);
                resolve(ret);

            } catch (e: any) {

                reject(new Error(e.message));

            }

        });

    }


    private _setContents = (project: number, fileInfos: mls.stor.IFileInfo[], comments: string | null): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {

            try {

                resolve(this.setContentsnew(fileInfos, comments));

            } catch (e: any) {

                reject(new Error(e.message));

            }
        }
        );
    };

    private async setContentsnew(fileInfos: mls.stor.IFileInfo[], comments: string | null) {

        if (fileInfos.length <= 0) return true;

        if (!comments) comments = '';

        let ret = false;
        const act: { action: string, path: string, content: string | Blob, needEncoding: boolean }[] = [];

        for await (const f of fileInfos) {

            const aux = f.folder === '' || f.folder.endsWith('/') ? '' : '/';
            const aux2 = f.extension.startsWith('.') ? '' : '.';
            const auxLevelPath = f.level === 0 ? '' : `l${f.level}/`;
            const path = `${auxLevelPath}` + f.folder.replace(/\\/g, '/') + aux + f.shortName + aux2 + f.extension;

            if (f.status === 'deleted') {

                act.push({ action: 'DELETE', path: path, content: '', needEncoding: false });

            } else if (['new'].includes(f.status)) {

                let cont = await this.verifyAndGetContent(f);
                let end = false;
                if (typeof cont !== 'string') {

                    cont = await dL.fileToBase64(cont as File);
                    [, cont] = cont.split('base64,');
                    end = true;
                }

                act.push({ action: 'CREATE', path: path, content: cont.replace(/(?:\r\n|\r|\n)/g, '\\n') as string, needEncoding: end });

            } else if (['changed', 'nochange'].includes(f.status)) {

                let cont = await this.verifyAndGetContent(f);
                let end = false;
                if (typeof cont !== 'string') {

                    cont = await dL.fileToBase64(cont as File);
                    [, cont] = cont.split('base64,');
                    end = true;
                }

                act.push({ action: 'UPDATE', path: path, content: cont.replace(/(?:\r\n|\r|\n)/g, '\\n') as string, needEncoding: end });

            } else if (f.getValueInfo && f.status === 'renamed') {

                let cont = await this.verifyAndGetContent(f);
                const info = await f.getValueInfo();
                const fileNameOld = `${auxLevelPath}` + f.folder.replace(/\\/g, '/') + aux + info.originalShortName + f.extension;
                let end = false;
                if (typeof cont !== 'string') {

                    cont = await dL.fileToBase64(cont as File);
                    [, cont] = cont.split('base64,');
                    end = true;

                } else cont = btoa(cont);

                act.push({ action: 'CREATE', path: path, content: cont.replace(/(?:\r\n|\r|\n)/g, '\\n') as string, needEncoding: end });
                act.push({ action: 'DELETE', path: fileNameOld, content: '', needEncoding: false });

            } else throw new Error('Status invalid');

        }

        ret = await this.saveMultipleFilesIO(fileInfos[0].project, act, comments);

        try {

            for await (const f of fileInfos) {

                if (f.onAction) {

                    await f.onAction('aftersave');

                }

            }

        } catch (e: any) {

            console.info('Erro onAftersace:' + e.message);

        }

        return ret;

    }

    private async verifyAndGetContent(fileInfo: mls.stor.IFileInfo) {

        const oldV = fileInfo.inLocalStorage;
        fileInfo.inLocalStorage = true;

        if (fileInfo.getValueInfo) {

            const cont = (await fileInfo.getValueInfo()).content;
            fileInfo.inLocalStorage = oldV;
            return cont;

        }

        const cont = await fileInfo.getContent();
        fileInfo.inLocalStorage = oldV;
        return cont;

    }


    private _loadFilesInfo(project: number): Promise<mls.cbe.IPrjSourcesFiles[]> {
        return new Promise<mls.cbe.IPrjSourcesFiles[]>((resolve, reject) => {
            try {

                let projectDriver = 'mls';
                let projectURL = '';

                const obj = mls.l5.getProjectDetails(project);
                if (!obj || !obj.value) throw new Error('Error loadFilesInfo getProjectDetails in:' + project);

                const json = JSON.parse(obj.value);
                if (!json) throw new Error('Error loadFilesInfo getProjectDetails .value json in:' + project);

                if (!json.projectURL && json.l5_actionPrjSettings) {

                    projectDriver = json.l5_actionPrjSettings.projectDriver || 'mls';
                    projectURL = json.l5_actionPrjSettings.projectURL || '';

                } else if (json.projectURL) {

                    projectDriver = json.projectDriver || 'mls';
                    projectURL = json.projectURL || '';

                } else {
                    throw new Error('Error loadFilesInfo project info:' + project);
                }

                (mls as any).stor.projects[project] = {
                    project,
                    projectDriver,
                    projectURL,
                };

                this.getFilesRepo(project).then((ret) => {

                    resolve(ret);

                }).catch((erro) => reject(erro));

            } catch (e: any) {
                reject(new Error(e.message));
            }

        });
    }

    private getFilesRepo(project: number): Promise<mls.cbe.IPrjSourcesFiles[]> {

        return new Promise<mls.cbe.IPrjSourcesFiles[]>(async (resolve, reject) => {

            try {

                const data = await this.getFilesRepoIO(project);
                let ret: mls.cbe.IPrjSourcesFiles[] = [];

                if (!data.data.project || !data.data.project.repository || !data.data.project.repository.tree || !data.data.project.repository.tree.blobs || !data.data.project.repository.tree.blobs.nodes) resolve(ret);

                if (data.data.project.repository.tree.blobs.nodes.length <= 0) resolve(ret);

                data.data.project.repository.tree.blobs.nodes.forEach((obj1: any) => {

                    const obj = {
                        shortPath: obj1.path,
                        versionRef: obj1.sha,
                        Length: 0,
                    };

                    ret.push(obj as any);

                });

                resolve(ret);

            } catch (e) {

                reject(e);

            }

        });

    }

    private async fecthQl(query: string, variables?: {}): Promise<{ status: number, ret: any }> {

        try {

            const info = {
                url: 'https://gitlab.com/api/graphql',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'bearer ' + mKey
                },
                query: query,
                variables: variables,
            }

            const dt = await dL.myFetchQL(info);

            if (dt.status !== 200) {
                throw new Error('Erro status: ' + dt.status + '; ' + dt.ret.message);
            }

            if (dt.ret.errors) {
                throw new Error('Erro' + dt.ret.errors[0].message);
            }

            return dt;

        } catch (er: any) {

            throw new Error('fecthQl:' + er.message);

        }

    }

    private myFetchGet(api: string): Promise<{ status: number, ret: any }> {

        return new Promise<{ status: number, ret: any }>((resolve, reject) => {

            try {

                let status = 0;
                fetch('https://gitlab.com/api/v4/' + api, {
                    method: 'Get',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'bearer ' + mKey
                    }

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

    //-------------IO----------------

    private _getHistoryContentIO(file: mls.stor.IFileInfo, ref: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {

            try {

                if (file.status === 'new') resolve('');//script%2Fteste%2Ets

                let filename = file.shortName + (file.extension.startsWith('.') ? file.extension : '.' + file.extension);
                const idProject = await this.getIDProject(file.project);

                filename = filename.replace(/\//g, '%2F').replace(/\./g, '%2E');
                const api = `projects/${idProject}/repository/files/${filename}/raw?ref=${ref}`;


                const ret = await this.myFetchGet(api);
                if (!ret.ret) resolve('');
                else resolve(ret.ret);

            } catch (e) {
                reject(e);
            }

        });

    }

    private _getHistoryIO(file: mls.stor.IFileInfo): Promise<mls.stor.IHistory[] | null> {
        return new Promise<mls.stor.IHistory[]>(async (resolve, reject) => {

            try {

                if (file.status === 'new') resolve([]);

                const filename = file.shortName + (file.extension.startsWith('.') ? file.extension : '.' + file.extension);
                const idProject = await this.getIDProject(file.project);
                const api = `projects/${idProject}/repository/commits?path=${filename}`;

                const data = await this.myFetchGet(api);
                if (data.ret.length <= 0) resolve([]);

                const ret: mls.stor.IHistory[] = [];

                data.ret.forEach((i: any) => {

                    const obj = {
                        authorName: i.author_name,
                        authorUrl: '',
                        data: i.created_at,
                        ref: i.id,
                        message: i.message,
                        additions: 0,
                        deletions: 0,

                    } as mls.stor.IHistory;

                    ret.push(obj);

                })

                resolve(ret);

            } catch (e) {
                reject(e);
            }

        });
    }

    private getFilesRepoIO(project: number): Promise<any> {

        return new Promise(async (resolve, reject) => {

            try {
                const info = await dL.getMyKeysBranch(project);

                const q = `query {
					project(fullPath: "${info.owner}/${info.repo}") {
						repository {
							tree(ref: "${info.branch}", recursive: true){
								blobs{
									nodes {
										name
										type
										path
										sha
									}
								}
							}
						}
					}
				}`;

                const data = await this.fecthQl(q);
                resolve(data.ret);


            } catch (e: any) {

                reject(new Error(e.message));
            }

        });

    }

    private saveMultipleFilesIO(project: number, action: { action: string, path: string, content: string | Blob, needEncoding: boolean }[], msg: string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            try {

                const info = await dL.getMyKeysBranch(project);

                const aAct: string[] = [];

                action.forEach((i) => {
                    const end = i.needEncoding ? ',encoding:BASE64' : '';
                    aAct.push(`{action: ${i.action}, filePath: "${i.path}", content:"${(i.content as string).replace(/\"/g, '\\"')}" ${end}}`);
                });

                const auxAct = aAct.length > 0 ? `actions: [ 	${aAct.join(', ')} ]` : '';
                if (auxAct === '') throw new Error('Erro building mutation save');

                const q = `mutation {
					commitCreate(input: {
							projectPath: "${info.owner}/${info.repo}", 
							branch: "${info.branch}", 
							message: "${msg}", 
							${auxAct}
						}) {
							commit {
								title
								authorName
								message
							}
							errors
						} 
					}`
                    ;

                const data = await this.fecthQl(q);

                const ret = data.ret.data && data.ret.data.commitCreate && data.ret.data.commitCreate.commit && data.ret.data.commitCreate.commit.authorName;

                resolve(ret);

            } catch (e: any) {

                reject(new Error(e.message));

            }

        });

    }


    private getFilesIO(project: number, fileName: string): Promise<string> {

        return new Promise(async (resolve, reject) => {

            try {

                const info = await dL.getMyKeysBranch(project);

                let ret = null;

                const q = `query {
					project(fullPath: "${info.owner}/${info.repo}") {
						repository {
							blobs(ref:"${info.branch}", paths: ["${fileName}"]) {
								nodes {
									rawBlob
								}
							}
						}
					}
				}`;

                const data = await this.fecthQl(q);

                if (!data.ret.data.project || !data.ret.data.project.repository || !data.ret.data.project.repository.blobs || !data.ret.data.project.repository.blobs.nodes
                    || !data.ret.data.project.repository.blobs.nodes[0]) {
                    reject(new Error('File not found:' + fileName));
                    return;
                }

                ret = data.ret.data.project.repository.blobs.nodes[0].rawBlob as string;
                resolve(ret);

            } catch (e: any) {

                reject(new Error(e.message));

            }

        });
    }

    private syncForkIO(opt: { repoOrigin: string, ownerOrigin: string, branchOrigin: string, repoDest: string, ownerDest: string, branchDest: string }): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!opt) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const prj = mls.actualProject;
                if (!prj) throw new Error('Not found project actual');

                const forkProjectId = await this.getIDProject(0, opt.ownerDest, opt.repoDest);

                const upstreamProjectId = await this.getIDProject(prj, opt.ownerDest, opt.repoDest);

                // Step 1: Create a merge request
                const createMRResponse = await fetch(
                    `https://gitlab.com/api/v4/projects/${forkProjectId}/merge_requests`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'PRIVATE-TOKEN': mKey
                        },
                        body: JSON.stringify({
                            source_branch: opt.branchOrigin,
                            target_branch: opt.branchOrigin,
                            title: 'Sync fork with upstream',
                            source_project_id: upstreamProjectId,
                            target_project_id: forkProjectId
                        })
                    }
                );

                const mergeRequest = await createMRResponse.json();
                console.log('Merge Request Created:', mergeRequest);

                if (!mergeRequest.iid) {
                    console.error('Failed to create merge request');
                    return;
                }

                // Step 2: Accept the merge request
                const acceptMRResponse = await fetch(
                    `https://gitlab.com/api/v4/projects/${forkProjectId}/merge_requests/${mergeRequest.iid}/merge`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'PRIVATE-TOKEN': mKey
                        }
                    }
                );

                const result = await acceptMRResponse.json();
                if (result) {
                    resolve(true);
                } else resolve(false);

            } catch (err) {

                reject(err);

            }

        });
    }

    private checkForkIO(ownerOrigin: string, repoOrigin: string, login: string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            try {

                const list = await this.listForksIO(ownerOrigin, repoOrigin);
                const f = list.find((fk) => fk.owner.login === login && fk.name === repoOrigin);

                resolve(!!f);

            } catch (err) {

                reject(err);

            }



        });

    }

    private delVariableIO(variable: string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!variable) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const prj = mls.actualProject;
                if (!prj) {
                    reject(new Error('Not Found project!'));
                    return;
                }

                const id = await this.getIDProject(prj);

                const retFetch = await fetch(`https://gitlab.com/api/v4/projects/${id}/variables/${variable}`, {
                    method: 'DELETE',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                });

                if (retFetch.status !== 200) {
                    resolve(false);
                    return;
                }

                const ret = await retFetch.json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });

    }

    private listVariablesIO(): Promise<{ variables: { name: string, value: string, created_at: string, updated_at: string }[], total_count: number }> {

        return new Promise<{ variables: { name: string, value: string, created_at: string, updated_at: string }[], total_count: number }>(async (resolve, reject) => {

            try {

                const prj = mls.actualProject;
                if (!prj) {
                    reject(new Error('Not Found project!'));
                    return;
                }

                const id = await this.getIDProject(prj);

                const retFetch = await fetch(`https://gitlab.com/api/v4/projects/${id}/variables/`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                });

                if (retFetch.status !== 200) {
                    reject(new Error('ERROR: status:' + retFetch.status));
                    return;
                }

                const j = await retFetch.json();

                if (j && j.message) {
                    reject(new Error(j.message));
                    return;
                }

                const ret = {
                    variables: [],
                    total_count: 0
                } as any;

                if (j.length && j.length >= 1) {
                    ret.total_count = j.length;

                    j.forEach((i: any) => {

                        ret.variables.push(
                            {
                                name: i.key,
                                value: i.value,
                                created_at: '',
                                updated_at: ''
                            }
                        );

                    });
                }

                resolve(ret);

            } catch (err) {

                reject(err);

            }

        });

    }

    private updateVariableIO(variable: string, secret: string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!variable || !secret) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const prj = mls.actualProject;
                if (!prj) {
                    reject(new Error('Not Found project!'));
                    return;
                }


                const id = await this.getIDProject(prj);

                const body = {
                    value: secret,
                    protected: false,
                    masked: false
                };

                const retFetch = await fetch(`https://gitlab.com/api/v4/projects/${id}/variables/${variable}`, {
                    method: 'PUT',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(body)
                });

                if (retFetch.status !== 200) {
                    resolve(false);
                    return;
                }

                const ret = await retFetch.json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });

    }

    private addVariableIO(newVariable: string, secret: string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!newVariable || !secret) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const prj = mls.actualProject;
                if (!prj) {
                    reject(new Error('Not Found project!'));
                    return;
                }


                const id = await this.getIDProject(prj);

                const body = {
                    key: newVariable,
                    value: secret,
                    protected: false,
                    masked: false
                };

                const retFetch = await fetch(`https://gitlab.com/api/v4/projects/${id}/variables`, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(body)
                });

                if (retFetch.status === 404) {
                    resolve(false);
                    return;
                }

                if (retFetch.status === 403) {
                    resolve(false);
                    return;
                }

                const ret = await retFetch.json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });

    }

    private verifyPermissionIO(owner: string, repo: string, login: string): Promise<mls.stor.others.IPermission> {

        return new Promise<mls.stor.others.IPermission>(async (resolve, reject) => {

            if (!repo || !owner || !login) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, owner, repo);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/members/all`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                if (ret && ret.error) {
                    reject(new Error(ret.error));
                    return;
                }

                const info = {
                    create: false,
                    delete: false,
                    write: false,
                    read: false,

                } as mls.stor.others.IPermission;

                if (ret.length <= 0) {
                    resolve(info);
                    return;
                }

                ret.forEach((member: any) => {
                    if (member.username !== login) return;

                    switch (member.access_level) {
                        case 10:
                            info.create = false;
                            info.delete = false;
                            info.write = false;
                            info.read = true;
                            break;
                        case 20:
                            info.create = false;
                            info.delete = false;
                            info.write = true;
                            info.read = true;
                            break;
                        case 30:
                            info.create = true;
                            info.delete = true;
                            info.write = true;
                            info.read = true;
                            break;
                        case 40:
                            info.create = true;
                            info.delete = true;
                            info.write = true;
                            info.read = true;
                            break;
                        case 50:
                            info.create = true;
                            info.delete = true;
                            info.write = true;
                            info.read = true;
                            break;
                        default:
                            info.create = false;
                            info.delete = false;
                            info.write = false;
                            info.read = false;
                    }
                });

                resolve(info);

            } catch (err) {

                reject(err);

            }

        });

    }

    private verifyRepositoryNewIO(owner: string, repo: string, user: string): Promise<'free' | 'reuse' | 'wait' | 'error'> {

        return new Promise<'free' | 'reuse' | 'wait' | 'error'>(async (resolve, reject) => {

            if (!repo || !owner || !user) {
                reject(new Error('Information invalid!'));
                return;
            }

            // retorno
            // free: free to create the repository
            // reuse: The repository already exists for the user, you can reuse it
            // wait: Please wait, another user is creating; 
            // error: There is a repository, but I was unable to validate the user

            try {

                const id = await this.getIDProject(0, owner, repo);

                if (!id) {
                    resolve('free');
                    return;
                }

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/repository/files/validate.json/raw?ref=main`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                })).json();

                try {

                    const js = ret;

                    if (!js.users) {
                        resolve('error');
                        return;
                    }

                    if (js.users.includes(user)) {
                        resolve('reuse');
                        return;

                    }

                    resolve('wait');
                    return;

                } catch {
                    resolve('error');
                    return;
                }

            } catch (err) {

                reject(err);

            }

        });

    }

    private changeVisibilityIO(owner: string, repo: string, visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!owner || !repo) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, owner, repo);

                const obj = {
                    visibility: visibility.toLocaleLowerCase(),
                };

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}`, {
                    method: 'PUT',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(obj)
                })).json();

                if (!ret) {
                    reject(new Error("Erro alter visibility project"));
                    return;
                }

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });
    }

    private getVersionFromFilesIO(options: { owner: string; repo: string; branchName: string; files: mls.stor.IFileInfo[]; }): Promise<{ [key: string]: string; } | undefined> {
        return new Promise<{ [key: string]: string } | undefined>(async (resolve, reject) => {

            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual')
            const uB = await dL.getMyKeysBranch(prj);

            let auxStr = '';

            options.files.forEach((f) => {

                const aux = f.folder === '' || f.folder.endsWith('/') ? '' : '/';
                const aux2 = f.extension.startsWith('.') ? '' : '.';
                const auxLevelPath = f.level === 0 ? '' : `l${f.level}/`;
                const path = `${auxLevelPath}` + f.folder.replace(/\\/g, '/') + aux + f.shortName + aux2 + f.extension;


                if (!auxStr) auxStr = `"${path}"`;
                else auxStr = `${auxStr}, "${path}"`;

            });

            if (!auxStr) reject(new Error('Not found str'));
            auxStr = `[${auxStr}]`;

            const q = `
                query  {
                    project(fullPath: "${uB.owner}/${uB.repo}") {
                        repository {
                        blobs(ref: "${uB.branch}", paths: ${auxStr}) {
                            nodes {
                                id
                                path
                                name
                                oid
                                
                                }
                            }
                        }
                    }
                }
			`;

            this.fecthQl(q).then((data) => {

                try {

                    if (!data.ret || !data.ret.data.project || !data.ret.data.project.repository || !data.ret.data.project.repository.blobs || !data.ret.data.project.repository.blobs.nodes) resolve(undefined);

                    const ret: any = {};

                    options.files.forEach((f) => {

                        const keyv = mls.stor.getKeyToFiles(f.project, f.level, f.shortName, f.folder, f.extension);
                        const aux2 = f.extension.startsWith('.') ? '' : '.';
                        const nf = f.shortName + aux2 + f.extension;

                        const ff: any = data.ret.data.project.repository.blobs.nodes.find((i: any) => i.name === nf);

                        if (!ff) return;

                        ret[keyv] = ff.oid;

                    });

                    resolve(ret);

                } catch (err: any) {

                    reject(err);

                }

            }).catch((e: Error) => {

                reject(e);

            });

        });
    }

    private createFileInRepoIO(owner: string, repo: string, path: string, content: string | Uint8Array): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            try {
                if (typeof (content) !== 'string') throw new Error('Not implemented');

                const q = `mutation {
					commitCreate(input: {
							projectPath: "${owner}/${repo}", 
							branch: "main", 
							message: "Add ${path}", 
							actions: [
								{action: CREATE, filePath: "${path}", content:"${content.replace(/\"/g, '\\"')}"}
								
							]
						}) {
							commit {
								title
								authorName
								message
							}
							errors
						} 
					}
				`;

                const data = await this.fecthQl(q);

                const ret = data.ret.data && data.ret.data.commitCreate && data.ret.data.commitCreate.commit && data.ret.data.commitCreate.commit.authorName;

                resolve(!!ret);

            } catch (e: any) {

                reject(new Error(e.message));

            }

        });
    }

    private renameRepositoryIO(owner: string, repo: string, newName: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            try {

                if (!repo || !owner || repo === newName) {
                    reject(new Error('Information invalid!'));
                    return;
                }

                const obj = {
                    name: newName,
                    path: newName
                }

                const id = await this.getIDProject(0, owner, repo);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}`, {
                    method: 'PUT',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(obj)
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });
    }

    private createForkIO(login: string, repoOri: string, orgOri: string, orgDest: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            try {

                const obj = {
                    namespace: orgDest,
                }

                const id = await this.getIDProject(0, orgOri, repoOri);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/fork`, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(obj)
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });
    }

    private deleteRepositoryIO(repo: string, organization: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            if (!organization || !repo) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, organization, repo);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}`, {
                    method: 'DELETE',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (!ret) {
                    reject(new Error("Erro delet project"));
                    return;
                }

                if (ret && ret.message && ret.message.indexOf('Accepted') <= 0) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });
    }

    private createRepositoryIO(login: string, repo: string, organization: string, description: string, visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            try {

                const obj = {
                    name: repo,
                    visibility: visibility.toLocaleLowerCase(),
                } as any;

                if (login === organization) {
                    obj.namespace = organization;

                } else {
                    obj.namespace_id = organization;
                }

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects`, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(obj)
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                if (ret && ret.error) {
                    reject(new Error(ret.error));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });

    }

    private getOrganizationsIO(login: string): Promise<mls.stor.others.IOrg[]> {

        return new Promise<mls.stor.others.IOrg[]>(async (resolve, reject) => {

            try {

                const ret = await (await fetch(`https://gitlab.com/api/v4/groups`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (!ret) {
                    reject(new Error("Get list groups"));
                    return;
                }

                const pr: mls.stor.others.IOrg[] = [];

                ret.forEach((i: any) => {

                    const obj = {
                        name: i.path,
                        id: i.id,
                        avatarUrl: '',
                        visibility: i.visibility
                    };

                    pr.push(obj);

                });

                resolve(pr);

            } catch (err) {

                reject(err);

            }

        });


    }

    private getUserInfoIO(): Promise<mls.stor.others.IInfo> {
        return new Promise<mls.stor.others.IInfo>(async (resolve, reject) => {

            try {

                const ret = await (await fetch(`https://gitlab.com/api/v4/user`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                };

                resolve({
                    name: ret.name,
                    login: ret.username,
                    avatarUrl: ret.avatar_url
                });

            } catch (err) {

                reject(err);

            }

        });
    }

    private listBranchesIO(owner: string, repo: string): Promise<mls.stor.others.IBranch[]> {
        return new Promise<mls.stor.others.IBranch[]>(async (resolve, reject) => {

            if (!owner || !repo) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, owner, repo);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/repository/branches/`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (!ret) {
                    reject(new Error("Get list branch"));
                    return;
                }

                const pr: mls.stor.others.IBranch[] = [];

                ret.forEach((i: any) => {

                    const obj = {
                        name: i.name
                    }

                    pr.push(obj)

                });

                resolve(pr);

            } catch (err) {

                reject(err);

            }

        });
    }

    private listForksIO(owner: string, repo: string): Promise<mls.stor.others.IFork[]> {

        return new Promise<mls.stor.others.IFork[]>(async (resolve, reject) => {

            if (!owner || !repo) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, owner, repo);


                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/forks`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                const pr: mls.stor.others.IFork[] = [];

                ret.forEach((i: any) => {

                    const obj = {
                        nameWithOwner: i.path_with_namespace,
                        name: i.path,
                        owner: { login: i.namespace.full_path },
                        defaultBranchRef: { name: i.default_branch },
                        createdAt: i.created_at
                    }

                    pr.push(obj)

                });

                resolve(pr);

            } catch (err) {

                reject(err);

            }

        });

    }

    private listPullRequestsIO(owner: string, repo: string): Promise<mls.stor.others.IPullRequest[]> {

        return new Promise<mls.stor.others.IPullRequest[]>(async (resolve, reject) => {

            if (!owner || !repo) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, owner, repo);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/merge_requests`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                const pr: mls.stor.others.IPullRequest[] = [];

                ret.forEach((i: any) => {

                    const obj = {
                        id: i.iid,
                        title: i.title,
                        url: i.web_url,
                        body: i.description,
                        state: i.state,
                        mergedAt: i.merged_at,
                        closedAt: i.closed_at,
                        createdAt: i.created_at,
                        author: {
                            login: i.author.username
                        }
                    }

                    pr.push(obj)

                });

                resolve(pr);

            } catch (err) {

                reject(err);

            }

        });

    }

    private reviewPullRequestIO(options: { owner: string, repo: string, idRequest: string, isApproved: boolean, }): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!options) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, options.owner, options.repo);

                let q = `https://gitlab.com/api/v4/projects/${id}/merge_requests/${options.idRequest}/merge`;
                let mt = 'POST';

                if (!options.isApproved) {
                    q = `https://gitlab.com/api/v4/projects/${id}/merge_requests/${options.idRequest}`;
                    mt = 'DELETE';
                }

                const ret = await (await fetch(q, {
                    method: mt,
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });

    }

    private createPullRequestIO(option: { owner: string, repo: string, branch: string, title: string, description: string }): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            if (!option) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const prj = mls.actualProject;
                if (!prj) throw new Error('Not found project actual')
                //const info = await this.getMyKeysBranch(project);
                const id = await this.getIDProject(0, option.owner, option.repo);
                const uB = await dL.getMyKeysBranch(prj, true);

                const obj = {
                    source_branch: uB.branch,
                    target_branch: option.branch,
                    title: option.title,
                    description: option.description
                }

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/merge_requests`, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(obj)
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });
    }

    private createNewBranchIO(option: { owner: string, repo: string, branch: string, newBranch: string }): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            if (!option.owner || !option.repo || !option.newBranch) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, option.owner, option.repo);
                const lastCommit = await this.getLastCommitFromInfo(option.owner, option.repo, option.branch, id);

                const obj = {
                    branch: option.newBranch,
                    ref: lastCommit
                }

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/repository/branches`, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(obj)
                })).json();

                if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });
    }

    private checkBranchExistenceIO(owner: string, repo: string, branchName: string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            if (!owner || !repo || !branchName) {
                reject(new Error('Information invalid!'));
                return;
            }

            try {

                const id = await this.getIDProject(0, owner, repo);

                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${id}/repository/branches/${branchName}`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (ret && ret.message.indexOf('404') >= 0) {

                    resolve(false);

                } else if (ret && ret.message) {
                    reject(new Error(ret.message));
                    return;
                }

                resolve(true);

            } catch (err) {

                reject(err);

            }

        });

    }


    private getLastCommitFromInfo(owner: string, repo: string, branch: string, projectId: string): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {

            try {
                const ret = await (await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/commits?ref_name=${branch}&per_page=1`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + mKey,
                    },
                    referrerPolicy: 'no-referrer'
                })).json();

                if (ret && ret.length === 0) {
                    reject(new Error("Get last commit"));
                    return;
                }

                resolve(ret[0].id);

            } catch (err) {

                reject(err);

            }

        });
    }

    private getIDProject(project: number, owner: string = '', repo: string = ''): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {

            let info = {} as any;

            if (project && project != 0) {
                info = await dL.getMyKeysBranch(project);
            } else {
                info.owner = owner;
                info.repo = repo;
            }


            const query = `
				query {
					project(fullPath: "${info.owner}/${info.repo}") {
						id
						
					}
				}
			`;

            try {

                const data = await this.fecthQl(query);

                if (!data.ret || !data.ret.data.project || !data.ret.data.project.id) resolve('');

                const k = data.ret.data.project.id.split('/');
                if (k.length <= 0) {
                    reject(new Error('Error not found id project'));
                    return;
                }
                else resolve(k[k.length - 1]);

            } catch (err) {

                reject(err);

            }

        });

    }
}
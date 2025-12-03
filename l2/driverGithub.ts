/// <mls shortName="driverGithub" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import * as dL from '/_100554_/l2/driverLib.js';

let mKey = (window as any)['mKey'] || "";

export function init(initString: string) {
	(window as any)['mKey'] = atob(initString);
}

export class DriverGitHub extends mls.stor.others.DriverIOBase {

	public shortName: mls.cbe.Provider = 'github';
	public project: number = 100554;
	public driverVersion: string = '1.0.0.3';

	constructor() {

		super();
		if (mls.istrace) console.info('gitDriver: ' + this.driverVersion);
		mKey = localStorage.getItem('keyGitHub') || mKey;

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
		return this._getHistory(fileInfo)
	}

	public getHistoryContent(fileInfo: mls.stor.IFileInfo, ref: string): Promise<string | null> {
		return this._getHistoryContent(fileInfo, ref)
	}

	public getUrl(file: mls.stor.IFileInfo): string {
		return this._getUrl(file);
	}

	public getVersionFromFiles(options: { owner: string; repo: string; branchName: string; files: mls.stor.IFileInfo[]; }): Promise<{ [key: string]: string; } | undefined> {
		return this.getVersionFromFilesIO(options);
	}

	public checkBranchExistence(owner: string, repo: string, branchName: string): Promise<boolean> {
		throw this.checkBranchExistenceIO(owner, repo, branchName);
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

	public setPermissionAction(owner: string, repo: string, login: string): Promise<boolean> {
		return this.setPermissionActionIO(owner, repo, login);
	}

	public addVariable2(owner: string, repo: string, name: string, value: string): Promise<boolean> {
		return this.addVariableIO2(owner, repo, name, value);
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

		if (!branch || !owner || !repo) return 'https://github.com/';
		let url = `https://github.com/${owner}/${repo}/blob/${branch}/l2/${file.shortName}${file.extension}`;
		if (file.folder) url = `https://github.com/${owner}/${repo}/blob/${branch}/l2/${file.folder}/${file.shortName}${file.extension}`;
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

		const r = await this.getContent3(fileInfos[0]);
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

	private getContent3(fileInfo: mls.stor.IFileInfo): Promise<string | Blob | null> {

		return new Promise<string | Blob | null>(async (resolve, reject) => {

			try {

				const auxLevel = fileInfo.level === 0 ? '' : `l${fileInfo.level}/`;
				const aux = fileInfo.folder === '' || fileInfo.folder.endsWith('/') ? '' : '/';
				const ext = fileInfo.extension ? fileInfo.extension : '.ts';
				const fileName = auxLevel + fileInfo.folder.replace(/\\/g, '/') + aux + fileInfo.shortName + ext;

				let ret: any = '';

				if (['.html', '.ts', '.test.ts', '.defs.ts', '.css', '.txt', '.json', '.md', '.js', '.less'].includes(ext)) {

					ret = await this.getFilesIO(fileInfo.project, fileName);

				} else {

					ret = await this.getFilesRestIO(fileInfo.project, fileInfo.versionRef, fileInfo.extension);

				}
				resolve(ret);

			} catch (e: any) {

				reject(new Error(e.message));

			}

		});

	}

	private async _setContents(project: number, fileInfos: mls.stor.IFileInfo[], comments: string | null): Promise<boolean> {
		const ret = await this.processFiles(project, fileInfos, comments || 'update git');
		return true;
		/*try {
			
			return this.setContents2(fileInfos, comments);

		} catch (e: any) {

			throw new Error(e.message);

		}*/

	}

	private async setContents2(fileInfos: mls.stor.IFileInfo[], comments: string | null) {

		if (fileInfos.length <= 0) return true;

		let ret = false;
		let add: { path: string, content: string | Blob }[] = [];
		let del: { path: string }[] = [];

		for await (const f of fileInfos) {

			const aux = f.folder === '' || f.folder.endsWith('/') ? '' : '/';
			const aux2 = f.extension.startsWith('.') ? '' : '.';
			const auxLevelPath = f.level === 0 ? '' : `l${f.level}/`;
			const path = `${auxLevelPath}` + f.folder.replace(/\\/g, '/') + aux + f.shortName + aux2 + f.extension;

			if (f.status === 'deleted') {

				del.push({ path });

			} else if (['changed', 'new', 'nochange'].includes(f.status)) {

				add = await this.setContentAddFile(f, path, add);

			} else if (f.status === 'renamed') {

				const info = f.getValueInfo ? await f.getValueInfo() : undefined;

				if (!info) continue;

				const fileNameOld = `${auxLevelPath}` + f.folder.replace(/\\/g, '/') + aux + info.originalShortName + f.extension;

				add = await this.setContentAddFile(f, path, add);
				del.push({ path: fileNameOld });

			} else throw new Error('Status invalid');

		}

		try {

			ret = await this.saveMultipleFilesIO(fileInfos[0].project, add, del, comments as string);

			//await this.afterSave(fileInfos);

			return ret;

		} catch (e: any) {

			throw new Error('Error:' + e.message);

		}

	}

	private async afterSave(fileInfos: mls.stor.IFileInfo[]) {

		try {

			for await (const f of fileInfos) {

				if (f.onAction) {

					await f.onAction('aftersave');

				}

			}

		} catch (e: any) {

			console.info('Erro onAftersave:' + e.message);

		}
	}

	private async setContentAddFile(
		f: mls.stor.IFileInfo,
		path: string,
		add: { path: string, content: string | Blob }[]):
		Promise<{ path: string, content: string | Blob }[]> {

		let cont = await this.verifyAndGetContent(f);

		if (typeof cont !== 'string') {

			cont = await dL.fileToBase64(cont as File);
			[, cont] = cont.split('base64,');

		} else cont = dL.base64EncodeUnicode(cont);//btoa(cont);

		add.push({ path, content: cont as string });

		return add;

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


	private async _loadFilesInfo(project: number): Promise<mls.cbe.IPrjSourcesFiles[]> {
		return new Promise<any[]>(async (resolve, reject) => {

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

				const ret = await this.getFilesRepo(project);
				resolve(ret);

			} catch (e: any) {
				reject(new Error(e.message));
			}

		});
	}

	private getFilesRepo(project: number): Promise<mls.cbe.IPrjSourcesFiles[]> {

		return new Promise<mls.cbe.IPrjSourcesFiles[]>(async (resolve, reject) => {

			try {

				const data = await this.getFilesRepoIO(project);
				let ret: any[] = [];

				if (!data.data.repository.object) resolve(ret);

				if (data.data.repository.object.entries.length <= 0) resolve(ret);

				data.data.repository.object.entries.forEach((obj1: any) => {

					ret = this.auxLoadFilesInfo2Reenter(obj1, ret);

				});
				resolve(ret);

			} catch (e) {

				reject(e);

			}

		});

	}

	private auxLoadFilesInfo2Reenter(obj: any, arr: any[]): any[] {

		if (!obj.object || !obj.object.entries) {

			if (obj.type === 'blob') {

				arr.push(
					{
						shortPath: 'l0/' + obj.name,
						versionRef: obj.oid,
						Length: obj.size,
					}
				);

			}

			return (arr);
		}

		obj.object.entries.forEach((obj2: any) => {

			if (obj2.type === 'blob') {

				arr.push(
					{
						shortPath: obj2.path.startsWith('l') ? obj2.path : 'l0/' + obj2.path,
						versionRef: obj2.oid,
						Length: obj2.size,
					}
				);

			} else {

				this.auxLoadFilesInfo2Reenter(obj2, arr);

			}

		});

		return (arr);
	}


	private _getHistory(file: mls.stor.IFileInfo): Promise<mls.stor.IHistory[]> {
		return new Promise<mls.stor.IHistory[]>(async (resolve, reject) => {

			try {

				if (file.status === 'new') resolve([]);

				let filename = file.shortName + (file.extension.startsWith('.') ? file.extension : '.' + file.extension);
				if (file.folder) filename = file.folder + '/' + filename;
				const oid = file.versionRef;
				const data = await this.getHistoryIO(file.project, file.level.toString(), filename, oid);
				if (data.length <= 0) resolve([]);

				const ret: mls.stor.IHistory[] = [];

				data.forEach((i: any) => {

					if (!i.node.file) return;
					const obj = {
						authorName: i.node.author.name,
						authorUrl: i.node.author.avatarUrl,
						data: i.node.authoredDate,
						ref: i.node.file.object.oid,
						message: i.node.message,
						additions: i.node.additions,
						deletions: i.node.deletions,

					} as mls.stor.IHistory;

					ret.push(obj);

				})

				resolve(ret);

			} catch (e) {
				reject(e);
			}

		});

	}

	private _getHistoryContent(file: mls.stor.IFileInfo, ref: string): Promise<string> {
		return new Promise<string>(async (resolve, reject) => {

			try {

				if (file.status === 'new') resolve('');

				const ret = await this.getHistoryContentIO(file.project, ref);
				resolve(ret);

			} catch (e) {
				reject(e);
			}

		});

	}

	private async fecthQl(query: string, variables?: {}): Promise<{ status: number, ret: any }> {

		try {

			this.verifyMKey();

			const info = {
				url: 'https://api.github.com/graphql',
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

			if (dt.status === 401) {
				throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
			}

			if (dt.status !== 200) {
				throw new Error('Erro status: ' + dt.status + '; ' + dt.ret.message);
			}

			if (dt.ret.errors) {
				throw new Error('Erro' + dt.ret.errors[0].message);
			}

			return dt;

		} catch (er: any) {

			throw new Error('fecthQl: ' + er.message);

		}



	}

	//-------------IO----------------


	private async githubRequest(path: string, method: string, token: string, body?: any) {
		return fetch(`https://api.github.com${path}`, {
			method,
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'bearer ' + mKey,
			},
			referrerPolicy: 'no-referrer',
			body: body ? JSON.stringify(body) : undefined,
		}).then(r => r.json());
	}

	private async getSha(owner: string, repo: string, path: string, token: string) {
		const res = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
			{

				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'bearer ' + mKey,
				},
				referrerPolicy: 'no-referrer'
			}
		);

		if (res.status === 404) return null;
		return await res.json();
	}

	private async saveFile(info: {
		token: string,
		owner: string,
		repo: string,
		path: string,
		content: string,
		message: string,
		branch: string,
		file: mls.stor.IFileInfo
	}) {


		const body: any = {
			message: info.message,
			branch: info.branch,
			content: info.content,
		};

		if ( !['new',  'renamed'].includes(info.file.status)) {
			const sha = await this.getSha(info.owner, info.repo, info.path, info.token);
			body.sha = sha.sha;

		}

		return this.githubRequest(
			`/repos/${info.owner}/${info.repo}/contents/${info.path}`,
			"PUT",
			info.token,
			body
		);
	}


	private async deleteFile({
		token,
		owner,
		repo,
		path,
		message,
		branch = "main"
	}: any) {
		const existing = await this.getSha(owner, repo, path, token);
		if (!existing) throw new Error("File not found");
		await this.githubRequest(
			`/repos/${owner}/${repo}/contents/${path}`,
			"DELETE",
			token,
			{
				message,
				sha: existing.sha,
				force: true,
				branch,
			}
		);
		return true;
	}

	private async processFiles(project:number, files: mls.stor.IFileInfo[], coments:string) {

		const parallelLimit = 1;

		this.verifyMKey();

		const info = await dL.getMyKeysBranch(project, true);

		// Lista expandida de tarefas atômicas
		const expandedTasks: {
			type: "update" | "delete";
			path: string;
			originalFile: mls.stor.IFileInfo;
		}[] = [];

		// ----- 1) EXPANSÃO -----
		for (const file of files) {
			const folderAux = file.folder === "" || file.folder.endsWith("/") ? "" : "/";
			const extAux = file.extension.startsWith(".") ? "" : ".";
			const levelPath = file.level === 0 ? "" : `l${file.level}/`;

			const newPath =
				levelPath +
				file.folder.replace(/\\/g, "/") +
				folderAux +
				file.shortName +
				extAux +
				file.extension;

			if (file.status === "deleted") {
				expandedTasks.push({ type: "delete", path: newPath, originalFile: file });
				continue;
			}

			if (file.status === "new" || file.status === "changed") {
				expandedTasks.push({ type: "update", path: newPath, originalFile: file });
				continue;
			}

			if (file.status === "renamed") {
				const oldInfo = await (file.getValueInfo?.() ?? undefined);
				if (!oldInfo) continue;

				const oldPath =
					levelPath +
					file.folder.replace(/\\/g, "/") +
					folderAux +
					oldInfo.originalShortName +
					extAux +
					file.extension;

				expandedTasks.push({ type: "delete", path: oldPath, originalFile: file });
				expandedTasks.push({ type: "update", path: newPath, originalFile: file });
				continue;
			}

			throw new Error(`Status invalid: ${file.status}`);
		}

		// ----- 2) FUNÇÕES ADIADAS -----
		const deferredTasks: (() => Promise<any>)[] = expandedTasks.map(task => {
			return async () => {

				if (task.type === "delete") {
					return this.deleteFile({
						token: mKey,
						owner: info.owner,
						repo: info.repo,
						branch: info.branch,
						path: task.path,
						message: coments
					});
				}

				// update
				let cont = await this.verifyAndGetContent(task.originalFile);

				if (typeof cont !== "string") {
					cont = await dL.fileToBase64(cont as File);
					[, cont] = cont.split("base64,");
				} else {
					cont = dL.base64EncodeUnicode(cont);
				}

				return this.saveFile({
					token: mKey,
					owner: info.owner,
					repo: info.repo,
					branch: info.branch,
					path: task.path,
					content: cont,
					message: coments,
					file: task.originalFile
				});
			};
		});

		// ----- 3) EXECUÇÃO EM BATCHES (interrompe ao 1º erro) -----
		const results: any[] = [];

		for (let i = 0; i < deferredTasks.length; i += parallelLimit) {

			const batchFns = deferredTasks.slice(i, i + parallelLimit);

			// executa o batch em paralelo
			const promises = batchFns.map(fn => fn());

			const settled = await Promise.allSettled(promises);

			// registrar e detectar erro
			for (let j = 0; j < settled.length; j++) {
				const idx = i + j;
				const file = expandedTasks[idx].originalFile;
				const s = settled[j];

				if (s.status === "fulfilled") {
					results.push({ file, status: "fulfilled", value: s.value });
				} else {
					results.push({ file, status: "rejected", reason: s.reason });

					// 🔥 PARA TUDO → lança erro imediatamente
					throw new Error(
						`Error in file ${file.shortName}: ${s.reason?.message || s.reason}`
					);
				}
			}
		}

		// ----- 4) Tudo OK -----
		return results;
	}


	public syncForkIO(opt: { repoOrigin: string, ownerOrigin: string, branchOrigin: string, repoDest: string, ownerDest: string, branchDest: string }): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!opt) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				if (!opt.branchDest) opt.branchDest = 'main';

				let body = {} as any;

				this.verifyMKey();

				const ret1 = await (await fetch(`https://api.github.com/repos/${opt.ownerOrigin}/${opt.repoOrigin}/git/refs/heads/${opt.branchOrigin}`, {
					method: 'GET',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer'
				})).json();

				if (ret1 && ret1.message) {
					reject(new Error(ret1.message));
					return;
				}

				const sha = ret1.object.sha;

				if (!sha) {
					resolve(false);
					return;
				}

				body = {
					sha: sha,
					force: true
				} as any;


				const ret2 = await fetch(`https://api.github.com/repos/${opt.ownerDest}/${opt.repoDest}/git/refs/heads/${opt.branchDest}`, {
					method: 'PATCH',
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

				if (![200, 201, 204].includes(ret2.status)) {
					resolve(false);
					return;
				}

				resolve(true);

			} catch (err) {

				reject(err);

			}

		});
	}

	public checkForkIO(ownerOrigin: string, repoOrigin: string, login: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			const query = `query {
						user(login: "${login}") {
							repositories(first: 100, isFork: true) {
								nodes {
									name
									nameWithOwner
									parent {
										nameWithOwner
									}
								}
							}
						}
					}`
				;

			this.fecthQl(query).then((data) => {

				try {

					if (!data.ret || !data.ret.data.user || !data.ret.data.user.repositories || !data.ret.data.user.repositories.nodes) resolve(false);

					let ret = false;
					const nameWithOwner = `${ownerOrigin}/${repoOrigin}`;
					data.ret.data.user.repositories.nodes.forEach((n: any) => {
						if (n.parent.nameWithOwner === nameWithOwner) ret = true;
					});

					resolve(ret);

				} catch (err) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private delVariableIO(variable: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!variable) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				const prj = mls.actualProject;
				if (!prj) {
					reject(new Error('Not Found project!'));
					return;
				}

				const info = await dL.getMyKeysBranch(prj);

				const retFetch = await fetch(`https://api.github.com/repos/${info.owner}/${info.repo}/actions/variables/${variable}`, {
					method: 'DELETE',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer',
				});

				if (retFetch.status === 401) {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

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

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private listVariablesIO(): Promise<{ variables: { name: string, value: string, created_at: string, updated_at: string }[], total_count: number }> {

		return new Promise<{ variables: { name: string, value: string, created_at: string, updated_at: string }[], total_count: number }>(async (resolve, reject) => {

			try {

				this.verifyMKey();

				const prj = mls.actualProject;
				if (!prj) {
					reject(new Error('Not Found project!'));
					return;
				}

				const info = await dL.getMyKeysBranch(prj);

				const retFetch = await fetch(`https://api.github.com/repos/${info.owner}/${info.repo}/actions/variables`, {
					method: 'GET',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer',
				});

				if (retFetch.status !== 200) {
					reject(new Error('Not Found! : status:' + retFetch.status));
					return;
				}

				const ret = await retFetch.json();

				if (ret && ret.message) {
					reject(new Error(ret.message));
					return;
				}

				resolve(ret as any);

			} catch (err: any) {

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

				this.verifyMKey();

				const prj = mls.actualProject;
				if (!prj) {
					reject(new Error('Not Found project!'));
					return;
				}

				const info = await dL.getMyKeysBranch(prj)

				const body = {
					name: variable,
					value: secret
				};

				const retFetch = await fetch(`https://api.github.com/repos/${info.owner}/${info.repo}/actions/variables/${variable}`, {
					method: 'PATCH',
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

				if (retFetch.status === 401) {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

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

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private addVariableIO2(owner: string, repo: string, newVariable: string, secret: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!newVariable || !secret) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				const body = {
					name: newVariable,
					value: secret
				};

				const retFetch = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/variables`, {
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

				if (retFetch.status === 401) {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

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

			} catch (err: any) {

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

				this.verifyMKey();

				const prj = mls.actualProject;
				if (!prj) {
					reject(new Error('Not Found project!'));
					return;
				}

				const info = await dL.getMyKeysBranch(prj)

				const body = {
					name: newVariable,
					value: secret
				};

				const retFetch = await fetch(`https://api.github.com/repos/${info.owner}/${info.repo}/actions/variables`, {
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

				if (retFetch.status === 401) {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

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

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private setPermissionActionIO(owner: string, repo: string, login: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!repo || !owner) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				const url = `https://api.github.com/repos/${owner}/${repo}/actions/permissions/workflow`;

				const retFetch = await fetch(url, {
					method: 'PUT',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					body: JSON.stringify({
						enabled: true,
						default_workflow_permissions: 'write',
						allowed_actions: 'all',
						can_approve_pull_request_reviews: true
					}),
					referrerPolicy: 'no-referrer',
				});

				if (![200, 204].includes(retFetch.status)) {
					throw new Error(`Error: set permission action`);
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

				this.verifyMKey();

				const retFetch = await fetch(`https://api.github.com/repos/${owner}/${repo}/collaborators/${login}/permission`, {
					method: 'GET',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer',
				});

				if (retFetch.status === 401) {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

				if (retFetch.status === 404) {
					resolve({
						create: false,
						delete: false,
						write: false,
						read: false,

					});
					return;
				}

				if (retFetch.status === 403) {
					resolve({
						create: false,
						delete: false,
						write: false,
						read: true,

					});
					return;
				}

				const ret = await retFetch.json();

				if (ret && ret.message) {
					reject(new Error(ret.message));
					return;
				}

				if (!ret || !ret.user || !ret.user.permissions) {
					reject(new Error('Not found your permissions'));
					return;
				}

				const info = {
					create: false,
					delete: false,
					write: false,
					read: false,

				} as mls.stor.others.IPermission;

				if (ret.user.permissions.admin || ret.user.permissions.maintain) {
					info.create = true;
					info.delete = true;
					info.write = true;
					info.read = true;

				} else if (ret.user.permissions.push) {
					info.create = false;
					info.delete = false;
					info.write = true;
					info.read = true;
				} else if (ret.user.permissions.triage || ret.user.permissions.pull) {
					info.create = false;
					info.delete = false;
					info.write = false;
					info.read = true;
				}

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

				this.verifyMKey();

				const retRepo = await (await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
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

				if (retRepo && retRepo.name && retRepo.name !== 'mls-new') {
					resolve('free');
					return;
				}

				if (retRepo.status === '401') {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

				if (retRepo && retRepo.message && retRepo.status === '404') {
					resolve('free');
					return;
				}

				const ret = await (await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/validate.json?ref=main`, {
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

				if (ret.status === '401') {
					throw new Error(`Conecte no "gitHub", faça SignIn no "gitHub" para permitir salvar nos repositórios<br/>É importante salvar nos repositórios para permitir históricos e evitar perca de dados.`);
				}

				if (ret && ret.message && ret.status === '404') {
					resolve('error');
					return;
				}

				if (ret && ret.content) {

					try {

						const txt = atob(ret.content);
						const js = JSON.parse(txt.trim());

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

				}

				resolve('free');

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private changeVisibilityIO(owner: string, repo: string, visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!repo || !owner) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				const body = {
					private: visibility === 'PRIVATE'
				};

				const ret = await (await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
					method: 'PATCH',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer',
					body: JSON.stringify(body)
				})).json();

				if (ret && ret.message) {
					reject(new Error(ret.message));
					return;
				}

				resolve(true);

			} catch (err: any) {

				reject(err);

			}

		});
	}

	private createFileInRepoIO(owner: string, repo: string, path: string, content: string | Uint8Array): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {

			if (!repo || !owner) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				if (typeof (content) !== 'string') throw new Error('Not implemented');
				content = dL.base64EncodeUnicode(content);

				const body = {
					message: 'Add ' + path,
					content
				};

				const ret = await (await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
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

	private renameRepositoryIO(owner: string, repo: string, newName: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!repo || !owner || repo === newName) {
				reject(new Error('Information invalid!'));
				return;
			}

			const body = {
				name: newName
			};

			try {

				this.verifyMKey();

				const ret = await (await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
					method: 'PATCH',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer',
					body: JSON.stringify(body)
				})).json();

				if (ret && ret.message) {
					reject(new Error(ret.message));
					return;
				}

				resolve(true);

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private createForkIO(login: string, repoOri: string, orgOri: string, orgDest: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!repoOri || !orgOri) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				let body = {} as any;

				if (login !== orgDest) {
					body.organization = orgDest;
				}

				const ret = await (await fetch(`https://api.github.com/repos/${orgOri}/${repoOri}/forks`, {
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
				})).json();

				if (ret && ret.message) {
					reject(new Error(ret.message));
					return;
				}

				// Set option delete_branch_on_merge
				const ret2 = await (await fetch(`https://api.github.com/repos/${orgDest}/${repoOri}`, {
					method: 'PATCH',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'bearer ' + mKey,
					},
					referrerPolicy: 'no-referrer',
					body: JSON.stringify({ delete_branch_on_merge: true })
				})).json();

				if (ret2 && ret2.message) {
					reject(new Error(ret.message));
					return;
				}

				resolve(true);

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private deleteRepositoryIO(repo: string, organization: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			if (!repo || !organization) {
				reject(new Error('Information invalid!'));
				return;
			}

			try {

				this.verifyMKey();

				const ret = await fetch(`https://api.github.com/repos/${organization}/${repo}`, {
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

				if (ret.status !== 204) {
					reject(new Error('Error delete repository'));
					return;
				}

				resolve(true);

			} catch (err: any) {

				reject(err);

			}

		});

	}

	private createRepositoryIO(login: string, repo: string, organization: string, description: string, visibility: "PUBLIC" | "PRIVATE" | "INTERNAL"): Promise<boolean> {

		return new Promise<boolean>((resolve, reject) => {

			if (!repo || !organization) {
				reject(new Error('Information invalid!'));
				return;
			}

			if (!description) description = "This project was created using the Collabcodes";

			let q = '';

			if (login === organization) {

				q = `
				mutation {
					createRepository(input: {name: "${repo}", description: "${description.replace(/"/g, "'")}", visibility:${visibility}}) {
						repository {
							id
							name
							owner {
								login
							}
						}
					}
				}
				`;

			} else {
				q = `
				mutation {
					createRepository(input: {name: "${repo}", ownerId:"${organization}", description: "${description.replace(/"/g, "'")}", visibility:${visibility}}) {
						repository {
							id
							name
							owner {
								login
							}
						}
					}
				}
				`;
			}

			this.fecthQl(q).then(async (data) => {

				try {

					if (!data.ret || !data.ret.data.createRepository || !data.ret.data.createRepository.repository || !data.ret.data.createRepository.repository.id) reject(new Error('Erro not possible add repository'));

					resolve(true);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private getOrganizationsIO(login: string): Promise<mls.stor.others.IOrg[]> {

		return new Promise<mls.stor.others.IOrg[]>(async (resolve, reject) => {

			if (!login) {
				reject(new Error('Login invalid!'));
				return;
			}

			const q = `
			{
				user(login: "${login}") {
					organizations(first: 100) {
						edges {
							node {
								name
								login
								avatarUrl
								id
							}
						}
					}
				}
			}
			`;

			this.fecthQl(q).then((data) => {

				try {

					const orgs: mls.stor.others.IOrg[] = [];
					if (!data.ret || !data.ret.data.user || !data.ret.data.user.organizations || !data.ret.data.user.organizations.edges) resolve(orgs);

					data.ret.data.user.organizations.edges.forEach((i: any) => {

						const info = {} as mls.stor.others.IOrg;

						info.name = i.node.login;
						info.id = i.node.id;
						info.avatarUrl = i.node.avatarUrl;
						info.visibility = 'public';

						orgs.push(info);

					});

					resolve(orgs);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});
	}

	private getUserInfoIO(): Promise<mls.stor.others.IInfo> {

		return new Promise<mls.stor.others.IInfo>(async (resolve, reject) => {

			const q = `
			{
				viewer {
					name
					login
					avatarUrl
				}
			}
			`;

			this.fecthQl(q).then((data) => {

				try {
					const info = {} as mls.stor.others.IInfo;
					if (!data.ret || !data.ret.data.viewer) resolve(info);

					info.name = data.ret.data.viewer.name;
					info.login = data.ret.data.viewer.login;
					info.avatarUrl = data.ret.data.viewer.avatarUrl;

					resolve(info);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});
	}

	private listBranchesIO(owner: string, repo: string): Promise<mls.stor.others.IBranch[]> {

		return new Promise<mls.stor.others.IBranch[]>(async (resolve, reject) => {

			const q = `
			{
                repository(owner:"${owner}", name:"${repo}") {
                refs(refPrefix: "refs/heads/", first: 100) {
                    edges {
                    node {
                        name
                    }
                    }
                    
                }
                }
            }
			`;

			this.fecthQl(q).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.refs ||
						!data.ret.data.repository.refs.edges) resolve([]);

					const b: mls.stor.others.IBranch[] = [];

					data.ret.data.repository.refs.edges.forEach((i: any) => {
						b.push(i.node);
					});

					resolve(b);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});
	}

	private listForksIO(owner: string, repo: string): Promise<mls.stor.others.IFork[]> {

		return new Promise<mls.stor.others.IFork[]>(async (resolve, reject) => {

			//const info = await this.getMyKeysBranch(project);

			const q = `
			{
				repository(owner:"${owner}", name:"${repo}") {
					forks(first: 100) {
						edges {
							node {
								nameWithOwner
								defaultBranchRef{
									name

								}
								createdAt
							}
						}

					}
				}
			}
			`;

			this.fecthQl(q).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.forks ||
						!data.ret.data.repository.forks.edges) resolve([]);

					const fk: mls.stor.others.IFork[] = [];
					data.ret.data.repository.forks.edges.forEach((i: any) => {
						fk.push(i.node);
					});

					resolve(fk);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});
	}

	private listPullRequestsIO(owner: string, repo: string): Promise<mls.stor.others.IPullRequest[]> {

		return new Promise<mls.stor.others.IPullRequest[]>(async (resolve, reject) => {

			const qLastCommit = `{
					repository(owner:"${owner}", name:"${repo}") {
						pullRequests(states: OPEN, first: 100) {
							edges {
								node {
									id
									title
									body
									state
									url
									createdAt
									mergedAt
							    closedAt
									author {
										login
									}
								}
							}
						}
					}
				}`;

			this.fecthQl(qLastCommit).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.pullRequests ||
						!data.ret.data.repository.pullRequests.edges) resolve([]);

					const pr: mls.stor.others.IPullRequest[] = [];

					data.ret.data.repository.pullRequests.edges.forEach((i: any) => {

						pr.push(i.node);

					});

					resolve(pr);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private reviewPullRequestIO(options: { owner: string, repo: string, idRequest: string, isApproved: boolean }): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			try {

				let q = '';

				if (options.isApproved) {

					q = `
					mutation {
						addPullRequestReview(input: {pullRequestId: "${options.idRequest}", event: APPROVE}) {
							pullRequestReview {
								id
								state
							}
						}
					}
				`;

				} else {

					q = `
					mutation() {
							closePullRequest(input: {pullRequestId: "${options.idRequest}"}) {
								pullRequest {
									id
									state
								}
							}
						}
					`;

				}

				const data = await this.fecthQl(q);

				const ret = !data.ret.data || !data.ret.data.addPullRequestReview;

				resolve(!ret);

			} catch (e: any) {

				reject(new Error(e.message));

			}

		});

	}

	private createPullRequestIO(option: { owner: string, repo: string, branch: string, title: string, description: string }): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			try {

				const project = mls.actualProject;
				if (!project) throw new Error('Not set project actual');

				const uB = dL.getMyKeysBranch(project);

				const idProject = await this.getIdProjectIO(0, uB.owner, uB.repo);

				let head = uB.owner !== option.owner ? `${option.owner}:${option.branch}` : option.branch;

				const q = `
					mutation {
						createPullRequest(input: {
							baseRefName:"${uB.branch}",
							headRefName: "${head}",
							title: "${option.title.replace(/"/g, "'")}",
							body: "${option.description.replace(/"/g, "'")}",
							repositoryId: "${idProject}"
						}) {
							pullRequest {
								id
								url
							}
						}
					}
				`;

				const data = await this.fecthQl(q);

				const ret = !data.ret.data || !data.ret.data.createPullRequest || !data.ret.data.createPullRequest.pullRequest || !data.ret.data.createPullRequest.pullRequest || !data.ret.data.createPullRequest.pullRequest.id;

				resolve(!ret);

			} catch (e: any) {

				reject(new Error(e.message));

			}

		});

	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private createNewBranchIO(option: { owner: string, repo: string, branch: string, newBranch: string }): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			try {

				const idProject = await this.getIdProjectIO(0, option.owner, option.repo);
				let oid = await this.getOidLastCommitFromInfoIO(option.owner, option.repo, option.branch);

				let test = 0;

				if (!oid) {
					while (test !== 2 && !oid) {
						oid = await this.getOidLastCommitFromInfoIO(option.owner, option.repo, option.branch);
						test++;
						await this.sleep(200);
					}
				}

				if (!oid) {
					reject('Not found oid');
					return;
				}

				const q = `
					mutation {
						 createRef(input: {repositoryId: "${idProject}", name: "refs/heads/${option.newBranch}", oid: "${oid}"}) {
							ref {
								id
								name
							}
						}
					}
				`;

				const data = await this.fecthQl(q);

				const ret = !data.ret.data || !data.ret.data.createRef || !data.ret.data.createRef.ref || !data.ret.data.createRef.ref.id;

				resolve(!ret);

			} catch (e: any) {

				reject(new Error(e.message));

			}

		});

	}

	private checkBranchExistenceIO(owner: string, repo: string, branchName: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			const qLastCommit = `{
					repository(owner:"${owner}", name:"${repo}") {
						ref(qualifiedName: "${branchName}") {
							id
						}
					}
				}`;

			this.fecthQl(qLastCommit).then((data) => {

				try {

					if (!data.ret || !data.ret.data.repository || !data.ret.data.repository.ref || !data.ret.data.repository.ref.id) resolve(false);
					resolve(true);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private getHistoryContentIO(project: number, oid: string): Promise<string> {

		return new Promise<string>(async (resolve, reject) => {

			const info = await dL.getMyKeysBranch(project);
			const query = `
				query {
					repository(owner:"${info.owner}", name: "${info.repo}") {
						object(oid: "${oid}") {
							
							... on Blob {
								
								byteSize
								id
								oid
								text
								
							}	
						}	
					}
				}`;

			this.fecthQl(query).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.object || !data.ret.data.repository.object.text) resolve('');

					resolve(data.ret.data.repository.object.text);

				} catch (err) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private getFilesIO(project: number, fileName: string): Promise<string> {

		return new Promise(async (resolve, reject) => {

			try {

				const info = dL.getMyKeysBranch(project);

				let ret = null;

				const q = `query {
					repository(owner:"${info.owner}", name:"${info.repo}") {
						object(expression: "HEAD:${fileName}") {	
							... on Blob {
								byteSize
								oid
								text
							}	
						}	
					}
				}`;

				const data = await this.fecthQl(q);

				if (!data.ret.data.repository || !data.ret.data.repository.object) {
					reject(new Error('File not found:' + fileName));
					return;
				}

				ret = data.ret.data.repository.object.text as string;
				resolve(ret);

			} catch (e: any) {

				reject(new Error(e.message));

			}

		});
	}


	private async getFilesRestIO(project: number, oid: string, extension: string): Promise<Blob> {

		const info = await dL.getMyKeysBranch(project);

		try {

			this.verifyMKey();
			const ret = await (await fetch(`https://api.github.com/repos/${info.owner}/${info.repo}/git/blobs/${oid}`, {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'bearer ' + mKey,
				},
				referrerPolicy: 'no-referrer'
			})).json();

			const b64 = ret && ret.content ? ret.content : 'Erro';
			if (!b64 || b64 === 'Erro') return b64;

			const blob = await dL.base64ToBlob(b64, extension, oid);
			return blob as any;

		} catch (e: any) {

			return e.message;

		}

	}

	private verifyMKey() {
		if (!mKey) throw new Error('Please connect to github!')
	}

	private saveMultipleFilesIO(project: number, add: { path: string, content: string | Blob }[], del: { path: string }[], msg: string): Promise<boolean> {

		return new Promise<boolean>(async (resolve, reject) => {

			try {

				const info = await dL.getMyKeysBranch(project, true);

				const oid = await this.getOidLastCommitIO(project);

				const aAdd: string[] = [];
				const aDel: string[] = [];

				add.forEach((i) => {
					aAdd.push(`{path: "${i.path}", contents: "${i.content}"}`);
				});

				del.forEach((i) => {
					aDel.push(`{path: "${i.path}"}`);
				});

				const auxAdd = aAdd.length > 0 ? `additions: [ 	${aAdd.join(', ')} ]` : '';
				const auxDel = aDel.length > 0 ? `deletions: [ 	${aDel.join(', ')} ]` : '';

				if (auxAdd === '' && auxDel === '') {
					resolve(true);
					return;
				}

				const q = `mutation {
					createCommitOnBranch(
						input: {
							fileChanges: {
								${auxAdd === '' ? '' : auxAdd + ', '}
								${auxDel}
							}, 
							branch: {
								repositoryNameWithOwner: "${info.owner}/${info.repo}", 
								branchName: "${info.branch}"
							}, 
							expectedHeadOid: "${oid}", 
							message: {headline: "${msg.replace(/"/g, "'")}", body: "${msg.replace(/"/g, "'")}"}
						}
					) {
						commit {
							abbreviatedOid
						}
					}
				}`;

				const data = await this.fecthQl(q);

				const ret = data.ret.data && data.ret.data.createCommitOnBranch && data.ret.data.createCommitOnBranch.commit && data.ret.data.createCommitOnBranch.commit.abbreviatedOid;

				resolve(ret);

			} catch (e: any) {

				reject(new Error(e.message));

			}

		});

	}


	private getFilesRepoIO(project: number): Promise<any> {

		return new Promise(async (resolve, reject) => {

			try {

				const info = await dL.getMyKeysBranch(project);

				let aux = '';

				for (let i = 0; i < 4; i++) {
					aux = aux + `
                        ... on TreeEntry{
                            object{
                                # Top-level.
                                ... on Tree {
                                    entries {
                                        name
                                        oid
                                        path
                                        type	
                                        size
                    
                    `
				}
				for (let i = 0; i < 4; i++) {
					aux = aux + `
                                }
                            }
                        }
                    }
                    `
				}

				const q = `query repository {
					repository(owner:"${info.owner}", name:"${info.repo}") {
							object(expression: "HEAD:") {
								# Top-level.
								... on Tree {
									entries {
										name
										oid
										path
										type
										size	
										${aux}
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

	private getHistoryIO(project: number, nivel: string, fileName: string, oid: string): Promise<any[]> {

		return new Promise<any[]>(async (resolve, reject) => {
			const info = await dL.getMyKeysBranch(project);
			const query = `
			query {
				repository(owner: "${info.owner}", name: "${info.repo}") {
					
					ref(qualifiedName: "main") {
						target {
							... on Commit {
								history(first: 20, path:"l${nivel}/${fileName}", before:"${oid}") {
									pageInfo {
										hasNextPage
										endCursor
									}
									edges {
										node {
											additions
              				deletions
											author{
												avatarUrl
												name
											}
											authoredDate
											message
											
											file(path:"l${nivel}/${fileName}"){
												object{
													... on Blob {
														oid

													}	
												}
											}
											
											
										}
									}
								}
							}
						}
					}
				}
			}`;

			this.fecthQl(query).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.ref || !data.ret.data.repository.ref.target ||
						!data.ret.data.repository.ref.target.history.edges) resolve([]);

					resolve(data.ret.data.repository.ref.target.history.edges);

				} catch (err) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private getVersionFromFilesIO(options: { owner: string, repo: string, branchName: string, files: mls.stor.IFileInfo[] }): Promise<{ [key: string]: string } | undefined> {

		return new Promise<{ [key: string]: string } | undefined>(async (resolve, reject) => {

			let auxStr = '';

			options.files.forEach((f) => {

				const aux = f.folder === '' || f.folder.endsWith('/') ? '' : '/';
				const aux2 = f.extension.startsWith('.') ? '' : '.';
				const auxLevelPath = f.level === 0 ? '' : `l${f.level}/`;
				const path = `${auxLevelPath}` + f.folder.replace(/\\/g, '/') + aux + f.shortName + aux2 + f.extension;
				const key = '_' + (mls.stor.getKeyToFiles(f.project, f.level, f.shortName, f.folder, f.extension).replace(/\./g, ''));

				auxStr = `
                    ${auxStr}
                    ${key}: object(expression: "${options.branchName}:${path}") {
                        ... on Blob {
                            oid
                        }
                    }
				`

			});

			if (!auxStr) reject(new Error('Not found str'));

			const q = `
                query {
                    repository(owner: "${options.owner}", name: "${options.repo}") {
                        ${auxStr}
                    }
                }
			`;

			this.fecthQl(q).then((data) => {

				try {

					if (!data.ret || !data.ret.data.repository) resolve(undefined);

					const ret: any = {};

					options.files.forEach((f) => {

						const keyv = mls.stor.getKeyToFiles(f.project, f.level, f.shortName, f.folder, f.extension);
						const key = '_' + (keyv.replace(/\./g, ''));

						if (data.ret.data.repository[key]) ret[keyv] = data.ret.data.repository[key].oid;

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

	private getOidLastCommitFromInfoIO(owner: string, repo: string, branch: string): Promise<string> {

		return new Promise<string>(async (resolve, reject) => {

			const qLastCommit = `{
					repository(owner:"${owner}", name:"${repo}") {
						ref(qualifiedName: "${branch}") {
							target {
								... on Commit {
									history(first: 1) {
										nodes {
											oid
										}
									}
								}
							}
						}
					}
				}`;

			this.fecthQl(qLastCommit).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.ref ||
						!data.ret.data.repository.ref.target.history.nodes) resolve('');
					const lastCommit = data.ret.data.repository.ref.target.history.nodes[0].oid;
					resolve(lastCommit);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private getIdProjectIO(project: number, owner: string = '', repo: string = ''): Promise<string> {

		return new Promise<string>(async (resolve, reject) => {

			let info

			if (!project) info = { owner, repo }
			else info = await dL.getMyKeysBranch(project);

			const qLastCommit = `{
					repository(owner:"${info.owner}", name:"${info.repo}") {
						id
					}
				}`;

			this.fecthQl(qLastCommit).then((data) => {

				try {

					if (!data.ret || !data.ret.data.repository || !data.ret.data.repository.id) resolve('');
					resolve(data.ret.data.repository.id);

				} catch (err: any) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}

	private getOidLastCommitIO(project: number, getCurrentBranch: boolean = true): Promise<string> {

		return new Promise<string>(async (resolve, reject) => {

			const info = await dL.getMyKeysBranch(project, getCurrentBranch);

			const qLastCommit = `{
					repository(owner:"${info.owner}", name:"${info.repo}") {
						ref(qualifiedName: "${info.branch}") {
							target {
								... on Commit {
									history(first: 1) {
										nodes {
											oid
										}
									}
								}
							}
						}
					}
				}`;

			this.fecthQl(qLastCommit).then((data) => {

				try {

					if (
						!data.ret ||
						!data.ret.data.repository.ref ||
						!data.ret.data.repository.ref.target.history.nodes) resolve('');
					const lastCommit = data.ret.data.repository.ref.target.history.nodes[0].oid;
					resolve(lastCommit);

				} catch (err) {

					reject(err);

				}

			}).catch((e: Error) => {

				reject(e);

			});

		});

	}
}
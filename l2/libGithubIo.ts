/// <mls shortName="libGithubIo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export async function updateFieldSelectProjects(req: IReq, idProject: string, idItem:string, idField:string, idOption:string): Promise<boolean>{

    try {

        if (!req.owner || !req.repo || !idProject) throw new Error('Not found owner project')

        const q = `
                mutation {
                    updateProjectV2ItemFieldValue(
                    input: {
                        projectId: "${idProject}"
                        itemId: "${idItem}"
                        fieldId: "${idField}"
                        value: { 
                        singleSelectOptionId: "${idOption}"        
                        }
                    }
                    ) {
                    projectV2Item {
                        id
                    }
                    }
                }

            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret) {
            return false;
        }

        return true;
            
    } catch (e) {
        console.info(e);
        return false;
    }
    
}

export async function getIssuesInProjects(req: IReq, idProject: string): Promise<IItemProject[]>{

    try {

        if (!req.owner || !req.repo || !idProject) throw new Error('Not found owner project')

        const q = `
                query {
                    node(id: "${idProject}") {
                        ... on ProjectV2 {
                            items(last: 100) {
                                nodes {
                                    id
                                    content {
                                        ... on Issue {
                                            title
                                            id
                                            number
                                            url
                                            createdAt
                                            assignees(first: 10) {
                                                nodes {
                                                    login
                                                    avatarUrl
                                                }
                                            }
                                        }
                                    }
                                    fieldValues(first: 100) {
                                        nodes {
                                            ... on ProjectV2ItemFieldTextValue {
                                                text
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        name
                                                        id
                                                    }
                                                }
                                            }
                                            ... on ProjectV2ItemFieldDateValue {
                                                date
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        name
                                                        id
                                                    }
                                                }
                                            }
                                            ... on ProjectV2ItemFieldSingleSelectValue {
                                                name
                                                optionId
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        name
                                                        id
                                                    }
                                                }
                                            }

                                            ... on ProjectV2ItemFieldNumberValue {
                                                number
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        name
                                                        id
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

            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret || !ret.node || !ret.node.items || !ret.node.items.nodes) {
            return [];
        }

        const itens: IItemProject[] = [];


        const getMyField = (fv: any[]):IItemProjectValues[] => {

            const ret:IItemProjectValues[] = [];

            fv.forEach((ifv) => {

                const nfv = {} as IItemProjectValues
                if (ifv.text) {
                    nfv.value = ifv.text;
                    nfv.valueText = ifv.text;
                } else if (ifv.number) {
                    nfv.value = ifv.number;
                    nfv.valueText = ifv.number;
                } else if (ifv.name && ifv.optionId) {
                    nfv.value = ifv.optionId;
                    nfv.valueText = ifv.name;
                } else if (ifv.name && !ifv.optionId) {
                    nfv.value = ifv.name;
                    nfv.valueText = ifv.name;
                }

                nfv.fieldName = ifv.field ? ifv.field.name : '';
                nfv.fieldId = ifv.field ? ifv.field.id : '';

                if (nfv.value) ret.push(nfv);
                
            });

            const find = ret.find((f) => f.fieldName.toLowerCase() === 'status');

            if (!find) {

                ret.push({
                    value: 'nostatus',
                    fieldName: 'Status',
                    fieldId: '',
                    valueText: 'No status'
                });
                
            }

            return ret;
            
        }

        ret.node.items.nodes.forEach((i: any) => {


            if (!i) return;
            const item = {} as IItemProject;
            item.id = i.id;
            item.title = i.content.title;
            item.issueId = i.content.id;
            item.createdAt = i.content.createdAt;
            item.issueNumber = i.content.number;
            item.url = i.content.url;
            item.assignees = i.content.assignees && i.content.assignees.nodes ? i.content.assignees.nodes : [];
            item.fieldValues = getMyField(i.fieldValues.nodes);

            itens.push(item);

        });

        return itens;

    } catch (e) {
        console.info(e);
        return [];
    }
    
}

export async function getProjectFields(req: IReq, idProject:string): Promise<IFieldsProject[]> { 

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        const q = `
                query{
                    node(id: "${idProject}") {
                        ... on ProjectV2 {
                            fields(first: 20) {
                                nodes {
                                    ... on ProjectV2Field {
                                        id
                                        name
                                        dataType
                                    }
                                    ... on ProjectV2IterationField {
                                        id
                                        name
                                        dataType
                                    }
                                    ... on ProjectV2SingleSelectField {
                                        id
                                        name
                                        dataType
                                        options {
                                            id
                                            name
                                                        
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret || !ret.node || !ret.node.fields || !ret.node.fields.nodes) {
            return [];
        }

        const fields: IFieldsProject[] = [];

        const tp = (t: string):string => {

            if (t === 'NUMBER') return 'number';

            if (t.indexOf('SELECT') >= 0) return 'select';

            return 'string';

        }

        ret.node.fields.nodes.forEach((i: any) => {


            if (!i) return;
            const field = {} as IFieldsProject;
            field.id = i.id;
            field.name = i.name;
            field.dataType = tp(i.dataType);
            field.options = i.options ? i.options : [];
            
            fields.push(field);

        });

        return fields;

    } catch (e) {
        console.info(e);
        return [];
    }

}

export async function getProjects(req: IReq): Promise<IProject[]> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        const q = `
                query {
                    repository(owner: "${req.owner}", name: "${req.repo}") {
                        projectsV2(first: 100) {
                            nodes {
                                id
                                number
                                title
                                createdAt
                                url
                                creator {
                                    login
                                    avatarUrl
                                }
                            }
                        }
                    }
                }

            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret || !ret.repository || !ret.repository.projectsV2 || !ret.repository.projectsV2.nodes) {
            return [];
        }

        const prjs:IProject[] = [];

        ret.repository.projectsV2.nodes.forEach((i: any) => {


            if (!i) return;
            const prj = {} as IProject;
            prj.id = i.id;
            prj.number = i.number;
            prj.createdAt = i.createdAt;
            prj.title = i.title;
            prj.url = i.url;
            prj.author = i.creator.login;
            prj.avatarUrl = i.creator.avatarUrl;
            prj.fields = [];
            prjs.push(prj);

        });

        return prjs.sort((a, b) => { return b.number - a.number; });

    } catch (e) {
        console.info(e);
        return [];
    }
}

export async function addNewIssueIO(req: IReq, user: IInfo, repositoryId: string, labelId: string, title: string, desc: string):Promise<IIssues | undefined> {

    try {

        if (!repositoryId || !title || !desc || !labelId) throw new Error('Not found information to add issue')

        const q = `
                mutation {
                    createIssue(
                        input: {
                            repositoryId: "${repositoryId}"
                            title: "${title}"
                            body: "${desc}"
                            labelIds: ["${labelId}"]
                        }
                    ) {
                        issue {
                            id
                            number
                            createdAt
                            title
                            bodyText
                            state
                            url
                            labels(last:10){
                                nodes{
                                    color
                                    name
                                }
                            }
                        }
                    }
                }

            `;

        const ret = await qlFetch(q, req.mkey);

        const issue = {} as IIssues;
        issue.id = ret.createIssue.issue.id;
        issue.numberIssues = ret.createIssue.issue.number;
        issue.createdAt = ret.createIssue.issue.createdAt;
        issue.title = ret.createIssue.issue.title;
        issue.bodyText = ret.createIssue.issue.bodyText;
        issue.state = ret.createIssue.issue.state;
        issue.url = ret.createIssue.issue.url;
        issue.author = user.login;
        issue.avatarUrl = user.avatarUrl;
        issue.labels = ret.createIssue.issue.labels.nodes;
        issue.reactionsTU = 0;
        issue.reactions = [];

        return issue;

    } catch (e) {
        console.info(e);
        return undefined;
    }

}

export async function removeReact(req: IReq, issueid: string, reactid: string): Promise<boolean> {

    try {

        const q = `
                mutation {
                    removeReaction(input: {
                        subjectId: "${issueid}",
                        content: THUMBS_UP}) 
                    {
                        reaction {
                            id
                            content
                        }
                    }
                }
            `;

        const ret = await qlFetch(q, req.mkey);
        return true;


    } catch (e) {
        console.info(e);
        return false;
    }

}

export async function addReact(req: IReq, issueid: string): Promise<string> {

    try {

        const q = `
                mutation {
                    addReaction(input: {
                        subjectId: "${issueid}",
                        content: THUMBS_UP}) 
                    {
                        reaction {
                            id
                            content
                        }
                    }
                }
            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret.addReaction || !ret.addReaction.reaction) return '';

        return ret.addReaction.reaction.id;

    } catch (e) {
        console.info(e);
        return '';
    }

}

export async function getIssues(req: IReq, state: string = 'OPEN'): Promise<IIssues[]> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let aux = '';
        if (state != '') aux = `, states:${state}`;

        const q = `
                query repository {
                    repository(owner: "${req.owner}", name: "${req.repo}") {
		                id
			            issues(last: 100${aux}) {
                            edges {
                                node {
                                    id
                                    number
                                    createdAt
                                    title
                                    bodyText
                                    state
                                    url
                                    author{
                                        login
                                        avatarUrl
                                    }
                                    labels(last:20){
                                        nodes{
                                            color
                                            name
                                        }
                                    }
                                    reactions(last:100, content: THUMBS_UP) {
                                        totalCount
                                        nodes {
                                            id
                                            user {
                                                login
                                            }
                                        }
                                    }
                                }
                            }
                        } 
                    }
                }
            `;

        const ret = await qlFetch(q, req.mkey);

        const issues: IIssues[] = []

        if (!ret || !ret.repository || !ret.repository.issues || !ret.repository.issues.edges) {
            return [];
        }

        ret.repository.issues.edges.forEach((i: any) => {


            if (!i || !i.node) return;
            const issue = {} as IIssues;
            issue.id = i.node.id;
            issue.numberIssues = i.node.number;
            issue.createdAt = i.node.createdAt;
            issue.title = i.node.title;
            issue.bodyText = i.node.bodyText;
            issue.state = i.node.state;
            issue.url = i.node.url;
            issue.author = i.node.author.login;
            issue.avatarUrl = i.node.author.avatarUrl;
            issue.labels = i.node.labels.nodes;
            issue.reactionsTU = i.node.reactions.totalCount;

            const r: IReactions[] = [];
            i.node.reactions.nodes.forEach((rt: any) => {
                r.push({
                    id: rt.id,
                    user: rt.user.login
                })
            })
            issue.reactions = r;

            issues.push(issue);

        });

        return issues.sort((a, b) => { return b.numberIssues - a.numberIssues; });

    } catch (e) {
        console.info(e)
        return [];
    }


}

export async function addComment(req: IReq, issue: IIssues, comment: string): Promise<IComments | undefined> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        const q = `
                mutation {
	
                    addComment(input: { subjectId: "${issue.id}", body: "${comment.replace(/\"/g, '\"')}" }) {
                        commentEdge {
                            node {
                                createdAt
                                id
                                bodyText
                                author{
                                    login,
                                    avatarUrl
                                }
                            }
                        }
                    }
                
                }

            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret || !ret.addComment || !ret.addComment.commentEdge || !ret.addComment.commentEdge.node) {
            return undefined
        }

        const com = {} as IComments;
        com.id = ret.addComment.commentEdge.node.id;
        com.createdAt = ret.addComment.commentEdge.node.createdAt;
        com.bodyText = ret.addComment.commentEdge.node.bodyText;
        com.author = ret.addComment.commentEdge.node.author.login;
        com.avatarUrl = ret.addComment.commentEdge.node.author.avatarUrl;

        return com;
        

    } catch (e) {
        console.info(e);
        return undefined
    }


}

export async function getIssue(req: IReq, issue: IIssues): Promise<IComments[]> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        const q = `
                query {
                    repository(owner: "${req.owner}", name: "${req.repo}") {
                        issue(number: ${issue.numberIssues}) {
                            comments(last:100){
                                nodes{
                                    createdAt
                                    id
                                    bodyText
                                    author{
                                        login,
                                        avatarUrl
                                    }
                                }
                            }
                        }
                    }
                }
            `;

        const ret = await qlFetch(q, req.mkey);

        const comments: IComments[] = []

        if (!ret || !ret.repository || !ret.repository.issue || !ret.repository.issue.comments || !ret.repository.issue.comments.nodes) {
            return []
        }

        ret.repository.issue.comments.nodes.forEach((i: any) => {


            if (!i) return;
            const com = {} as IComments;
            com.id = i.id;
            com.createdAt = i.createdAt;
            com.bodyText = i.bodyText;
            com.author = i.author.login;
            com.avatarUrl = i.author.avatarUrl;
            comments.push(com);

        });

        return comments;

    } catch (e) {
        console.info(e);
        return [];
    }


}

export async function getRepositoryId(req: IReq): Promise<string> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        const q = `
                query { 
                    repository(owner: "${req.owner}", name: "${req.repo}") { id } 
                }
            `;

        const ret = await qlFetch(q, req.mkey);

        if (!ret || !ret.repository || !ret.repository.id) {
            throw new Error('Not found repositoryId');
        }

        return ret.repository.id;

    } catch (e) {
        console.info(e);
        return '';
    }


}

export async function getLabelIdOrAdd(req: IReq, repositoryId: string): Promise<string> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                query repository {
                    repository(owner: "${req.owner}", name: "${req.repo}") {
                        labels(last:100, query:"feature request"){
                            nodes{
                                id
                                color
                                name
                            }
                        }        
                    }
                }
            `;

        let ret = await qlFetch(q, req.mkey);

        if (ret.repository && ret.repository.labels && ret.repository.labels.nodes && ret.repository.labels.nodes[0] && ret.repository.labels.nodes[0].name === 'feature request') {

            return ret.repository.labels.nodes[0].id as string;
        }


        q = `
                mutation {
                    createLabel(input: {
                        repositoryId: "${repositoryId}", 
                        name: "feature request", 
                        color: "1E8103", 
                        description: "Collabcodes label"
                    }) {
                        label {
                        id
                        name
                        color
                        description
                        }
                    }
                }
            `;

        ret = await qlFetch(q, req.mkey);

        if (ret.createLabel && ret.createLabel.label) {

            return ret.createLabel.label.id as string;
        }

        return '';

    } catch (e) {
        console.info(e);
        return '';
    }


}

export function getUserInfoIO(req: IReq): Promise<IInfo> {

    return new Promise<IInfo>(async (resolve, reject) => {

        const q = `
			{
				viewer {
					name
					login
					avatarUrl
				}
			}
			`;

        myFetch(q, req.mkey).then((data) => {

            try {

                if (data.status !== 200) {
                    reject(new Error('Erro status: ' + data.status + '; ' + data.ret.message));
                    return;
                }

                if (data.ret.errors) {
                    reject(new Error('Erro' + data.ret.errors[0].message));
                    return;
                }

                const info = {} as IInfo;
                if (!data.ret || !data.ret.data.viewer) resolve(info);

                info.name = data.ret.data.viewer.name;
                info.login = data.ret.data.viewer.login;
                info.avatarUrl = data.ret.data.viewer.avatarUrl;

                resolve(info);

            } catch (err) {

                reject(err);

            }

        }).catch((e: Error) => {

            reject(e);

        });

    });
}


function qlFetch(query: string, mkey: string, variables?: {}): Promise<any> {

    return new Promise<any>(async (resolve, reject) => {

        try {

            const info = await myFetch(query, mkey, variables);

            if (!info || info.status !== 200) {
                reject(new Error('Erro status: ' + info.status + '; ' + info.ret.message));
                return;
            }

            if (info.ret.errors) {
                reject(new Error('Erro' + info.ret.errors[0].message));
                return;
            }

            resolve(info.ret.data);

        } catch (er) {

            reject(er);

        }


    });
}

function myFetch(query: string, mKey: string, variables?: {}): Promise<{ status: number, ret: any }> {

    return new Promise<{ status: number, ret: any }>((resolve, reject) => {

        try {

            const body: { query: string, variables?: {} } = { query };

            if (variables) body.variables = variables;
            let status = 0;
            fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'bearer ' + mKey
                },
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

export interface IItemProject{
    id: string,
	title: string,
	issueId: string,
    issueNumber: string,
    createdAt:string,
	url: string,
    assignees: [],
	fieldValues:IItemProjectValues[]
}

export interface IItemProjectAssignees{
    login: string,
    avatarUrl:string
}

export interface IItemProjectValues{
    value: string,
    valueText:string,
    fieldName: string,
    fieldId:string,
}

export interface IProject{
    id:string,
    number:number,
    title:string,
    createdAt:string
    author: string,
    avatarUrl: string,
    url: string,
    fields:IFieldsProject[]
}

export interface IFieldsProject{
    id:string,
    name: string,
    dataType: string,
    options:{id:string, name:string}[]
}

export interface IReq {
    mkey: string,
    owner: string,
    repo: string,
    branch: string,
}

export interface IIssues {
    id: string,
    numberIssues: number,
    createdAt: string,
    title: string,
    bodyText: string,
    state: string,
    url: string,
    author: string,
    avatarUrl: string,
    labels: ILabel[],
    reactionsTU: number,
    reactions: IReactions[]

}

export interface IReactions {
    id: string,
    user: string
}

export interface ILabel {
    color: string,
    name: string
}

export interface IComments {
    createdAt: string,
    id: string,
    bodyText: string,
    author: string
    avatarUrl: string
}

export interface IInfo {
    name: string,
    login: string,
    avatarUrl: string
}
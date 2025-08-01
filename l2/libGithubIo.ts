/// <mls shortName="libGithubIo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export async function addIssueInProject(req: IReq, idProject: string, idIssue: string): Promise<string | undefined> {

    try {

        if (!req.owner || !req.repo || !idProject || !idIssue) throw new Error('Not found owner project')

        const q = `
                mutation {
                    addProjectV2ItemById(input: {
                        contentId: "${idIssue}",
                        projectId: "${idProject}"
                    }) {
                        item {
                        id
                        }
                    }
                }
            `;

        const ret = await qlFetch(q);

        if (!ret) {
            return undefined;
        }

        return ret.addProjectV2ItemById.item.id;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function removeIssueInProject(req: IReq, idProject: string, idIssueProject: string): Promise<boolean> {

    try {

        if (!req.owner || !req.repo || !idProject || !idIssueProject) throw new Error('Not found owner project')

        const q = `
                mutation {
                    deleteProjectV2Item(input: { 
                        projectId: "${idProject}",
                        itemId: "${idIssueProject}"
                    }) {
                        deletedItemId
                    }
                }
            `;

        const ret = await qlFetch(q);

        if (!ret) {
            return false;
        }

        return true;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function updateFieldSelectProjects(req: IReq, idProject: string, idItem: string, idField: string, idOption: string): Promise<boolean> {

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
                        singleSelectOptionId: ${idOption === 'null' ? 'null' : `"${idOption}"`}        
                        }
                    }
                    ) {
                    projectV2Item {
                        id
                    }
                    }
                }

            `;

        const ret = await qlFetch(q);

        if (!ret) {
            return false;
        }

        return true;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function getIssuesInProjects(req: IReq, idProject: string): Promise<IItemProject[]> {

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
                                            id
                                            number
                                            createdAt
                                            title
                                            bodyHTML
                                            state
                                            url
                                            author{
                                                login
                                                avatarUrl
                                            }
                                            labels(last:20){
                                                nodes{
                                                    id
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

        const ret = await qlFetch(q);

        if (!ret || !ret.node || !ret.node.items || !ret.node.items.nodes) {
            return [];
        }

        const itens: IItemProject[] = [];


        const getMyField = (fv: any[]): IItemProjectValues[] => {

            const ret: IItemProjectValues[] = [];

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
                    value: 'null',
                    fieldName: 'Status',
                    fieldId: 'null',
                    valueText: 'No status'
                });

            }

            return ret;

        }

        ret.node.items.nodes.forEach((i: any) => {


            if (!i) return;
            const item = {} as IItemProject;
            item.id = i.id;
            item.fieldValues = getMyField(i.fieldValues.nodes);


            const issue = {} as IIssues;
            issue.id = i.content.id;
            issue.numberIssues = i.content.number;
            issue.createdAt = i.content.createdAt;
            issue.title = i.content.title;
            issue.bodyText = i.content.bodyHTML;
            issue.state = i.content.state;
            issue.url = i.content.url;
            issue.author = i.content.author.login;
            issue.avatarUrl = i.content.author.avatarUrl;
            issue.labels = i.content.labels.nodes;
            issue.reactionsTU = i.content.reactions.totalCount;
            issue.comments = [];
            issue.assignees = i.content.assignees.nodes;

            const r: IReactions[] = [];
            i.content.reactions.nodes.forEach((rt: any) => {
                r.push({
                    id: rt.id,
                    user: rt.user.login
                })
            })
            issue.reactions = r;


            item.issue = issue;

            itens.push(item);

        });

        return itens;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function getProjectFields(req: IReq, idProject: string): Promise<IFieldsProject[]> {

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

        const ret = await qlFetch(q);

        if (!ret || !ret.node || !ret.node.fields || !ret.node.fields.nodes) {
            return [];
        }

        const fields: IFieldsProject[] = [];

        const tp = (t: string): string => {

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

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
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

        const ret = await qlFetch(q);

        if (!ret || !ret.repository || !ret.repository.projectsV2 || !ret.repository.projectsV2.nodes) {
            return [];
        }

        const prjs: IProject[] = [];

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

    } catch (e: any) {
        console.info(e);
        throw new Error(e);
    }
}

export async function addNewIssueIO(req: IReq, user: IInfo, repositoryId: string, labelsId: string[], title: string, desc: string): Promise<IIssues | undefined> {

    try {

        if (!repositoryId || !title || !desc || !labelsId) throw new Error('Not found information to add issue')

        let labelId = '';
        labelsId.forEach((l) => {

            if (labelId === '') labelId += `"${l}"`;
            else labelId += `,"${l}"`;

        });

        const q = `
                mutation {
                    createIssue(
                        input: {
                            repositoryId: "${repositoryId}"
                            title: "${title}"
                            body: "${desc}"
                            labelIds: [${labelId}]
                        }
                    ) {
                        issue {
                            id
                            number
                            createdAt
                            title
                            bodyHTML
                            state
                            url
                            labels(last:10){
                                nodes{
                                    id
                                    color
                                    name
                                }
                            }
                        }
                    }
                }

            `;

        const ret = await qlFetch(q);

        const issue = {} as IIssues;
        issue.id = ret.createIssue.issue.id;
        issue.numberIssues = ret.createIssue.issue.number;
        issue.createdAt = ret.createIssue.issue.createdAt;
        issue.title = ret.createIssue.issue.title;
        issue.bodyText = ret.createIssue.issue.bodyHTML;
        issue.state = ret.createIssue.issue.state;
        issue.url = ret.createIssue.issue.url;
        issue.author = user.login;
        issue.avatarUrl = user.avatarUrl;
        issue.labels = ret.createIssue.issue.labels.nodes;
        issue.reactionsTU = 0;
        issue.reactions = [];
        issue.comments = [];
        issue.assignees = [];

        return issue;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
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

        const ret = await qlFetch(q);
        return true;


    } catch (e: any) {
        console.info(e)
        throw new Error(e);
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

        const ret = await qlFetch(q);

        if (!ret.addReaction || !ret.addReaction.reaction) return '';

        return ret.addReaction.reaction.id;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
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
                                    bodyHTML
                                    state
                                    url
                                    author{
                                        login
                                        avatarUrl
                                    }
                                    labels(last:20){
                                        nodes{
                                            id
                                            color
                                            name
                                        }
                                    }
                                    projectsV2(first: 1) {
                                        nodes {
                                            number
                                            title
                                            id
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
                                    assignees(first: 10) {
                                        nodes {
                                            login
                                            avatarUrl
                                        }
                                    }
                                }
                            }
                        } 
                    }
                }
            `;

        const ret = await qlFetch(q);

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
            issue.bodyText = i.node.bodyHTML;
            issue.state = i.node.state;
            issue.url = i.node.url;
            issue.author = i.node.author.login;
            issue.avatarUrl = i.node.author.avatarUrl;
            issue.labels = i.node.labels.nodes;
            issue.reactionsTU = i.node.reactions.totalCount;
            issue.comments = [];
            issue.assignees = i.node.assignees.nodes;

            const r: IReactions[] = [];
            i.node.reactions.nodes.forEach((rt: any) => {
                r.push({
                    id: rt.id,
                    user: rt.user.login
                })
            })
            issue.reactions = r;

            i.node.projectsV2.nodes.forEach((pj: any) => {
                issue.project = {
                    id: pj.id,
                    title: pj.title,
                    number: pj.number
                }
            })

            issues.push(issue);

        });

        return issues.sort((a, b) => { return b.numberIssues - a.numberIssues; });

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }


}


export async function getIssue(req: IReq, id: string): Promise<IIssues | undefined> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')


        const q = `
                query {
                    node(id: "${id}") {
                        ... on Issue {
                            id
                            number
                            createdAt
                            title
                            bodyHTML
                            state
                            url
                            author{
                                login
                                avatarUrl
                            }
                            labels(last:20){
                                nodes{
                                    id
                                    color
                                    name
                                }
                            }
                            projectsV2(first: 1) {
                                nodes {
                                    number
                                    title
                                    id
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
                            assignees(first: 10) {
                                nodes {
                                    login
                                    avatarUrl
                                }
                            }
                        } 
                    }
                }
            `;

        const ret = await qlFetch(q);

        if (!ret || !ret.node) {
            return undefined;
        }

        const issue = {} as IIssues;
        issue.id = ret.node.id;
        issue.numberIssues = ret.node.number;
        issue.createdAt = ret.node.createdAt;
        issue.title = ret.node.title;
        issue.bodyText = ret.node.bodyHTML;
        issue.state = ret.node.state;
        issue.url = ret.node.url;
        issue.author = ret.node.author.login;
        issue.avatarUrl = ret.node.author.avatarUrl;
        issue.labels = ret.node.labels.nodes;
        issue.reactionsTU = ret.node.reactions.totalCount;
        issue.comments = [];
        issue.assignees = ret.node.assignees.nodes;

        const r: IReactions[] = [];
        ret.node.reactions.nodes.forEach((rt: any) => {
            r.push({
                id: rt.id,
                user: rt.user.login
            })
        })
        issue.reactions = r;

        ret.node.projectsV2.nodes.forEach((pj: any) => {
            issue.project = {
                id: pj.id,
                title: pj.title,
                number: pj.number
            }
        })

        return issue;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
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
                                bodyHTML
                                author{
                                    login,
                                    avatarUrl
                                }
                            }
                        }
                    }
                
                }

            `;

        const ret = await qlFetch(q);

        if (!ret || !ret.addComment || !ret.addComment.commentEdge || !ret.addComment.commentEdge.node) {
            return undefined
        }

        const com = {} as IComments;
        com.id = ret.addComment.commentEdge.node.id;
        com.createdAt = ret.addComment.commentEdge.node.createdAt;
        com.bodyText = ret.addComment.commentEdge.node.bodyHTML;
        com.author = ret.addComment.commentEdge.node.author.login;
        com.avatarUrl = ret.addComment.commentEdge.node.author.avatarUrl;

        return com;


    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }


}

export async function getIssueComments(req: IReq, issue: IIssues): Promise<IComments[]> {

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
                                    bodyHTML
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

        const ret = await qlFetch(q);

        const comments: IComments[] = []

        if (!ret || !ret.repository || !ret.repository.issue || !ret.repository.issue.comments || !ret.repository.issue.comments.nodes) {
            return []
        }

        ret.repository.issue.comments.nodes.forEach((i: any) => {


            if (!i) return;
            const com = {} as IComments;
            com.id = i.id;
            com.createdAt = i.createdAt;
            com.bodyText = i.bodyHTML;
            com.author = i.author.login;
            com.avatarUrl = i.author.avatarUrl;
            comments.push(com);

        });

        return comments;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
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

        const ret = await qlFetch(q);

        if (!ret || !ret.repository || !ret.repository.id) {
            throw new Error('Not found repositoryId');
        }

        return ret.repository.id;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }


}

export async function addMemberInIssue(req: IReq, issueId: string, memberId: string): Promise<boolean> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                mutation {

                    addAssigneesToAssignable(input: {
                        assignableId: "${issueId}",
                        assigneeIds: ["${memberId}"]
                    }) {
                        assignable {
                            ... on Issue {
                                id
                                title
                                assignees(first: 1) {
                                    nodes {
                                        login
                                    }
                                }
                            }
                        }
                    }
                }
            `;

        await qlFetch(q);

        return true;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function addLabelInIssue(req: IReq, issueId: string, labelId: string): Promise<ILabel | undefined> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                mutation {
                    addLabelsToLabelable(input: {
                        labelableId: "${issueId}"
                        labelIds: ["${labelId}"]
                    }) {
                        labelable {
                            ... on Issue {
                                id
                                title
                                labels(first: 100) {
                                    nodes {
                                        name
                                        color
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            `;

        let ret = await qlFetch(q);
        let retLabel = undefined;

        if (ret.addLabelsToLabelable && ret.addLabelsToLabelable.labelable && ret.addLabelsToLabelable.labelable.labels && ret.addLabelsToLabelable.labelable.labels.nodes) {

            ret.addLabelsToLabelable.labelable.labels.nodes.forEach((l: any) => {

                if (l.id === labelId) {
                    retLabel = l;
                }

            })

        }

        return retLabel;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function removeMemberInIssue(req: IReq, issueId: string, memberId: string): Promise<boolean> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                mutation {
                removeAssigneesFromAssignable(input: {
                    assignableId: "${issueId}",
                    assigneeIds: ["${memberId}"]
                }) {
                        assignable {
                            ... on Issue {
                                id
                                title
                                assignees(first: 1) {
                                    nodes {
                                        login
                                    }
                                }
                            }
                        }
                    }
                }
            `;

        let ret = await qlFetch(q);

        return true;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function removeLabelInIssue(req: IReq, issueId: string, labelId: string): Promise<boolean> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                mutation {
                    removeLabelsFromLabelable(input: {
                        labelableId: "${issueId}"
                        labelIds: ["${labelId}"]
                    }) {
                        labelable {
                            ... on Issue {
                                id
                                title
                                labels(first: 100) {
                                    nodes {
                                        name
                                        color
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            `;

        let ret = await qlFetch(q);

        return true;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export async function getLabels(req: IReq): Promise<ILabel[]> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                query repository {
                    repository(owner: "${req.owner}", name: "${req.repo}") {
                        labels(last:100){
                            nodes{
                                id
                                color
                                name
                            }
                        }        
                    }
                }
            `;

        let ret = await qlFetch(q);

        if (ret.repository && ret.repository.labels && ret.repository.labels.nodes) {

            return ret.repository.labels.nodes;

        }
        return []

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }
}

export async function getUsers(req: IReq): Promise<IAssignees[]> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                query {
                    repository(owner: "${req.owner}", name: "${req.repo}")  {
                        collaborators(first: 100) {
                            edges {
                                node {
                                    id
                                    login
                                    avatarUrl
                                }
                                permission
                            }
                        }
                    }
                }
            `;

        let ret = await qlFetch(q);

        if (!ret.repository || !ret.repository.collaborators || !ret.repository.collaborators.edges) return [];

        const users: IAssignees[] = [];

        ret.repository.collaborators.edges.forEach((c: any) => {

            users.push({
                id: c.node.id,
                login: c.node.login,
                avatarUrl: c.node.avatarUrl,
            })

        });

        return users;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }
}

export async function getLabelIdOrAdd(req: IReq, repositoryId: string): Promise<ILabelsCollab | undefined> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        let q = `
                query repository {
                    repository(owner: "${req.owner}", name: "${req.repo}") {
                        labels(last:100){
                            nodes{
                                id
                                color
                                name
                            }
                        }        
                    }
                }
            `;

        let ret = await qlFetch(q);

        const retLabels = {
            feature: '',
            low: '',
            medium: '',
            high: '',
        } as ILabelsCollab;

        if (ret.repository && ret.repository.labels && ret.repository.labels.nodes) {

            ret.repository.labels.nodes.forEach((l: any) => {

                switch (l.name) {
                    case 'feature request':
                        retLabels.feature = l.id;
                        break;
                    case 'low':
                        retLabels.low = l.id;
                        break;
                    case 'medium':
                        retLabels.medium = l.id;
                        break;
                    case 'high':
                        retLabels.high = l.id;
                        break;
                    default: '';
                }
            })

        }

        let retLabel;
        if (!retLabels.feature) {
            retLabel = await createLabelIO(req, repositoryId, 'feature request', '1e8103');
            retLabels.feature = retLabel ? retLabel.id : '';
        }

        if (!retLabels.low) {
            retLabel = await createLabelIO(req, repositoryId, 'low', '49ff18');
            retLabels.low = retLabel ? retLabel.id : '';
        }

        if (!retLabels.medium) {
            retLabel = await createLabelIO(req, repositoryId, 'medium', 'f1ff18');
            retLabels.medium = retLabel ? retLabel.id : '';
        }

        if (!retLabels.high) {
            retLabel = await createLabelIO(req, repositoryId, 'high', 'ff0000');
            retLabels.high = retLabel ? retLabel.id : '';
        }

        return retLabels;


    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }


}

export async function createLabelIO(req: IReq, repositoryId: string, label: string, color: string): Promise<ILabel | undefined> {

    try {

        if (!req.owner || !req.repo) throw new Error('Not found owner project')

        const q = `
                mutation {
                    createLabel(input: {
                        repositoryId: "${repositoryId}", 
                        name: "${label}", 
                        color: "${color}", 
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

        let ret = await qlFetch(q);

        if (ret.createLabel && ret.createLabel.label) {

            return {
                id: ret.createLabel.label.id,
                color: ret.createLabel.label.color,
                name: ret.createLabel.label.name,
            } as ILabel;
        }

        return undefined;

    } catch (e: any) {
        console.info(e)
        throw new Error(e);
    }

}

export function getUserInfoIO(req: IReq): Promise<IInfo> {

    return new Promise<IInfo>(async (resolve, reject) => {
        try {
            const q = `
			{
				viewer {
					name
					login
					avatarUrl
				}
			}
			`;

            const data = await qlFetch(q)

            const info = {} as IInfo;
            if (!data.viewer) resolve(info);

            info.name = data.viewer.name;
            info.login = data.viewer.login;
            info.avatarUrl = data.viewer.avatarUrl;

            resolve(info);


        } catch (e: any) {

            reject(e.message);

        };

    });
}

const driver = await mls.stor.others.getDefaultDriver(mls.actualProject || 0);
function qlFetch(query: string, variables?: {}): Promise<any> {

    return new Promise<any>(async (resolve, reject) => {

        try {

            if (!driver || driver.shortName.toLocaleLowerCase() !== 'github') {
                throw new Error('Driver not found or driver is not of type github')
            }

            if (!(driver as any).fecthQl) {
                throw new Error('Driver not have function fecthQl');
            }

            const info = await (driver as any).fecthQl(query, variables);

            resolve(info.ret.data);

            /*const info = await myFetch(query, mkey, variables);

            if (!info || info.status !== 200) {
                reject(new Error('Erro status: ' + info.status + '; ' + info.ret.message));
                return;
            }

            if (info.ret.errors) {
                reject(new Error('Erro' + info.ret.errors[0].message));
                return;
            }

            resolve(info.ret.data);*/

        } catch (er: any) {

            reject(er.message);

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

        } catch (er: any) {

            reject(er.message);

        }

    });

}

export interface IItemProject {
    id: string,
    issue: IIssues
    fieldValues: IItemProjectValues[]
}

export interface IAssignees {
    id: string,
    login: string,
    avatarUrl: string
}

export interface IItemProjectValues {
    value: string,
    valueText: string,
    fieldName: string,
    fieldId: string,
}

export interface IProject {
    id: string,
    number: number,
    title: string,
    createdAt: string
    author: string,
    avatarUrl: string,
    url: string,
    fields: IFieldsProject[]
}

export interface IFieldsProject {
    id: string,
    name: string,
    dataType: string,
    options: { id: string, name: string }[]
}

export interface IReq {
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
    reactions: IReactions[],
    comments: IComments[],
    assignees: IAssignees[],
    project: IProjectMain
}

export interface IProjectMain {
    number: number,
    title: string,
    id: string
}

export interface IReactions {
    id: string,
    user: string
}

export interface ILabel {
    id: string,
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

export interface ILabelsCollab {
    feature: string,
    low: string,
    medium: string,
    high: string,
}
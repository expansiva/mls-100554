/// <mls shortName="libCommom" project="100554" enhancement="_blank" groupName="other" />

export function getMyKeysBranch(project: number): { branch: string, owner: string, repo: string } {

    try {

        if (!mls.stor.projects[project]) throw new Error('Not found projectInfo:' + project);

        const obj = mls.l5.getProjectDetails(project);
        if (!obj || !obj.value) throw new Error('Error getProjectDetails in:' + project);

        const json = JSON.parse(obj.value);
        if (!json) throw new Error('Error getProjectDetails .value json in:' + project);

        let info = '';

        if (!json.projectURL && json.l5_actionPrjSettings) info = json.l5_actionPrjSettings.projectURL;
        else if (json.projectURL) info = json.projectURL;
        else throw new Error('Error project info:' + project);
        
        if (info.endsWith('/')) info = info.substring(0, info.length - 1);
        const array = info.split('/');
        if (array.length < 3) throw new Error('Insufficient information to progress');

        return { branch: array[array.length - 3], owner: array[array.length - 2], repo: array[array.length - 1] };

    } catch (e: any) {

        throw new Error('Error get info branch: ' + e.message);

    }

}

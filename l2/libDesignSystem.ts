/// <mls shortName="libDesignSystem" project="100554" enhancement="_blank" groupName="other" />

export async function list(project: number) {
    const config = await getConfigProject(project);
    const ds: IPrjDesignSystem[] = config.designSystems || [];
    return ds;
}

export async function getDSInstance(project: number, dsindex: number): Promise<mls.l3.DesignSystemIO> {
    const instance = await _getDsInstance(project, dsindex);
    return instance;
}

async function _getDsInstance(project: number, dsindex: number): Promise<mls.l3.DesignSystemIO> {

    const dsProjectList = await list(project);
    const dsInfo = dsProjectList[dsindex];
    if (!dsInfo) throw new Error(`Design system: ${dsindex} dont exist in project: ${project}`);
    const instance: mls.l3.DesignSystemIO = mls.l3['getOrCreateDSInstanceIO'](project, dsindex, dsInfo.widgetIOName);
    if (!instance) throw new Error('Invalid ds instance!');
    return instance;
}

async function getConfigProject(project: number): Promise<any> {
    const shortName = 'project';
    if (project === undefined) throw new Error('No project selected!')
    const key = mls.stor.getKeyToFiles(project, 5, shortName, '', '.json');
    let configFile = mls.stor.files[key];
    if (!configFile) throw new Error('No config file!');
    const content = await configFile.getContent();
    if (!content || typeof content !== 'string') throw new Error('Invalid config file!');
    return JSON.parse(content);
}

export interface IPrjDesignSystem {
    dsIndex: number,
    widgetIOName: string,
    dsName: string,
}

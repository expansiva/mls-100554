/// <mls shortName="libProjectConfig" project="100554" enhancement="_blank" groupName="other" />

export const projectConfig: ICacheProjectConfig = {};

const FILENAME = 'project';
const LEVEL = 5;
const EXTENSION = '.json';

export async function getConfigProject(project: number, ignoreLocalChanges = false): Promise<mls.l5_common.ProjectConfig | undefined> {
    if (projectConfig[project]) return projectConfig[project];
    if (project === undefined) return undefined;
    const key = mls.stor.getKeyToFiles(project, LEVEL, FILENAME, '', EXTENSION);
    let configFile = mls.stor.files[key];
    if (!configFile) return undefined;
    const lastStatus = configFile.inLocalStorage;
    if (ignoreLocalChanges) {
        configFile.inLocalStorage = false;
    }
    const content = await configFile.getContent();
    configFile.inLocalStorage = lastStatus;
    if (!content || typeof content !== 'string') return undefined;
    const config = JSON.parse(content);
    projectConfig[project] = config;
    return projectConfig[project];
}

export async function updateConfigProject(project: number, newConfig: mls.l5_common.ProjectConfig): Promise<void> {
    const key = mls.stor.getKeyToFiles(project, LEVEL, FILENAME, '', EXTENSION);
    projectConfig[project] = newConfig;
    const configFile = mls.stor.files[key];
    if (!configFile) throw new Error('No config file!');
    await mls.stor.localStor.setContent(configFile, {
        contentType: 'string',
        content: JSON.stringify(newConfig, null, 2)
    });
}

export async function createConfigFile(project: number): Promise<mls.l5_common.ProjectConfig> {
    if (project === undefined) throw new Error('Invalid project')
    const key = mls.stor.getKeyToFiles(project, LEVEL, FILENAME, '', EXTENSION);
    let configFile = mls.stor.files[key];
    if (configFile) throw new Error('config file already exists');
    const config = await _createConfigFile(project);
    projectConfig[project] = config;
    return projectConfig[project];
}

async function _createConfigFile(project: number) {
    const newConfig: mls.l5_common.ProjectConfig = {
        orgName: '',
        designSystems: [],
        languages: []
    }
    const content = JSON.stringify(newConfig);
    const params = {
        project,
        level: LEVEL,
        shortName: FILENAME,
        extension: EXTENSION,
        versionRef: '0',
        folder: ''
    };
    const file = await mls.stor.addOrUpdateFile(params);
    if (!file) throw new Error('invalid file');
    file.status = 'new';
    const fileInfo: mls.stor.IFileInfoValue = {
        content,
        contentType: 'string',
    };
    await mls.stor.localStor.setContent(file, fileInfo);
    return newConfig;
}


interface ICacheProjectConfig {
    [key: number]: mls.l5_common.ProjectConfig
}
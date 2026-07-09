/// <mls fileReference="_100554_/l2/collabMessagesEnvironment.ts" enhancement="_blank"/>

import { CollabMessagesEnvironment, CollabProgramMenu, CollabProgramMenuItem } from '/_102036_/l2/environmentContract.js';
import { IAgentMeta, IOpenClawIntegration, Thread, ToolsBeforeSendMessage, ExecutionContext, TaskData, Message } from '/_102036_/l2/shared/interfaces.js';

import { loadAgent, executeBeforePrompt } from '/_102027_/l2/aiAgentOrchestration.js';
import { getTemporaryContext } from '/_102027_/l2/aiAgentHelper.js';
import { openElementInServiceDetails, getProjectConfig, getProjectModuleConfig } from '/_102027_/l2/libCommom.js';

export const collabEnvironment: CollabMessagesEnvironment = {
    getAgents,
    getIntegrationsOpenClaw,
    setIntegrationsOpenClaw: (integrations: IOpenClawIntegration[]) => setIntegrationsOpenClaw(integrations),
    notifications: {
        getFCMTokenForBackend,
        getNotifySoundUrl,
        sendACK: (id: string) => sendACK(id),
        sendRequestMissed,
    },
    bots: {
        getArgsToBots,
        getBotContextVarsBeforeMessageSend,
        getBotContextVarsBeforeMessageSend2
    },
    agents: {
        generateSvgAvatar: (threadId: string, userId: string, promptToAvatar: string) => generateSvgAvatar(threadId, userId, promptToAvatar),
        executeAgent: (agent: string, context: ExecutionContext) => executeAgent(agent, context),
        loadAgent: (agentName: string) => loadAgent2(agentName)
    },
    tasks: {
        openTaskDetails: (messageId: string, taskId: string, task: TaskData, message: Message) => openTaskDetails(messageId, taskId, task, message)
    },
    apps: {
        getProgramMenu: () => getProgramMenu(),
        openProgram: (item: CollabProgramMenuItem & { project?: number; module?: string; path?: string }) => openProgram(item)
    },
    config: {
        getMenuMode: () => 'custom',
        generateSvgAvatarEnabled: () => true
    }
}

// Builds the Apps menu tree for the current Studio project:
// first level = module (project.ts modules), children = the module's navigation pages
// (module.ts menu). Reuses the same config readers the live view uses.
async function getProgramMenu(): Promise<CollabProgramMenu[]> {

    const project = mls.actualProject as number;
    if (!project) return [];

    const projectConfig = await getProjectConfig(project);
    if (!projectConfig || !projectConfig.modules) return [];

    const menus: CollabProgramMenu[] = [];

    for await (const module of projectConfig.modules) {
        let items: CollabProgramMenuItem[] = [];
        try {
            const moduleConfig = await getProjectModuleConfig(module.path, project);
            items = (moduleConfig?.menu ?? []).map((m) => ({
                title: m.title,
                icon: m.icon ?? module.icon ?? '',
                url: m.pageName,
                pageName: m.pageName,
                target: m.target
            }));
        } catch (err) {
            // A single broken module must not hide the rest of the menu.
            console.info('[getProgramMenu] skip module ' + module.path, err);
        }

        menus.push({
            name: module.name,
            icon: module.icon ?? '',
            project,
            path: module.path,
            menu: items
        });
    }

    return menus;
}

// Opens the selected page on the right side (Aura preview / live view, level 7).
// Reuses the standard preview path: servicePreview handles the 'openLink' FileAction
// fired at level 7 (see servicePreview.onOpenLink).
async function openProgram(item: CollabProgramMenuItem & { project?: number; module?: string; path?: string }): Promise<void> {

    const project = item.project ?? (mls.actualProject as number);
    const folder = item.path ?? '';
    const shortName = item.pageName;
    if (!project || !shortName) return;

    const fullName = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`;

    // Point the level-7 preview context at the selected page.
    mls.actual[7].setFullName(fullName);

    // Fire the same event the rest of the studio uses to open a page in the preview.
    const params = {} as mls.events.IFileAction;
    (params.action as any) = 'openLink';
    params.level = 2;
    params.project = project;
    params.shortName = shortName;
    params.extension = '.ts';
    params.folder = folder;
    params.position = 'right';

    mls.events.fire([7], ['FileAction'], JSON.stringify(params), 0);
}

async function getAgents(): Promise<IAgentMeta[]> {

    const keys = Object.keys(mls.stor.files);
    const ret: IAgentMeta[] = [];
    for await (const k of keys) {
        if (k.indexOf('agent') < 0) continue;
        const file = mls.stor.files[k];
        const path = `/_${file.project}_${file.folder ? file.folder + '/' : ''}${file.shortName}`;
        if (file.extension !== '.ts' || !file.shortName.startsWith('agent')) continue;
        try {
            const mdl = await import(path);
            if (!mdl.createAgent) continue;
            const agent = mdl.createAgent() as IAgentMeta
            ret.push(agent);
        } catch (err) {
            console.info(err)
            continue;
        }
    }
    return ret;

}

async function getIntegrationsOpenClaw(): Promise<IOpenClawIntegration[]> {

    if (mls.l5.actualOrg === undefined) return [];
    const actualOrgDetails = getOrgDetails(mls.l5.actualOrg);
    if (!actualOrgDetails || !actualOrgDetails.value) return [];
    try {
        const data = JSON.parse(actualOrgDetails.value);
        return data.integrations || []

    } catch (err: any) {
        throw new Error(err.message)
    }

}

async function setIntegrationsOpenClaw(integrations: IOpenClawIntegration[]): Promise<void> {

    if (mls.l5.actualOrg === undefined) throw new Error(`Invalid org actual: ${mls.l5.actualOrg}`);

    const actualOrgDetails = getOrgDetails(mls.l5.actualOrg);
    if (!actualOrgDetails) throw new Error(`Invalid org details: ${mls.l5.actualOrg}`);

    try {
        let data: any = {};

        if (actualOrgDetails.value) {
            data = JSON.parse(actualOrgDetails.value);
        }

        data = { ...data, integrations };

        await mls.api.cbeAddOrUpdateOrgValue(
            actualOrgDetails.sett.name,
            JSON.stringify(data)
        );

    } catch (err: any) {
        throw new Error(err.message);
    }

}

async function getNotifySoundUrl() {
    return './l3/_100529_/audio/collabNotification.mp3';
}

async function getFCMTokenForBackend() {
    const token = await mls.events.getFCMTokenForBackend();
    return token;
}

async function sendRequestMissed() {
    return await mls.stor.cache.sendRequestMissed();
}

async function sendACK(id: string) {
    return await mls.stor.cache.sendACK(id);
}

async function getArgsToBots(): Promise<Record<string, any>> {
    const data = {}
    return data;
}

async function getBotContextVarsBeforeMessageSend(thread: Thread, prompt: string): Promise<string[]> {
    return mls.bots.getBotContextVarsBeforeMessageSend(thread, prompt);
}

async function getBotContextVarsBeforeMessageSend2(vars: string[], myArgs: Record<string, any>): Promise<ToolsBeforeSendMessage[]> {
    return mls.bots.getBotContextVarsBeforeMessageSend2(vars, myArgs);
}

async function generateSvgAvatar(threadId: string, userId: string, promptToAvatar: string) {
    const agentName = '_100554_/l2/agents/agentGenerateAvatarSvg';
    const agent = await loadAgent(agentName);
    if (!agent) throw new Error('Invalid agent');
    const context = getTemporaryContext(threadId, userId, promptToAvatar);
    await executeBeforePrompt(agent, context);
    const svg = extractSvgFromContext(context);
    return svg;

}

async function loadAgent2(agentName: string) {
    const agent = await loadAgent(agentName);
    if (!agent) return null;
    return agent as IAgentMeta
}

async function executeAgent(agentToCall: string, context: ExecutionContext) {
    const agent = await loadAgent(agentToCall);
    if (!agent) throw new Error('Invalid agent' + agentToCall)
    await executeBeforePrompt(agent, context);
}

async function openTaskDetails(messageId: string, taskId: string, task: TaskData, message: Message): Promise<{
    openLocal: boolean;
    element: HTMLElement | undefined;
}> {

    await import('/_102025_/l2/collabMessagesTaskInfo.js');
    const el = document.createElement('collab-messages-task-info-102025');
    el.setAttribute('messageId', messageId);
    if (task && task.PK) el.setAttribute('taskId', task.PK);
    (el as any)['task'] = task;
    (el as any)['message'] = message;
    openElementInServiceDetails(el);
    return { openLocal: false, element: undefined }

}

function extractSvgFromContext(context: any): string | null {
    return context?.task?.iaCompressed?.nextSteps?.[0]?.interaction?.payload?.[0]?.result ?? null;
}

function getOrgDetails(orgIndex: number) {
    const actualOrgName = Object.keys(mls.stor.orgs)[orgIndex];
    const actualOrgDetails = mls.stor.orgs[actualOrgName];
    return actualOrgDetails;
}

/// <mls shortName="aimHelper" project="100554" enhancement="_blank" />


export let tasks: mls.cbe.ITaskRoot[] = [];
export let tasksProject: number = 0;
import { ServiceBase } from './_100554_serviceBase';

//let lastReadFromServer: Date | undefined = undefined;


/**
 * return the result of the prompt
 */
export async function executePrompt(taskIndex: number): Promise<mls.cbe.ITaskRoot> {
  if (taskIndex < 0 || taskIndex >= tasks.length) throw new Error(`invalid task index`);
  const project: number = mls.actual[5].project || 0;
  if (project < 1) throw new Error(`invalid project ${project}`);

  const taskRoot = { ...tasks[taskIndex] }; // get copy
  let tasksToExecute = 0;
  for (const child of taskRoot.children) {
    if (child.mode === 'initializing') tasksToExecute++;
    if (child.mode === 'in progress') child.mode = 'error'; // abend !?
    child._tempResult = undefined; // clear
  }
  if (tasksToExecute < 1 || tasksToExecute > 3) throw new Error(`invalid tasks to execute, tasksToExecute=${tasksToExecute}`);
  const resp = await mls.api.cbeAiTask(project, taskRoot, 'execute LLM');
  if (resp.msg !== "ok") throw new Error("error on api prompt: " + resp.msg);

  if (resp.task) tasks[taskIndex] = { ...tasks[taskIndex], ...resp.task };
  return resp.task;

}

export async function updateTaskOnServer(taskIndex: number): Promise<mls.cbe.ITaskRoot> {
  if (taskIndex < 0 || taskIndex >= tasks.length) throw new Error(`invalid task index`);
  const project: number = mls.actual[5].project || 0;
  if (project < 1) throw new Error(`invalid project ${project}`);
  const taskRoot = { ...tasks[taskIndex] }; // get copy
  mls.stor.localDB.saveTask(project, taskRoot);
  const resp = await mls.api.cbeAiTask(project, taskRoot, 'update record');
  if (resp.msg !== "ok") throw new Error("error on api prompt: " + resp.msg);
  if (resp.task) tasks[taskIndex] = { ...tasks[taskIndex], ...resp.task };
  return resp.task;
}

// const timeToWait = 5 * 60 * 1000; // 5 minutes , in ms
// export async function readTasksFromServer(filtedBy: mls.cbe.IFilterTask, filter: string) {
//   if (lastReadFromServer) {
//     // compare and don't read again for last seconds
//     const timeSinceLastRead = new Date().getTime() - lastReadFromServer.getTime();
//     if (timeSinceLastRead < timeToWait) return;
//   }
//   lastReadFromServer = new Date();
//   const rc = await mls.api.cbeAiTaskList(mls.actual[5].project || 0, 'all', '');
//   if (rc.msg !== 'ok') {
//     console.error('error on read tasks from server: ', rc);
//     return;
//   }
//   tasks = rc.tasks;
//   for (const task of tasks) {
//     if (task.mode !== 'error' &&
//       task.mode !== 'processed' &&
//       task.mode !== 'waiting for user') task.mode = 'error';
//   }
// }

export async function readTasks() {
  const project = mls.actual[5].project || 0;
  if (project < 1) throw new Error(`invalid project ${project}`);
  if (tasks.length > 0 && tasksProject === project) return; // already read
  const itasks = await mls.stor.localDB.readAllTasks(project)
    .catch((e) => {
      console.error(e);
      return [];
    });
  tasks = itasks.map(task => task.taskRoot);
  tasksProject = project;
}

export interface InfoServiceAIM {
  level: number,
  position: mls.IPosition,
  activeOppositeService: HTMLElement | undefined,
}

export function getInfoServiceAim(elBase: HTMLElement): InfoServiceAIM | undefined {
  const service = elBase.closest('service-aim-100554') as ServiceBase;
  if (!service || service.tagName !== 'SERVICE-AIM-100554') {
    console.log('not found service-* in this DOM');
    return undefined;
  }
  const op = service.position === 'left' ? 'right' : 'left';
  let servOp = service.nav3Service;
  if (!servOp) {
    console.log('not found service in opposite side');
    return undefined;
  }  
  const activeOppositeService: HTMLElement | undefined = servOp.getActiveInstance(op);
  return {
    level: service.level,
    position: service.position,
    activeOppositeService
  }
}

export function getUserConfigs(): IAimColums {
  let configs = getDefaultColumsConfigs();
  try {
    const str = localStorage.getItem('serviceAIM');
    if (!str) return configs;
    const data = JSON.parse(str);
    configs = data;
    return { ...configs };
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export function saveUserConfigs(obj: IAimColums) {
  if (!obj) throw new Error('Invalid data')
  try {
    const str = localStorage.setItem('serviceAIM', JSON.stringify(obj));
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export function extractScript(src: string, regex: RegExp) {
    //const regex = /```typescript([\s\S]+?)```/g;
    const matches = src.match(regex);
    const contents = [];

    let ret = src;

    if (matches) {
        for (const m of matches) {
            const conteudo = m.replace(/```typescript|```/g, '').trim();
            contents.push(conteudo);
        }

        ret = contents[0];
    } else { 
        console.error('no match in task result, regex: "' + regex + '"');
    }

    return ret;
}

function getDefaultColumsConfigs(): IAimColums {
  return {
    status: true,
    cost: true,
    sequencial: true,
    countChild: true,
    title: true,
    prompt: true,
    user: true,
    reference: false,
    lastUpdateDate: false
  }
};

export interface IAimColums {
  status: boolean,
  cost: boolean,
  sequencial: boolean,
  countChild: boolean,
  title: boolean,
  prompt: boolean,
  user: boolean,
  reference: boolean,
  lastUpdateDate: boolean
}

export interface ITaskFinish {
  status: 'ok' | 'error' | 'rejected' | 'userEvent',
  taskIndex: number,
  childIndex: number,
  result: string, // result or error message
  newPrompt?: string,
  taskRoot: mls.cbe.ITaskRoot,
  taskChild: mls.cbe.ITaskChild
}

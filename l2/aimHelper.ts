/// <mls shortName="aimHelper" project="100554" enhancement="_blank" />


export let tasks: cbe.ITaskRoot[] = [];
let lastReadFromServer: Date | undefined = undefined;


/**
 * return the result of the prompt
 */
export async function executePrompt(taskIndex: number): Promise<cbe.ITaskRoot> {
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

export async function updateTaskOnServer(taskIndex: number): Promise<cbe.ITaskRoot> {
  if (taskIndex < 0 || taskIndex >= tasks.length) throw new Error(`invalid task index`);
  const project: number = mls.actual[5].project || 0;
  if (project < 1) throw new Error(`invalid project ${project}`);
  const taskRoot = { ...tasks[taskIndex] }; // get copy
  const resp = await mls.api.cbeAiTask(project, taskRoot, 'update record');
  if (resp.msg !== "ok") throw new Error("error on api prompt: " + resp.msg);
  if (resp.task) tasks[taskIndex] = { ...tasks[taskIndex], ...resp.task };
  return resp.task;
}

const timeToWait = 5 * 60 * 1000; // 5 minutes , in ms
export async function readTasksFromServer(filtedBy: cbe.IFilterTask, filter: string) {
  if (lastReadFromServer) {
    // compare and don't read again for last seconds
    const timeSinceLastRead = new Date().getTime() - lastReadFromServer.getTime();
    if (timeSinceLastRead < timeToWait) return;
  }
  lastReadFromServer = new Date();
  const rc = await mls.api.cbeAiTaskList(mls.actual[5].project || 0, 'all', '');
  if (rc.msg !== 'ok') {
    console.error('error on read tasks from server: ', rc);
    return;
  }
  tasks = rc.tasks;
  for (const task of tasks) {
    if (task.mode !== 'error' &&
      task.mode !== 'processed' &&
      task.mode !== 'waiting for user') task.mode = 'error';
  }
}

export function getInfoMyService(elBase: HTMLElement): { level: number, position: string, actServiceOp: any } | undefined {

  let ret;
  try {
    const shadowRoot = elBase.getRootNode() as any;
    if (!shadowRoot) return ret;

    const service = shadowRoot.host as any;
    if (!service || service.tagName !== 'SERVICE-AIM-100554') return ret;

    const op = service.position === 'left' ? 'right' : 'left';
    let servOp = service.nav3Service;
    if (!servOp) return ret;

    servOp = servOp.getActiveInstance(op);

    if (!servOp) return ret;

    ret = {
      level: service.level,
      position: service.position,
      actServiceOp: servOp
    }

    return ret;

  } catch (e) {

    return ret;

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
  taskRoot: cbe.ITaskRoot,
  taskChild: cbe.ITaskChild
}

/// <mls shortName="iaChatBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export function getTotalCost(task: mls.msg.TaskData): string {

    let tot = 0;
    const nextSteps = task.iaCompressed?.nextSteps;
    if (!nextSteps || nextSteps.length === 0) return tot.toFixed(4);

    const sumCosts = (interaction: mls.msg.AIInteraction) => {
        tot += interaction.cost ? interaction.cost : 0;
        if (interaction.payload && interaction.payload.length > 0) {
            interaction.payload.forEach((p) => {
                if (p.interaction) sumCosts(p.interaction)
            })
        }
    };

    nextSteps.forEach((step) => {
        if (step.interaction) sumCosts(step.interaction);
    })

    return tot.toFixed(4);
}

export function formatTimestamp(timestamp: string) {
    if (!timestamp || timestamp.length < 14) {
        throw new Error("Formato de timestamp inválido");
    }

    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(8, 10);
    const minute = timestamp.slice(10, 12);
    const second = timestamp.slice(12, 14);

    // Cria o objeto Date no formato UTC
    const utcDate = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,  // Meses são indexados de 0 a 11
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    ));

    // Converte para o horário local
    const localDate = utcDate.toLocaleString('pt-BR', {
        timeZoneName: 'short'
    });

    // Converte os componentes individuais para o formato local
    const localYear = utcDate.getFullYear();
    const localMonth = (utcDate.getMonth() + 1).toString().padStart(2, '0');
    const localDay = utcDate.getDate().toString().padStart(2, '0');
    const localHour = utcDate.getHours().toString().padStart(2, '0');
    const localMinute = utcDate.getMinutes().toString().padStart(2, '0');
    const localSecond = utcDate.getSeconds().toString().padStart(2, '0');

    const date = `${localYear}-${localMonth}-${localDay}`;
    const time = `${localHour}:${localMinute}:${localSecond}`;
    const dateFull = `${date} ${time}`;

    return { dateFull, date, time };
}

// export function getInternalStatus(task: mls.msg.TaskData): { status: mls.msg.AIStepStatus; stepId: number } | undefined {
//     const interaction = task.iaCompressed?.interaction;
//     if (!interaction || !interaction.payload) return;

//     const priority: mls.msg.AIStepStatus[] = [
//         'failed',
//         'waiting_for_user',
//         'pending',
//         'in_progress',
//         'completed',
//     ];

//     const found: Partial<Record<mls.msg.AIStepStatus, number[]>> = {};
//     const collectStatuses = (interaction: mls.msg.AIInteraction) => {
//         if (!interaction.payload) return;

//         for (const step of interaction.payload) {
//             if (!found[step.status]) found[step.status] = [];
//             found[step.status]!.push(step.stepId);

//             if (step.interaction) {
//                 collectStatuses(step.interaction);
//             }

//             if (step.nextSteps?.length) {
//                 for (const next of step.nextSteps) {
//                     if (!found[next.status]) found[next.status] = [];
//                     found[next.status]!.push(next.stepId);

//                     if (next.interaction) {
//                         collectStatuses(next.interaction);
//                     }
//                 }
//             }
//         }
//     };

//     collectStatuses(interaction);

//     for (const status of priority) {
//         const stepIds = found[status];
//         if (stepIds && stepIds.length > 0) {
//             return { status, stepId: stepIds[0] };
//         }
//     }

//     return;
// }


// export function getInteractionByStep(interaction: iaChat.AIInteraction, stepId: number) {

//     let item: iaChat.AIPayload | undefined

//     const getPayload = (interaction: iaChat.AIInteraction) => {
//         if (interaction.payload && interaction.payload.length > 0) {
//             interaction.payload.forEach((p) => {
//                 if (p.stepId === stepId) {
//                     item = p;
//                     return;
//                 }
//                 if (p.interaction) getPayload(p.interaction);

//             });
//         }
//     };

//     getPayload(interaction);
//     return item;
// }

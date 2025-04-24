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
        return;
    }
    
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(8, 10);
    const minute = timestamp.slice(10, 12);
    const second = timestamp.slice(12, 14);
    const utcDate = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    ));

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



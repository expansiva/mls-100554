/// <mls shortName="ateste" project="100554" folder="" enhancement="_blank" groupName="" />


export function ateste() {
    console.info('estou no ateste');
} 

export async function outroteste() {
    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(1000);
    console.info('estou no await ateste');
}
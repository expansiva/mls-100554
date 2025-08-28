/// <mls shortName="utilsLit" project="100554" enhancement="_blank" />

// export function convertTagToFileName(tag: string): string{
//     const regex = /(.+)-(\d+)/;
//     const match = tag.match(regex);
//     if (match) {
//         const [, rest, number] = match;
//         const convertedSrc = rest.replace(/-(.)/g, (_, letter) => letter.toUpperCase());
//         tag = `_${number}_${convertedSrc}`;
//     }
//     return tag;
// }

// export function convertFileNameToTag(widget: string) {
//     const regex = /_([0-9]+)_?(.*)/;
//     const match = widget.match(regex);
//     if (match) {
//         const [, number, rest] = match;
//         const convertedSrc = rest.replace(/([A-Z])/g, '-$1').toLowerCase();
//         widget = `${convertedSrc}-${number}`;
//     }

//     if (widget.startsWith('-')) widget = widget.substring(1) // santiago
//     return widget;
// }


export function convertTagToFileName(tag: string): {
    shortName: string;
    project: number;
    folder: string;
} | undefined {
    const parts = tag.split('--');
    const namePart = parts.pop() || '';
    const folder = parts.join('/').replace(/-(.)/g, (_, letter) => letter.toUpperCase());

    const regex = /(.+)-(\d+)$/;
    const match = namePart.match(regex);

    if (!match) return;

    const [, rest, number] = match;
    const shortName = rest.replace(/-(.)/g, (_, letter) => letter.toUpperCase());

    return {
        shortName,
        project: +number,
        folder
    };
}

export function convertFileNameToTag(info: {
    shortName: string;
    project: number;
    folder?: string;
}): string {
    const { shortName, project, folder = '' } = info;

    const kebabName = shortName.replace(/([A-Z])/g, '-$1').toLowerCase();
    const baseName = `${kebabName}-${project}`;
    const folderPrefix = folder ? folder.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/\//g, '--') + '--' : '';

    return `${folderPrefix}${baseName}`;
}

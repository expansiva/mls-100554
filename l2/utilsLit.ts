/// <mls shortName="utilsLit" project="100554" enhancement="_blank" />
				
export function convertTagToFileName(tag: string) {
    const regex = /(.+)-(\d+)/;
    const match = tag.match(regex);

    if (match) {
        const [, rest, number] = match;
        const convertedSrc = rest.replace(/-(.)/g, (_, letter) => letter.toUpperCase());
        tag = `_${number}_${convertedSrc}`;
    }
    return tag;
}

export function convertFileNameToTag(widget: string) {
    const regex = /_([0-9]+)_?(.*)/;
    const match = widget.match(regex);
    if (match) {
        const [, number, rest] = match;
        const convertedSrc = rest.replace(/([A-Z])/g, '-$1').toLowerCase();
        widget = `${convertedSrc}-${number}`;
    }

    if(widget.startsWith('-')) widget = widget.substring(1) // santiago
    return widget;
}



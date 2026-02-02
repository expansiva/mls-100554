/// <mls shortName="libMindMap" project="100554" enhancement="_blank" />


export async function getMindMapByName(file: string): Promise<MindMapData | undefined> {

    try {

        if (!file) throw new Error(`Not found file: ${file}`);

        const info = mls.l2.getPath(file);
        if (!info || !info.shortName) return;
        let { project, folder, shortName } = info;
        folder = folder.replace('/l2', '').trim();
        shortName = shortName.replace('.defs.ts', '').trim();
        shortName = shortName.replace('.ts', '').trim();

        const key = mls.stor.getKeyToFile({ project, level: 2, shortName, folder, extension: '.defs.ts' });

        if (!mls.stor.files[key]) throw new Error(`Not found mls.stor: ${key}`);
        return _getMindMapByFile(mls.stor.files[key]);

    } catch (e: any) {
        throw new Error(`Error: ${e.message}`);
    }

}

export async function getMindMapByStorFile(file: mls.stor.IFileInfo): Promise<MindMapData | undefined> {

    if (file.extension !== '.defs.ts') {
        let { project, folder, shortName, level } = file;
        const key = mls.stor.getKeyToFile({ project, folder, shortName, extension: '.defs.ts', level })   
        if (!mls.stor.files[key]) throw new Error(`Not found mls.stor: ${key}`);
        file = mls.stor.files[key]
    }

    return _getMindMapByFile(file);
}

export function setMindMapVariable(bread: MindMapNode[]) {
    (window as any).mlsBreadcrumbMindMap = bread;
}

export function getMindMapVariable(): MindMapNode[] {
    return (window as any).mlsBreadcrumbMindMap || []
}



//-------------IMPLEMENTATION---------------------

async function _getMindMapByFile(file: mls.stor.IFileInfo): Promise<MindMapData | undefined> {

    const src = await file.getContent() as string;
    const jsonRaw = extractJsonFromAsIs(src);
    const data = buildMindMapFromInsights(jsonRaw);
    data.nodes = data.nodes.map((i) => {

        i = {
            ...i,
            related: Array.from(new Set(i.related))
        }
        if (i.related.length <= 1 && !['imports', 'asIs'].includes(i.id)) i.related = [];
        return i

    });
    return data;
}

function extractJsonFromAsIs(source: string): any {
    const firstBrace = source.indexOf("{");
    if (firstBrace === -1) {
        throw new Error("Nenhum '{' encontrado na string.");
    }

    let depth = 0;
    let endIndex = -1;

    for (let i = firstBrace; i < source.length; i++) {
        const char = source[i];

        if (char === "{") depth++;
        if (char === "}") depth--;

        if (depth === 0) {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) {
        throw new Error("JSON malformado: não foi possível fechar '}'.");
    }

    const jsonText = source.slice(firstBrace, endIndex + 1);

    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("JSON bruto extraído:\n", jsonText);
        throw new Error("Falha ao fazer parse do JSON extraído.");
    }
}

function buildMindMapFromInsights(input: any): MindMapData {
    const nodes: MindMapNode[] = [];

    const centerId = `service:${input.meta.fileReference}`;

    // Helper: cria nó e já registra
    const pushNode = (node: MindMapNode) => {
        nodes.push(node);
        return node;
    };

    // Helper: dedup no final
    const normalizeRelations = () => {
        nodes.forEach(n => {
            n.related = Array.from(new Set(n.related));
        });
    };

    const fileKey = input.meta.fileReference;

    // Center node (related será preenchido dinamicamente)
    const centerNode = pushNode({
        id: fileKey + '_' + centerId,
        label: input.meta.fileReference,
        type: "main",
        meta: { fileKey },
        related: []
    });

    // ---------------- LANGUAGES ----------------
    if (Array.isArray(input.meta.languages) && input.meta.languages.length) {
        const groupId = fileKey + '_' + "language";

        const groupNode = pushNode({
            id: groupId,
            label: "Languages",
            type: "language",
            meta: { fileKey },
            related: []
        });

        centerNode.related.push(groupId);

        input.meta.languages.forEach((lang: string) => {
            const id = fileKey + '_' + `lang:${lang}`;

            pushNode({
                id,
                label: lang.toUpperCase(),
                type: "attributes",
                meta: { fileKey },
                related: [groupId]
            });

            groupNode.related.push(id);
        });
    }

    // ---------------- WEB COMPONENTS ----------------
    if (Array.isArray(input.references?.webComponents) && input.references.webComponents.length) {
        const groupId = fileKey + '_' + "webComponents";

        const groupNode = pushNode({
            id: groupId,
            label: "Web Components",
            type: "webcomponent",
            meta: { fileKey },
            related: []
        });

        centerNode.related.push(groupId);

        input.references.webComponents.forEach((wc: string) => {
            const id = fileKey + '_' + `wc:${wc}`;

            pushNode({
                id,
                label: wc,
                type: "file_wc",
                related: [groupId],
                meta: { fileKey },
                navigate: true
            });

            groupNode.related.push(id);
        });
    }

    // ---------------- IMPORTS ----------------
    if (Array.isArray(input.references?.imports) && input.references.imports.length) {
        const groupId = fileKey + '_' + "imports";

        const groupNode = pushNode({
            id: groupId,
            label: "Imports",
            type: "imports",
            meta: { fileKey },
            related: []
        });

        centerNode.related.push(groupId);

        input.references.imports.forEach((imp: any) => {
            const importId = fileKey + '_' + `import:${imp.ref}`;

            let text = '';
            (imp.dependencies || []).forEach((dep: any) => {
                text = `${text}<li>${dep.name}</li>`
            });
            if (text !== '') text = `<ul>${text}</ul>`;

            pushNode({
                id: importId,
                label: imp.ref,
                type: "file",
                related: [groupId],
                navigate: true,
                meta: { fileKey },
                description: text
            });

            groupNode.related.push(importId);

        });
    }

    // ---------------- CODE INSIGHTS ----------------
    const insights = input.codeInsights || {};
    if (Object.keys(insights).length) {
        const groupId = fileKey + '_' + "codeInsights";

        const groupNode = pushNode({
            id: groupId,
            label: "Code Insights",
            type: "codeInsights",
            meta: { fileKey },
            related: []
        });

        centerNode.related.push(groupId);

        Object.entries(insights).forEach(([key, value]) => {
            const sectionId = fileKey + '_' + `insight:${key}`;
            let description = joinStringArrayDescription(value);
            description = description === '<ul></ul>' ? '' : description;

            pushNode({
                id: sectionId,
                label: key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
                type: "text",
                related: [groupId],
                meta: { fileKey },
                description
            });

            groupNode.related.push(sectionId);
        });
    }

    // ---------------- AS IS ----------------
    const asIs = input.asIs || {};
    const semantic = asIs.semantic || {};

    if (Object.keys(semantic).length) {
        const groupId = fileKey + '_' + "asIs";

        const groupNode = pushNode({
            id: groupId,
            label: "As Is",
            type: "asIs",
            meta: { fileKey },
            related: ['asIs:semantic']
        });

        centerNode.related.push(groupId);

        const semanticId = fileKey + '_' + "asIs:semantic";
        const semanticNode = pushNode({
            id: semanticId,
            label: "Semantic",
            type: "attributes",
            meta: { fileKey },
            related: [groupId]
        });

        groupNode.related.push(semanticId);

        Object.entries(semantic).forEach(([key, value]) => {
            const nodeId = fileKey + '_' + `asIs:semantic:${key}`;
            let description = joinStringArrayDescription(value);
            description = description === '<ul></ul>' ? '' : description;

            pushNode({
                id: nodeId,
                label: key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
                type: "text",
                related: [semanticId],
                meta: { fileKey },
                description
            });

            semanticNode.related.push(nodeId);
        });
    }

    normalizeRelations();

    return {
        current: fileKey + '_' + centerId,
        nodes
    };
}

function joinStringArrayDescription(value: any): string | undefined {
    if (Array.isArray(value) && value.every(v => typeof v === "string")) {
        return `<ul>${value.map((i) => `<li>${i}</li>`).join("\n")}</ul>`;
    }
    if (typeof value === "string") {
        return value;
    }
    return undefined;
}


export type MindMapSelected = MindMapSelectedFile | MindMapSelectedPlugin;

export interface MindMapSelectedBase {
    plugin: Function; // function to get informations
    args: string;
}

export interface MindMapSelectedFile extends MindMapSelectedBase {
    type: "file",
    file: mls.stor.IFileInfo; // file selected , level, project, shortName, folder, extension
    organism?: string;
    widget?: string;
    modelType?: mls.editor.ModelType; // .ts , .html, .less, .test.ts, .defs.ts
}

export interface MindMapSelectedPlugin extends MindMapSelectedBase {
    type: "plugin",
    file: mls.stor.IFileInfo; // file selected , level, project, shortName, folder, extension    
}

export type MindMapNodeType =
    | 'main'
    | 'asIs'
    | 'codeInsights'
    | 'webcomponent'
    | 'imports'
    | 'language'
    | 'attributes'
    | 'file'
    | 'file_wc'
    | 'text';

export interface MindMapNode {
    id: string;             // unique identifier
    label: string;          // label shown on the node
    type: MindMapNodeType;
    related: string[];      // ids of related nodes
    meta: Record<string, any>; // optional metadata;
    description?: string,
    navigate?: boolean
}

export interface MindMapData {
    current: string;
    nodes: MindMapNode[];
}

export interface MindMapNodeStyle {
    fill: string;    // Circle background color
    stroke: string;  // Circle border color
    text: string;    // Text color
}

export type MindMapNodeStyles = Record<string, MindMapNodeStyle>;
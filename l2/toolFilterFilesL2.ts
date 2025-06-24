/// <mls shortName="toolFilterFilesL2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITool, svg_tool } from './_100554_aiAgentBase';
const toolName = "toolFileFilter";
type FilterOp = "equals" | "startsWith" | "endsWith" | "contains" | "regex" | "isTrue" | "isFalse";
interface FileFilter {
    field: string;
    op: FilterOp;
    value?: string | number;
}
interface Args {
    filters: FileFilter[];
}
// Define a type for file objects for better type safety
interface FileObj {
    [key: string]: any;
    extension?: string;
}
export function createTool(): ITool {
    return {
        toolName,
        tool_url: svg_tool,
        description: "Filtra uma lista de arquivos com base em critérios como extensão, nome, erro, status, entre outros.",
        argsSchema: {
            filters: {
                type: "array",
                description: "Lista de filtros a aplicar nos arquivos.",
                items: {
                    type: "object",
                    properties: {
                        field: { type: "string", description: "Campo do arquivo a ser filtrado." },
                        op: { type: "string", description: "Operador de comparação (equals, startsWith, endsWith, contains, regex, isTrue, isFalse)." },
                        value: { type: ["string", "number"], description: "Valor a ser comparado (se aplicável).", optional: true }
                    }
                }
            }
        },
        async execute(args: Args): Promise<string> {
            const { filters } = args;
            const actualProject = mls.actual[5].project;
            if (!actualProject) throw new Error('Project ID is missing or invalid. Cannot filter files without a valid project context.');
            // Get files with explicit typing
            const files: FileObj[] = Object.keys(mls.stor.files)
                .filter((item) =>
                    item.startsWith(`${actualProject}_2`) &&
                    ['.html', '.ts', '.less'].includes(mls.stor.files[item].extension)
                )
                .map((item) => mls.stor.files[item]);
            function isValidRegex(pattern: string): boolean {
                try {
                    new RegExp(pattern);
                    return true;
                } catch {
                    return false;
                }
            }
            function matches(file: FileObj, filter: FileFilter): boolean {
                const fieldValue = file[filter.field];
                switch (filter.op) {
                    case "equals":
                        return fieldValue === filter.value;
                    case "startsWith":
                        return typeof fieldValue === "string" && typeof filter.value === "string" && fieldValue.startsWith(filter.value);
                    case "endsWith":
                        return typeof fieldValue === "string" && typeof filter.value === "string" && fieldValue.endsWith(filter.value);
                    case "contains":
                        return typeof fieldValue === "string" && typeof filter.value === "string" && fieldValue.includes(filter.value);
                    case "regex":
                        if (typeof fieldValue === "string" && typeof filter.value === "string" && isValidRegex(filter.value)) {
                            return new RegExp(filter.value).test(fieldValue);
                        }
                        return false;
                    case "isTrue":
                        return fieldValue === true;
                    case "isFalse":
                        return fieldValue === false;
                    default:
                        return false;
                }
            }
            const result = files.filter(file =>
                filters.every(filter => matches(file, filter))
            ).map(item => ({
                project: item.project,
                level: item.level,
                shortName: item.shortName,
                folder: item.folder,
                extension: item.extension
            }));

            console.info(result);
            return ` Arquivos filtrados: ${JSON.stringify(result)}`;
        }
    };
}

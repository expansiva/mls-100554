/// <mls shortName="toolFilterFilesL2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITool, svg_tool } from '/_100554_/l2/aiAgentBase.js';
const toolName = "toolFileFilter";
type FilterOp = "equals" | "startsWith" | "endsWith" | "contains" | "regex" | "isTrue" | "isFalse" | "between";

interface FileFilter {
    field: string;
    op: FilterOp;
    value?: string | number | [string, string];
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
                        value: { type: ["string", "number", "array"], description: "Valor a ser comparado (se aplicável).", optional: true }
                    }
                }
            }
        },
        async execute(args: Args): Promise<string> {
            const { filters } = args;
            if (!filters || filters.length === 0) return `## Arquivos filtrados: \n\n []`;
            const actualProject = mls.actualProject;
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
                    case "between":
                        if (
                            filter.field === "updatedAt" &&
                            typeof fieldValue === "string" &&
                            Array.isArray(filter.value) &&
                            filter.value.length === 2 &&
                            typeof filter.value[0] === "string" &&
                            typeof filter.value[1] === "string"
                        ) {
                            const fileDateUTC = new Date(fieldValue);
                            const fileDateLocal = new Date(
                                fileDateUTC.getTime() + fileDateUTC.getTimezoneOffset() * 60000 * -1
                            );

                            const start = new Date(filter.value[0]);
                            const end = new Date(filter.value[1]);

                            return fileDateLocal >= start && fileDateLocal <= end;
                        }
                        return false;
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

            return `## Arquivos filtrados: \n\n ${JSON.stringify(result)}`;
        }
    };
}


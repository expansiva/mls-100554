/// <mls shortName="jsDocLib" project="100554" enhancement="_blank" />

export function getJson(docTS: string, onlyWithComents: boolean = false): IMembersResult[] {

    const docsJS: IJSDocMember[] = !docTS ? exDoc : JSON.parse(docTS);
    const docs: IMembersResult[] = [];

    docsJS.forEach((item, index) => {

        if (!item.name) return;

        if (onlyWithComents
            && !item.comment
            && (!item.parameters || item.parameters.length === 0)
            && (!item.members || item.members.length === 0 || item.members[0].name === item.name)
        ) return;

        const doc: IMembersResult = {
            name: item.name,
            pos: item.pos || 0,
            type: item.type,
            comment: item.comment,
            parameters: item.parameters || [],
            modifiers: [],
            members: [],
            id: index,
            tags: [],
            otherTags: []
        };

        const { otherTags, mainTags } = getTags(item.tags || []);
        doc.tags = mainTags;
        doc.otherTags = otherTags;

        if (item.members) {
            for (let i = 0; i < item.members.length; i++) {
                const newMember = createMember(item.members[i], +`${index}${i}`, item.pos, onlyWithComents);
                if (newMember && doc && doc.members) doc.members.push(newMember);
            }
        }
        if (doc) docs.push(doc);

    });

    return docs;
}

function createMember(member: IJSDocMember, indexParent: number, posParent: number | undefined, onlyWithComents: boolean) {

    const { comment, members, type, tags, parameters, name, modifiers, pos } = member;
    if (!name) return undefined;
    const newMember: IMembersResult = {
        comment,
        modifiers: [],
        name,
        parameters: parameters || [],
        members: [],
        tags: [],
        otherTags: [],
        id: indexParent,
        pos: pos || posParent,
        type
    };
    const { otherTags, mainTags } = getTags(tags || []);
    newMember.tags = mainTags;
    newMember.otherTags = otherTags;

    if (modifiers) {
        modifiers.forEach((modifier) => {
            newMember.modifiers.push({ name: modifier });
        });
    }

    if (members) {
        for (let i = 0; i < members.length; i++) {
            const newMember2 = createMember(members[i], +`${indexParent}${i}`, member.pos, onlyWithComents);
            if (newMember2) newMember2.members?.push(newMember);
        }
    }

    return newMember;

}

function getTags(array: IJSDocTag[]): { mainTags: ITagResult[], otherTags: ITagResult[] } {
    const tags = array.map((item) => item.tagName);
    const newArrayTags = Array.from(new Set([...tags]));
    const mainTags: ITagResult[] = [];
    const otherTags: ITagResult[] = [];
    const arrMainTags = ['throws', 'event', 'todo', 'param', 'result', 'link', 'see']
    const a = newArrayTags.map((item) => array.filter((item2) => item2.tagName === item));
    a.forEach((item) => {
        const comments: any[] = [];
        item.forEach((t) => {
            let c: string = (t as any).comment;
            if (t.tagName === 'see' || t.tagName === 'link') {
                c = c.replace(/{@link/g, '').replace(/{ @link/g, '').replace(/}/g, '');
                c = `<a href="${c}" target="_blank">${c}</a>`;
            }
            comments.push({ comment: c });
        });
        const { tagName } = item[0];
        if (arrMainTags.includes(tagName)) mainTags.push({ tagName: item[0].tagName, comments });
        else otherTags.push({ tagName: item[0].tagName, comments });
    });

    return { otherTags, mainTags };
}

const exDoc: IJSDocMember[] = [
    {
        "name": "testType1",
        "pos": 0,
        "type": "type",
        "comment": "use testType for documentation example",
        "tags": []
    },
    {
        "name": "testDoc",
        "pos": 368,
        "type": "interface",
        "comment": "interface for test documentations\n\nUse Markdown, ex: from https://google.github.io/styleguide/jsguide.html#jsdoc\nComputes weight based on three factors:\n\n - items sent\n - items received\n - last timestamp",
        "tags": [],
        "members": [
            {
                "name": "optional1",
                "type": "string",
                "comment": "test for modifier optional",
                "modifiers": [
                    "optional"
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties"
                    }
                ]
            },
            {
                "name": "testExternalDoc",
                "type": "string",
                "comment": "doc for parameter testExternalDoc (in class doc)",
                "modifiers": [],
                "tags": []
            },
            {
                "name": "y",
                "type": "number",
                "comment": "test for modifier readonly",
                "modifiers": [
                    "readonly"
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties"
                    }
                ]
            },
            {
                "name": "[index]",
                "type": "unknown",
                "comment": "test for index property",
                "modifiers": [
                    "index"
                ],
                "parameters": [
                    {
                        "name": "propName",
                        "pos": 1183,
                        "comment": "",
                        "type": "string",
                        "modifiers": []
                    }
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks"
                    }
                ]
            },
            {
                "name": "(call)",
                "type": "boolean",
                "comment": "test for functions types",
                "modifiers": [
                    "call"
                ],
                "parameters": [
                    {
                        "name": "source",
                        "pos": 1338,
                        "comment": "",
                        "type": "string",
                        "modifiers": []
                    },
                    {
                        "name": "subString",
                        "pos": 1353,
                        "comment": "",
                        "type": "string",
                        "modifiers": []
                    }
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#function-types"
                    }
                ]
            },
            {
                "name": "[index]",
                "type": "string",
                "comment": "test for Indexable Types",
                "modifiers": [
                    "index"
                ],
                "parameters": [
                    {
                        "name": "index",
                        "pos": 1511,
                        "comment": "",
                        "type": "number",
                        "modifiers": []
                    }
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#indexable-types"
                    }
                ]
            },
            {
                "name": "setTime",
                "type": "void",
                "comment": "test for interface class type",
                "modifiers": [],
                "parameters": [
                    {
                        "name": "d",
                        "pos": 1705,
                        "comment": "doc for parameter d",
                        "type": "Date",
                        "modifiers": []
                    },
                    {
                        "name": "e",
                        "pos": 1713,
                        "comment": "",
                        "type": "string",
                        "modifiers": []
                    }
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#class-types"
                    }
                ]
            },
            {
                "name": "testNoDoc",
                "type": "unknown",
                "comment": "",
                "modifiers": [],
                "tags": []
            },
            {
                "name": "(construct)",
                "type": "testDoc",
                "comment": "test for interface constructor",
                "modifiers": [
                    "construct"
                ],
                "parameters": [
                    {
                        "name": "property",
                        "pos": 1981,
                        "comment": "doc for parameter property",
                        "type": "string",
                        "modifiers": []
                    }
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "link",
                        "comment": "https://www.typescriptlang.org/docs/handbook/interfaces.html#class-types"
                    }
                ]
            }
        ]
    },
    {
        "name": "clTest2",
        "pos": 2010,
        "type": "class",
        "comment": "comment for class 2",
        "members": [
            {
                "name": "f1",
                "pos": 2128,
                "type": "function",
                "comment": "comment for f1\ncomment for f1",
                "modifiers": [],
                "parameters": [
                    {
                        "name": "_a",
                        "pos": 2452,
                        "comment": "",
                        "type": "string",
                        "modifiers": []
                    },
                    {
                        "name": "_b",
                        "pos": 2486,
                        "comment": "",
                        "type": "any",
                        "modifiers": [
                            "optional"
                        ]
                    }
                ],
                "tags": [
                    {
                        "name": "",
                        "tagName": "result",
                        "comment": "nothing"
                    },
                    {
                        "name": "b",
                        "tagName": "param",
                        "comment": "b must by any"
                    },
                    {
                        "name": "",
                        "tagName": "todo",
                        "comment": "Don't forget the milk"
                    },
                    {
                        "name": "",
                        "tagName": "todo",
                        "comment": "Make this method do something useful"
                    },
                    {
                        "name": "",
                        "tagName": "event",
                        "comment": "document#mousedown y"
                    },
                    {
                        "name": "",
                        "tagName": "throws",
                        "comment": "Error exception if a > 10"
                    },
                    {
                        "name": "",
                        "tagName": "throws",
                        "comment": "BadError something bad happened"
                    },
                    {
                        "name": "",
                        "tagName": "result",
                        "comment": "nothing"
                    }
                ]
            },
            {
                "name": "clTest",
                "pos": 2559,
                "type": "function",
                "comment": "constructor of clTest \n<br>\nExample\n```\nvar me = getMe();\n\n// do one\n\nme.one();\n\n```",
                "modifiers": [
                    "public"
                ],
                "tags": []
            },
            {
                "name": "v1",
                "pos": 2705,
                "type": "property",
                "comment": "",
                "modifiers": [
                    "public"
                ],
                "tags": []
            }
        ],
        "tags": [
            {
                "name": "v1",
                "tagName": "param",
                "comment": "comment for member v1 (error, must be next to v1)"
            }
        ]
    }
]

export interface IJSDocParameter {
    name: string;
    pos: number;
    comment: string;
    type: string;
    modifiers: string[];
}

export interface IJSDocTag {
    name: string;
    tagName: string;
    comment: string;
}

export interface IJSDocMember {
    name: string;
    pos?: number;
    type: string;
    comment: string;
    modifiers?: string[];
    parameters?: IJSDocParameter[];
    members?: IJSDocMember[];
    tags?: IJSDocTag[];
}

export interface IMembersResult {
    name: string,
    comment: string,
    modifiers: IModifiersResult[],
    members?: IMembersResult[];
    type: string,
    pos: number | undefined,
    id: number,
    tags: ITagResult[],
    otherTags: ITagResult[],
    parameters: IParameters[]
}

export interface IParameters {
    name: string,
    comment: string,
    type: string
}

export interface ITagResult {
    comments: ITagsComment[],
    tagName: string
}

export interface ITagsComment {
    comment: string,
}

export interface IModifiersResult {
    name: string
}
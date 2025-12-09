/// <mls shortName="agentProjectSearch2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { PayLoad1, getPayload1 } from '/_100554_/l2/agentProjectSearch.js'

import {
    notifyTaskChange,
    updateStepStatus,
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName
} from "/_100554_/l2/aiAgentHelper.js";

import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask,
} from "/_100554_/l2/aiAgentOrchestration.js";

const agentName = "agentProjectSearch2";
const project: number = mls.actualProject || 1;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a new Module - step 2",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Searching...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const payload1 = getPayload1Mock(); // use mock
        const contextToLLM = await getContextToLLM(payload1);
        const inputs: mls.msg.IAMessageInputType[] = await getPrompts(payload1.userPrompt, contextToLLM);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}] [beforePrompt]: No pending step found for this agent.`);
    }

    const payload1 = getPayload1(context);
    const contextToLLM = await getContextToLLM(payload1);
    const inputs: mls.msg.IAMessageInputType[] = await getPrompts(payload1.userPrompt, contextToLLM);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    notifyTaskChange(context);
    await executeNextStep(context);
}

async function getContextToLLM(payload1: PayLoad1): Promise<string> {
    const defsScores: DefsResult = await scanDefsFiles(payload1, project);
    let htmlScores = await scanSourceFiles(payload1.optionalSearchHTML || '', project, ".html", 'Html');
    let tsScores = await scanSourceFiles(payload1.optionalSearchTS || '', project, ".ts", 'TS');
    let lessScores = await scanSourceFiles(payload1.optionalSearchLess || '', project, ".less", 'Less');
    defsScores.bm25 = [...defsScores.bm25 || [], ...htmlScores, ...tsScores, ...lessScores];
    const finalResult = consolidateDefsResult(defsScores);
    const contextToLLM = JSON.stringify(finalResult, null, 2);
    return contextToLLM;
}

async function getPrompts(userPrompt: string, contextToLLM: string): Promise<mls.msg.IAMessageInputType[]> {
    if (!userPrompt) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);

    const data = {
        userPrompt,
        contextToLLM
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
    return prompts;
}

function getPayload1Mock(): PayLoad1 {
    return {
        userPrompt: "qual pagina faz o login no sistema",
        optionalSearchHTML: "data nascimento",
        "textToEmbedding": "login page authentication user access credentials sign in authentication flow login form session start user authentication login screen",
        "principalSearch": "login authentication page",
        "embedding": "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",
        "embeddingVersion": "openai-text-embedding-3-small,len:512x1,compressed:2508,version:2"

    }
}

// a -> search vector (1D)
// b -> defs vectors (2D)
function cosineSimilarity(
    docId: string,
    texts: string[],
    a: number[],
    b: number[] | number[][]
): ScanDefsFileRAG {
    if (Array.isArray(a[0])) throw new Error("Search vector must be a 1D vector");
    if (!Array.isArray(b[0])) throw new Error("Defs vectors must be a 2D array");
    if (texts.length !== b.length) {
        throw new Error(
            `Texts and embedding vectors must have the same length. Got ${texts.length} and ${b.length}`
        );
    }

    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0)) || 1;

    const compute = (vec: number[]) => {
        const dot = a.reduce((sum, val, i) => sum + val * vec[i], 0);
        const normB = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0)) || 1;
        return dot / (normA * normB);
    };

    let bestScore = -Infinity;
    const text: string[] = [];

    for (let i = 0; i < (b as number[][]).length; i++) {
        const score = compute((b as number[][])[i]);
        if (score > bestScore) {
            bestScore = score;
            text.push(texts[i]);
        }
    }

    return {
        docId,
        bestScore: Number(bestScore.toFixed(2)),
        text
    };
}

function formatBM25ForLLM(result: BM25ScoredEntry, type: BM25FileType): BM25ForLLMResult[] {
    const formatted: BM25ForLLMResult[] = [];
    for (const file in result.postings) {
        const post = result.postings[file];
        const snippets = post.snippets.map(s => s.text.trim());
        formatted.push({
            origin: file,
            type,
            score: Number(result.scores[file].toFixed(2)) || 0,
            snippets
        });
    }
    return formatted;
}

function consolidateRAGWithRealScore(
    entries: ScanDefsFileRAG[],
    topN: number = 5,
    minScore: number = 5.0,
): ScanDefsFileRAG[] {
    return entries
        .filter(e => e.bestScore >= minScore)        // keep only relevant scores
        .sort((a, b) => b.bestScore - a.bestScore)   // sort descending by score
        .slice(0, topN);                              // pick top N
}

function consolidateBM25WithRealScore(
    entries: BM25IndexEntry[],
    topN: number = 5,
    minScore: number = 0.0,
    k: number = 1.2,
    b: number = 0.75
): BM25ScoredEntry {
    const postings: BM25IndexEntry['postings'] = {};
    const N = entries.length;
    let df = 0;
    let totalLength = 0;

    // Merge postings and calculate df
    for (const entry of entries) {
        for (const docId in entry.postings) {
            const post = entry.postings[docId];
            if (!postings[docId]) {
                postings[docId] = post;
                totalLength += post.fileLength;
                df++;
            }
        }
    }

    const avgdl = totalLength / df;
    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

    // Calculate BM25 scores
    const scored: { docId: string; score: number }[] = [];

    for (const docId in postings) {
        const { count: f, fileLength: dl } = postings[docId];
        const numerator = f * (k + 1);
        const denominator = f + k * (1 - b + b * (dl / avgdl));
        const score = idf * (numerator / denominator);

        if (score >= minScore) {
            scored.push({ docId, score });
        }
    }

    // Sort and slice topN
    const topDocs = scored.sort((a, b) => b.score - a.score).slice(0, topN);

    // Build final postings with only topN
    const finalPostings: BM25IndexEntry['postings'] = {};
    const scores: Record<string, number> = {};

    for (const doc of topDocs) {
        finalPostings[doc.docId] = postings[doc.docId];
        scores[doc.docId] = doc.score;
    }

    return {
        df: Object.keys(finalPostings).length,
        postings: finalPostings,
        scores
    };
}

// BM25 partial index with snippets for use in RAG
function buildBM25PartialIndex(
    docId: string,
    source: string,
    searchText: string | RegExp
): BM25IndexEntry | null {
    const stopWords = new Set(["a", "or", "and", "the", "in", "on", "is", "to", "for", "of"]);

    // Normalize source to lowercase
    const sourceLower = source.toLowerCase();
    const lines = source.split(/\r?\n/);

    let terms: string[] = [];
    let termRegexes: RegExp[] = [];

    if (searchText instanceof RegExp) {
        termRegexes = [searchText];
    } else {
        terms = searchText
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, "")       // remove punctuation
            .split(/\s+/)                  // split by spaces
            .filter(w => w.length > 1 && !stopWords.has(w)); // remove short/common words

        if (terms.length === 0) return null;

        termRegexes = terms.map(term => new RegExp(`\\b${term}\\b`, "gi")); // exact word match
    }

    const matchMap = new Map<number, Snippet>();
    let count = 0;

    for (const regex of termRegexes) {
        let match: RegExpExecArray | null;
        regex.lastIndex = 0;

        while ((match = regex.exec(sourceLower)) !== null) {
            const charIndex = match.index;

            // Find the line number of the match
            let lineStart = 0;
            let charCount = 0;
            for (let i = 0; i < lines.length; i++) {
                charCount += lines[i].length + 1;
                if (charCount > charIndex) {
                    lineStart = i;
                    break;
                }
            }

            const lineEnd = Math.min(lines.length - 1, lineStart + 1);
            const snippetText = lines.slice(lineStart, lineEnd + 1).join("\n");

            if (!matchMap.has(lineStart)) {
                matchMap.set(lineStart, {
                    text: snippetText,
                    lineStart: lineStart + 1,
                    lineEnd: lineEnd + 1
                });
                count++;
                if (count >= 5) break;
            }

            if (regex.lastIndex === match.index) regex.lastIndex++; // prevent infinite loop
        }
    }

    if (matchMap.size === 0) return null;

    return {
        df: 1,
        postings: {
            [docId]: {
                count,
                fileLength: source.split(/\s+/).length, // crude file size by word count
                positions: [], // optional: pode ser preenchido depois
                snippets: [...matchMap.values()]
            }
        }
    };
}

function consolidateDefsResult(result: DefsResult): DefsConsolidatedResult[] {
    const consolidated: Map<string, DefsConsolidatedResult> = new Map();

    // Process RAG
    if (result.rag) {
        for (const entry of result.rag) {
            consolidated.set(entry.docId, {
                docId: entry.docId,
                ragScore: entry.bestScore,
                ragText: Array.isArray(entry.text) ? entry.text : [entry.text],
            });
        }
    }

    // Process BM25: types: Meta, TS, Html or Less
    if (result.bm25) {
        for (const entry of result.bm25) {
            const existing = consolidated.get(entry.origin);
            const updated: DefsConsolidatedResult = {
                docId: entry.origin,
                ...existing,
            };
            updated[`bm25${entry.type}Score`] = entry.score;
            updated[`bm25${entry.type}Snippets`] = entry.snippets;
            consolidated.set(entry.origin, updated);
        }
    }

    return Array.from(consolidated.values());
}

async function scanSourceFiles(
    searchText: string,
    project: number,
    extension: string,
    type: BM25FileType
): Promise<(BM25ForLLMResult[])> {
    const promises: Promise<BM25IndexEntry | null>[] = [];
    if (!searchText) return [];
    for (const key of Object.keys(mls.stor.files)) {
        const file = mls.stor.files[key];
        if (
            file.project !== project ||
            file.level !== 2 ||
            file.extension !== extension
        ) continue;
        promises.push(scanSourceFiles2(searchText, file));
    }
    let results: (BM25IndexEntry | null)[] = await Promise.all(promises);
    const bm25: BM25IndexEntry[] = results.filter((r): r is BM25IndexEntry => r !== null);
    if (bm25.length > 0) {
        const result = consolidateBM25WithRealScore(bm25, 5 /* top 5 */, 0.1 /* minScore */)
        return formatBM25ForLLM(result, type);
    }
    return [];
}

async function scanDefsFiles(
    payload1: PayLoad1,
    project: number
): Promise<(DefsResult)> {
    const promises: Promise<ScanDefsFileResult | null>[] = [];

    for (const key of Object.keys(mls.stor.files)) {
        const file = mls.stor.files[key];
        if (
            file.project !== project ||
            file.level !== 2 ||
            file.extension !== ".defs.ts"
        ) continue;
        promises.push(scanDefsFiles2(payload1, file));
    }
    let results: (ScanDefsFileResult | null)[] = await Promise.all(promises);
    const nonNullResults: ScanDefsFileResult[] = results.filter((r): r is ScanDefsFileResult => r !== null);
    const bm25: BM25IndexEntry[] = nonNullResults
        .map(r => r.bm25)
        .filter((b): b is BM25IndexEntry => b !== null);
    const rag: ScanDefsFileRAG[] = nonNullResults
        .map(r => r.rag)
        .filter((b): b is ScanDefsFileRAG => b !== null);

    const finalResult: DefsResult = {
        bm25: undefined,
        rag: undefined
    };
    if (bm25.length > 0) {
        const result = consolidateBM25WithRealScore(bm25, 5 /* top 5 */, 0.1 /* minScore */)
        finalResult.bm25 = formatBM25ForLLM(result, 'Meta');
    }
    if (rag.length > 0) {
        finalResult.rag = consolidateRAGWithRealScore(rag, 5 /* top 5 */, 0.2 /* minScore */)
    }
    return finalResult;
}

async function scanSourceFiles2(
    searchText: string,
    file: mls.stor.IFileInfo,
): Promise<BM25IndexEntry | null> {
    const fileNoExtension: string = `${file.shortName}`;
    try {
        const source: string | Blob | null = await file.getContent("");
        if (typeof source !== "string") return null;
        return buildBM25PartialIndex(fileNoExtension, source, searchText);
    } catch (e) {
        console.log('error on ', file.shortName, e)
        return null;
    }
}

async function scanDefsFiles2(
    payload1: PayLoad1,
    file: mls.stor.IFileInfo
): Promise<ScanDefsFileResult | null> {
    const fileJS: string = `/_${file.project}_/l2/${file.shortName}.defs.js`;
    const fileNoExtension: string = `${file.shortName}`;
    try {
        const url = await mls.stor.cache.getURL(file.project, file.folder, file.shortName, file.extension.replace(".ts", ".js"), file.versionRef)
        if (!url) {
            console.log('incorrect .defs.ts file: ', fileJS)
            return null;
        }
        const mod = await import(fileJS);
        const defs = mod.defs as mls.l4.BaseDefs;
        if (!defs) return null;

        let rag: ScanDefsFileRAG | null = null;
        if (payload1.embeddingVector && Array.isArray(defs.textToEmbedding) && defs.embedding) {
            const vectorb = mls.l4.decompressVector(defs.embedding);
            rag = cosineSimilarity(fileNoExtension, defs.textToEmbedding, payload1.embeddingVector as number[], vectorb)
        }

        let bm25: BM25IndexEntry | null = null;
        if (payload1.principalSearch) {
            bm25 = buildBM25PartialIndex(fileNoExtension, JSON.stringify(defs, null, 2), payload1.principalSearch);
        }
        return { bm25, rag };
    } catch (e) {
        console.log('error on ', file.shortName, e)
        return null;
    }
}

interface DefsResult {
    bm25?: BM25ForLLMResult[];
    rag?: ScanDefsFileRAG[];
}

interface BM25ScoredEntry extends BM25IndexEntry {
    scores: {
        [docId: string]: number;
    };
}

type BM25FileType = 'Meta' | 'TS' | 'Html' | 'Less';

interface BM25ForLLMResult {
    origin: string;
    type: BM25FileType;
    score: number;
    snippets: string[];
}

interface ScanDefsFileResult {
    bm25: BM25IndexEntry | null;
    rag: ScanDefsFileRAG | null;
}

interface ScanDefsFileRAG {
    docId: string;
    bestScore: number;
    text: string[];
}

interface BM25IndexEntry {
    df: number;
    postings: {
        [docId: string]: {
            count: number;
            fileLength: number;
            positions: number[];
            snippets: Snippet[];
        };
    };
}

interface Snippet {
    text: string;      // Extracted lines of code (up to 10 lines)
    lineStart: number; // Line number where snippet starts (1-based)
    lineEnd: number;   // Line number where snippet ends
}

interface DefsConsolidatedResult {
    docId: string;
    ragScore?: number;
    ragText?: string[];
    bm25MetaScore?: number;
    bm25MetaSnippets?: string[];
    bm25TSScore?: number;
    bm25TSSnippets?: string[];
    bm25HtmlScore?: number;
    bm25HtmlSnippets?: string[];
    bm25LessScore?: number;
    bm25LessSnippets?: string[];
}

// async function teste1() {
//     const payload1 = getPayload1Mock();
//     if (!payload1.embeddingVector) {
//         payload1.embeddingVector = mls.l4.decompressVector(payload1.embedding || '');
//     }
//     const finalResult = await getContextToLLM(payload1);
//     console.log('--- final');
//     console.log(finalResult);
// }

// teste1();

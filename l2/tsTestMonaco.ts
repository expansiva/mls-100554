/// <mls shortName="tsTestMonaco" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

const _editor = Symbol("ignoredProperty");


/**
 * class to interface with monaco models
 */
export class MonacoDriver {

    [_editor]: monaco.editor.IStandaloneCodeEditor | undefined;

    constructor(editor: monaco.editor.IStandaloneCodeEditor) {
        this[_editor] = editor;
    }

    public getLines(model: monaco.editor.ITextModel): string[] {
        const lines: string[] = model.getLinesContent();
        return lines;
    }

    public replaceLines(model: monaco.editor.ITextModel, lineNrInit: number, lineNrInitEnd: number, newContent: string): boolean {
        if (lineNrInit < 1 || lineNrInitEnd < lineNrInit || lineNrInitEnd > model.getLineCount()) {
            console.warn('Invalid line range.');
            return false;
        }

        const startColumn = 1;
        const endColumn = model.getLineContent(lineNrInitEnd).length + 1;
        const range = new monaco.Range(lineNrInit, startColumn, lineNrInitEnd, endColumn);
        const text = newContent.endsWith('\n') ? newContent : `${newContent}\n`;
        model.pushEditOperations([], [{ range, text, forceMoveMarkers: true }], () => null);
        return true;
    }


    /**
     * Inserts a new line at a specified line number.
     * Returns true if the operation is successful.
     */
    public insertLine(model: monaco.editor.ITextModel, lineNr: number, line: string): boolean {
        model.pushEditOperations(
            [], // Undo stack will automatically handle this.
            [{ range: new monaco.Range(lineNr, 1, lineNr, 1), text: line + '\n', forceMoveMarkers: true }],
            () => null
        );
        return true;
    }

    /**
     * Deletes a specified line number.
     * Returns true if the operation is successful.
     */
    public deleteLine(model: monaco.editor.ITextModel, lineNr: number): boolean {
        return this.deleteLines(model, lineNr, 1);
    }

    /**
     * Deletes a specified line numbers.
     * Returns true if the operation is successful.
     */
    public deleteLines(model: monaco.editor.ITextModel, startLine: number, countLines: number): boolean {
        model.pushEditOperations(
            [],
            [{ range: new monaco.Range(startLine, 1, startLine + countLines, 1), text: '', forceMoveMarkers: true }],
            () => null
        );
        return true;
    }

    /**
     * Updates a specified line at a particular column.
     * Returns true if the operation is successful.
     */
    public updateLine(model: monaco.editor.ITextModel, lineNr: number, columnNr: number, newText: string): boolean {

        const lineContent = model.getLineContent(lineNr);
        const startColumn = columnNr;
        const endColumn = lineContent.length + 1;;

        model.pushEditOperations(
            [],
            [{
                range: new monaco.Range(lineNr, startColumn, lineNr, endColumn),
                text: newText,
                forceMoveMarkers: true
            }],
            () => null
        );

        const newLineContent = model.getLineContent(lineNr);
        const newEndColumn = newLineContent.length + 1;;

        // if (this[_editor]) {
        //     this[_editor].setSelection(
        //         new monaco.Selection(lineNr, 1, lineNr, newEndColumn)
        //     );
        // }

        return true;
    }

    /**
     * Finalizes the current edit operation group, allowing all previous
     * changes to be undone as a single action.
     */
    public finishEdit = (model: monaco.editor.ITextModel): void => {
        model.pushStackElement(); // Marks the end of a grouped edit
    }

}


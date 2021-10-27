// note that 'onclick' is the most reliable indicator of a comment
// element, since the 'comment-text' attribute might sometimes be
// empty and hence deleted by Quill's optimization procedures.
import Quill, { RangeStatic } from "quill";

function commentIsInRange(editor: Quill, range: RangeStatic): boolean {
    let commentFound: boolean = false;

    for (let i = 0; i < range.length; i++) {
        const searchI = range.index+i;
        if ('onclick' in editor.getFormat(searchI, 1)) {
            commentFound = true;
            break;
        }
    }
    return commentFound;
}

function rangeIsWholeComment(editor: Quill, range: RangeStatic): boolean {
    const commonFormat = editor.getFormat(range)
    const allOfRangeEnclosedByComment = 'onclick' in commonFormat;
    
    if (!allOfRangeEnclosedByComment) {
        return false;
    }
    
    // does the comment stretch out before the passed range?
    if (range.index > 0) {
        const precedingFormat = editor.getFormat(range.index-1, 1);
        const precedingId = precedingFormat['comment-id'];

        if (precedingId && precedingId === commonFormat['comment-id']) {
            return false;
        }
    }

    // does the comment stretch out after the passed range?
    // (quill counts final newline character in total editor content length)
    const totalDocLength = editor.getLength();
    if ((range.index + range.length) < (totalDocLength-1)) {
        const subseqFormat = editor.getFormat(range.index + range.length + 1, 1);
        const subseqId = subseqFormat['comment-id'];

        if (subseqId && subseqId === commonFormat['comment-id']) {
            return false;
        }
    }
    return true;
}

function removeCommentFromRange(editor: Quill, range: RangeStatic) {
    const text = editor.getText(range.index, range.length);
    const formats = editor.getFormat(range);
    const commentFormatNames = ['onclick', 'comment-text', 'background'];
    const nonCommentFormats: any = {};

    Object.keys(formats)
        .filter(fName => !commentFormatNames.includes(fName))
        .forEach((fName: string) => {nonCommentFormats[fName] = formats[fName];});
    
    editor.deleteText(range.index, range.length);
    editor.insertText(range.index, text);
    editor.formatText(range.index, range.length, nonCommentFormats);

    // check if comment window is open, and if so, delete it.
    let commentEditorEl = document.querySelector('.comment-card');

    if (commentEditorEl) {
        const quillEditor = document.querySelector('quill-editor');

        quillEditor?.removeChild(commentEditorEl);
    }
}

export function commentHandlerGenerator(editor: Quill): any {
    function commentHandler(): void {
        const range = editor.getSelection();
        if (range == null || range.length == 0) return;
        if (rangeIsWholeComment(editor, range)) {
            removeCommentFromRange(editor, range);
            return;
        }
        const pieceHasComment = commentIsInRange(editor, range);

        if (pieceHasComment) {
            return;
        }
        editor.format('comment', true);
        editor.format('background', 'rgba(156, 39, 176, 0.4)');
    };
    
    return commentHandler;
};

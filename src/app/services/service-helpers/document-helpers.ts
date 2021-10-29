import { Editor } from "src/app/interfaces/Editor";
import { TextDocument } from "src/app/interfaces/TextDocument";

export function docToGQLCreateObj(doc: TextDocument, ownerId: string): any {
    const gqlDocCreateVars = {
        'title': doc.title,
        'body': doc.body,
        'ownerId': ownerId,
    };

    return gqlDocCreateVars;
}

export function docToGQLUpdateObj(doc: TextDocument): any {
    const gqlDocUpdateVars = {
        'id': doc.id,
        'title': doc.title,
        'body': doc.body,
        'ownerId': doc.owner.id,
        'editorIds': doc.editors.map(editor => editor.id)
    };

    return gqlDocUpdateVars
}

// warning: impure function (for now)
export function toggleEditorById(docEds: Editor[], allEds: Editor[], toggleId: string): Editor[] {
    if (docEds.find(e => e.id === toggleId)) {
        docEds = docEds.filter(e => e.id !== toggleId);
      } else {
        const matchEditor = allEds.find(e => e.id === toggleId);
  
        if (matchEditor) {
          docEds.push(matchEditor);
        }
    }
    return docEds;
}
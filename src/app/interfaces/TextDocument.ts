import { Editor } from "./Editor";

export interface TextDocument {
    id: string, 
    title: string,
    body: string,
    owner: Editor,
    editors: Editor[]
}

export const emptyDoc: TextDocument = {
    id: '',
    title: '',
    body: '',
    owner: {username: '', id: ''},
    editors: []
};

import { Editor } from "./Editor";

export interface TextDocument {
    id: string, 
    title: string,
    body: string,
    owner: Editor,
    editors: Editor[],
    type: "regular" | "code"
}

const emptyDocBasis = {
    id: '',
    title: '',
    body: '',
    owner: {username: '', id: ''},
    editors: [],
};

export const regularEmptyDoc: TextDocument = {
    ...emptyDocBasis,
    type: "regular"
};

export const codeEmptyDoc: TextDocument = {
    ...emptyDocBasis,
    type: "code"
};
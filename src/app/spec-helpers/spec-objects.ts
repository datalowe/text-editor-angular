import { TextDocument } from "../interfaces/TextDocument";

export const testDocReg: TextDocument = {
  id: 'abcdefghijklmnopqrstuvwx',
  title: 'test-title',
  body: 'test-body',
  editors: [{id: '1', username: 'a'}],
  owner: {id: '3', username: 'ba'},
  type: 'regular'
};

export const testDocCode: TextDocument = {
  id: 'abcdefghijklmnopqrstuvwz',
  title: 'test-title-code',
  body: 'test-body-code',
  editors: [{id: '2', username: 'b'}],
  owner: {id: '4', username: 'af'},
  type: 'code'
};

export const testDocEmptyReg: TextDocument = {
  id: 'abcdefghijklmnopqrstuvwx',
  title: 'test-title',
  body: 'test-body',
  editors: [{id: '1', username: 'a'}],
  owner: {id: '3', username: 'ba'},
  type: 'regular'
};
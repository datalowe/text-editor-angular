import { TextDocument } from 'src/app/interfaces/TextDocument';
import { backendRootUrl } from 'src/app/global-variables';

const apiUrl = `{backendRootUrl}/editor-api/document`;

const presavedDoc1: TextDocument = {
    id: 'abcdefghijklmnopqrstuvwx',
    title: 'saved-title-1',
    body: 'saved-body-2'
};

const presavedDoc2: TextDocument = {
    id: '1bcdefghijklmnopqrstuvwx',
    title: 'saved-title-2',
    body: 'saved-body-2'
};

const newDoc1: TextDocument = {
    id: '',
    title: 'new-title-1',
    body: 'new-body-1'
};

const newDoc1WithGeneratedId: TextDocument = {
    id: 'nnndefghijklmnopqrstuvwx',
    title: 'new-title-1',
    body: 'new-body-1'
};

// describe('preexisting documents', () => {
//     it('clicking list button retrieves documents from database and shows them', () => {
//         cy.intercept('GET', apiUrl, {
//             statusCode: 200,
//             body: [
//                 presavedDoc1,
//                 presavedDoc2
//             ]
//         });
      
//         cy.visit('/')
      
//         const listButton = cy.get('#toggle-list-btn > button');

//         listButton.click();

//         cy.contains(presavedDoc1.title);
//     })

//     it('clicking document in list loads it into text editor', async () => {
//         cy.intercept('GET', apiUrl, {
//             statusCode: 200,
//             body: [
//                 presavedDoc1,
//                 presavedDoc2
//             ]
//         });
      
//         cy.visit('/')
      
//         const listButton = cy.get('#toggle-list-btn > button');
        
//         listButton.click();

//         cy.wait(3);

//         const firstDocItem = cy.get('.document-list-item-li').first();

//         firstDocItem.click();

//         const quillEditor = cy.get('.ql-editor').first();
//         quillEditor.contains(presavedDoc1.body);

//     })
// });


// describe('new documents', () => {
//     it('clicking save button initiates a POST request to database with current title/body in title field/editor input', () => {
//         cy.intercept('POST', apiUrl, {
//             statusCode: 200,
//             body: newDoc1WithGeneratedId
//         }).as('saveRoute');

//         cy.intercept('GET', apiUrl, {
//             statusCode: 200,
//             body: [newDoc1WithGeneratedId]
//         }).as('fetchRoute');
      
//         cy.visit('/')

//         const quillEditor = cy.get('.ql-editor').first();
//         quillEditor.type(newDoc1.body);

//         const titleInput = cy.get('#title-input');
//         titleInput.type(newDoc1.title);
      
//         const saveButton = cy.get('#save-doc-btn > button');

//         saveButton.click();
//         cy.wait('@saveRoute').its('response.body.title').should('eq', newDoc1WithGeneratedId.title);

//     })
// });
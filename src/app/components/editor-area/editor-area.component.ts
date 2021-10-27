import { Component, OnInit, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

import { emptyDoc } from 'src/app/interfaces/TextDocument';
import { requestDocPDF } from 'src/app/util-functions/requestDocPDF';
import Quill from 'quill';
import { customQuillModules } from 'src/app/quill-customization/customQuillModules';
import { CommentBlot } from 'src/app/quill-customization/CommentBlot';
import { commentAtt, commentIdAtt, onclickAtt } from 'src/app/quill-customization/CustomAttributors';
import { commentHandlerGenerator } from 'src/app/quill-customization/commentHandler';

// register custom blot/attributors related to comment functionality
Quill.register(CommentBlot);
Quill.register(commentAtt);
Quill.register(onclickAtt);
Quill.register(commentIdAtt);

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.scss']
})
export class EditorAreaComponent implements OnInit {

  @ViewChild('editor') editorComponent: QuillEditorComponent;
  savedDocsSubscription: Subscription;
  savedDocs: TextDocument[] = [];
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...emptyDoc
  };
  // use customized modules, ie an editor toolbar that includes comment
  // tool
  editorModules= customQuillModules;

  constructor(private documentService: DocumentService) {
    this.activeDocSubscription = this.documentService
      .onActiveDocUpdate()
      .subscribe(
        (d) => (this.activeDoc = d)
      );
    this.savedDocsSubscription = this.documentService
      .onAllDocsUpdate()
      .subscribe(
        (docs) => {
          this.savedDocs = docs;
        }
      )
   }

  ngOnInit(): void {
    this.documentService
      .startDocumentsSubscription();
    this.documentService
      .startEditorsSubscription();
  }

  updateText(): void {
    this.documentService
      .updateActiveBody(this.editorComponent.quillEditor.root.innerHTML);
  }

  updateTitle(event: any): void {
    this.documentService
      .updateActiveTitle(event.target.value);
  }

  saveText(): void {
    if (!this.activeDoc.title) {
      alert('Please add a title.')
      return;
    }
    this.documentService
      .upsertDocument();
  }

  changeDoc(document: TextDocument): void {
    this.documentService.refreshAllDocs();
    this.documentService.swapActive(document);
  }

  newDoc(): void {
    this.documentService.refreshAllDocs();
    this.documentService.resetActiveDoc();
    this.editorComponent.quillEditor.setText('');
  }

  triggerRequestDocPDF(): void {
    requestDocPDF(this.activeDoc.id, this.activeDoc.title);
  }

  activeDocIsSaved(): boolean {
    let foundDoc: TextDocument | undefined;
    
    foundDoc = this.savedDocs.find( (doc: TextDocument) => doc.id === this.activeDoc.id);

    return Boolean(foundDoc);
  }

  editorSetupAfterCreation(editor: any) {
    editor
      .getModule("toolbar")
      .addHandler(
        'comment',
        commentHandlerGenerator(editor)
      );
  }

}

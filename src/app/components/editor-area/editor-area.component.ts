import { Component, OnInit, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

import { emptyDoc } from 'src/app/interfaces/TextDocument';
import { requestDocPDF } from 'src/app/util-functions/requestDocPDF';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.scss']
})
export class EditorAreaComponent implements OnInit {

  @ViewChild('editor') editor: QuillEditorComponent;
  savedDocsSubscription: Subscription;
  savedDocs: TextDocument[] = [];
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...emptyDoc
  };

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
      .updateActiveBody(this.editor['quillEditor']['root']['innerHTML']);
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
    this.editor['quillEditor']['root']['innerText'] = '';
  }

  triggerRequestDocPDF(): void {
    requestDocPDF(this.activeDoc.id, this.activeDoc.title);
  }

  activeDocIsSaved(): boolean {
    return this.savedDocs.includes(this.activeDoc);
  }

}

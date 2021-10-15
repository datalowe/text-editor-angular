import { Component, OnInit, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

import { emptyDoc } from 'src/app/interfaces/TextDocument';

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
      .upsertDocument()
      .subscribe(
        (d) => {
          // check if document already was in saved docs. if so, update it.
          // otherwise add it to array of saved docs.
          const matchDoc = this.savedDocs.find(sD => sD.id === d.id);
          if (matchDoc) {
            matchDoc.title = d.title;
            matchDoc.body = d.body;
          } else {
            this.savedDocs.push(d);
          }
        }
      );
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

}

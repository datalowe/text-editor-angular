import { Component, OnInit, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.css']
})
export class EditorAreaComponent implements OnInit {

  @ViewChild('editor') editor: QuillEditorComponent;
  savedDocs: TextDocument[] = [];
  subscription: Subscription;
  activeDoc: TextDocument = {
    _id: '',
    title: '',
    body: ''
  };

  constructor(private documentService: DocumentService) {
    this.subscription = this.documentService
      .onActiveDocUpdate()
      .subscribe(
        (d) => (this.activeDoc = d)
      );
   }

  ngOnInit(): void {
    this.documentService
    .getDocuments()
    .subscribe(
      (docs) => (this.savedDocs = docs)
    );
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
          const matchDoc = this.savedDocs.find(sD => sD._id === d._id);
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
    this.documentService
      .getDocuments()
      .subscribe(
        (docs) => (this.savedDocs = docs)
    );
    this.documentService.swapActive(document);
  }

  newDoc(): void {
    this.documentService
    .getDocuments()
    .subscribe(
      (docs) => (this.savedDocs = docs)
    );
    this.documentService.resetActiveDoc();
    this.editor['quillEditor']['root']['innerText'] = '';
  }

}

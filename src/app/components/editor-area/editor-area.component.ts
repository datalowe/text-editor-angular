import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

import { emptyDoc } from 'src/app/interfaces/TextDocument';
import { requestDocPDF } from 'src/app/util-functions/requestDocPDF';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillWrapperComponent } from '../quill-wrapper/quill-wrapper.component';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.scss']
})
export class EditorAreaComponent implements OnInit {

  savedDocsSubscription: Subscription;
  savedDocs: TextDocument[] = [];
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...emptyDoc
  };
  @ViewChild('quillwrapper') quillWrapper: QuillWrapperComponent;

  constructor(
    private documentService: DocumentService,
    private _snackBar: MatSnackBar) {
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

  updateTitle(event: any): void {
    this.documentService
      .updateActiveTitle(event.target.value);
  }

  saveText(): void {
    if (!this.activeDoc.title) {
      this.openWarningSnackBar('Please add a title before saving', 'Dismiss', 5000);
      return;
    }
    this._snackBar.dismiss();
    this.documentService
      .upsertDocument();
  }

  changeDoc(document: TextDocument): void {
    this.documentService.refreshAllDocs();
    this.documentService.swapActive(document);
    // quill doesn't like the comment blot/element and tries to reshuffle
    // its attributes upon user keyboard navigation in document until
    // first input is passed in. I haven't been able to find out why.
    // inserting and immediately deleting text as user in this manner
    // works as a dirty fix for now.
    setTimeout(
      () => {
        this.quillWrapper.fakeUserAction();
      }, 5
    )
  }

  newDoc(): void {
    this.documentService.refreshAllDocs();
    this.documentService.resetActiveDoc();
  }

  triggerRequestDocPDF(): void {
    requestDocPDF(this.activeDoc.id, this.activeDoc.title);
  }

  activeDocIsSaved(): boolean {
    let foundDoc: TextDocument | undefined;
    
    foundDoc = this.savedDocs.find( (doc: TextDocument) => doc.id === this.activeDoc.id);

    return Boolean(foundDoc);
  }

  openWarningSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      panelClass: 'snack-bar-warning'
    });
  }
}

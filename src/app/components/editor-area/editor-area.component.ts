import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';

import { Document } from 'src/app/Document';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.css']
})
export class EditorAreaComponent implements OnInit {

  @ViewChild('editor') editor: QuillEditorComponent; 
  activeDoc: Document = {
    _id: '',
    title: '',
    body: ''
  }

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
  }

  updateText(event: EditorChangeContent | EditorChangeSelection): void {
    this.activeDoc.body = event['editor']['root']['innerText'];
  }

  saveText(): void {
    if (!this.activeDoc.title) {
      alert('Please add a title.')
      return;
    }
    this.documentService
      .upsertDocument(this.activeDoc)
      .subscribe(
        (d) => (console.log(d))
      );
  }

  changeDoc(document: Document): void {
    this.activeDoc = document;
    this.editor['quillEditor']['root']['innerText'] = document.body;
  }

}

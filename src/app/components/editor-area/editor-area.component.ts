import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';

import { Document } from 'src/app/Document';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.css']
})
export class EditorAreaComponent implements OnInit {

  @ViewChild('editor') editor: QuillEditorComponent; 
  docId: string = '';
  docTitle: string = '';
  docBody: string = '';
  content: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.editor);
  }

  updateText(event: EditorChangeContent | EditorChangeSelection): void {
    this.docBody = event['editor']['root']['innerText'];
  }

  saveText(): void {
    const saveDoc = {
      _id: this.docId,
      title: this.docTitle,
      body: this.docBody
    }
    console.log(this.docBody);
  }

  changeDoc(document: Document): void {
    this.docId = document._id;
    this.docTitle = document.title;
    this.docBody = document.body;
    this.editor['quillEditor']['root']['innerText'] = this.docBody;
  }

}

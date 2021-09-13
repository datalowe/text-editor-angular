import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Document } from 'src/app/Document';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.css']
})
export class EditorToolbarComponent implements OnInit {

  @Output() saveSignal = new EventEmitter();
  @Output() onChangeDoc = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSave(): void {
    this.saveSignal.emit();
  }

  changeDoc(document: Document): void {
    this.onChangeDoc.emit(document);
  }

}

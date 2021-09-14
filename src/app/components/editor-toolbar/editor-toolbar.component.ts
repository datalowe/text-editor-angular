import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Document } from 'src/app/Document';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.css']
})
export class EditorToolbarComponent implements OnInit {

  @Input() documents: Document[] = [];
  @Output() saveSignal = new EventEmitter();
  @Output() onChangeDoc = new EventEmitter();
  @Output() onNewDoc = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSave(): void {
    this.saveSignal.emit();
  }

  newDoc(): void {
    this.onNewDoc.emit();
  }

  changeDoc(document: Document): void {
    this.onChangeDoc.emit(document);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TextDocument } from 'src/app/interfaces/TextDocument';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  @Input() documents: TextDocument[] = [];

  @Output() onSelectDoc = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClickDoc(document: TextDocument): void {
    this.onSelectDoc.emit(document);
  }
}

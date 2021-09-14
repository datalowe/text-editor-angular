import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Document } from 'src/app/Document';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Input() documents: Document[] = [];

  @Output() onSelectDoc = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClickDoc(document: Document): void {
    this.onSelectDoc.emit(document);
  }
}

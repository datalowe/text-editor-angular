import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Document } from 'src/app/Document';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.css']
})
export class DocumentListItemComponent implements OnInit {
  @Input() document: Document = {
    _id: '',
    title: '',
    body: ''
  }

  @Output() onSelectDoc = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(): void {
    this.onSelectDoc.emit(this.document);
  }

}

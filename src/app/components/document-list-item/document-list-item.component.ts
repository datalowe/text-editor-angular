import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TextDocument } from 'src/app/TextDocument';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.css']
})
export class DocumentListItemComponent implements OnInit {
  @Input() document: TextDocument = {
    _id: '',
    title: '',
    body: ''
  }

  constructor() { }

  ngOnInit(): void {
  }
}

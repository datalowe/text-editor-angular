import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { emptyDoc } from 'src/app/interfaces/TextDocument';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss']
})
export class DocumentListItemComponent implements OnInit {
  @Input() document: TextDocument = {
    ...emptyDoc
  }

  constructor() { }

  ngOnInit(): void {
  }
}

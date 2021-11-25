import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  @Input() documents: TextDocument[] = [];

  @Output() onSelectDoc = new EventEmitter();

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
  }

  onClickDoc(document: TextDocument): void {
    this.onSelectDoc.emit(document);
  }

  getCurrentModeDocs(): TextDocument[] {
    const currentDocType = this.documentService.isCodeModeOn() ? "code" : "regular";

    return this.documents.filter(d => d.type === currentDocType);
  }
}

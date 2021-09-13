import { Component, OnInit } from '@angular/core';

import { DocumentService } from 'src/app/services/document.service';

import { Document } from 'src/app/Document';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService
      .getDocuments()
      .subscribe(
        (docs) => (this.documents = docs)
      );
  }

}

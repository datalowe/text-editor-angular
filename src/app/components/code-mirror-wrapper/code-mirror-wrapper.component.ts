import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { regularEmptyDoc, TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-code-mirror-wrapper',
  templateUrl: './code-mirror-wrapper.component.html',
  styleUrls: ['./code-mirror-wrapper.component.scss']
})
export class CodeMirrorWrapperComponent implements OnInit {
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...regularEmptyDoc
  };

  constructor(
    private documentService: DocumentService,
  ) {
    this.activeDocSubscription = this.documentService
      .onActiveDocUpdate()
      .subscribe(
        (d) => (this.activeDoc = d)
      );
  }

  ngOnInit(): void {
  }

}

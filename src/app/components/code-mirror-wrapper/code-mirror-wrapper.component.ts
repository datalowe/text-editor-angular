import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { regularEmptyDoc, TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

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
  @ViewChild('cmeditor') private cmEditor: CodemirrorComponent;

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

  ngAfterViewInit(): void {
    this.cmEditor.registerOnChange(this.updateText.bind(this));
  }

  updateText(str: string): void {
    this.documentService
      .updateActiveBody(str);
  }
}

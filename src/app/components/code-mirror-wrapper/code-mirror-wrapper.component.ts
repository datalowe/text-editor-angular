import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { regularEmptyDoc, TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-code-mirror-wrapper',
  templateUrl: './code-mirror-wrapper.component.html',
  styleUrls: ['./code-mirror-wrapper.component.scss']
})
export class CodeMirrorWrapperComponent implements OnInit, AfterViewInit {
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...regularEmptyDoc
  };
  @ViewChild('cmeditor') private cmEditor: CodemirrorComponent;
  codeExUrl = "https://execjs.emilfolino.se/code";
  codeOutput: string = "";

  constructor(
    private documentService: DocumentService,
    private http: HttpClient
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

  async triggerExecuteCode() {
    // console.log('execute', this.activeDoc.body);

    const respData: {data: string} = await this.http.post<{data: string}>(
      this.codeExUrl, {code: btoa(this.activeDoc.body)}, httpOptions
    ).toPromise();

    if (respData && respData.data) {
      this.codeOutput = atob(respData.data);
    }
  }
}

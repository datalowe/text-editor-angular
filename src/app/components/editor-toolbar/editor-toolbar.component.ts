import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss']
})
export class EditorToolbarComponent implements OnInit {

  @Input() documents: TextDocument[] = [];
  @Output() saveSignal = new EventEmitter();
  @Output() docChange = new EventEmitter();
  @Output() genNewDoc = new EventEmitter();

  showDocList: boolean = false;
  subscription: Subscription; 

  constructor(private uiService: UiService, private documentService: DocumentService) {
    this.subscription = this.uiService
      .onToggleDocList()
      .subscribe(
        (val) => (this.showDocList = val)
    );
  }

  ngOnInit(): void {
  }

  onSave(): void {
    this.saveSignal.emit();
  }

  newDoc(): void {
    this.genNewDoc.emit();
  }

  changeDoc(document: TextDocument): void {
    this.docChange.emit(document);
  }

  toggleShowList(): void {
    this.uiService.toggleShowDocList();
  }

  toggleCodeMode(): void {
    this.documentService.toggleCodeMode();
  }
}

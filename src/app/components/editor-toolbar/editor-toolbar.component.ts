import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { TextDocument } from 'src/app/TextDocument';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss']
})
export class EditorToolbarComponent implements OnInit {

  @Input() documents: TextDocument[] = [];
  @Output() saveSignal = new EventEmitter();
  @Output() onChangeDoc = new EventEmitter();
  @Output() onNewDoc = new EventEmitter();

  showDocList: boolean = false;
  subscription: Subscription; 

  constructor(private uiService: UiService) {
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
    this.onNewDoc.emit();
  }

  changeDoc(document: TextDocument): void {
    this.onChangeDoc.emit(document);
  }

  toggleShowList(): void {
    this.uiService.toggleShowDocList();
  }
}

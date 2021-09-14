import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Document } from 'src/app/Document';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.css']
})
export class EditorToolbarComponent implements OnInit {

  @Input() documents: Document[] = [];
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

  changeDoc(document: Document): void {
    this.onChangeDoc.emit(document);
  }

  toggleShowList(): void {
    this.uiService.toggleShowDocList();
  }
}

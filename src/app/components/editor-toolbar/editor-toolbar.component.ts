import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.css']
})
export class EditorToolbarComponent implements OnInit {

  @Output() saveSignal = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSave(): void {
    this.saveSignal.emit();
  }

}

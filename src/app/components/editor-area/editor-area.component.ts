import { Component, OnInit } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.css']
})
export class EditorAreaComponent implements OnInit {

  inputText: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  updateText(event: EditorChangeContent | EditorChangeSelection): void {
    this.inputText = event['editor']['root']['innerText'];
  }

  saveText(): void {
    console.log(this.inputText);
  }

}

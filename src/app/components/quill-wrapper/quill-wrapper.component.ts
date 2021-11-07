import { Component, OnInit, ViewChild } from '@angular/core';

import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';

import { customQuillModules } from 'src/app/quill-customization/customQuillModules';
import { DocumentService } from 'src/app/services/document.service';
import { CommentBlot } from 'src/app/quill-customization/CommentBlot';
import { commentAtt, commentIdAtt, onclickAtt } from 'src/app/quill-customization/CustomAttributors';
import { commentHandlerGenerator } from 'src/app/quill-customization/commentHandler';
import { Subscription } from 'rxjs';
import { emptyDoc, TextDocument } from 'src/app/interfaces/TextDocument';

// register custom blot/attributors related to comment functionality
Quill.register(commentIdAtt);
Quill.register(commentAtt);
Quill.register(onclickAtt);
Quill.register(CommentBlot);

@Component({
  selector: 'app-quill-wrapper',
  templateUrl: './quill-wrapper.component.html',
  styleUrls: ['./quill-wrapper.component.scss']
})
export class QuillWrapperComponent implements OnInit {
  @ViewChild('editor') editorComponent: QuillEditorComponent;
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...emptyDoc
  };

  // use customized modules, ie an editor toolbar that includes comment
  // tool
  editorModules= customQuillModules;

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

  updateText(): void {
    this.documentService
      .updateActiveBody(this.editorComponent.quillEditor.root.innerHTML);
  }

  editorSetupAfterCreation(editor: Quill) {
    editor
      .getModule("toolbar")
      .addHandler(
        'comment',
        commentHandlerGenerator(editor)
      );
  }

  // quill doesn't like the comment blot/element and tries to reshuffle
  // its attributes upon user keyboard navigation in document until
  // first input is passed in. I haven't been able to find out why.
  // inserting and immediately deleting text as user in this manner
  // works as a dirty fix for now.
  fakeUserAction() {
    this.editorComponent.quillEditor.insertText(0, 'a', 'user');
    this.editorComponent.quillEditor.deleteText(0, 1, 'user');
  }
}

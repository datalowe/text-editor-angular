import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Editor } from 'src/app/interfaces/Editor';
import { TextDocument } from 'src/app/interfaces/TextDocument';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

import { regularEmptyDoc } from 'src/app/interfaces/TextDocument';
import { DocInviteDialogComponent } from '../doc-invite-dialog/doc-invite-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-document-editors-list',
  templateUrl: './document-editors-list.component.html',
  styleUrls: ['./document-editors-list.component.scss']
})
export class DocumentEditorsListComponent implements OnInit {
  allEditors: Editor[] = [];
  editorsSubscription: Subscription;
  usernamesSubscription: Subscription;
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    ...regularEmptyDoc
  };
  showEditors: boolean = false;

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private inviteDialog: MatDialog
  ) {
    this.editorsSubscription = this.documentService
    .onEditorsUpdate()
    .subscribe(
      (editors) => {
        this.allEditors = editors}
    );
    this.activeDocSubscription = this.documentService
      .onActiveDocUpdate()
      .subscribe(
        (doc) => {
          this.activeDoc = doc;
        }
      )
  }

  ngOnInit(): void {
  }

  userIsDocumentOwner(): boolean {
    const ownId: string = this.authService.getOwnUserId();

    return this.activeDoc.owner.id === ownId;
  }

  isDocumentEditor(editorId: string): boolean {
    return this.activeDoc.editors.some(e => e.id === editorId);
  }

  toggleEditor(editorId: string): void {
    this.documentService.toggleActiveEditor(editorId);
  }

  toggleShowEditors(): void {
    this.showEditors = !this.showEditors;
  }

  getDocEditorsExceptOwner(): Editor[] {
    return this.activeDoc.editors.filter(e => e.id !== this.activeDoc.owner.id);
  }

  getAllEditorsExceptOwner(): Editor[] {
    return this.allEditors.filter(e => e.id !== this.activeDoc.owner.id);
  }

  openInviteDialog(): void {
    this.inviteDialog.open(DocInviteDialogComponent, {
      data: {docId: this.activeDoc.id}
    });
  }
}

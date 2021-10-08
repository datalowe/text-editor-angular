import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextDocument } from 'src/app/interfaces/TextDocument';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-editors-list',
  templateUrl: './document-editors-list.component.html',
  styleUrls: ['./document-editors-list.component.scss']
})
export class DocumentEditorsListComponent implements OnInit {
  allUsernames: string[] = [];
  usernamesSubscription: Subscription;
  activeDocSubscription: Subscription;
  activeDoc: TextDocument = {
    _id: '',
    title: '',
    body: '',
    owner: '',
    editors: []
  };

  constructor(
    private authService: AuthService,
    private documentService: DocumentService
  ) {
    this.usernamesSubscription = this.authService
      .onUsernameArrUpdate()
      .subscribe(
        (usernames) => {
          this.allUsernames = usernames}
      );
    this.activeDocSubscription = this.documentService
      .onActiveDocUpdate()
      .subscribe(
        (doc) => (this.activeDoc = doc)
      )
  }

  ngOnInit(): void {
    this.authService
      .updateUsernameArr();
  }

  isDocumentOwner(): boolean {
    const ownUsername: string = this.authService.getOwnUsername();

    if (this.activeDoc.owner === ownUsername) {
      return true;
    }
    return false;
  }

  isDocumentEditor(username: string): boolean {
    if (this.activeDoc.editors.includes(username)) {
      return true;
    }
    return false;
  }

  toggleEditor(username: string): void {
    this.documentService.toggleActiveEditor(username);
  }
}

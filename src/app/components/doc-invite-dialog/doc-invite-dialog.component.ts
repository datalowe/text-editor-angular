import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { requestEmailInvite } from 'src/app/util-functions/requestEmailInvite';
import { InvalidEmailError } from 'src/app/util-functions/custom-errors';

interface InviteDialogData {
  docId: string;
}

@Component({
  selector: 'app-doc-invite-dialog',
  templateUrl: './doc-invite-dialog.component.html',
  styleUrls: ['./doc-invite-dialog.component.scss']
})
export class DocInviteDialogComponent implements OnInit {
  activeDocSubscription: Subscription;
  email: string = '';


  constructor(
    public dialogRef: MatDialogRef<DocInviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InviteDialogData) { }

  ngOnInit(): void {
  }

  async triggerEmailInvite(): Promise<void> {
    console.log('activeDocId', this.data.docId);
    try {
      await requestEmailInvite(this.data.docId, this.email);
      alert('E-mail invitation sent!');
    } catch (e) {
      if (e instanceof InvalidEmailError) {
        alert("The e-mail you provided appears to be incorrect. Please double check it.");
        return;
      }
      alert('E-mail invitation attempt failed for reasons unknown. Please try again later.');
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSendClick(): void {
    if (!this.email) {
      alert('Please enter an e-mail to send to.');
      return;
    }
    this.triggerEmailInvite();
  }
}

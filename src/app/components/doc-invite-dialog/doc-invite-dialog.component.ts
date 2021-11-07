import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { requestEmailInvite } from 'src/app/util-functions/requestEmailInvite';
import { InvalidEmailError } from 'src/app/util-functions/custom-errors';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    @Inject(MAT_DIALOG_DATA) public data: InviteDialogData,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async triggerEmailInvite(): Promise<void> {
    try {
      await requestEmailInvite(this.data.docId, this.email);
      this.openSnackBar('E-mail invitation sent!', 'Dismiss', 2000);
      this.dialogRef.close();
    } catch (e) {
      let errMsg: string;
      if (e instanceof InvalidEmailError) {
        errMsg = 'The e-mail you provided appears to be incorrect.';
      } else {
        errMsg = 'E-mail invitation attempt failed for reasons unknown. Please try again later.';
      }
      this.openSnackBar(errMsg, 'Dismiss', 100000);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSendClick(): void {
    if (!this.email) {
      this.openSnackBar('Please enter an e-mail to send to.', 'Dismiss', 3000);
      return;
    }
    this.triggerEmailInvite();
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration
    });
  }
}

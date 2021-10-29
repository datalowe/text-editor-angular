import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlainUser } from 'src/app/interfaces/PlainUser';
import { AuthService } from 'src/app/services/auth.service';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-registration-area',
  templateUrl: './registration-area.component.html',
  styleUrls: ['./registration-area.component.scss']
})
export class RegistrationAreaComponent implements OnInit {

  @Input() showPassword: boolean = false;
  // users can send e-mail invites to non-users, which include a registration link
  // with a query parameter that holds an 'invitation code'. they are to be
  // granted access to a particular document once they register, by means of the key.
  docInvitationCode: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter( (param: any) => param.doc_invite_key ) )
      .subscribe(params => {
        this.docInvitationCode = params.doc_invite_key;
      });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  askCreateUser(f: NgForm): void {
    if (!f.valid) {
      return;
    }
    const user: PlainUser = {
      username: f.value.username,
      password: f.value.password
    };
    if (this.docInvitationCode) {
      user.invitation_code = this.docInvitationCode;
    }

    this.authService.createUser(
      user
    ).subscribe(() => {
      this.authService.loginUser(
        user
      ).then(() => this.router.navigate(['/editor'])); 
    });
  };
}

import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PlainUser } from 'src/app/interfaces/PlainUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration-area',
  templateUrl: './registration-area.component.html',
  styleUrls: ['./registration-area.component.scss']
})
export class RegistrationAreaComponent implements OnInit {

  @Input() showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
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

    this.authService.createUser(
      user
    ).subscribe(() => {} );
    this.router.navigate(['/login']);
  };
}

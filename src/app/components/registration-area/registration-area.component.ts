import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration-area',
  templateUrl: './registration-area.component.html',
  styleUrls: ['./registration-area.component.scss']
})
export class RegistrationAreaComponent implements OnInit {

  @Input() showPassword: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  askCreateUser(f: NgForm): void {
    if (f.valid) {
      this.authService.createUser(
        f.value.username,
        f.value.password
      ).subscribe(() => {} );
    }
  };
}

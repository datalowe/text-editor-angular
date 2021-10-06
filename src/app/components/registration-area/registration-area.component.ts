import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration-area',
  templateUrl: './registration-area.component.html',
  styleUrls: ['./registration-area.component.scss']
})
export class RegistrationAreaComponent implements OnInit {

  @Input() showPassword: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}

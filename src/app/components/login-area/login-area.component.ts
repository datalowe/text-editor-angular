import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { PlainUser } from 'src/app/interfaces/PlainUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-area',
  templateUrl: './login-area.component.html',
  styleUrls: ['./login-area.component.scss']
})
export class LoginAreaComponent implements OnInit {
  showIncorrect: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  async loginUser(f: NgForm): Promise<void> {
    if (!f.valid) {
      return;
    }
    const user: PlainUser = {
      username: f.value.username,
      password: f.value.password
    };
    const loginSuccessful: boolean = await this.authService.loginUser(user);

    if (loginSuccessful) {
      this.router.navigate(['/editor']);
    } else {
      this.activateShowIncorrect();
    }
  }

  activateShowIncorrect(): void {
    this.showIncorrect = true;
  }


}

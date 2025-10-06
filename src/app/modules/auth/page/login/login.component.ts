import { AccountService } from '@app/service/https/account.service';
import { AuthService } from '@app/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';

// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  emailText: string = '';
  passwordText: string = '';
  passwordType: string = 'password';
  termsChecked: boolean = false;

  // private emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);

  constructor(
    private router: Router,
    private auth: AuthService,
    private account: AccountService,
    private themeService: ThemeService,
  ) { }


  ngOnInit() {
    let auth = this.auth.getState();
    if (auth) {
      if (auth.isBuyFirst) {
        this.router.navigateByUrl("home");
      } else {
        this.router.navigateByUrl("solicitacoes");
      }
      return;
    } else {
      this.themeService.disableDarkMode();
    }
  }

  termsChange() {
    this.termsChecked = !this.termsChecked;
    console.log(this.termsChecked);
  }

  login() {
    this.account.logIn(this.emailText, this.passwordText).subscribe(result => {
      this.auth.saveState(result.data);
      if (result.data.isBuyFirst) {
        this.router.navigateByUrl('home');
      } else {
        this.router.navigateByUrl("solicitacoes");
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { AuthService } from '@app/service/auth.service';
import { Login } from '@data/schema/login/login';
import { Notificacao } from '@data/schema/notificacao/notificacao';
import { isNumeric } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  public version = environment.version;
  auth: Login;
  isDark$: Observable<boolean>;
  expanded: boolean = false;
  isOpened$: Observable<boolean>;
  primaryColor;
  notificationOpened = false;
  userInfoOpened = false;
  notificacoes$: Observable<Notificacao[]>;
  title$: Observable<string>;
  backRoute$: Observable<string>;
  submenu = {
    opened: false,
    pos: 0,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.auth = this.authService.getState();
    this.isDark$ = this.themeService.getDarkTheme();
    this.isOpened$ = this.themeService.isOpened();
    this.primaryColor = this.themeService.getPrimaryColor();
    this.notificacoes$ = this.authService.getNotifications();
    this.title$ = this.themeService.getTitle();
    this.backRoute$ = this.themeService.getBackRoute();
  }

  countNotReadNot(notificacoes: Notificacao[]) {
    return notificacoes.filter((n) => n.read == false);
  }

  ngOnInit() {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  expand() {
    this.submenu.opened = false;
    this.themeService.toggleMenu();
  }

  logOut() {
    this.authService.logOut();
    localStorage.clear();
  }

  routeLogin() {
    return this.router.url === '/auth/login';
  }

  personalData() {
    return this.router.navigateByUrl('mydata');
  }

  back(route) {
    if (
      (this.router.url.indexOf('cotacao') + this.router.url.indexOf('solicitacao') + this.router.url.indexOf('detalhe') + this.router.url.indexOf('analise') < 0 ) &&
      (isNumeric(this.router.url.slice(-1)) ||
        this.router.url.slice(-8) == 'cadastro')
    ) {
      this.themeService.geraConfirmacao(() => {
        this.router.navigateByUrl(route);
      });
    } else {
      this.router.navigateByUrl(route);
    }
  }

  toggleNotification() {
    this.notificationOpened = !this.notificationOpened;
    if (this.notificationOpened) {
      this.authService.readNotifications();
    }
  }

  toggleUserInfo() {
    this.userInfoOpened = !this.userInfoOpened;
    if (this.userInfoOpened) {
      // this.authService.readNotifications();
    }
  }
}

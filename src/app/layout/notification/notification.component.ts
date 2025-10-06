import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { AuthService } from '@app/service/auth.service';
import { Login } from '@data/schema/login/login';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Notificacao } from '@data/schema/notificacao/notificacao';
import { Utils } from '@app/lib/utils/utils';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('notificationOpened', [
      state('false', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('true', style({ height: '350px', visibility: 'visible' })),
      transition('true <=> false', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class NotificationComponent implements OnInit {

  public version = environment.version;
  auth: Login;
  isDark$: Observable<boolean>;
  expanded: boolean = false;
  isOpened$: Observable<boolean>;
  primaryColor;
  @Input() notificationOpened = false;
  @Output() notificationOpenedChange: EventEmitter<boolean> = new EventEmitter();
  notificacoes$: Observable<Notificacao[]>;

  constructor(
    private Acrouter: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private sanitization: DomSanitizer
  ) {
    this.auth = this.authService.getState();
    this.isDark$ = this.themeService.getDarkTheme();
    this.primaryColor = this.themeService.getPrimaryColor();
    this.notificacoes$ = this.authService.getNotifications();
  }

  ngOnInit() { }

  getStringDate(date: Date) {
    return Utils.getStringDateHour(date);
  }



}

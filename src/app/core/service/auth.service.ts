import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Login } from '@data/schema/login/login';
import { BehaviorSubject } from 'rxjs';
import { Notificacao } from '@data/schema/notificacao/notificacao';

@Injectable()
export class AuthService {


    private notifications: BehaviorSubject<Notificacao[]>;

    constructor(private http: HttpClient, private _store: Store<{ auth: Login }>, private router: Router) {
        let notificacoes = this.getStoreNotications();
        this.notifications = new BehaviorSubject<Notificacao[]>(
            notificacoes
        );
    }

    saveToken(token: string) {
        localStorage.setItem('bf-token', JSON.stringify(token));
    }

    getToken() {
        return JSON.parse(localStorage.getItem('bf-token'));
    }

    getStoreNotications() {
        let notificacoes: Notificacao[] = JSON.parse(localStorage.getItem('bf-notificacoes'));
        return notificacoes == null ? [] : notificacoes;
    }

    saveNotifications(notificacoes: Notificacao[]) {
        localStorage.setItem('bf-notificacoes', JSON.stringify(notificacoes));
    }

    getNotifications(): Observable<Notificacao[]> {
        return this.notifications;
    }

    addNotification(notificacao: Notificacao) {
        let notificacoes = this.getStoreNotications();
        notificacoes.unshift(notificacao);
        this.notifications.next(notificacoes);
        this.saveNotifications(notificacoes);
    }

    readNotifications() {
        let notificacoes = this.getStoreNotications();
        notificacoes.forEach(n => n.read = true);
        this.notifications.next(notificacoes);
        this.saveNotifications(notificacoes);
    }

    saveState(state: Login) {
        localStorage.setItem('state', JSON.stringify(state));
    }

    getState(): Login {
        return JSON.parse(localStorage.getItem('state'));
    }

    logOut() {
        localStorage.setItem('state', null);
        this.router.navigateByUrl("auth/login");
    }

}

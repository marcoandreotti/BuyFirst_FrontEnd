import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Menu } from '@data/schema/usuarios/menu';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  modalDialog = new DialogGenericoFuncoes(this._dialog);

  private isDarkTheme: BehaviorSubject<boolean>;
  private isOpenedMenu: BehaviorSubject<boolean>;
  private isLoading: BehaviorSubject<boolean>;
  private title: BehaviorSubject<string>;
  private backRoute: BehaviorSubject<string>;
  // private primayColor = '#85B57D';
  private primayColor = '#0b5cdf';

  constructor(private _dialog: MatDialog) {
    this.isDarkTheme = new BehaviorSubject<boolean>(
      localStorage.getItem('isDarkTheme') === 'true'
    );
    this.isOpenedMenu = new BehaviorSubject<boolean>(false);
    this.isLoading = new BehaviorSubject<boolean>(false);
    this.title = new BehaviorSubject<string>(null);
    this.backRoute = new BehaviorSubject<string>(null);
  }

  toggleTheme() {
    this.isDarkTheme.next(!this.isDarkTheme.value);
    localStorage.setItem('isDarkTheme', this.isDarkTheme.value.toString());
  }

  toggleMenu() {
    this.isOpenedMenu.next(!this.isOpenedMenu.value);
  }

  closeMenu() {
    this.isOpenedMenu.next(false);
  }

  startLoading() {
    this.isLoading.next(true);
  }

  stopLoading() {
    this.isLoading.next(false);
  }

  getLoading() {
    return this.isLoading;
  }

  setTitle(title: string) {
    this.title.next(title);
  }

  getTitle() {
    return this.title;
  }

  setBackRoute(route: string | any) {
    if (route) {
      this.backRoute.next(route);
    } else {
      this.backRoute.next('home');
    }
  }

  getBackRoute() {
    return this.backRoute;
  }

  disableDarkMode() {
    this.isDarkTheme.next(false);
    localStorage.setItem('isDarkTheme', this.isDarkTheme.value.toString());
  }

  getDarkTheme(): Observable<boolean> {
    return this.isDarkTheme;
  }

  getPrimaryColor() {
    return this.primayColor;
  }

  isOpened(): Observable<boolean> {
    return this.isOpenedMenu;
  }

  geraErro(e) {
    let erro: string = e.error.Message || 'Erro não especificado.';

    if (e.error.Errors != undefined) {
      if (
        e.error.errors.ConfirmPassword != undefined &&
        e.error.errors.ConfirmPassword.length > 0
      ) {
        erro += ':';
        e.error.errors.ConfirmPassword.forEach((erroText) => {
          erro += '\r\n' + erroText;
        });
      } else if (e.error.Errors.length > 0) {
        erro += ':';
        e.error.Errors.forEach((erroText) => {
          erro += '\r\n' + erroText;
        });
      }
    }
    this.modalDialog.apresentaErro('Erro', erro);
  }

  geraConfirmacao(callback) {
    this.modalDialog.apresentaAviso(
      'Voltar',
      'Tem certeza que deseja retornar? Todas as alterações poderam ser perdidas.',
      true,
      true,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      () => {
        this.modalDialog.dialog.closeAll();
        callback();
      },
      'NÃO',
      'SIM'
    );
  }
}

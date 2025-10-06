import { AccountService } from '@app/service/https/account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.scss'],
})
export class EsqueceuSenhaComponent implements OnInit {
  emailText: string = '';
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  private emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX),
  ]);
  isLoading: boolean;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private account: AccountService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.disableDarkMode();
  }

  forgotPassword() {
    this.account.forgotPassword(this.emailText).subscribe((result) => {
      if (result.succeeded) {
        this.messagemSucesso();
      } else {
        console.log(result);
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('login');
  }

  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Redefinição de senha solicitada com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('#');
      },
      null,
      'CONTINUAR'
    );
  }
}

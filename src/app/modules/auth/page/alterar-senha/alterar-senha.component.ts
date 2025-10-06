import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/service/https/account.service';
import { ThemeService } from '@app/service/theme.service';
import { ResetPassword } from '@data/dto/accounts/reset-password.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss'],
})
export class AlterarSenhaComponent implements OnInit {
  resetForm: FormGroup;
  form: FormRow[] = [];
  model: ResetPassword = new ResetPassword();
  token: string;
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private _account: AccountService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.disableDarkMode();

    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
    });


    // this.route.paramMap.subscribe((params) => {
    //   this.token = params.get('token');
    // });

    this.createForm();
  }

  resetPassword() {
    if (!this.resetForm.valid) {
      this.resetForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: ResetPassword = Object.assign(
        new ResetPassword(),
        this.resetForm.getRawValue()
      );

      model.token = this.token;
      this._account.resetPassword(model).subscribe((result) => {
        if (result.succeeded) {
          this.messagemSucesso();
        } else {
          this.modalDialog.apresentaErro('Erro', result.message);
        }
      });
    }
  }

  createForm() {
    this.form = [
      {
        fields: [
          {
            name: 'email',
            label: 'E-mail',
            placeholder: 'E-mail',
            size: 100,
            value: 'email',
            required: true,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'password',
            label: 'Senha',
            placeholder: 'Senha',
            size: 50,
            value: 'password',
            required: true,
            passwordType: true,
            validators: [Validators.minLength(6)],
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'confirmPassword',
            label: 'Confirmar Senha',
            placeholder: 'Confirmar Senha',
            size: 50,
            value: 'confirmPassword',
            required: true,
            passwordType: true,
            validators: [Validators.minLength(6)],
            // validatorComparer: ['password', 'confirmPassword'],
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Senha resetada com sucesso!',
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

  // prepareForm() {
  //   this.resetForm = new FormGroup(
  //     {
  //       password: new FormControl('', [
  //         Validators.required,
  //         Validators.minLength(6),
  //       ]),
  //       confirmPassword: new FormControl('', [Validators.required]),
  //     },
  //     CustomValidators.mustMatch('password', 'confirmPassword')
  //   );
  // }
}

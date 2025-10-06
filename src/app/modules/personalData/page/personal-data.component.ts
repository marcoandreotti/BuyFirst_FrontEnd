import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/service/auth.service';
import { AccountService } from '@app/service/https/account.service';
import { ThemeService } from '@app/service/theme.service';
import { Usuario } from '@data/schema/usuarios/usuarios';
import { FormRow } from '@shared/component/form/form';
import { Login } from '@data/schema/login/login';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';

@Component({
  selector: 'app-personal',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss'],
})
export class PersonalDataComponent implements OnInit {
  auth: Login;
  model: Usuario;
  
  userForm: FormGroup;
  formUser: FormRow[] = [];

  personalForm: FormGroup;
  formPersonal: FormRow[] = [];

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private themeService: ThemeService,
    private _auth: AuthService,
    private _service: AccountService,
    private dialog: MatDialog,
    private router: Router) {}

  ngOnInit(): void {
    this.auth = this._auth.getState();

    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Meus dados');
    this.mountUserLogin();
  }

  createForms() {
    this.formUser = [
      {
        fields: [
          {
            name: 'firstName',
            label: 'Primeiro Nome',
            placeholder: 'Primeiro Nome',
            size: 33,
            value: 'firstName',
            required: true,
            maxLength: 20,
          },
          {
            name: 'lastName',
            label: 'Sobrenome',
            placeholder: 'Sobrenome',
            size: 33,
            value: 'lastName',
            required: true,
            maxLength: 20,
          },
          {
            name: 'userName',
            label: 'Nome de Usuário',
            placeholder: 'Nome de Usuário',
            size: 33,
            value: 'userName',
            required: true,
            maxLength: 20,
          },
        ],
      }
    ];

    this.formPersonal = [
      {
        fields: [
          {
            name: 'document',
            label: 'CPF',
            placeholder: 'Digite seu CPF',
            size: 33,
            value: 'document',
            required: true,
            mask: 'CPF_CNPJ',
            maxLength: 11,
          },
        ],
      },
      {
        fields: [
          {
            name: 'zipCode',
            label: 'CEP',
            placeholder: 'CEP',
            size: 20,
            value: 'zipCode',
            required: true,
            mask: '99999-999',
            maxLength: 10,
          },
          {
            name: 'street',
            label: 'Logradouro',
            placeholder: 'Logradouro',
            size: 80,
            value: 'street',
            required: true,
            maxLength: 100,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'number',
            label: 'Número',
            placeholder: 'Número',
            size: 20,
            value: 'number',
            required: false,
            maxLength: 15,
          },
          {
            name: 'complement',
            label: 'Complemento',
            placeholder: 'Complemento',
            size: 30,
            value: 'complement',
            required: false,
            maxLength: 50,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'neighborhood',
            label: 'Bairro',
            placeholder: 'Bairro',
            size: 45,
            value: 'neighborhood',
            required: true,
            maxLength: 50,
          },
          {
            name: 'location',
            label: 'Cidade',
            placeholder: 'Cidade',
            size: 45,
            value: 'location',
            required: true,
            maxLength: 100,
          },
          {
            name: 'stateAcronym',
            label: 'UF',
            placeholder: 'UF',
            size: 10,
            value: 'stateAcronym',
            required: true,
            maxLength: 2,
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  mountUserLogin() {
    this._service.getPersonUserData(this.auth.id).subscribe((usuario) => {
       this.model = usuario.data;
       console.log(this.model);
     });
     this.createForms();
  }
  
  save() {
    if (!this.userForm.valid || !this.personalForm.valid) {
      this.userForm.markAsPending();
      this.personalForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
      return;

    } else {
      
      let model: Usuario = Object.assign(
        this.model,
        this.userForm.getRawValue(),
        {personData : this.personalForm.getRawValue()}
      );

      this._service.savePersonalData(model).subscribe((result) => {
        if (result.succeeded) {
          this.messagemSucesso(); 
        } else {
          this.modalDialog.apresentaErro('Erro', result.message);
        }
      });
    }   
  }

  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Informações do usuário alteradas com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('mydata');
      },
      null,
      'CONTINUAR'
    );
  }
}


import { AccountService } from '@app/service/https/account.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogGenericoFuncoes } from '../../../../shared/component/dialog-generico/dialog-generico.funcoes';
import { AuthService } from '@app/service/auth.service';
import { Usuario } from '@data/schema/usuarios/usuarios';
import { Field, FormRow } from '@shared/component/form/form';
import { ThemeService } from '@app/service/theme.service';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { ExternalApplicationService } from '@app/service/https/external-application.service';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { CompanyRoles, Role } from '@data/schema/login/role';

@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class UsuariosCadastroComponent {
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  titulo = 'Cadastrar Usuários';
  model: Usuario = new Usuario();
  lastCompanyRoles: CompanyRoles[] = [];
  editId: number = null;
  userForm: FormGroup;
  form: FormRow[] = [];
  userIntegration: boolean = false;

  filteredCompanies: CompanyDto[] = [];
  companyForm: FormGroup;
  isLoading: boolean = false;
  companyType: number = null;
  isValidCompanyForm: boolean = true;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _company: CompanyService,
    private _externalApp: ExternalApplicationService,
    private _account: AccountService,
    private themeService: ThemeService,
    private fb: FormBuilder
  ) {
    this.createFormFiltered();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('usuarios');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.titulo = 'Editando Usuário';
        this._account.get(this.editId).subscribe((usuario) => {
          this.model = usuario.data;
          this.lastCompanyRoles = usuario.data.companiesRoles;
          if (this.lastCompanyRoles) {
            this.companyType = this.lastCompanyRoles[0].companyType;
          }
          this.userIntegration = usuario.data.isBuyFirst && usuario.data.externalApplicationId > 0;
          this.createForm();
        });
      } else {
        this.createForm();
      }
      this.themeService.setTitle(this.titulo);
    });
  }

  onCompanyAutocomplet(event) {
    var selectObj = event.option.value;
    this.companyType = selectObj.type;

    let exitstCompany = null;
    var rolesHasValues: Boolean = this.model.companiesRoles;
    if (rolesHasValues) {
      exitstCompany = this.model.companiesRoles.find((data) => {
        if (data.companyId == selectObj.companyId) return data;
      });
    } else {
      this.model.companiesRoles = [];
    }

    if (!exitstCompany) {
      this.model.companiesRoles.push({
        companyId: selectObj.companyId,
        companyType: selectObj.type,
        companyName: selectObj.name.split(' - ')[1],
        companyDocument: selectObj.name.split(' - ')[0],
        companyTradingName: selectObj.name.split(' - ')[1],
        roles: [],
      });
    }

    if (!rolesHasValues) {
      this.lastCompanyRoles = this.model.companiesRoles;
    }

   this.setCompanyType();

    this.companyForm.reset();
  }

  onSave() {
    if (!this.userForm.valid) {
      this.userForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      this.isValidCompanyForm = true;
      //Verificar se foi preenchido RolesCompany
      if (!this.model.companiesRoles || this.model.companiesRoles.length <= 0) {
        this.isValidCompanyForm = false;
        this.modalDialog.apresentaErro(
          'Erro',
          'É necessário preencher a autorização'
        );
      } else {
        this.lastCompanyRoles.forEach((role) => {
          if (role.roles.length <= 0) {
            this.isValidCompanyForm = false;
            this.modalDialog.apresentaErro(
              'Erro',
              'É necessário preencher a autorização/permissão'
            );
            return false;
          }
        });

        if (this.isValidCompanyForm) {
          if (!this.editId) {
            let model = Object.assign(this.model, this.userForm.getRawValue());

            //Monta roles
            model.rolesCompanies = this.mountRolesCompanies();

            this._account.register(model).subscribe((result) => {
              if (result.succeeded) {
                this.messagemSucesso();
              } else {
                this.modalDialog.apresentaErro('Erro', result.message);
              }
            });
          } else {
            let model: Usuario = Object.assign(
              this.model,
              this.userForm.getRawValue()
            );

            //Monta roles
            model.rolesCompanies = this.mountRolesCompanies();

            this._account.save(model).subscribe((result) => {
              if (result.succeeded) {
                this.messagemSucesso();
              } else {
                this.modalDialog.apresentaErro('Erro', result.message);
              }
            });
          }
        }
      }
    }
  }

  onDelete(companyId: number) {
    //Model
    const modelCompanyRole = this.model.companiesRoles.findIndex((object) => {
      return object.companyId === companyId;
    });
    if (modelCompanyRole !== -1) {
      this.model.companiesRoles.splice(modelCompanyRole, 1);
    }
    //Last
    const modelLastCompanyRole = this.lastCompanyRoles.findIndex((object) => {
      return object.companyId === companyId;
    });
    if (modelLastCompanyRole !== -1) {
      this.lastCompanyRoles.splice(modelLastCompanyRole, 1);
    }

    this.setCompanyType();
  }

  onRoleTypeChange(company: CompanyRoles, event: { value: string[] }) {
    let lastCompnayRole = this.lastCompanyRoles.find((result) => {
      return result.companyId == company.companyId;
    });

    var lastSelected_Admin: boolean =
      lastCompnayRole.roles.indexOf('Admin') > -1;
    var lastSelected_Purchaser: boolean =
      lastCompnayRole.roles.indexOf('Purchaser') > -1;
    var lastSelected_Seller: boolean =
      lastCompnayRole.roles.indexOf('Seller') > -1;
    var lastSelected_Financy: boolean =
      lastCompnayRole.roles.indexOf('Financy') > -1;

    var selected_Admin: boolean = event.value.indexOf('Admin') > -1;
    var selected_Purchaser: boolean = event.value.indexOf('Purchaser') > -1;
    var selected_Seller: boolean = event.value.indexOf('Seller') > -1;
    var selected_Financy: boolean = event.value.indexOf('Financy') > -1;

    if (!lastSelected_Admin) {
      if (
        selected_Admin ||
        (!lastSelected_Admin &&
          selected_Purchaser &&
          selected_Seller &&
          selected_Financy)
      ) {
        lastCompnayRole.roles = ['Admin'];
      } else {
        lastCompnayRole.roles = event.value;
      }
    } else if (
      selected_Admin == lastSelected_Admin &&
      (selected_Purchaser != lastSelected_Purchaser ||
        selected_Seller != lastSelected_Seller ||
        selected_Financy != lastSelected_Financy)
    ) {
      lastCompnayRole.roles = event.value.filter((obj) => {
        return obj !== 'Admin';
      });
    } else {
      lastCompnayRole.roles = event.value;
    }

    company = lastCompnayRole;
  }

  createFormFiltered() {
    this.companyForm = this.fb.group({
      companyInput: null,
    });

    this.companyForm
      .get('companyInput')
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this._company.getFiltered(value, this.companyType).pipe(
            finalize(() => {
              return (this.isLoading = false);
            })
          )
        )
      )
      .subscribe((companies) => {
        this.filteredCompanies = companies;
      });
  }

  createForm() {
    let fieldEntity: Field;
    let fieldsUserRole: Field[] = [
      {
        name: 'userName',
        label: 'UserName',
        placeholder: 'UserName',
        size: 50,
        maxLength: 50,
        value: 'userName',
        disabled: this.editId > 0,
        required: true,
      },
    ];

    this.form = [];

    if (this.userIntegration) {
      this.form.push({
        fields: [
          {
            disabled: this.editId > 0,
            label: 'Aplicação externa',
            name: 'externalApplicationId',
            placeholder: 'Aplicação externa',
            required: false,
            select: true,
            selectName: 'name',
            size: 100,
            useSearch: true,
            value: 'externalApplicationId',
            list: this._externalApp.getAll(),
            options: [{ name: 'name', search: true, text: true }],
          },
        ],
        marginTop: '10px',
      });
    }

    this.form.push(
      {
        fields: [
          {
            name: 'firstName',
            label: 'Primeiro nome',
            placeholder: 'Primeiro nome',
            size: 50,
            maxLength: 50,
            value: 'firstName',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Sobrenome',
            placeholder: 'Sobrenome',
            size: 50,
            maxLength: 50,
            value: 'lastName',
            required: true,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: fieldsUserRole,
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'email',
            label: 'E-mail',
            placeholder: 'E-mail',
            size: 100,
            maxLength: 250,
            value: 'email',
            required: true,
          },
        ],
        marginTop: '10px',
      }
    );

    if (!this.editId) {
      this.form.push(
        {
          fields: [
            {
              name: 'password',
              label: 'Senha',
              placeholder: 'Senha',
              size: 50,
              maxLength: 50,
              value: 'password',
              required: true,
              passwordType: true,
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
              maxLength: 50,
              value: 'confirmPassword',
              required: true,
              passwordType: true,
            },
          ],
          marginTop: '10px',
        }
      );
    }
  }

  //Aux

  setCompanyType() {
    if (this.lastCompanyRoles.length <= 0) {
      this.companyType =  null;
      this.model.isBuyFirst = false;
      this.model.isSupplier = false;
      this.model.isBuyer = false;
      this.model.isRepresentative = false;
    } else {
      this.companyType = this.lastCompanyRoles[0].companyType;
      this.model.isBuyFirst = this.companyType == 0;
      this.model.isSupplier = this.companyType == 1;
      this.model.isBuyer = this.companyType == 2;
      this.model.isRepresentative = this.companyType == 3;
    }
  }

  mountRolesCompanies(): Role[] {
    let rolesCompanies: Role[] = [];
    this.lastCompanyRoles.forEach((company) => {
      company.roles.forEach((role) => {
        rolesCompanies.push({
          companyId: company.companyId,
          role: role,
          companyType: company.companyType,
          companyName: company.companyName,
          companyDocument: company.companyDocument,
          companyTradingName: company.companyTradingName,
        });
      });
    });

    return rolesCompanies;
  }

  displayFn(company: CompanyDto) {
    if (company) {
      return company.name;
    }
  }

  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Usuario ' + (this.editId ? 'alterado' : 'cadastrado') + ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('usuarios');
      },
      null,
      'CONTINUAR'
    );
  }
}

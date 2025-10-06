import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogGenericoFuncoes } from '../../../../shared/component/dialog-generico/dialog-generico.funcoes';
import { AuthService } from '@app/service/auth.service';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { Catalog } from '@data/schema/Catalogs/Catalog';
import { CompanyService } from '@app/service/https/company.service';
import { Login } from '@data/schema/login/login';
import { RegionService } from '@app/service/https/region.serice';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { BlackListDto } from '@data/dto/black-lists/black-list.dto';
import { CatalogBlackList } from '@data/schema/Catalogs/catalog-black-lists';
import { CatalogBlackListService } from '@app/service/https/catalog-blacklist.service';
import { PaymentTypeDto } from '@data/dto/payment-condition/payment-type.dto';
import { PaymentConditionService } from '@app/service/https/payment-condition.service';
import { PaymentConditionDto } from '@data/dto/payment-condition/payment-condition.dto';
import { ModalCatalogConfigPaymentComponent } from '@modules/catalog/components/modal-catalog-config-payment/modal-catalog-config-payment.component';

@Component({
  selector: 'app-catalog-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class CatalogRegisterComponent {
  auth: Login;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  model: Catalog = new Catalog();
  editId: number = null;
  catalogForm: FormGroup;
  form: FormRow[] = [];

  // Black Lists
  modelBlackList: CatalogBlackList;
  blackLists: BlackListDto[] = [];
  colsBlackList: GridColumn[];
  itemMenusBlackList: GridItemMenu[] = [];
  displayedColumnsBlackList: String[];
  blackListFormRegion: FormGroup;
  blackListFormCnpj: FormGroup;
  formBlackListRegion: FormRow[] = [];
  formBlackListCnpj: FormRow[] = [];
  restrictConditionType: number = 2;

  //PaymentConditions
  paymentsDirectLists: PaymentTypeDto[];
  paymentsLists: PaymentTypeDto[];

  selected = new FormControl(0);
  allowEntry: boolean = true;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private themeService: ThemeService,
    private _catalogos: CatalogsService,
    private _companyService: CompanyService,
    private _regionService: RegionService,
    private _blackListService: CatalogBlackListService,
    private _paymentService: PaymentConditionService
  ) { }

  ngOnInit(): void {
    this.auth = this._auth.getState();
    this.themeService.setBackRoute('catalogos');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');

      if (this.editId > 0) {
        this.themeService.setTitle('Editando Catálogo');

        this._catalogos.get(this.editId).subscribe((result) => {
          this.model = result.data;
          this.allowEntry = !result.data.actualStatus.overallStatus.finalization;
          this.createForm();
        });

        //Show PaymentConditions
        this.showPaymentConditions();
      } else {
        this.themeService.setTitle('Novo Catálogo');

        if (!this.auth.isBuyFirst) {
          this.model.companyId = this.auth.companiesSelected[0].companyId;
        }

        this.createForm();
      }
      this.createFormBlackList();
      this.showBlackList();
      this.prepareGridBlackList();
    });
  }

  openProducts() {
    this.router.navigate([this.router.url + '/produtos']);
  }

  openThermometer() {
    const link = window.location.href.replace(this.router.url, `/catalogos/termometro/${this.editId}`);
    this.router.navigate([]).then(result => { window.open(link); });
  }

  radioButtonChange($event) {
    this.createFormBlackList();
  }

  save() {
    if (!this.catalogForm.valid) {
      this.catalogForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      this.model = Object.assign(new Catalog(), this.catalogForm.getRawValue());

      if (!this.editId) {
        this._catalogos.add(this.model).subscribe((result) => {
          // this.editId = result.data;
          this.mensagemSucesso(result.data);
        });
      } else {
        this.model.catalogId = this.editId;
        this._catalogos.save(this.model).subscribe((result) => {
          this.mensagemSucesso();
        });
      }
    }
  }

  formBlackListSubmit() {
    if (!this.allowEntry) {
      return false;
    }
    let form: FormRow | any =
      this.restrictConditionType == 1
        ? this.blackListFormRegion
        : this.blackListFormCnpj;

    if (!form) {
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: CatalogBlackList = Object.assign(
        new CatalogBlackList(),
        this.createFormBlackList(),
        form.getRawValue()
      );

      model.catalogId = this.editId;
      model.restrictConditionType = this.restrictConditionType;

      this._blackListService.add(model).subscribe((result) => {
        this.mensagemSucesso_BlackList(false);
      });
    }
  }

  createForm() {
    this.form = [
      {
        fields: [
          {
            name: 'companyId',
            label: 'Empresa',
            placeholder: 'Empresa',
            size: 100,
            value: 'companyId',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: true,
            useRemove: this.auth.isBuyFirst || (!this.auth.isBuyFirst && this.auth.companiesSelected.length > 1),
            disabled: this.editId > 0 || (!this.auth.isBuyFirst && this.auth.companiesSelected.length == 1),
            list: this._companyService.getListCompany(true),
            options: [{ name: 'name', search: true, text: true }],
          },
        ],
      },
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 100,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'description',
            label: 'Descrição',
            placeholder: 'Descrição',
            size: 100,
            textArea: true,
            textAreaRows: 4,
            value: 'description',
            required: false,
            maxLength: 250,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'startDate',
            label: 'Início vigência',
            placeholder: 'Início vigência',
            size: 100,
            value: 'startDate',
            required: true,
            date: true,
            disabled: (this.editId > 0 && new Date(this.model.startDate) < new Date()),
            useRemove: this.editId == 0,
          },
          {
            name: 'expirationDate',
            label: 'Termino vigência',
            placeholder: 'Termino vigência',
            size: 100,
            value: 'expirationDate',
            required: false,
            date: true,
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  createFormBlackList() {
    this.formBlackListRegion = [
      {
        fields: [
          {
            name: 'regionId',
            label: 'Region',
            placeholder: 'Region',
            size: 50,
            value: 'regionId',
            select: true,
            required: true,
            selectName: 'name',
            useRemove: true,
            useSearch: false,
            list: this._regionService.getSelectAll(),
            options: [{ name: 'name', search: true, text: true }],
          },
        ],
        submit: true,
        submitText: 'Restringir',
        size: 20,
        marginTop: '10px',
      },
    ];

    this.formBlackListCnpj = [
      {
        fields: [
          {
            name: 'cnpj',
            label: 'CNPJ',
            placeholder: 'CNPJ',
            size: 30,
            value: 'cnpj',
            required: true,
            mask: 'CPF_CNPJ',
            maxLength: 18,
          },
        ],
        submit: true,
        submitText: 'Restringir',
        size: 20,
        marginTop: '10px',
      },
    ];
  }

  prepareGridBlackList() {
    let restrictType = {};
    restrictType['1'] = 'Região';
    restrictType['2'] = 'CNPJ';

    this.colsBlackList = [
      {
        name: 'restrictConditionType',
        title: 'Tipo',
        show: true,
        value: restrictType,
      },
      { name: 'restrictText', title: 'Restrição', show: true },
    ];

    this.displayedColumnsBlackList = ['restrictConditionType', 'restrictText'];

    this.itemMenusBlackList = [
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: BlackListDto) => {
          let sub = this._blackListService
            .delete(row.id)
            .subscribe((result) => {
              if (result.succeeded) {
                this.mensagemSucesso_BlackList(true);
                sub.unsubscribe();
              } else {
                console.log(result.message);
              }
            });
        },
      },
    ];
  }

  showPaymentConditions() {
    let sub = this._paymentService
      .getPaymentConditionCatalogAll(this.editId, false)
      .subscribe((result) => {
        if (result.succeeded) {
          this.paymentsDirectLists = result.data;
          sub.unsubscribe();
        } else {
          console.log(result.message);
        }
      });

    let sub2 = this._paymentService
      .getPaymentConditionCatalogAll(this.editId, true)
      .subscribe((result) => {
        if (result.succeeded) {
          this.paymentsLists = result.data;
          sub2.unsubscribe();
        } else {
          console.log(result.message);
        }
      });
  }

  showBlackList() {
    let subBlackList = this._blackListService
      .getAll(this.editId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.blackLists = result.data;
          subBlackList.unsubscribe();
        } else {
          console.log(result.message);
        }
      });
  }

  //Payment Actions
  paymentConditionActive(row: PaymentConditionDto) {
    if (!this.allowEntry) {
      return false;
    }

    if (row.id == null) {
      //show modal new config...
      this.showModalConfigPayment(row);
    } else {
      var sub = this._paymentService
        .activePaymentCatalog(row.id)
        .subscribe((response) => {
          if (response.succeeded) {
            row.active = !row.active;
          } else {
            console.log(response.message);
          }
        });
    }
  }

  //Aux

  showModalConfigPayment(row: PaymentConditionDto) {
    if (!this.allowEntry) {
      return false;
    }
    const dialogRef = this.dialog.open(ModalCatalogConfigPaymentComponent, {
      data: row,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showPaymentConditions();
      }
    });
  }

  mensagemSucesso(catalogId: number = 0) {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Catalogo ' + (this.editId ? 'alterado' : 'cadastrado') + ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        if (catalogId > 0) {
          this.router.navigateByUrl(`catalogos/cadastro/${catalogId}`);
        }
      },
      null,
      'CONTINUAR'
    );
  }

  mensagemSucesso_BlackList(deleting: boolean) {
    const text = deleting ? 'deletada' : 'adicionada';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Restrição ${text} com sucesso!`,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.showBlackList();
      },
      null,
      'CONTINUAR'
    );
  }
}

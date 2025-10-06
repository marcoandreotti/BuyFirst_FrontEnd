import { RegionService } from '@app/service/https/region.serice';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormRow } from '@shared/component/form/form';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { Buyer } from '@data/schema/persons/companies/buyers/buyer';
import { ThemeService } from '@app/service/theme.service';
import { BuyerService } from '@app/service/https/buyers.service';
import { Address } from '@data/schema/persons/address';
import { Responsible } from '@data/schema/persons/responsible';
import { ModalAddressComponent } from '@modules/company/components/modal-address/modal-address.component';
import { ModalResponsibleComponent } from '@modules/company/components/modal-responsible/modal-responsible.component';
import { Region } from '@data/schema/Regions/region';
import { BlackList } from '@data/schema/black-lists/black-lists';
import { BlackListService } from '@app/service/https/blacklist.service';
import { BlackListDto } from '@data/dto/black-lists/black-list.dto';
import { PaymentTypeDto } from '@data/dto/payment-condition/payment-type.dto';
import { PaymentConditionService } from '@app/service/https/payment-condition.service';
import { PaymentConditionDto } from '@data/dto/payment-condition/payment-condition.dto';
import { ModalConfigPaymentComponent } from '../../../components/modal-config-payment/modal-config-payment.component';
import { Login } from '@data/schema/login/login';
import { AuthService } from '@app/service/auth.service';
import { CompanyConfig99KDto } from '@data/dto/companies/company-config-99k.dto';
import { CompanyService } from '@app/service/https/company.service';

@Component({
  selector: 'app-buyer-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class BuyerRegisterComponent {
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  //Buyer
  model: Buyer;
  responsibleModel: Responsible[] = [];
  editId: number = null;
  buyerForm: FormGroup;
  formBuyer: FormRow[] = [];

  //Address
  modelAddress: Address;
  addressesList: Address[] = [];
  editAddressId: number = null;
  addressForm: FormGroup;
  formAddress: FormRow[] = [];
  colsAddress: GridColumn[];
  displayedColumnsAddress: String[];
  itemMenusAddress: GridItemMenu[] = [];
  topMenusAddress: GridItemMenu[] = [];

  //Responsible
  modelResponsible: Responsible;
  isNewResponsible: boolean = false;
  responsiblesList: Responsible[] = [];
  editResponsibleId: number = null;
  responsibleForm: FormGroup;
  formResponsible: FormRow[] = [];
  colsResponsible: GridColumn[];
  itemMenusResponsible: GridItemMenu[] = [];
  topMenusResponsible: GridItemMenu[] = [];
  displayedColumnsResponsible: String[];

  //Regiões
  regionsList: Region[] = [];
  editRegionId: number = null;
  regionForm: FormGroup;
  formRegion: FormRow[] = [];
  colsRegion: GridColumn[];
  itemMenusRegion: GridItemMenu[] = [];
  topMenusRegion: GridItemMenu[] = [];
  displayedColumnsRegion: String[];

  // Black Lists
  modelBlackList: BlackList;
  blackLists: BlackListDto[] = [];
  colsBlackList: GridColumn[];
  itemMenusBlackList: GridItemMenu[] = [];
  displayedColumnsBlackList: String[];
  blackListFormRegion: FormGroup;
  blackListFormCnpj: FormGroup;
  formBlackListRegion: FormRow[] = [];
  formBlackListCnpj: FormRow[] = [];
  restrictConditionType: number = 2;
  auth: Login;

  //PaymentConditions
  paymentsLists: PaymentTypeDto[];

  //Config
  modelConfig99K: CompanyConfig99KDto = new CompanyConfig99KDto();
  formConfig99K: FormRow[] = [];
  configForm99K: FormGroup;

  selected = new FormControl(0);

  constructor(
    private _auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private _buyerService: BuyerService,
    private _compnayService: CompanyService,
    private _regionService: RegionService,
    private _blackListService: BlackListService,
    private _paymentService: PaymentConditionService
  ) { }

  ngOnInit(): void {
    this.auth = this._auth.getState();
    if (!this.auth.isBuyFirst) {
      this.themeService.setBackRoute(null);
    } else {
      this.themeService.setBackRoute('compradores');
    }

    this.prepareGridAddress();
    this.prepareGridResponsible();
    this.prepareGridRegion();
    this.prepareGridBlackList();

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.themeService.setTitle('Editando Comprador');
        
        this._buyerService.get(this.editId).subscribe((result) => {
          this.model = result.data;
          if (result.data) {
            if (result.data.addresses) {
              this.addressesList = result.data.addresses;
            }
            if (result.data.responsibles) {
              this.responsiblesList = result.data.responsibles;
            }
            if (result.data.regions) {
              this.regionsList = result.data.regions;
            }
            if (result.data.config99K){
              this.modelConfig99K = result.data.config99K;
            }
          }
        });

        //Show BlackLists grid
        this.showBlackList();

        //Show PaymentConditions
        this.showPaymentConditions();
      } else {
        this.themeService.setTitle('Novo Comprador');
        this.model = new Buyer();
        this.model.contractAccepted = false;
        this.model.minimumBillingAmount = 0;
        this.model.optingSimple = false;
      }
    });

    this.createForm();
    this.createFormRegion();
    this.createFormBlackList();
    this.createFormConfig99K();
  }

  //Submit's
  save() {
    if (!this.buyerForm.valid) {
      this.buyerForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (this.addressesList.length == 0) {
        this.modalDialog.apresentaErro(
          'Erro',
          'Adicione pelo menos um endereço'
        );
        return;
      }

      let model: Buyer = Object.assign(
        new Buyer(),
        this.buyerForm.getRawValue()
      );

      if (model.contractAccepted == true && this.responsiblesList.length == 0) {
        this.modalDialog.apresentaErro(
          'Erro',
          'Adicione pelo menos um contato'
        );
        return;
      }

      if (!model.contractAccepted) model.contractAccepted = false;
      if (!model.optingSimple) model.optingSimple = false;
      model.addresses = this.addressesList;

      if (this.responsiblesList) {
        model.responsibles = this.responsiblesList;
      }

      model.regions = this.regionsList;

      if (!model.minimumBillingAmount) {
        model.minimumBillingAmount = 0;
      }

      if (!this.editId) {
        this._buyerService.add(model).subscribe(() => {
          this.mensagemSucesso();
        });
      } else {
        model.buyerId = this.editId;

        if (!this.auth.isBuyFirst) {
          model.contractAccepted = this.model.contractAccepted;
          model.minimumBillingAmount = this.model.minimumBillingAmount;
        }

        this._buyerService.save(model).subscribe(() => {
          this.mensagemSucesso();
        });
      }
    }
  }

  formRegionSubmit() {
    if (!this.regionForm) {
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: Region = Object.assign(
        new Region(),
        this.createFormRegion(),
        this.regionForm.getRawValue()
      );

      if (model.regionId) {
        let existsRegion: Region = this.regionsList.find(
          (e) => e.regionId === model.regionId
        );

        if (!existsRegion) {
          let regionNew: Region;
          let sub = this._regionService
            .get(model.regionId)
            .subscribe((result) => {
              regionNew = result.data;
              regionNew.new = true;
              this.regionsList = [...this.regionsList.concat(regionNew)];
            });
        } else {
          this.modalDialog.apresentaErro('Erro', 'Região já existente');
        }
      }
    }
  }

  formBlackListSubmit() {
    let form: FormRow | any =
      this.restrictConditionType == 1
        ? this.blackListFormRegion
        : this.blackListFormCnpj;

    if (!form) {
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: BlackList = Object.assign(
        new BlackList(),
        this.createFormBlackList(),
        form.getRawValue()
      );

      model.companyId = this.editId;
      model.restrictConditionType = this.restrictConditionType;

      this._blackListService.add(model).subscribe((result) => {
        this.mensagemSucesso_BlackList(false);
      });
    }
  }

  formConfigSubmit() {
    if (!this.configForm99K) {
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let modelConfig: CompanyConfig99KDto = Object.assign(
        new CompanyConfig99KDto(),
        this.createFormConfig99K(),
        this.configForm99K.getRawValue()
      );

      modelConfig.companyId = this.editId;
      this._compnayService.saveCompanyConfig99K(modelConfig).subscribe((result) => {
        if (result.succeeded){
          this.mensagemSucesso_Config(false);
        } else {
          this.modalDialog.apresentaErro('Erro', result.message);
        }
      });
    }
  }
  //Forms

  createForm() {
    this.formBuyer = [
      {
        fields: [
          {
            name: 'document',
            label: 'CNPJ ou CPF',
            placeholder: 'CNPJ ou CPF',
            size: 34,
            value: 'document',
            required: true,
            mask: 'CPF_CNPJ',
            maxLength: 20,
          },
          {
            name: 'externalCode',
            label: 'Código externo-ERP',
            placeholder: 'Código externo-ERP',
            size: 33,
            value: 'externalCode',
            required: false,
            maxLength: 20,
          },
          {
            name: 'companyCodeSac',
            label: 'Código do Grupo',
            placeholder: 'Código do Grupo',
            size: 33,
            value: 'companyCodeSac',
            required: false,
            maxLength: 20,
            number: true,
            numberType: 'inteiro',
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
            maxLength: 100,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'tradingName',
            label: 'Nome Fantasia',
            placeholder: 'Nome Fantasia',
            size: 100,
            value: 'tradingName',
            required: false,
            maxLength: 100,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'stateRegistration',
            label: 'Inscrição Estadual',
            placeholder: 'Inscrição Estadual',
            size: 33,
            value: 'stateRegistration',
            required: false,
            maxLength: 20,
          },
          {
            name: 'municipalRegistration',
            label: 'Inscrição Municipal',
            placeholder: 'Inscrição Municipal',
            size: 33,
            value: 'municipalRegistration',
            required: false,
            maxLength: 20,
          },
          {
            name: 'optingSimple',
            label: 'Optante pelo simples!',
            placeholder: 'Optante pelo simples!',
            checkBox: true,
            size: 40,
            value: 'optingSimple',
            required: false,
          },
        ],
        marginTop: '10px',
      },
    ];

    if (this.auth.isBuyFirst) {
      this.formBuyer.push({
        fields: [
          {
            name: 'minimumBillingAmount',
            label: 'Vlr. Minimo Faturamento',
            placeholder: 'Vlr. Minimo Faturamento',
            size: 52,
            value: 'minimumBillingAmount',
            required: false,
            number: true,
            numberType: 'decimal',
          },
          {
            name: 'contractAccepted',
            label: 'Contrato de compra e venda. Aceito!',
            placeholder: 'Contrato de compra e venda. Aceito!',
            checkBox: true,
            size: 40,
            disabled: !this.auth.isBuyFirst,
            value: 'contractAccepted',
            required: false,
          }
        ],
        marginTop: '10px',

      });
      
    }
  }

  createFormRegion() {
    this.formRegion = [
      {
        fields: [
          {
            name: 'regionId',
            label: 'Region',
            placeholder: 'Region',
            size: 60,
            value: 'regionId',
            select: true,
            required: false,
            selectName: 'name',
            useRemove: true,
            useSearch: true,
            list: this._regionService.getSelectAll(),
            options: [{ name: 'name', search: true, text: true }],
            onChange: () => { },
          },
        ],
        submit: true,
        submitText: 'Confirmar',
        size: 20,
        marginTop: '40px',
      },
    ];
  }

  radioButtonChange($event) {
    this.createFormBlackList();
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

  createFormConfig99K() {
    this.formConfig99K = [
      {
        fields: [
          {
            name: 'clientId',
            label: '99Kote - Acesso ID',
            placeholder: '99Kote - Acesso ID',
            size: 50,
            value: 'clientId',
            required: true,
            maxLength: 255,
          },
          {
            name: 'clientSecret',
            label: '99Kote - Acesso Token',
            placeholder: '99Kote - Acesso Token',
            size: 40,
            value: 'clientSecret',
            required: true,
            maxLength: 255,
          }
        ],
        submit: true,
        submitText: 'Salvar Configurações',
        marginTop: '30px',
      },
    ];
  }

  // Grids

  prepareGridAddress() {
    let typeAddress = {};
    typeAddress[1] = 'Único';
    typeAddress[2] = 'Cobrança';
    typeAddress[3] = 'Entrega';

    this.displayedColumnsAddress = [
      'type',
      'street',
      'number',
      'complement',
      'neighborhood',
      'location',
      'stateAcronym',
      'zipCode',
    ];

    this.colsAddress = [
      { name: 'type', title: 'Tipo', show: true, value: typeAddress },
      { name: 'street', title: 'Logradouro', show: true },
      { name: 'number', title: 'Nro.', show: true },
      { name: 'complement', title: 'Complemento', show: true },
      { name: 'neighborhood', title: 'Bairro', show: true },
      { name: 'location', title: 'Cidade', show: true },
      { name: 'stateAcronym', title: 'UF', show: true },
      { name: 'zipCode', title: 'CEP', show: true },
    ];

    this.itemMenusAddress = [
      {
        name: 'Editar',
        icon: 'edit',
        action: (row: Address) => {
          this.showModalAddress(row);
        },
      },
    ];

    this.topMenusAddress = [
      {
        name: 'Novo endereço',
        icon: 'add',
        action: (_onclick) => {
          this.showModalAddress(new Address());
        },
      },
    ];
  }

  prepareGridResponsible() {
    let typeResponsible = {};
    typeResponsible[1] = 'Principal';
    typeResponsible[2] = 'Comum';

    this.displayedColumnsResponsible = ['type', 'name', 'email', 'cellphone'];

    this.colsResponsible = [
      { name: 'type', title: 'Tipo', show: true, value: typeResponsible },
      { name: 'name', title: 'Nome.', show: true },
      { name: 'email', title: 'E-mail', show: true },
      { name: 'cellphone', title: 'Celular', show: true },
    ];

    this.itemMenusResponsible = [
      {
        name: 'Editar',
        icon: 'edit',
        action: (row: Responsible) => {
          this.isNewResponsible = false;
          this.showModalResponsible(row);
        },
      },
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: Responsible) => {
          this.modalDialog.apresentaAviso(
            'Excluir',
            'Tem certeza que deseja excluir?',
            true,
            true,
            () => {
              this.modalDialog.dialog.closeAll();
            },
            () => {
              this.modalDialog.dialog.closeAll();
              const lst: Responsible[] = [];

              const findResp = this.responsiblesList.findIndex((e) => {
                return e.responsibleId === row.responsibleId && e.name === row.name && e.type === row.type;
              });
              this.responsiblesList.splice(findResp, 1);

              this.responsiblesList.forEach(element => {
                lst.push(element);
              });

              this.responsiblesList = lst;
            },
            'NÃO',
            'SIM'
          );
        },
      },
    ];

    this.topMenusResponsible = [
      {
        name: 'Novo Contato',
        icon: 'add',
        action: (_onclick) => {
          this.isNewResponsible = true;
          this.showModalResponsible(new Responsible());
        },
      },
    ];
  }

  prepareGridRegion() {
    this.displayedColumnsRegion = ['regionId', 'name', 'stateAcronym'];

    this.colsRegion = [
      { name: 'regionId', title: 'ID', show: true },
      { name: 'name', title: 'Nome', show: true },
      { name: 'stateAcronym', title: 'UF', show: true },
    ];

    this.itemMenusRegion = [
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: Region) => {
          let list: Region[] = [];
          this.regionsList.forEach((value, index) => {
            if (value.regionId != row.regionId) list.push(value);
          });
          this.regionsList = list;
          if (!row.new) {
            this.mensagemSucesso_RegionTarget();
          }
        },
      },
    ];
  }

  prepareGridBlackList() {
    let restrictType = {};
    restrictType['1'] = 'Região';
    restrictType['2'] = 'CNPJ';

    this.displayedColumnsBlackList = ['restrictConditionType', 'restrictText'];

    this.colsBlackList = [
      {
        name: 'restrictConditionType',
        title: 'Tipo',
        show: true,
        value: restrictType,
      },
      { name: 'restrictText', title: 'Restrição', show: true },
    ];

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

  //Aux

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

  showPaymentConditions() {
    let sub = this._paymentService
      .getPaymentConditionSupplierAll(this.editId, true)
      .subscribe((result) => {
        if (result.succeeded) {
          this.paymentsLists = result.data;
          sub.unsubscribe();
        } else {
          console.log(result.message);
        }
      });
  }

  showModalAddress(model: Address) {
    const dialogRef = this.dialog.open(ModalAddressComponent, {
      data: model,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!result.addressId || result.addressId == 0) {
          this.addressesList = [...this.addressesList.concat(result)];
        } else {
          let address = this.addressesList.find(
            (e) => e.addressId === result.addressId
          );
          if (address) {
            address.type = result.type;
            address.addressId = result.addressId;
            address.complement = result.complement;
            // address.default = result.default;
            address.location = result.location;
            address.neighborhood = result.neighborhood;
            address.number = result.number;
            address.stateAcronym = result.stateAcronym;
            address.street = result.street;
            address.type = result.type;
            address.zipCode = result.zipCode;
          }
        }
      }
    });
  }

  showModalResponsible(model: Responsible) {
    //Carregando os dados antes da edição
    this.modelResponsible = model;

    const dialogRef = this.dialog.open(ModalResponsibleComponent, {
      data: model,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.isNewResponsible) {
          const findResp = this.responsiblesList.findIndex((e) => {
            return e.name === this.modelResponsible.name && e.type === this.modelResponsible.type;
          });
          this.responsiblesList.splice(findResp, 1);
        }
        this.responsiblesList = [...this.responsiblesList.concat(result)];
      }
    });
  }

  //Payment Actions
  paymentConditionActive(row: PaymentConditionDto) {
    if (row.id == null) {
      //show modal new config...
      this.showModalConfigPayment(row);
    } else {
      var sub = this._paymentService
        .activePaymentSupplier(row.id)
        .subscribe((response) => {
          if (response.succeeded) {
            row.active = !row.active;
          } else {
            console.log(response.message);
          }
        });
    }
  }

  showModalConfigPayment(row: PaymentConditionDto) {
    const dialogRef = this.dialog.open(ModalConfigPaymentComponent, {
      data: row,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showPaymentConditions();
      }
    });
  }

  //Msgs
  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Comprador ' +
      (this.editId ? 'alterado' : 'cadastrado') +
      ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        if (this.auth.isBuyFirst) {
          this.router.navigateByUrl('compradores');
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

  mensagemSucesso_RegionTarget() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Região removida, é necessário salvar geral para efetivar!`,
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

  mensagemSucesso_Config(deleting: boolean) {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Configurações salvas com sucesso!`,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }
}

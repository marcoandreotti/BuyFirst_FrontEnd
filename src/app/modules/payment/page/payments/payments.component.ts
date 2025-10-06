import { BfResponse } from '@data/schema/response';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { PaymentCondition } from '@data/schema/payment-conditions/payment-condition';
import { PaymentType } from '@data/schema/payment-type/payment-type';
import { PaymentTypeService } from '@app/service/https/payment-type.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentComponent implements OnInit {
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_payment';
  modelIdentity: string = 'paymentTypeId';
  pageIndex: number = 0;
  pageSize: number = 25;
  paymentType$: BfResponse<PaymentType[]>;

  expandedElementIndex: PaymentCondition[] | any;
  paymentCondition$: PaymentCondition[];
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private dialog: MatDialog,
    private themeService: ThemeService,
    private _service: PaymentTypeService
  ) {
    this.PrepareGrid();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('configuracoes');
    this.themeService.setTitle('Métodos de pagamento');

    this.lastFilter = this.getLastFilter();
    this.filter(this.lastFilter);
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.filter(this.lastFilter);
  }

  onFilter(event) {
    this.pageIndex = 0;

    this.filter(event);
  }

  filter(event) {
    if (event) {
      this.SaveLastFilter(event);
      this.lastFilter = event;
    } else {
      event = this.lastFilter;
    }

    let sub = this._service
      .getAll(event?.argument ?? null, this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.paymentType$ = res;
        sub.unsubscribe();
      });
  }

  onExpandItem(event) {
    this.paymentCondition$ = event.row.paymentConditions;
    this.expandedElementIndex = event.row[this.modelIdentity];
  }

  onCloseExpandItem(event) {
    this.expandedElementIndex = null;
  }

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          argument: null,
        })
      );
    }
  }

  getLastFilter() {
    var data = localStorage.getItem(this.lastFilterTag);
    if (data == 'undefined') {
      return null;
    } else {
      return JSON.parse(data);
    }
  }

  PrepareGrid() {
    this.displayedColumns = [
      'paymentTypeId',
      'name',
      'description',
      'isEcommerce',
      'active',
    ];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    let ecommerceValue = {};
    ecommerceValue['true'] = 'Indireta';
    ecommerceValue['false'] = 'Direta com a empresa';

    this.cols = [
      {
        name: 'paymentTypeId',
        title: 'ID',
        show: true,
      },
      {
        name: 'name',
        title: 'Nome',
        show: true,
      },
      {
        name: 'description',
        title: 'Descrição',
        show: true,
      },
      {
        name: 'isEcommerce',
        title: 'Negociação',
        show: true,
        value: ecommerceValue,
      },
      {
        name: 'active',
        title: 'Ativo',
        show: true,
        value: activeValue,
      },

      {
        name: 'paymentConditions',
        title: 'Condições de pagamento',
        show: true,
        expandled: true,
        expandledColumns: [
          { name: 'paymentConditionId', title: 'ID', show: true },
          { name: 'name', title: 'Nome', show: true },
          { name: 'maturityDateTypeName', title: 'Tipo', show: true },
          {
            name: 'maturityDateTypeDescription',
            title: 'Descrição',
            show: true,
          },
          {
            name: 'daysByPayment',
            title: 'Dias p/pagto',
            show: true,
            decimal: true,
            decimalPrecision: 0,
          },
          {
            name: 'quantityInstallments',
            title: 'Qtd/Parcelas',
            show: true,
            decimal: true,
            decimalPrecision: 0,
          },
          {
            name: 'percentageOnPrice',
            title: '%',
            show: true,
            decimal: true,
            decimalPrecision: 2,
          },
          {
            name: 'active',
            title: 'Ativo',
            show: true,
            value: activeValue,
          },
        ],
        expandledDisplayColumns: [
          'paymentConditionId',
          'name',
          'maturityDateTypeName',
          'maturityDateTypeDescription',
          'daysByPayment',
          'quantityInstallments',
          'percentageOnPrice',
          'active',
        ],
      },
    ];

    this.itemMenus = [
      {
        name: 'Ativar/Inativar',
        icon: 'done_outline',
        action: (row: PaymentType) => {
          let sub = this._service
            .activeInactive(row.paymentTypeId)
            .subscribe((result) => {
              if (result.succeeded) {
                this.mensagemSucesso_Active(!row.active);
                row.active = !row.active;
                sub.unsubscribe();
              } else {
                console.log(result.message);
              }
            });
        },
      },
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: PaymentType) => {
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

              let sub = this._service
                .delete(row.paymentTypeId)
                .subscribe((result) => {
                  if (result.succeeded) {
                    this.mensagemSucesso_Delete();
                    sub.unsubscribe();
                    this.filter(this.lastFilter);
                  } else {
                    console.log(result.message);
                  }
                });
            },
            'NÃO',
            'SIM'
          );
        },
      },
    ];
  }

  PrepareFilters() {
    this.filters = [
      {
        fields: [
          {
            name: 'argument',
            label: 'Nome',
            placeholder: 'Nome',
            size: 30,
            value: 'argument',
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  mensagemSucesso_Delete() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Método de pagamento excluido com sucesso!`,
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

  mensagemSucesso_Active(active: boolean) {
    const text = active ? 'ativo' : 'inativo';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Método de pagamento ${text} com sucesso!`,
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

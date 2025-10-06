import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { FormRow } from '@shared/component/form/form';
import { ThemeService } from '@app/service/theme.service';
import { BfResponse } from '@data/schema/response';
import { SalesService } from '@app/service/https/sales.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MyOrderDto } from '@data/dto/sales-force/my-order.dto';
import { Login } from '@data/schema/login/login';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  auth: Login;
  sales$: BfResponse<MyOrderDto[]>;
  purchases$: BfResponse<MyOrderDto[]>;
  cols: GridColumn[] = [];
  colsBuyers: GridColumn[] = [];
  displayedSalesColumns: String[] = [];
  displayedPurchasesColumns: String[] = [];
  Salesfilters: FormRow[];
  Purchasesfilters: FormRow[];
  idEstabelecimento: number = null;
  modelIdentity: string = 'orderId';
  lastSalesFilter: any;
  lastPurchasesFilter: any;
  lastSalesFilterTag: string = 'last_filter_my_sales';
  lastPurchasesFilterTag: string = 'last_filter_my_purchases';
  itemMenus: GridItemMenu[] = [];
  pageIndex: number = 0;
  pageSize: number = 25;
  sort: Sort = { active: 'default', direction: 'desc' };

  constructor(
    private router: Router,
    private _auth: AuthService,
    private themeService: ThemeService,
    private _service: SalesService
  ) {
    this.auth = _auth.getState();

    this.PrepareColumns();
    this.PrepareSalesFilters();
    this.PreparePurchasesFilters();
    this.PrepareItensMenu();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle(this.auth.isSupplier ? 'Minhas Vendas' : this.auth.isBuyFirst ? 'Vendas' : 'Minhas Finanças');

    this.lastSalesFilter = this.getLastSalesFilter();
    this.lastPurchasesFilter = this.getLastPurchasesFilter();
    this.filterSales(this.lastSalesFilter);
    if (this.auth.isBuyer) {
      this.filterPurchases(this.lastPurchasesFilter);
    }
  }

  onSalesPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.filterSales(this.lastSalesFilter);
  }

  onPurchasesPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    
    this.filterPurchases(this.lastPurchasesFilter);
  }

  onSalesFilter(event) {
    this.pageIndex = 0;

    this.filterSales(event);
  }

  onPurchasesFilter(event) {
    this.pageIndex = 0;

    this.filterPurchases(event);
  }

  filterSales(event) {
    if (event) {
      this.SaveLastSalesFilter(event);
      this.lastSalesFilter = event;
    } else {
      event = this.lastSalesFilter;
    }

    let sub = this._service.getAllSellers(
        null,
        event?.argument ?? null,
        null,
        event?.orderId ?? null,
        event?.dataInicial ?? null,
        event?.dataFinal ?? null,
        this.pageIndex + 1,
        this.pageSize,
        this.sort
      )
      .subscribe((res) => {
        this.sales$ = res;
        sub.unsubscribe();
      });
  }

  filterPurchases(event) {
    if (event) {
      this.SaveLastPurchasesFilter(event);
      this.lastPurchasesFilter = event;
    } else {
      event = this.lastPurchasesFilter;
    }

    let sub2 = this._service.getAllPurchases(
        null,
        event?.argument ?? null,
        null,
        event?.orderId ?? null,
        event?.dataInicial ?? null,
        event?.dataFinal ?? null,
        this.pageIndex + 1,
        this.pageSize,
        this.sort
      )
      .subscribe((res) => {
        this.purchases$ = res;
        sub2.unsubscribe();
      });
  }

  changeSalesSorter(event: Sort) {
    this.pageIndex = 0;

    this.sort = event;
    if (!this.sort.direction) this.sort.direction = 'asc';
    this.filterSales(this.lastSalesFilter);
  }

  changePurchasesSorter(event: Sort) {
    this.pageIndex = 0;

    this.sort = event;
    if (!this.sort.direction) this.sort.direction = 'asc';
    this.filterPurchases(this.lastPurchasesFilter);
  }

  SaveLastSalesFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastSalesFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastSalesFilterTag,
        JSON.stringify({
          supplierId: null,
          argument: null,
          overallStatusId: null,
          orderId: null,
          initialDate: null,
          endDate: null,
          sort: this.sort,
        })
      );
    }
  }

  SaveLastPurchasesFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastPurchasesFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastPurchasesFilterTag,
        JSON.stringify({
          supplierId: null,
          argument: null,
          overallStatusId: null,
          orderId: null,
          initialDate: null,
          endDate: null,
          sort: this.sort,
        })
      );
    }
  }

  getLastSalesFilter() {
    var data = localStorage.getItem(this.lastSalesFilterTag);
    if (data == 'undefined') {
      return null;
    } else {
      return JSON.parse(data);
    }
  }

  getLastPurchasesFilter() {
    var data = localStorage.getItem(this.lastPurchasesFilterTag);
    if (data == 'undefined') {
      return null;
    } else {
      return JSON.parse(data);
    }
  }

  PrepareSalesFilters() {
    this.Salesfilters = [
      {
        fields: [
          {
            name: 'dataInicial',
            label: 'Data Inicial',
            placeholder: 'Data Inicial',
            size: 15,
            value: 'dataInicial',
            date: true,
            range: false,
          },
          {
            name: 'dataFinal',
            label: 'Data Final',
            placeholder: 'Data Final',
            size: 15,
            value: 'dataFinal',
            date: true,
            range: false,
          },
          {
            name: 'orderId',
            label: 'Número do Pedido',
            placeholder: '',
            size: 15,
            value: 'orderId',
          },
          {
            name: 'argument',
            label: 'Nome do Comprador ou CNPJ (somente números)',
            placeholder: '',
            size: 55,
            value: 'argument',
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  PreparePurchasesFilters() {
    this.Purchasesfilters = [
      {
        fields: [
          {
            name: 'dataInicial',
            label: 'Data Inicial',
            placeholder: 'Data Inicial',
            size: 15,
            value: 'dataInicial',
            date: true,
            range: false,
            useRemove: true
          },
          {
            name: 'dataFinal',
            label: 'Data Final',
            placeholder: 'Data Final',
            size: 15,
            value: 'dataFinal',
            date: true,
            range: false,
            useRemove: true
          },
          {
            name: 'orderId',
            label: 'Número do Pedido',
            placeholder: '',
            size: 15,
            value: 'orderId',
          },
          {
            name: 'argument',
            label: 'Nome do Comprador ou CNPJ (somente números)',
            placeholder: '',
            size: 55,
            value: 'argument',
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  PrepareItensMenu() {
    this.itemMenus = [
      {
        name: 'Ver',
        icon: 'remove_red_eye',
        action: (item) => {
          this.router.navigateByUrl(`vendas/detalhe/${item.orderId}`);
        },
      },
      {
        name: 'Imprimir',
        icon: 'print',
        action: (item) => {
          // this.router.navigateByUrl(`vendas/print-order/${item.orderId}`);
          this._service.printOrderPdf(item.orderId);
        },
      },
    ];
  }

  PrepareColumns() {
    this.displayedSalesColumns = [
      'orderId',
      'supplierName',
      'externalCode',
      'buyerDocument',
      'buyerName',
      'openingDate',
      'statusName',
      'totalOrder',
    ];

    this.displayedPurchasesColumns = [
      'orderId',
      'externalCode',
      'supplierDocument',
      'supplierName',
      'openingDate',
      'statusName',
      'totalOrder',
    ];

    this.cols = [
      { name: 'orderId', title: 'Pedido', show: true, showSort: true },
      { name: 'supplierName', title: 'Fornecedor', show: this.auth.isBuyFirst, showSort: true },
      { name: 'externalCode', title: 'ERP Nro.', show: true, showSort: true },
      { name: 'buyerDocument', title: 'CNPJ', mask: 'CPF_CNPJ', show: true, showSort: true, },
      { name: 'buyerName', title: 'Razão Social', show: true, showSort: true },
      { name: 'openingDate', title: 'Data/Hora', date: true, hour: true, show: true, showSort: true, },
      { name: 'statusName', title: 'Status', show: true, showSort: true },
      { name: 'totalOrder', title: 'Valor total', decimal: true, decimalPrecision: 2, prefix: 'R$ ', show: true, showSort: true, },
    ];

    this.colsBuyers = [
      { name: 'orderId', title: 'Pedido', show: true, showSort: true },
      { name: 'externalCode', title: 'ERP Nro.', show: true, showSort: true },
      { name: 'supplierDocument', title: 'CNPJ', mask: 'CPF_CNPJ', show: true, showSort: false },
      { name: 'supplierName', title: 'Vendedor', show: true, showSort: true },
      { name: 'openingDate', title: 'Data/Hora', show: true, showSort: false, date: true, hour: true, },
      { name: 'statusName', title: 'Status', show: true, showSort: true },
      { name: 'totalOrder', title: 'Valor total', show: true, showSort: false, decimal: true, decimalPrecision: 2, prefix: 'R$ ', },
    ];
  }
}

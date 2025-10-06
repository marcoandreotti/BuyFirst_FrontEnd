import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { ThemeService } from '@app/service/theme.service';
import { Login } from '@data/schema/login/login';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { BfResponse } from '@data/schema/response';
import { SalesService } from '@app/service/https/sales.service';
import { Router } from '@angular/router';
import { QueueTotalsDto } from '@data/dto/queue/queue-totals.dto';
import { DatePipe } from '@angular/common';
import { MyOrderDto } from '@data/dto/sales-force/my-order.dto';
import { QuoteErpHistoricService } from '@app/service/https/quote-erp-historic.service';
import { FilterQuoteErpModel } from '@data/dto/quote/erp/filter-quote-erp-model';
import { FilterQuoteErpHistoricDto, FilterQuoteErpHistoricSearch } from '@data/dto/quote/erp/filter-quote-erp-historic.dto';
import { Sort } from '@angular/material/sort';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { MatDialog } from '@angular/material/dialog';
import { ModalCompanyProblemComponent } from '@modules/home/component/modal-company-problem.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  auth: Login;
  cols: GridColumn[] = [];
  colsBuyers: GridColumn[] = [];
  vendas$: BfResponse<MyOrderDto[]>;
  compras$: BfResponse<MyOrderDto[]>;
  displayedColumns: String[] = [];
  displayedSupplierColumns: String[] = [];
  modelIdentity: string = 'orderId';
  itemMenus: GridItemMenu[] = [];
  lastFilterQuoteErpHistoric: string = 'last_filter_quote_erp_historic';

  multi: QueueTotalsDto[];
  countErros: number = 0;

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = false;
  animations: boolean = true;

  view: any[] = [400, 290];

  colorScheme = {
    domain: ['#5AA454', '#53704e'],
  };

  constructor(
    private router: Router,
    private _auth: AuthService,
    public dialog: MatDialog,
    private themeService: ThemeService,
    private _quoteErpHistoricService: QuoteErpHistoricService,
    private _service: SalesService,
    private datepipe: DatePipe
  ) {
    this.auth = this._auth.getState();

    let sub = _quoteErpHistoricService.getQueueTotals().subscribe((result) => {
      if (result.succeeded) {
        this.multi = result.data;
        sub.unsubscribe();
      } else {
        console.log(result);
      }
    });

    this.getProblems();

    Object.assign(this, this.multi);
  }

  ngOnInit(): void {
    this.PrepareColumns();

    this.PrepareItensMenu();

    this.themeService.setTitle('Dashboard');

    let sub = this._service.getLatestSales(1, 5).subscribe((res) => {
      this.vendas$ = res;
      sub.unsubscribe();
    });

    let sub2 = this._service.getLatestPurchases(1, 5).subscribe((res) => {
      this.compras$ = res;
      sub2.unsubscribe();
    });
  }

  //Auxiliares
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
          this._service.printOrderPdf(item.orderId);
        },
      },
    ];
  }

  onSubmitPesquisar() {
    this.router.navigateByUrl('pesquisar');
  }

  PrepareColumns() {
    this.displayedColumns = [
      'orderId',
      'buyerDocument',
      'buyerName',
      'openingDate',
      'totalOrder',
    ];

    this.displayedSupplierColumns = [
      'orderId',
      'supplierDocument',
      'supplierName',
      'openingDate',
      'totalOrder',
    ];

    this.cols = [
      { name: 'orderId', title: 'Pedido', show: true, showSort: false },
      { name: 'buyerDocument', title: 'CNPJ', mask: 'CPF_CNPJ', show: true, showSort: false },
      { name: 'buyerName', title: 'Comprador', show: true, showSort: false },
      { name: 'openingDate', title: 'Data/Hora do pedido', show: true, showSort: false, date: true, hour: true, },
      { name: 'totalOrder', title: 'Valor total', show: true, showSort: false, decimal: true, decimalPrecision: 2, prefix: 'R$ ', },
    ];

    this.colsBuyers = [
      { name: 'orderId', title: 'Pedido', show: true, showSort: false },
      { name: 'supplierDocument', title: 'CNPJ', mask: 'CPF_CNPJ', show: true, showSort: false },
      { name: 'supplierName', title: 'Vendedor', show: true, showSort: false },
      { name: 'openingDate', title: 'Data/Hora do pedido', show: true, showSort: false, date: true, hour: true, },
      { name: 'totalOrder', title: 'Valor total', show: true, showSort: false, decimal: true, decimalPrecision: 2, prefix: 'R$ ', },
    ];
  }

  onGoQuoteErpHistoric(event) {
    if (event) {
      var sort: Sort = { active: 'default', direction: 'asc' };
      var initialDate: Date = this.mountDate(event.series);
      const filterModel: FilterQuoteErpHistoricDto = {
        pageNumber: 1,
        pageSize: 300,
        sort: sort,
        startDate: initialDate.toISOString(),
        endDate: initialDate.toISOString(),
        companyCodeSac: null,
        productErpCode: null,
        productId: null,
        productArguments: [],
        buyerArguments: []
      };
      localStorage.setItem(this.lastFilterQuoteErpHistoric, JSON.stringify(filterModel));
    }
    this.router.navigateByUrl('cotacao/erp');
  }

  mountDate(diames: string): Date {
    return new Date(
      new Date().getFullYear(),
      Number(diames.split('/')[1]) - 1,
      Number(diames.split('/')[0])
    );
  }

  getProblems() {
    let subT = this._quoteErpHistoricService.getQuoteErpHistoricCountProblem().subscribe((result) => {
      if (result.succeeded) {
        this.countErros = result.data;
        subT.unsubscribe();
      }
    });
  }

  showModalProblem(): void {
    const dialogRef = this.dialog.open(ModalCompanyProblemComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mensagemCompanyCodeSacSucesso();
      }

    });
  }

  mensagemCompanyCodeSacSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Atualizado todos os Erros!',
      false,
      true,
      null,
      () => { this.modalDialog.dialog.closeAll(); },
      null,
      'CONTINUAR'
    );
  }

}

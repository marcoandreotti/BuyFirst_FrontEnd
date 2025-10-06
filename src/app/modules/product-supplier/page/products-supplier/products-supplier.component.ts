import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { FormRow } from '@shared/component/form/form';
import { ThemeService } from '@app/service/theme.service';
import { BfResponse } from '@data/schema/response';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { ProductSupplier } from '@data/schema/products/products-supplier/product-supplier';
import { Login } from '@data/schema/login/login';
import { PageEvent } from '@angular/material/paginator';
import { BrandService } from '@app/service/https/brand.service';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { UploadProductSupplierComponent } from '../register/component/upload/upload-supplier-product.component';
import { CsvTemplatesService } from '@app/service/https/csv-templates.service';
import { Sort } from '@angular/material/sort';
import { ModalWaitingQueueComponent } from '../register/component/waiting-queue-modal/waiting-queue-modal.component';
import { ProductSupplierWaitingQueueDto } from '@data/dto/products/product-supplier/product-supplier-waiting-queue.dto';

@Component({
  selector: 'app-products-supplier',
  templateUrl: './products-supplier.component.html',
  styleUrls: ['./products-supplier.component.scss'],
})
export class ProductsSupplierComponent implements OnInit {
  auth: Login;
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_produtos_Vendas';
  modelIdentity: string = 'productSupplierId';
  companyId: number;
  pageIndex: number = 0;
  pageSize: number = 25;
  sort: Sort = { active: 'default', direction: 'asc' };
  produtos$: BfResponse<ProductSupplier[]>;
  topMenus: GridItemMenu[] = [];

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private _auth: AuthService,
    private dialog: MatDialog,
    private _brandService: BrandService,
    private _service: ProductSupplierService,
    private themeService: ThemeService,
    private _companyService: CompanyService,
    private _csvTemplateService: CsvTemplatesService
  ) {
    this.auth = this._auth.getState();
    if (!this.auth.isBuyFirst) {
      this.companyId = this.auth.companiesSelected[0].companyId;
    }

    this.lastFilter = this.getLastFilter();

    this.PrepareGrid();
    this.PrepareFilters();
    this.PrepareTopMenus();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Produtos de venda');

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
      .getAll(
        true,
        event?.argument ?? null,
        event?.brandId ?? null,
        event?.companyId ?? null,
        event?.referenceCode ?? null,
        this.pageIndex + 1,
        this.pageSize,
        this.sort
      )
      .subscribe((res) => {
        this.produtos$ = res;
        sub.unsubscribe();
      });
  }

  changeSorter(event: Sort) {
    this.pageIndex = 0;

    this.sort = event;
    if (!this.sort.direction) this.sort.direction = 'asc';
    this.filter(this.lastFilter);
  }

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          active: null,
          argument: null,
          brandid: null,
          companyId: this.companyId,
          referenceCode: null,
          sort: this.sort,
        })
      );
    }
  }

  getLastFilter() {
    var data = localStorage.getItem(this.lastFilterTag);

    if (data == null || data == 'undefined') {
      var filter = {
        active: null,
        argument: null,
        brandid: null,
        companyId: this.companyId,
        referenceCode: null,
        sort: this.sort,
      };
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
      
      return filter;
    } else {
      return JSON.parse(data);
    }
  }

  showModalUpload(): void {
    if (this.companyId && this.companyId > 1) {
      const dialogRef = this.dialog.open(UploadProductSupplierComponent, {
        data: this.companyId,
      });

      dialogRef.afterClosed().subscribe((result: ProductSupplierWaitingQueueDto[]) => {
        if (result) {
          const dialogQueue = this.dialog.open(ModalWaitingQueueComponent, {
            data: result,
          });

          dialogQueue.afterClosed().subscribe((result) => { });
        }
      });
    } else {
      return;
    }
  }

  PrepareGrid() {
    this.displayedColumns = [
      'referenceCode',
      'name',
      'unitOfMeasureAcronym',
      'brandName',
      'quantityCatalogActive',
      'quantityMatch',
      'availableQuantity',
      'active',
    ];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    let existMatch = {};
    existMatch['1'] = 'Sim';
    existMatch['0'] = 'Não';

    this.cols = [
      {
        name: 'referenceCode',
        title: 'Referência',
        show: true,
        showSort: true,
      },
      { name: 'name', title: 'Descrição', show: true, showSort: true },
      {
        name: 'unitOfMeasureAcronym',
        title: 'Un.',
        show: true,
        showSort: true,
      },
      { name: 'brandName', title: 'Marca', show: true, showSort: true },
      {
        name: 'quantityCatalogActive',
        title: 'Catálogos ativos',
        decimal: true,
        decimalPrecision: 0,
        show: true,
        showSort: true,
      },
      {
        name: 'quantityMatch',
        title: 'Match',
        value: existMatch,
        show: true,
        showSort: true,
      },
      {
        name: 'availableQuantity',
        title: 'Estoque de venda',
        decimal: true,
        decimalPrecision: 2,
        show: true,
        showSort: true,
      },
      {
        name: 'active',
        title: 'Status',
        value: activeValue,
        show: true,
        showSort: true,
      },
    ];

    this.itemMenus = [
      {
        name: 'Ativar/Inativar',
        icon: 'done_outline',
        action: (row: ProductSupplier) => {
          let sub = this._service
            .activeInactive(row.productSupplierId)
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
        action: (row: ProductSupplier) => {
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
                .delete(row.productSupplierId)
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
            name: 'companyId',
            label: 'Empresa',
            placeholder: 'Empresa',
            size: 30,
            value: 'companyId',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: false,
            useRemove:
              (this.auth.isBuyFirst || this.auth.companiesSelected.length > 1),
            disabled:
              !this.auth.isBuyFirst && this.auth.companiesSelected.length == 1,
            list: this._companyService.getListCompany(true),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: CompanyDto) => {
              if (value) {
                this.companyId = value.companyId;
              } else {
                this.companyId = this.auth.companyId;
              }
            },
          },
          {
            name: 'argument',
            label: 'Nome',
            placeholder: 'Nome',
            size: 30,
            value: 'argument',
          },
          {
            name: 'referenceCode',
            label: 'Código de Referência',
            placeholder: 'Código de Referência',
            size: 15,
            value: 'codigo',
          },
          {
            name: 'brandId',
            label: 'Marca',
            placeholder: 'Marca',
            size: 15,
            value: 'brandId',
            select: true,
            selectName: 'name',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this._brandService.getSelecteddAll(),
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  PrepareTopMenus() {
    this.topMenus = [
      {
        name: 'Importar lista de produtos (CSV)',
        icon: 'file_upload',
        action: (_onclick) => {
          this.showModalUpload();
        },
      },
      {
        name: 'Faça o download do CSV de exemplo',
        icon: 'cloud',
        color: 'lightgray',
        action: (_onclick) => {
          this._csvTemplateService.getCsvExemple(1);
        },
      },
    ];
  }

  mensagemSucesso_Delete() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Produto excluido com sucesso!`,
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
      `Produto ${text} com sucesso!`,
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

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogGenericoFuncoes } from '../../../../../shared/component/dialog-generico/dialog-generico.funcoes';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { CatalogProduct } from '@data/schema/Catalogs/catalog-product';
import { PageEvent } from '@angular/material/paginator';
import { BfResponse } from '@data/schema/response';
import { UploadProductComponent } from './register/component/upload/upload-product.component';
import { CsvTemplatesService } from '@app/service/https/csv-templates.service';
import { Login } from '@data/schema/login/login';
import { AuthService } from '@app/service/auth.service';
import { ReplaySubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { CatalogStatus } from '@data/schema/Catalogs/catalog-status';
import { CatalogDto } from '@data/dto/catalogs/catalog.dto';
import { CatalogProductWaitingQueueDto } from '@data/dto/catalogs/catalog-product-waiting-queue.dto';
import { CatalogModalWaitingQueueComponent } from './register/component/catalog-waiting-queue-modal/catalog-waiting-queue-modal.component';
import { CatalogProductDto } from '@data/dto/catalogs/catalog-product.dto';

@Component({
  selector: 'app-catalog-products',
  templateUrl: './catalog-products.component.html',
  styleUrls: ['./catalog-products.component.scss'],
})
export class CatalogProductsComponent {
  auth: Login;
  catalogProducts$: BfResponse<CatalogProductDto[]>;
  catalogStatus$: CatalogStatus;

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  editId: number = null;
  filters: FormRow[] = [];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_catalog_products';
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  modelIdentity: string = 'catalogProductId';
  pageIndex: number = 0;
  pageSize: number = 25;
  sort: Sort = { active: 'default', direction: 'asc' };
  topMenus: GridItemMenu[] = [];
  statusFilters$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    private _auth: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private _service: CatalogsService,
    private _csvTemplateService: CsvTemplatesService
  ) {}

  ngOnInit(): void {
    this.auth = this._auth.getState();
    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      this.themeService.setBackRoute('catalogos/cadastro/' + this.editId);
      this.themeService.setTitle('Produtos Catálogo');
      this.lastFilter = this.getLastFilter();
      this.filter(this.lastFilter);

      //Capturando status
      var sub = this._service.getCatalogStatus(this.editId).subscribe((res) => {
        if (res.succeeded) {
          this.catalogStatus$ = res.data;

          this.PrepareGrid();
          this.PrepareFilters();
          this.PrepareItemMenus();
          this.PrepareTopMenus();
          sub.unsubscribe();
        }
      });
    });
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
      .getProducts(
        this.editId,
        !event || !event.active ? null : event.active == '1',
        event?.argument ?? null,
        event?.referenceCode ?? null,
        this.pageIndex + 1,
        this.pageSize,
        this.sort
      )
      .subscribe((res) => {
        this.catalogProducts$ = res;
        sub.unsubscribe();
      });

    localStorage.setItem(this.lastFilterTag, JSON.stringify(event));
    this.lastFilter = event;
  }

  changeSorter(event: Sort) {
    this.pageIndex = 0;

    this.sort = event;
    if (!this.sort.direction) this.sort.direction = 'asc';
    this.filter(this.lastFilter);
  }

  showModalUpload(): void {
    const dialogRef = this.dialog.open(UploadProductComponent, {
      data: this.editId,
    });

    dialogRef.afterClosed().subscribe((result: CatalogProductWaitingQueueDto[]) => {
      if (result) {
        const dialogQueue = this.dialog.open(CatalogModalWaitingQueueComponent, {
          data: result,
        });
        dialogQueue.afterClosed().subscribe((result) => { });
      }
    });
  }

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          catalogId: this.editId,
          active: null,
          argument: null,
          referenceCode: null,
          sort: this.sort,
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
      'referenceCode',
      'productName',
      'unitOfMeasureAcronym',
      'brandName',
      'deliveryTime',
      'quantity',
      // 'salesMinimumQuantity',
      // 'salesMaximumQuantity',
      'price',
      'active',
    ];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      {
        name: 'referenceCode',
        title: 'Código',
        show: true,
        showSort: true,
      },
      {
        name: 'productName',
        title: 'Descrição',
        show: true,
        showSort: true,
      },
      {
        name: 'unitOfMeasureAcronym',
        title: 'Un.',
        show: true,
        showSort: true,
      },
      {
        name: 'brandName',
        title: 'Marca',
        show: true,
        showSort: true,
      },
      { name: 'deliveryTime', title: 'D.Entrega', show: true, decimal: true },
      { name: 'quantity', title: 'Qtde', show: true, decimal: true },
      // {
      //   name: 'salesMaximumQuantity',
      //   title: 'Qtde Max',
      //   decimal: true,
      //   show: true,
      //   showSort: true,
      // },
      // {
      //   name: 'salesMinimumQuantity',
      //   title: 'Qtde Min',
      //   decimal: true,
      //   show: true,
      //   showSort: true,
      // },
      {
        name: 'price',
        title: 'Valor',
        decimal: true,
        decimalPrecision: 2,
        prefix: 'R$ ',
        show: true,
        showSort: true,
      },
      {
        name: 'active',
        title: 'Status',
        show: true,
        value: activeValue,
        showSort: true,
      },
    ];
  }

  PrepareFilters() {
    this.statusFilters$.next([
      { id: '1', description: 'Ativos' },
      { id: '2', description: 'Inativos' },
    ]);

    this.filters = [
      {
        fields: [
          {
            name: 'referenceCode',
            label: 'Código de Referência',
            placeholder: 'Código de Referência',
            size: 15,
            value: 'referenceCode',
          },
          {
            name: 'argument',
            label: 'Pesquisar',
            placeholder: 'Pesquisar',
            size: 60,
            value: 'argument',
          },
          {
            name: 'active',
            label: 'Ativos e Inativos',
            placeholder: 'Ativos e Inativos',
            size: 15,
            value: 'id',
            select: true,
            selectName: 'description',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this.statusFilters$,
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  PrepareItemMenus() {
    if (
      this.catalogStatus$.overallStatus.alias != 'CAT_CANCEL' &&
      this.catalogStatus$.overallStatus.alias != 'CAT_FINALIZAD'
    ) {
      this.itemMenus = [
        {
          name: 'Ativar/Inativar',
          icon: 'done_outline',
          action: (row: CatalogProduct) => {
            let sub = this._service
              .activeInactiveCatalogProduct(row.catalogProductId)
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
          action: (row: CatalogProduct) => {
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
                  .deleteProduct(row.catalogProductId)
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
    } else {
      this.itemMenus = [];
    }
  }

  PrepareTopMenus() {
    if (
      this.catalogStatus$.overallStatus.alias != 'CAT_CANCEL' &&
      this.catalogStatus$.overallStatus.alias != 'CAT_FINALIZAD'
    ) {
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
            this._csvTemplateService.getCsvExemple(2);
          },
        },
      ];
    } else {
      this.topMenus = [];
    }
  }

  mensagemSucesso_Active(active: boolean) {
    const text = active ? 'ativo' : 'inativo';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Produto do catálogo ${text} com sucesso!`,
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

  mensagemSucesso_Delete() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Produto do catálogo excluido com sucesso!`,
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

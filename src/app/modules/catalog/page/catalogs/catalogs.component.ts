import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { ReplaySubject } from 'rxjs';
import { FormRow } from '@shared/component/form/form';
import { ThemeService } from '@app/service/theme.service';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { BfResponse } from '@data/schema/response';
import { PageEvent } from '@angular/material/paginator';
import { CatalogDto } from '@data/dto/catalogs/catalog.dto';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { Login } from '@data/schema/login/login';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { ModalCatalogConfigComponent } from '@modules/catalog/components/modal-config/modal-config.component';
import { CatalogConfigRequestDto } from '@data/dto/catalogs/catalog-config-request.dto';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss'],
})
export class CatalogsComponent implements OnInit {
  catalogos$: BfResponse<CatalogDto[]>;
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[] = [];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_catalogos';
  modelIdentity: string = 'catalogId';
  pageIndex: number = 0;
  pageSize: number = 25;
  sort: Sort = { active: 'default', direction: 'asc' };
  statusFilters$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  modalDialog = new DialogGenericoFuncoes(this.dialog);
  auth: Login;

  constructor(
    private _auth: AuthService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private _service: CatalogsService,
    private _companyService: CompanyService,
    private router: Router,
  ) {
    this.auth = this._auth.getState();

    this.PrepareGrid();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Catálogos de venda');

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
      .getAll(
        event?.companyId ?? this.auth.companyId,
        (event?.active ?? '') == '' || (event?.active ?? null) == null ? null : event.active == '1' ? true : false,
        event?.argument ?? null,
        this.pageIndex + 1,
        this.pageSize,
        this.sort
      )
      .subscribe((res) => {
        this.catalogos$ = res;
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

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          companyId: this._auth.getState().companyId,
          active: null,
          argument: null,
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
      'personName',
      'name',
      'startDate',
      'expirationDate',
      'qtdProdActive',
      'active',
      'statusName',
    ];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      { name: 'personName', title: 'Empresa', show: true, showSort: true },
      { name: 'name', title: 'Catálogo', show: true, showSort: true },
      {
        name: 'startDate',
        title: 'Início',
        show: true,
        date: true,
        hour: false,
        showSort: true,
      },
      {
        name: 'expirationDate',
        title: 'Término',
        show: true,
        date: true,
        hour: false,
        showSort: true,
      },
      { name: 'qtdProdActive', title: 'Produtos', show: true },
      {
        name: 'active',
        title: 'Status',
        show: true,
        value: activeValue,
        showSort: true,
      },
      { name: 'statusName', title: 'Situação', show: true, showSort: true },
    ];

    this.itemMenus = [
      {
        name: 'Configurações',
        icon: 'build',
        action: (row: CatalogDto) => {
          this.showModalConfig(row);
        },
      },
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: CatalogDto) => {
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
                .delete(row.catalogId)
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

    if (this.auth.isBuyFirst){
      this.itemMenus.push(
      {
        name: 'Analise',
        icon: 'account_tree',
        action: (row: CatalogDto) => {
          const link = window.location.href + `/termometro/${row.catalogId}`;
          this.router.navigate([]).then(result => { window.open(link); });
        },
      });
    }
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
            name: 'companyId',
            label: 'Empresa',
            placeholder: 'Empresa',
            size: 30,
            value: 'companyId',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: false,
            useRemove: true,
            list: this._companyService.getListCompany(true),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: CompanyDto) => {},
          },
          {
            name: 'argument',
            label: 'Pesquisar',
            placeholder: 'Pesquisar',
            size: 30,
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

  showModalConfig(model: CatalogDto) {
    const dialogRef = this.dialog.open(ModalCatalogConfigComponent, {
      data: model,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: CatalogConfigRequestDto | any) => {
        if (result != null) {
          this.mensagemSucesso_Config();
          this.filter(this.lastFilter);
        }
      });
  }

  mensagemSucesso_Delete() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Catálogo excluido com sucesso!`,
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

  mensagemSucesso_Config() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Catálogo configurado com sucesso!`,
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

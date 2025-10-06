import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { AuthService } from '@app/service/auth.service';
import { SupplierService } from '@app/service/https/suppliers.service';
import { ThemeService } from '@app/service/theme.service';
import { Supplier } from '@data/schema/persons/companies/suppliers/supplier';
import { BfResponse } from '@data/schema/response';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit {
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[] = [];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_suppliers';
  modelIdentity: string = 'companyId';
  pageIndex: number = 0;
  pageSize: number = 25;
  sort: Sort = { active: 'default', direction: 'asc' };

  statusFilters$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  suppliers$: BfResponse<Supplier[]>;

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private _auth: AuthService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private _service: SupplierService
  ) {
    this.PrepareGrid();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('fornecedores');
    this.themeService.setTitle('Fornecedores');

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
        event?.argument ?? null,
        this.pageIndex + 1,
        this.pageSize,
        this.sort
      )
      .subscribe((res) => {
        this.suppliers$ = res;
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
      this.lastFilterTag,
        JSON.stringify({
          argument: null,
          sort: this.sort,
        });
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
      'person.document',
      'person.name',
      'minimumBillingAmount',
      'active',
    ];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      {
        name: 'person.document',
        title: 'CPF/CNPJ',
        mask: 'CPF_CNPJ',
        show: true,
        showSort: true,
      },
      { name: 'person.name', title: 'Nome', show: true, showSort: true },
      {
        name: 'minimumBillingAmount',
        title: 'Fat. Mínimo',
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
        action: (row: Supplier) => {
          let sub = this._service
            .activeInactive(row.companyId)
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
        action: (row: Supplier) => {
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
                .delete(row.companyId)
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
            label: 'Pesquisar',
            placeholder: 'Pesquisar',
            size: 100,
            maxLength: 50,
            value: 'argument',
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  //Aux
  mensagemSucesso_Active(active: boolean) {
    const text = active ? 'ativo' : 'inativo';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Fornecedor ${text} com sucesso!`,
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
      `Fornecedor excluido com sucesso!`,
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

import { BfResponse } from '@data/schema/response';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { GridColumn } from '@shared/component/grid/grid.config';
import { BrandService } from '@app/service/https/brand.service';
import { Brand } from '@data/schema/products/brand/brand';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandComponent implements OnInit {
  brand$: BfResponse<Brand[]>;
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  editId: number = null;
  filters: FormRow[];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_brands';
  modelIdentity: string = 'brandId';
  pageIndex: number = 0;
  pageSize: number = 25;
  statusFilters$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    private themeService: ThemeService,
    private _service: BrandService
  ) {
    this.PrepareColumns();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('configuracoes');
    this.themeService.setTitle('Marcas');

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
        !event || !event.active ? null : event.active == '1',
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe((res) => {
        this.brand$ = res;
        sub.unsubscribe();
      });
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

  PrepareColumns() {
    this.displayedColumns = ['brandId', 'name', 'active'];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      { name: 'brandId', title: 'ID', show: true },
      { name: 'name', title: 'Nome', show: true },
      { name: 'active', title: 'Ativo', show: true, value: activeValue },
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
            name: 'argument',
            label: 'Nome',
            placeholder: 'Nome',
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
}

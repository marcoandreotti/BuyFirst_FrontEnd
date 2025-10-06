import { BfResponse } from '@data/schema/response';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { GridColumn } from '@shared/component/grid/grid.config';
import { Router } from '@angular/router';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';
import { UnitOfMeasure } from '@data/schema/products/unit-of-measure/unit-of-measure';

@Component({
  selector: 'app-unit-of-measure',
  templateUrl: './unit-of-measure.component.html',
  styleUrls: ['./unit-of-measure.component.scss'],
})
export class UnitOfMeasureComponent implements OnInit {
  unitOfMeasure$: BfResponse<UnitOfMeasure[]>;
  editId: number = null;

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_unitOfMeasure';
  pageIndex: number = 0;
  pageSize: number = 25;
  modelIdentity: string = 'unitOfMeasureId';

  constructor(
    private themeService: ThemeService,
    private _service: UnitOfMeasureService,
    private router: Router
  ) {
    this.PrepareColumns();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('configuracoes');
    this.themeService.setTitle('Unidades de Medida');

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

      let sub = this._service.getUnitOfMeasureAll(
        event?.argument ?? null,
        this.pageIndex + 1,
        this.pageSize
      ).subscribe((res) => {
        this.unitOfMeasure$ = res;
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
    this.displayedColumns = ['unitOfMeasureId', 'name', 'acronym', 'active'];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      { name: 'unitOfMeasureId', title: 'ID', show: true },
      { name: 'name', title: 'Nome', show: true },
      { name: 'acronym', title: 'Unid. de Medida', show: true },
      { name: 'active', title: 'Ativo', show: true, value: activeValue },
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
}

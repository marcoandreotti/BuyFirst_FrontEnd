import { BfResponse } from '@data/schema/response';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RegionService } from '@app/service/https/region.serice';
import { ThemeService } from '@app/service/theme.service';
import { Region } from '@data/schema/Regions/region';
import { FormRow } from '@shared/component/form/form';
import { GridColumn } from '@shared/component/grid/grid.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent implements OnInit {
  regions$: BfResponse<Region[]>;
  editId: number = null;

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_regions';
  pageIndex: number = 0;
  pageSize: number = 25;
  modelIdentity: string = 'regionId';

  constructor(
    private themeService: ThemeService,
    private _region: RegionService,
    private router: Router
  ) {
    this.PrepareColumns();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('configuracoes');
    this.themeService.setTitle('Regiões');

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

    let sub = this._region
      .getAll(event?.argument ?? null, this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.regions$ = res;
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
    this.displayedColumns = ['regionId', 'name', 'stateAcronym', 'active'];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      { name: 'regionId', title: 'ID', show: true },
      { name: 'name', title: 'Região', show: true },
      { name: 'stateAcronym', title: 'UF', show: true },
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

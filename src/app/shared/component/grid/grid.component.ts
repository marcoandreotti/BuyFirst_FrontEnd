import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  GridColumn,
  GridFilter,
  GridItemMenu,
  GridOption,
  GridOptionDir,
  LoadingColumn,
  ColumnValue,
  getElementValue,
} from './grid.config';
import { FilterEvent } from './filters/filters.component';
import { MatDialog } from '@angular/material/dialog';
import { Utils } from '@app/lib/utils/utils';
import { Sort } from '@angular/material/sort';
import { MaskApplierService } from 'ngx-mask';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() fullScreen: Boolean = false;
  @Input() openedFilters: Boolean = false;
  @Input() filters: any[] = [];
  @Input() alwaysFilters: boolean = false;
  @Input() mobileHint: boolean = false;
  @Input() options: GridOption[] = [];
  @Input() pageSizeOptions: number[] = [25, 50, 100];
  @Input() itemMenus: GridItemMenu[] = [];
  @Input() actionButtons: GridItemMenu[] = [];
  @Input() ableEdit: boolean = true;
  @Input() modelIdentity: string = 'id';
  @Input() displayedColumns: String[] = [];
  @Input() columns: GridColumn[] = [];
  @Input() rows: any[];
  @Input() usePagination: boolean = true;
  @Input() useSelect: boolean = false;
  @Input() scroll: boolean = false;
  @Input() topMenus: GridItemMenu[] = [];
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() loadingColumn: LoadingColumn = null;
  @Output() onChangeColumnValue: EventEmitter<ColumnValue> = new EventEmitter();
  @Input() useRegister: boolean = true;
  @Input() useHeader: boolean = true;
  @Input() useFilters: boolean = true;
  @Input() useEditColumns: boolean = true;
  @Input() filterModel: any;
  @Input() specialFilter: boolean = false;
  @Input() tableName: string;
  @Input() havePadding: boolean = true;
  @Input() dashboards;
  @Input() xlsHeader = [];
  @Input() pageSize: number = this.pageSizeOptions[0];
  @Input() pageIndex: number = 0;
  @Input() pageLength?: number | null = 0;

  filteredRows: any[] = [];
  sortedRows: any[] = [];
  paginedRows: any[] = [];

  onChangePaginedRows: EventEmitter<any[]> = new EventEmitter();

  openColumnsConfig: boolean = false;
  filterEvent: FilterEvent;
  haveFilters: boolean = false;
  subAuditoria: Subscription;
  sort: Sort;
  gridLoading = true;

  @Input() expandedElement;
  @Input() expandedRows: any[];
  @Output() onExpandItem: EventEmitter<any> = new EventEmitter();
  @Output() onCloseExpandItem: EventEmitter<any> = new EventEmitter();

  @Input() expandedElementSecond;
  @Input() expandedRowsSecond: any[];
  @Output() onExpandItemSecond: EventEmitter<any> = new EventEmitter();
  @Output() onCloseExpandItemSecond: EventEmitter<any> = new EventEmitter();

  @Input() useTwoLevel;
  @Input() selectedRows: any[] = [];
  @Output() selectedRowsChange: EventEmitter<any[]> = new EventEmitter();

  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter();
  @Output() onChangeSorterValue: EventEmitter<Sort> = new EventEmitter();

  optionsParent = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private maskService: MaskApplierService
  ) {}

  getColumns() {
    return this.options.filter((c) => c.icon == 'settings').length > 0;
  }

  ngOnInit(): void {
    this.options = [];

    let op = this.optionsParent;

    op.forEach((o) => {
      this.options.push(o);
    });

    this.options.push({
      dir: GridOptionDir.RIGHT,
      name: 'Filtros',
      icon: 'tune',
      menu: [],
      hint: true,
      mobileHint: true,
      action: () => {
        if (this.haveFilters) {
          this.filterEvent = { search: '', filters: [] };
          this.filteredRow();
        } else {
          this.openedFilters = !this.openedFilters;
        }
      },
    });

    // this.options.push({
    //   dir: GridOptionDir.LEFT,
    //   name: 'Cfg. Colunas',
    //   icon: 'settings',
    //   menu: [],
    //   hint: true,
    //   mobileHint: false,
    //   action: () => {
    //     this.openColumnsConfig = !this.openColumnsConfig;
    //     return true;
    //   },
    // });

    if (this.useHeader) {
      this.options.push({
        dir: GridOptionDir.RIGHT,
        name: 'Tela Cheia',
        icon: 'fullscreen',
        menu: [],
        hint: true,
        mobileHint: false,
        action: () => {
          this.fullScreen = !this.fullScreen;
        },
      });
    }

    if (this.columns.find((c) => c.name == 'situacao') && !this.specialFilter) {
      let filter = new GridFilter();
      (filter.name = 'situacao'), (filter.title = 'Situação');
      filter.options = [
        { name: 'Ativo', value: 'Ativo', checked: false },
        { name: 'Inativo', value: 'Inativo', checked: false },
      ];
      this.filters.push(filter);
      this.columns.find((c) => c.name == 'situacao').alignEnd = true;
    }

    this.filterEvent = { search: '', filters: [] };
    let f: FilterEvent = JSON.parse(
      localStorage.getItem('filter' + this.title)
    );

    if (f != null) {
      this.filterEvent = f;
      if (
        this.filterEvent.search.length > 0 ||
        this.filterEvent.filters.length > 0
      ) {
        this.openedFilters = true;
      }
    }

    if (this.useRegister) {
      this.options.push({
        dir: GridOptionDir.LEFT,
        name: 'Cadastrar',
        icon: 'add',
        menu: [],
        hint: false,
        action: () => {
          this.router.navigate([this.router.url + '/cadastro']);
        },
      });
    }

    this.gridLoading = false;
    this.filteredRow();
  }

  OnExpandItem(event) {
    this.onExpandItem.emit(event);
  }

  OnCloseExpandItem(event) {
    this.onCloseExpandItem.emit(event);
  }

  OnExpandItemSecond(event) {
    this.onExpandItemSecond.emit(event);
  }

  OnCloseExpandItemSecond(event) {
    this.onCloseExpandItemSecond.emit(event);
  }

  onSelectItem(event: any[]) {
    event.forEach((item) => {
      this.selectedRows.push(item);
    });
    this.selectedRowsChange.emit(this.selectedRows);
  }

  onRemoveItem(event: any[]) {
    event.forEach((item) => {
      if (
        this.selectedRows.find(
          (row) => row[this.modelIdentity] == item[this.modelIdentity]
        )
      ) {
        this.selectedRows = this.selectedRows.filter(
          (row) => row[this.modelIdentity] != item[this.modelIdentity]
        );
      }
    });
    this.selectedRowsChange.emit(this.selectedRows);
  }

  pageEvent(event: PageEvent) {
    this.pageChange.emit(event);
  }

  filteredRow() {
    if (!this.rows) {
      return;
    }

    let rows = Utils.refazObjetoReadOnly(this.rows);

    this.filteredRows = rows;
    this.haveFilters = false;

    if (!this.specialFilter) {
      let fe = this.filterEvent;

      if (fe) {
        let search = fe.search.replace(/[^a-zA-Z0-9]/g, '');

        if (search.length > 0) {
          let filteredColumns = this.columns.filter(
            (c) => c.searchable == undefined || c.searchable
          );
          var result = rows.filter(
            (item) =>
              filteredColumns.filter(
                (c) =>
                  item[c.name] != null &&
                  item[c.name]
                    .toString()
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .toLowerCase()
                    .includes(search.toLowerCase())
              ).length > 0
          );

          this.filteredRows = result;
          this.haveFilters = true;
        }

        let se = this.filterEvent.filters.filter(
          (f) => f.options.filter((o) => o.checked).length > 0
        );

        if (se.length > 0) {
          this.haveFilters = true;
          var resultTwo = this.filteredRows.filter(
            (item) =>
              se.filter(
                (s) =>
                  item[s.name] != null &&
                  s.options.find((o) => o.checked && o.value == item[s.name])
              ).length == se.length
          );
          this.filteredRows = resultTwo;
        }

        localStorage.setItem(
          'filter' + this.title,
          JSON.stringify(this.filterEvent)
        );
      }
    }
    this.sortedRow();
  }

  sortedRow() {
    let rows = [...this.filteredRows];

    if (this.sort != null && this.sort.direction != '') {
      if (this.sort.direction == 'asc') {
        this.sortedRows = rows.sort((a, b) =>
          a[this.sort.active] < b[this.sort.active] ? -1 : 1
        );
      } else {
        this.sortedRows = rows.sort((a, b) =>
          a[this.sort.active] > b[this.sort.active] ? -1 : 1
        );
      }
    } else {
      this.sortedRows = rows;
    }

    this.paginedRow();
  }

  paginedRow() {
    this.paginedRows = [...this.rows];
  }

  onChangeColumnValueTable(c: ColumnValue) {
    this.onChangeColumnValue.emit(c);
  }

  changeSorter(event: Sort) {
    this.onChangeSorterValue.emit(event);
  }

  // onChangeSorterValue(event: Sort) {
  //   this.sort = event;
  //   this.sortedRow();
  // }

  onFilterComponent(event) {
    if (event.search != undefined) {
      this.filterEvent = event;
      this.filteredRow();
    }
    this.onFilter.emit(event);
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const change = simpleChanges['rows'];
    const laodingChange = simpleChanges['loadingColumn'];
    const expandedElement = simpleChanges['expandedElement'];
    const options = simpleChanges['options'];

    if (laodingChange) {
      this.loadingColumn = laodingChange.currentValue;
    }

    if (expandedElement) {
      this.expandedElement = expandedElement.currentValue;
    }

    if (options) {
      this.optionsParent = options.currentValue;
    }

    if (change) {
      this.filteredRow();
    }
  }
}

import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import {
  GridColumn,
  GridItemMenu,
  LoadingColumn,
  ColumnValue,
  getElementValue,
} from '../grid.config';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MobileService } from '@app/service/mobile.service';
import { Sort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableComponent implements OnInit, OnChanges {
  dataSource: any;
  @Input() title: string;
  @Input() itemMenus: GridItemMenu[];
  @Input() actionButtons: GridItemMenu[];
  @Input() displayedColumns: String[];
  @Input() rows: any[];
  @Input() columns: GridColumn[];
  @Input() ableEdit: boolean = true;
  @Input() modelIdentity: string = 'id';
  @Input() onChangePaginedRows: Observable<any[]>;
  @Input() useSelect: boolean = true;
  @Input() scroll: boolean = false;
  @Input() loadingColumn: LoadingColumn = null;
  @Output() onChangeColumnValue: EventEmitter<ColumnValue> = new EventEmitter();
  @Output() onChangeSorterValue: EventEmitter<Sort> = new EventEmitter();
  @Input() fullScreen: boolean = false;
  haveExpanded: boolean = false;

  selection = new SelectionModel<any>(true, []);
  menuPosTop = 0;
  menuPosRight = 0;
  menuHeight = 48;
  expandPosTop = 0;
  expandPosLeft = 0;
  expandHeight = 48;
  hoveredRow;

  isDark$: Observable<boolean>;
  @ViewChild('gridTable') table;
  timeOutToSearch;
  timeOutToCleanOver;
  lastClickedId;

  @Input() expandedElement;
  @Output() onExpandItem: EventEmitter<any> = new EventEmitter();
  @Output() onCloseExpandItem: EventEmitter<any> = new EventEmitter();
  @Input() expandedRows: any[];

  @Input() useTwoLevel;

  @Input() expandedElementSecond;
  @Output() onExpandItemSecond: EventEmitter<any> = new EventEmitter();
  @Output() onCloseExpandItemSecond: EventEmitter<any> = new EventEmitter();
  @Input() expandedRowsSecond: any[];

  @Output() onSelectItem: EventEmitter<any[]> = new EventEmitter();
  @Output() onRemoveItem: EventEmitter<any[]> = new EventEmitter();
  @Input() selectedRows: any[];

  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty('detailRow');

  constructor(
    private router: Router,
    private el: ElementRef,
    private mobile: MobileService
  ) {}

  changeColumnValue(event, column, row, index) {
    clearTimeout(this.timeOutToSearch);
    this.timeOutToSearch = setTimeout((s) => {
      let columnValue: ColumnValue = { row, column, index, value: event };
      this.onChangeColumnValue.emit(columnValue);
    }, 1000);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onRemoveItem.emit(this.dataSource.data);
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
      this.onSelectItem.emit(this.dataSource.data);
    }
  }

  selectRow(row) {
    let selectRow = [row];
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.onSelectItem.emit(selectRow);
    } else {
      this.onRemoveItem.emit(selectRow);
    }
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  OnExpandItem(row) {
    if (row[this.modelIdentity] != this.expandedElement) {
      this.onExpandItem.emit({ row });
    } else {
      this.onCloseExpandItem.emit({ row });
    }
  }

  OnExpandItemSecond(row, index) {
    if (index != this.expandedElementSecond) {
      this.onExpandItemSecond.emit({ row, index });
    } else {
      this.onCloseExpandItemSecond.emit({ row, index });
    }
  }

  ngOnInit() {
    this.createRows();

    this.onChangePaginedRows.subscribe((value) => {
      this.createRows();
    });

    let lastClick = localStorage.getItem(this.title + 'clicked');
    if (lastClick != null) {
      this.lastClickedId = lastClick;

      setTimeout((s) => {
        this.lastClickedId = null;
      }, 3000);
    }
  }

  createRows() {
    let haveExpandled = this.getExpandled() != null;
    this.dataSource = haveExpandled
      ? new ExampleDataSource(this.rows)
      : new MatTableDataSource(this.rows);
    this.haveExpanded = haveExpandled;

    this.selectedRows.forEach((rowSelected) => {
      let item = this.dataSource.data.filter(
        (row) => row[this.modelIdentity] == rowSelected[this.modelIdentity]
      );
      if (item) {
        this.selection.select(item);
      }
    });
  }

  getExpandled() {
    return this.columns.find((c) => c.expandled != null && c.expandled == true);
  }

  expandItem(element) {
    this.expandedElement = element == this.expandedElement ? null : element;
  }

  getElementValue(element, column) {
    return getElementValue(element, column);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['rows'];
    const laodingChange = changes['loadingColumn'];
    const expandedElement = changes['expandedElement'];
    const changeSelectedRows = changes['selectedRows'];

    if (laodingChange) {
      this.loadingColumn = laodingChange.currentValue;
    }

    if (expandedElement) {
      this.expandedElement = expandedElement.currentValue;
    }

    if (changeSelectedRows) {
      this.selectedRows = changeSelectedRows.currentValue;
      if (this.selectedRows.length == 0) {
        this.selection.clear();
      }
    }

    if (change) {
      this.createRows();
    }
  }

  tableDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  getDisplayedColumns() {
    let filtereds = this.displayedColumns.filter((s) =>
      this.columns.find((c) => c.name == s && c.show == c.show)
    );
    if (this.useSelect) {
      filtereds = ['select', ...filtereds];
    }
    if (this.mobile.isMobile()) {
      filtereds = [...filtereds, 'menu'];
    }
    if (this.haveExpanded) {
      filtereds = ['expanded', ...filtereds];
    }
    if (this.actionButtons && this.actionButtons.length > 0) {
      filtereds = ['action', ...filtereds];
    }
    return filtereds;
  }

  itemOver(event, row) {
    let tableRect = this.table.nativeElement.getBoundingClientRect();
    let el = event.toElement;
    if (this.menuPosTop != el.offsetTop) {
      this.menuPosTop = el.offsetTop;
      this.hoveredRow = row;
    }
    if (this.menuPosRight != tableRect.x) {
      this.menuPosRight = tableRect.x;
      this.hoveredRow = row;
    }
    if (this.menuHeight != event.toElement?.getBoundingClientRect().height) {
      this.menuHeight = event.toElement?.getBoundingClientRect().height;
      this.hoveredRow = row;
    }
    clearTimeout(this.timeOutToCleanOver);
    this.timeOutToCleanOver = setTimeout((s) => {
      this.itemOut(null);
    }, 5000);
  }

  itemOut(event) {
    this.menuPosTop = 0;
    this.menuPosRight = 0;
    this.expandPosTop = 0;
    this.expandPosLeft = 0;
  }

  openEdit() {
    this.router.navigate([
      this.router.url + '/cadastro',
      this.hoveredRow[this.modelIdentity],
    ]);
  }

  saveClicked() {
    localStorage.setItem(
      this.title + 'clicked',
      this.hoveredRow[this.modelIdentity]
    );
    return true;
  }

  changeSorter(event: Sort) {
    this.onChangeSorterValue.emit(event);
  }
}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */

  rows: any[];

  constructor(rows: any[]) {
    super();
    this.rows = rows;
  }

  connect(): Observable<Element[]> {
    const rows = [];
    this.rows.forEach((element) =>
      rows.push(element, { detailRow: true, element })
    );
    return of(rows);
  }

  disconnect() {}
}

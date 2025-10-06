import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridColumn } from '../grid.config';
import { GridState } from '../redux/state';

@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss']
})
export class ColumnsComponent implements OnInit {


  @Input() opened = true;
  @Input() displayedColumns: String[];
  @Input() columns: GridColumn[] = [];
  state$: Observable<GridState>;

  constructor(private _store: Store<{ grid: GridState }>) {
    this.state$ = this._store.pipe(select('grid'));
  }

  ngOnInit(): void {
  }

  close() {
    this.opened = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}

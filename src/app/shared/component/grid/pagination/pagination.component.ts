import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() pageLength?: number | null = 0;
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 0;
  @Input() pageSizeOptions: number[];
  @Input() rows: any[] = [];
  @Input() title: string = '';
  @Output() onPageEvent: EventEmitter<PageEvent> = new EventEmitter();

  showGotoPage: boolean = false;
  listGotoPages$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor() {}

  ngOnInit(): void {}

  pageEvent(event: PageEvent) {
    this.showGotoPage = false;
    this.onPageEvent.emit(event);
  }

  onClickShowGotoPage() {
    this.showGotoPage = true;
    var totalRegister = this.pageSize;

    let lstPages: any[] = [];
    var arrayLength = Number(
      (this.pageLength / totalRegister)
    );
    let indexOff: number = 1;
    for (let index = 1; index < arrayLength; index++) {
      lstPages.push({
        id: index - 1,
        description: `${indexOff} - ${index * totalRegister}`,
      });
      indexOff += totalRegister;
    }

    this.listGotoPages$.next(lstPages);
  }

  updateGotoPage($event) {
    this.pageIndex = $event;
    this.pageEvent({
      previousPageIndex: $event - 1,
      pageIndex: $event,
      pageSize: this.pageSize,
      length: this.pageLength,
    });
  }
}

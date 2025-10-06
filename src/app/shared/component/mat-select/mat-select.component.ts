import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mat-select',
  templateUrl: './mat-select.component.html',
  styleUrls: ['./mat-select.component.css'],
})
export class MatSelectComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() public list: any[] = [];
  @Input() public value: string = '';
  @Input() public name: string = '';
  @Input() public label: string = '';
  @Input() public nameObject: string = '';
  @Input() public form: FormControl = new FormControl();
  @Input() public defaultValue: number = null;
  @Input() public useRemove: boolean = true;
  @Input() public useAddEntity: boolean = true;
  @Input() public useSearch: boolean = true;
  @Input() public options: SelectOption[] = [];
  @Input() public placeHolder: string = 'Digite aqui...';
  @Input() public disabled: boolean = false;

  @Output() onChangeTextoSelect: EventEmitter<string> = new EventEmitter();
  @Output() onAddEntity: EventEmitter<string> = new EventEmitter();

  public filterFormControl: FormControl = new FormControl();
  public filteredList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['list'];
    if (
      change /*&& (change.previousValue == [] || change.previousValue == null)*/
    ) {
      if (this.defaultValue) this.form.setValue(this.list[this.defaultValue]);
      this.list = change.currentValue;
      if (this.useSearch) this.initFilter();
    }
  }

  initFilter() {
    if (this.list == null) this.list = [];
    this.filteredList.next(this.list.slice());
    this.filterFormControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((f) => {
        this.filterList();
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a === b;
      });
  }

  getTextOptions() {
    return this.options.filter((o) => o.text);
  }

  getText(l, opt) {
    return { text: l[opt.name], mask: opt.mask };
  }

  protected filterList() {
    if (!this.list) {
      return;
    }

    let search = this.filterFormControl.value;
    if (!search) {
      this.filteredList.next(this.list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    if (this.options.length > 0) {
      let options = this.options.filter((o) => o.search);
      let filteredList = this.list.filter(
        (l) =>
          options.filter((o) => l[o.name].toLowerCase().indexOf(search) > -1)
            .length > 0
      );
      this.filteredList.next(filteredList);
    } else {
      this.filteredList.next(
        this.list.filter((l) => l[this.name].toLowerCase().indexOf(search) > -1)
      );
    }
  }

  onChangeSelect($event) {
    this.onChangeTextoSelect.emit($event);
  }

  addEntity($event) {
    this.onAddEntity.emit($event);
  }
}

export class SelectOption {
  name: string = "";
  search: boolean = true;
  text: boolean = true;
  mask?: string = null;
}
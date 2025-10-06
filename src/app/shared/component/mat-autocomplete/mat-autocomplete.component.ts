import {
  Component,
  OnInit,
  ViewEncapsulation,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { SelectOption } from '../mat-select/mat-select.component';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mat-autocomplete',
  templateUrl: './mat-autocomplete.component.html',
  styleUrls: ['./mat-autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MatAutocompleteComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() public list: any[] = [];
  @Input() public value: string = '';
  @Input() public name: string = '';
  @Input() public label: string = '';
  @Input() public form: FormControl = new FormControl();
  @Input() public defaultValue: number = null;
  @Input() public useRemove: boolean = true;
  @Input() public useSearch: boolean = true;
  @Input() public options: SelectOption[] = [];
  @Input() public placeHolder: string = 'Digite aqui...';

  public filteredList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @Output() onChangeTextoSelect: EventEmitter<string> = new EventEmitter();
  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['list'];
    if (change) {
      if (this.defaultValue) this.form.setValue(this.list[this.defaultValue]);
      this.list = change.currentValue;
      if (this.useSearch) this.initFilter();
    }
  }

  initFilter() {
    if (this.list == null) this.list = [];
    this.filteredList.next(this.list.slice());
    this.form.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((f) => {
        this.filterList();
      });
  }

  protected filterList() {
    if (!this.list) {
      return;
    }

    let search = this.form.value;
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

  getTextOptions() {
    return this.options.filter((o) => o.text);
  }

  getText(l, opt) {
    return { text: l[opt.name], mask: opt.mask };
  }

  onChangeSelect($event) {
    if (!$event) this.onChangeTextoSelect.emit($event)
    this.onChangeTextoSelect.emit($event.id);
  }
}

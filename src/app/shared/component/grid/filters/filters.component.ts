import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Form } from '@angular/forms';
import { MobileService } from '@app/service/mobile.service';
import { FormRow } from '@shared/component/form/form';
import { fromPromise } from 'rxjs/internal-compatibility';
import { GridFilter, GridFilterOptions } from '../grid.config';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnChanges {

  @Input() opened: Boolean;
  @Input() filters = [];
  @Input() alwaysFilters: boolean = false;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() filterModel: any;
  @Input() specialFilter: boolean = false;
  form: FormGroup;
  @Input() filterEvent;
  @Input() useMargin: boolean = true;

  constructor(private mobile: MobileService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const laodingChange = changes["filterEvent"];
    if (laodingChange) {
      this.filterEvent = laodingChange.currentValue;
      this.loadFilterEvent();
    }
  }

  ngOnInit(): void {
    this.loadFilterEvent();
  }

  loadFilterEvent() {

    if (!this.filterEvent) {
      this.filterEvent = new FilterEvent();
    }

    if (this.filterEvent.filters.length == 0) {
      this.filterEvent.filters = this.filters;
      this.filters?.forEach(f => f.options?.forEach(fo => fo.checked = false));
    } else {
      this.filterEvent.filters.forEach(f => {

        if (f.options?.filter(fo => fo.checked).length > 0) {
          this.filters = this.filters.filter(fi => fi.name != f.name);
          this.filters.push(f);
        }
      })
    }

  }

  formSubmit(event) {
    this.onFilter.emit(event);
  }

  firstSelected(f: GridFilter) {
    return f.options.filter(fo => fo.checked)[0];
  }

  countFilters(f: GridFilter) {
    return f.options.filter(fo => fo.checked).length
  }

  haveOption(search: string, optionName: string, optionValue: string) {
    search = search.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return optionName.toString().replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      .includes(search) || optionValue.toString().replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        .includes(search)
  }

  aoPesquisar(event) {
    this.filterEvent.search = event;
    this.onFilter.emit(this.filterEvent);
  }

  aoFiltrar(filter: GridFilter, option: GridFilterOptions, value: boolean) {
    option.checked = value
    let newF = this.filterEvent.filters.filter(f => f.name != filter.name)
    if (filter.options.filter(fo => fo.checked).length > 0) {
      newF.push(filter);
    }
    this.filterEvent.filters = newF;
    this.onFilter.emit(this.filterEvent);
  }

  cleanFilter(filter: GridFilter) {
    filter.options.forEach(f => f.checked = false);
    let newF = this.filterEvent.filters.filter(f => f.name != filter.name)
    this.filterEvent.filters = newF;
    this.onFilter.emit(this.filterEvent);
  }

  isMobile() {
    return this.mobile.isMobile();
  }

}

export class FilterEvent {
  search: string = "";
  filters: any[] = [];
}
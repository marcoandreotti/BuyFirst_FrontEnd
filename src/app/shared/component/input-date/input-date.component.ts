import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MyDateAdapter } from './date-adapter';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

import { NgxMatMomentModule, NgxMatMomentAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDateFormats } from '@angular-material-components/datetime-picker';

const moment = _rollupMoment || _moment;

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.css'],
  providers: [
    // { provide: DateAdapter, useClass: MyDateAdapter },
    // { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: NgxMatDateAdapter, useClass: NgxMatMomentAdapter },
  ],
})
export class InputDateComponent implements OnInit {
  @Input() public label: string = '';
  @Input() public formControl: FormControl;
  @Input() public formControlEndDate: FormControl;
  @Input() public placeHolder: string = '';
  @Input() public placeHolderEndDate: string = '';
  @Input() public name: string = '';
  @Input() public useRemove: boolean = true;
  @Input() public useTime: boolean = false;
  @Input() public disabled: boolean = false;

  @Input() public showSpinners: boolean = true;
  @Input() public showSeconds: boolean = false;
  @Input() public stepHour: number = 1;
  @Input() public stepMinute: number = 1;
  @Input() public stepSecond: number = 1;
  @Input() public touchUi: boolean = false;
  @Input() public enableMeridian: boolean = false;
  @Input() public disableMinute: boolean = false;
  @Input() public hideTime: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

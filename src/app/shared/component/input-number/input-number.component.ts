import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css']
})
export class InputNumberComponent implements OnInit {

  @Input() public label: string = "";
  @Input() public control: FormControl;
  @Input() public formControlName: string = "";
  @Input() public formGroup: FormGroup;
  @Input() public placeHolder: string = "";
  @Input() public name: string = "";
  @Input() public align: string = "left";
  @Input() public type: string = "inteiro";
  @Input() public precision: string;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public allowNegative: string;
  @Input() public apenasValor: boolean = false;

  inputOptions = {
    inteiro: { align: 'left', prefix: '', suffix: '', thousands: '', decimal: '', precision: 0, allowNegative: false, max: 9999 },
    real: { align: 'left', prefix: 'R$ ', suffix: '', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (999999999999.99) },
    decimal: { align: 'rigth', prefix: '', suffix: '', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (999999999999.99) },
    decimal_negative: { align: 'rigth', prefix: '', suffix: '', thousands: '.', decimal: ',', precision: 2, allowNegative: true, max: (999999999999.99) },
    porcentagem: { align: 'left', prefix: '', suffix: '%', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: 100 },
    kg: { align: 'left', prefix: '', suffix: ' Kg', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (99999.99) },
    m3: { align: 'left', prefix: '', suffix: ' m³', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (99999.99) },
    fatorM3: { align: 'left', prefix: '', suffix: ' Kg/m³', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (99999.99) },
    falseReal: { align: 'left', prefix: 'R$ -', suffix: '', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (999999999999.99) },
  }

  constructor() { }

  ngOnInit(): void {

  }

  getOptions() {
    let op = this.inputOptions[this.type];
    op.align = this.align;
    if (this.precision != null) op.precision = this.precision;
    if (this.min != null) op.min = this.min;
    if (this.max != null) op.max = this.max;
    if (this.allowNegative != null) op.allowNegative = this.allowNegative;
    return op;
  }


}

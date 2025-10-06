import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { isNumeric } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.css'],
})
export class SliderComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() public form;
  @Input() public label: string = '';
  @Input() public max: number = 100;
  @Input() public min: number = 0;
  @Input() public step: number = 1;
  @Input() public value: number = 0;
  @Input() public name: string = '';
  @Output() onInputChangeSelected: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNumeric(changes.currentValue)) this.value = this.min;
  }

  onInputChange(event) {
    if (isNumeric(event.value)) this.value = event.value;
    this.onInputChangeSelected.emit(event);
  }
}

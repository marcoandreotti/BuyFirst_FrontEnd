import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.css'],
})
export class slideToggleComponent implements OnInit {
  @Input() public formControl: FormControl;
  @Input() public name: string = '';
  @Input() public label: string = '';
  @Input() public disabled: boolean = false;
  @Input() public color: string = 'primary';
  @Input() public value: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

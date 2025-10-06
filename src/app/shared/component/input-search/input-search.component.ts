import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css']
})
export class InputSearchComponent implements OnInit {

  @Input() public backgroundColor = 'white';
  @Output() public alterarValor = new EventEmitter<string>();
  value = '';

  constructor() { }

  ngOnInit(): void {
  }

  aoAlterarValor(valor) {
    this.alterarValor.emit(valor);
  }

}

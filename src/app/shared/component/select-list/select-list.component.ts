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
import { ParamSelectItemList } from '@data/schema/param-select-item-list/param-select-item-list';

@Component({
  selector: 'select-list-form',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectListComponent implements OnInit, OnChanges {

  constructor() {}

  @Input() tituloDisponiveis = 'Disponíveis';
  @Input() tituloSelecionados = 'Selecionados';
  @Input() listaDisponiveis: any[] = [];
  @Input() listaSelecionados: any[] = [];
  @Input() parametros: ParamSelectItemList[] = [];
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  @Output() onRemoverItem: EventEmitter<any> = new EventEmitter();

  pesquisaDisponivel = '';
  pesquisaSelecionados = '';

  ngOnInit(): void {}

  ngOnDestroy(): void {}

 
  ngOnChanges(changes: SimpleChanges): void {
  }

  get disponiveis() {
    if (!this.pesquisaDisponivel) return this.listaDisponiveis;
    let paramFilter = this.parametros
      .filter((f) => f.search)
      .map((m) => m.name);
    return this.listaDisponiveis.filter((item) =>
      paramFilter.some(
        (key) =>
          item.hasOwnProperty(key) &&
          new RegExp(this.pesquisaDisponivel, 'gi').test(item[key])
      )
    );
  }

  get selecionados() {
    if (!this.pesquisaSelecionados) return this.listaSelecionados;
    let paramFilter = this.parametros
      .filter((f) => f.search)
      .map((m) => m.name);
    return this.listaSelecionados.filter((item) =>
      paramFilter.some(
        (key) =>
          item.hasOwnProperty(key) &&
          new RegExp(this.pesquisaSelecionados, 'gi').test(item[key])
      )
    );
  }

  addItem(event, item): void {
    this.onAddItem.emit({ event: event, item });
  }

  removerItem(event, item): void {
    this.onRemoverItem.emit({ event: event, item });
  }
}

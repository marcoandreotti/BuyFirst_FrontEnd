import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-generico',
  templateUrl: './dialog-generico.component.html',
  styleUrls: ['./dialog-generico.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogGenericoComponent implements OnInit {
  @Input() modal = null;
  @Input() titulo = "Lorem Ipsum";
  @Input() texto = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  @Input() obsTexto = "Lorem ipsum dolor sit amet, consectetur adipiscing elit laborum.";

  @Input() tipo = "";
  @Input() possuiBotaoContinuar = true;
  @Input() botaoContinuarCallback = () => {
    this.modal.close();
  };
  @Input() botaoContinuarTexto = "Continuar";
  @Input() possuiBotaoCancelar = true;
  @Input() botaoCancelarCallback = () => {
    this.modal.close()
  };
  @Input() botaoCancelarTexto = "Cancelar";

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
}

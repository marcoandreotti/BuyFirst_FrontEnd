import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { OrderSolicitationService } from '@app/service/https/order-solicitation.service';
import { Router } from '@angular/router';
import { OrderSolDto } from '@data/dto/order/order-sol/order-sol.dto';

@Component({
  selector: 'app-modal-order-sol',
  templateUrl: './modal-order-sol.component.html',
  styleUrls: ['./modal-order-sol.component.scss'],
})
export class ModalOrderSolComponent implements OnInit {
  model: OrderSolDto;
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private _service: OrderSolicitationService,
    public dialogRef: MatDialogRef<ModalOrderSolComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    if (this.data > 0) {
      let sub = this._service.get(data).subscribe((result) => {
        if (result.succeeded) {
          this.model = result.data;
        }
        sub.unsubscribe();
      });
    }
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }  
}
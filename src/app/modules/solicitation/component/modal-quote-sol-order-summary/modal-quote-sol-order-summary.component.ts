import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { QuoteSolOrderDto } from '@data/dto/quote/quote-sol/quote-sol-order/quote-sol-order.dto';
import { QuoteSolicitationService } from '@app/service/https/quote-solicitation.service';
import { Address } from '@data/schema/persons/address';
import { CompanyService } from '@app/service/https/company.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { OrderSolicitationService } from '@app/service/https/order-solicitation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-quote-sol-order-summary',
  templateUrl: './modal-quote-sol-order-summary.component.html',
  styleUrls: ['./modal-quote-sol-order-summary.component.scss'],
})
export class ModalSolOrderSummaryComponent implements OnInit {
  model: QuoteSolOrderDto;

  listAddress: Address[] = [];
  selectedAddress: Address;
  idxAddress: number = 0;

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public fb: FormBuilder,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private _companyService: CompanyService,
    private _orderService: OrderSolicitationService,
    public dialogRef: MatDialogRef<ModalSolOrderSummaryComponent>,
    private router: Router,
    private _service: QuoteSolicitationService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    if (this.data > 0) {
      let sub = this._service.getOrdersummary(data).subscribe((result) => {
        if (result.succeeded) {
          this.model = result.data
          this.searchAddresses(result.data.buyerId);
        }
        sub.unsubscribe();
      });
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    this.modalDialog.apresentaAviso(
      'Enviar',
      'Tem certeza que deseja enviar os pedidos?',
      true,
      true,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      () => {
        this.modalDialog.dialog.closeAll();
        let sub = this._orderService
          .sendOrderSol(this.model.quoteSolId, this.selectedAddress.addressId, "") //TODO notes!!!
          .subscribe((result) => {
            if (result.succeeded) {
              this.mensagemSucesso_Send();
              sub.unsubscribe();
            } else {
              console.log(result.message);
            }
          });
      },
      'NÃO',
      'SIM'
    );
  }

  searchAddresses(companyId: number) {
    let sub = this._companyService.GetDeliveryAddresses(companyId).subscribe((result) => {
      this.listAddress = result;
      if (result) {
        this.selectedAddress = result[this.idxAddress];
      }
      sub.unsubscribe()
    });
  }

  stepAddresses(step: number) {
    if (step < 0 && this.idxAddress > 0 || step > 0 && this.listAddress && this.idxAddress < this.listAddress.length - 1) {
      this.idxAddress += step;
      this.selectedAddress = this.listAddress[this.idxAddress];
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  //AUX
  mensagemSucesso_Send() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Pedido(s) enviado(s) com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('solicitacoes');
      },
      null,
      'CONTINUAR'
    );
  }
}
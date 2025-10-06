import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';

@Component({
  selector: 'app-modal-autom',
  templateUrl: './modal-match-automatic.component.html',
  styleUrls: ['./modal-match-automatic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalMatchAutomaticComponent implements OnInit {
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalMatchAutomaticComponent>,
    private router: Router,
    private service: ProductSupplierService,
    @Inject(MAT_DIALOG_DATA) public data: CompanyDto
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  executeMatch() {
    var sub = this.service
      .executAutomaticMatch(this.data.companyId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.mensagemSucesso(result.data);
        } else {
          console.log(result.message);
        }
        sub.unsubscribe();
      });
  }

  mensagemSucesso(totalPersistido: number) {
    let message: string = 'Sucesso na execução. Porem não foram encontrados vínculos!';
    if (totalPersistido == 1) {
      message = 'Sucesso foi criado um vínculo';
    } else if (totalPersistido > 1) {
      message = `Sucesso foram criados ${totalPersistido} vínculos`;
    }

    this.modalDialog.apresentaSucesso(
      'Sucesso!',
      message,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }
}

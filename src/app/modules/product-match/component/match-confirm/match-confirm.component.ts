import { Component, Inject, OnInit } from '@angular/core';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmMatchDto } from '@data/dto/match/confirm-match.dto';
import { MatchLinkDto } from '@data/dto/match/match-link.dto';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';

@Component({
  selector: 'app-match-confirm',
  templateUrl: './match-confirm.component.html',
  styleUrls: ['./match-confirm.component.scss'],
})
export class MatchConfirmComponent implements OnInit {
  tagStorageConfirmMatch: string = 'confirm_match_storage';
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  lstConfirmMatchs: ConfirmMatchDto[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MatchConfirmComponent>,
    public _service: ProductSupplierService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmMatchDto[]
  ) {}

  ngOnInit(): void {
    this.lstConfirmMatchs = this.data;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  saveConfirmMatch() {
    let links = this.lstConfirmMatchs.map((e) => {
      return new MatchLinkDto({ productId: e.productId, productSupplierId: e.productSupplierId });
    })

    this._service.addLinks(links).subscribe((result) => {
      if (result.succeeded) {
        this.mensagemSucesso();
      } else {
        console.log(result.message);
      }
    });

  }

  mensagemSucesso() {
    this.dialogRef.close(true);

    this.modalDialog.apresentaSucesso(
      'Sucesso!',
      'Matchs adicionados com sucesso!',
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

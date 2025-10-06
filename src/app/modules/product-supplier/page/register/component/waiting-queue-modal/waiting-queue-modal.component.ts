import { Component, Inject, OnInit } from '@angular/core';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridColumn } from '@shared/component/grid/grid.config';
import { ProductSupplierWaitingQueueDto } from '@data/dto/products/product-supplier/product-supplier-waiting-queue.dto';

@Component({
  selector: 'app-waiting-queue-modal',
  templateUrl: './waiting-queue-modal.component.html',
  styleUrls: ['./waiting-queue-modal.component.scss'],
})
export class ModalWaitingQueueComponent implements OnInit {
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalWaitingQueueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductSupplierWaitingQueueDto[]) {}

  ngOnInit(): void { }

  cancel(): void {
    this.dialogRef.close(false);
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogProductWaitingQueueDto } from '@data/dto/catalogs/catalog-product-waiting-queue.dto';

@Component({
  selector: 'app-catalog-waiting-queue-modal',
  templateUrl: './catalog-waiting-queue-modal.component.html',
  styleUrls: ['./catalog-waiting-queue-modal.component.scss'],
})
export class CatalogModalWaitingQueueComponent implements OnInit {
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CatalogModalWaitingQueueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CatalogProductWaitingQueueDto[]) {}

  ngOnInit(): void { }

  cancel(): void {
    this.dialogRef.close(false);
  }
}

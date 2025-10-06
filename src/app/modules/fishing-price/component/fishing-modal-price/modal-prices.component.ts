import { Component, Inject, OnInit } from '@angular/core';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmMatchDto } from '@data/dto/match/confirm-match.dto';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { FishingPriceDto } from '@data/dto/fishing-price/fishing-price.dto';
import { GridColumn } from '@shared/component/grid/grid.config';

@Component({
  selector: 'app-modal-prices',
  templateUrl: './modal-prices.component.html',
  styleUrls: ['./modal-prices.component.scss'],
})
export class ModalPricesComponent implements OnInit {
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  model: FishingPriceDto | any;

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalPricesComponent>,
    public _service: ProductSupplierService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmMatchDto[]
  ) {}

  ngOnInit(): void {
    this.model = this.data;
    this.PrepareColumns();
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  PrepareColumns() {
    this.displayedColumns = [
      'paymentConditionName',
      'quantityInstallments',
      'price',
    ];

    this.cols = [
      { name: 'paymentConditionName', title: 'Conds. Pagto', show: true },
      {
        name: 'quantityInstallments',
        title: 'Parcelas',
        show: true,
        mask: '0',
      },
      {
        name: 'price',
        title: 'Preço',
        decimal: true,
        decimalPrecision: 2,
        prefix: 'R$ ',
        show: true,
      },
    ];
  }
}

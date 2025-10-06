import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { QuoteSolProductAddress } from '@data/schema/quote/solicitation/quote-sol-product-address';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-quote-sol-product-addresses',
  templateUrl: './modal-quote-sol-product-addresses.component.html',
  styleUrls: ['./modal-quote-sol-product-addresses.component.scss'],
})
export class ModalSolProductAddressesComponent implements OnInit {
  addressForm: FormGroup;
  formAddressArray = new FormArray([]);
  listAddresses: QuoteSolProductAddress[] = [];

  constructor(
    public fb: FormBuilder,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalSolProductAddressesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuoteSolProductAddress[]
  ) {
    this.listAddresses = data;
  }

  ngOnInit() {
    this.listAddresses.forEach((e) => {
      const form = this.fb.group({
        quoteSolProductAddressId: [e.quoteSolProductAddressId],
        quoteSolProductId: [e.quoteSolProductId],
        deliveryAddressId: [e.deliveryAddressId],
        concatAddress: [e.concatAddress],
        quantity: ['quantity']
      });
      this.formAddressArray.push(form);
    });
    this.addressForm = new FormGroup({
      addresses: this.formAddressArray
    });
  }

  onSubmitAddresses() {
    this.formAddressArray.value.filter((e) => e.quantity > 0).forEach((e) => {
      let addressSearch = this.listAddresses.find((x) => x.deliveryAddressId === e.deliveryAddressId);
      if (addressSearch) addressSearch.quantity = e.quantity;
    });

    this.dialogRef.close(this.listAddresses);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getOptions() {
    return { align: 'rigth', prefix: ' ', suffix: '', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (999999999999.99) };
  }

}
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Address } from '@data/schema/persons/address';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-modal-address',
  templateUrl: './modal-address.component.html',
  styleUrls: ['./modal-address.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalAddressComponent implements OnInit {
  addressForm: FormGroup;
  // modelAddress: Address;
  editAddressId: number = null;
  formAddress: FormRow[] = [];
  typesAddress$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.editAddressId = this.data.addressId;
    this.data.type = this.data.type;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveAddress() {
    if (!this.addressForm.valid) {
      this.addressForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      this.data = Object.assign(
        new Address(),
        this.addressForm.getRawValue()
      );
      this.data.type = this.data.type;
      this.data.addressId = this.editAddressId;

      this.dialogRef.close(this.data);
    }
  }

  createForm() {
    this.typesAddress$.next([
      { id: 1, description: 'Único (Reflete a todos)' },
      { id: 2, description: 'Cobrança' },
      { id: 3, description: 'Entrega' },
    ]);

    this.formAddress = [
      {
        fields: [
          {
            name: 'type',
            label: 'Tipo de endereço',
            placeholder: 'Tipo de endereço',
            size: 50,
            value: 'id',
            select: true,
            selectName: 'description',
            required: true,
            list: this.typesAddress$,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'zipCode',
            label: 'CEP',
            placeholder: 'CEP',
            size: 20,
            value: 'zipCode',
            required: true,
            mask: '99999-999',
            maxLength: 10,
          },
          {
            name: 'street',
            label: 'Logradouro',
            placeholder: 'Logradouro',
            size: 80,
            value: 'street',
            required: true,
            maxLength: 100,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'number',
            label: 'Número',
            placeholder: 'Número',
            size: 20,
            value: 'number',
            required: false,
            maxLength: 15,
          },
          {
            name: 'complement',
            label: 'Complemento',
            placeholder: 'Complemento',
            size: 30,
            value: 'complement',
            required: false,
            maxLength: 50,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'neighborhood',
            label: 'Bairro',
            placeholder: 'Bairro',
            size: 45,
            value: 'neighborhood',
            required: true,
            maxLength: 50,
          },
          {
            name: 'location',
            label: 'Cidade',
            placeholder: 'Cidade',
            size: 45,
            value: 'location',
            required: true,
            maxLength: 100,
          },
          {
            name: 'stateAcronym',
            label: 'UF',
            placeholder: 'UF',
            size: 10,
            value: 'stateAcronym',
            required: true,
            maxLength: 2,
          },
        ],
        marginTop: '10px',
      },
    ];
  }
}

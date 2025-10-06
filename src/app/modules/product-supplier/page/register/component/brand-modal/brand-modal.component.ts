import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { BrandService } from '@app/service/https/brand.service';
import { Brand } from '@data/schema/products/brand/brand';
import { FormRow } from '@shared/component/form/form';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-modal',
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand-modal.component.scss'],
})
export class BrandModalComponent implements OnInit {
  brandForm: FormGroup;
  formBrand: FormRow[] = [];
  model: Brand;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  brandId: number = 0;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BrandModalComponent>,
    private _service: BrandService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    //  this.companyId = data;
  }

  ngOnInit() {
     this.createForm();
  }

  save() {
    if (!this.brandForm.valid) {
      this.brandForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: Brand = Object.assign(
         new Brand(),
         this.brandForm.getRawValue()
      );

      model.active = true;

      this._service.add(model).subscribe((result) => {
         if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
         } else {
           this.brandId = result.data;
            this.mensagemSucesso();
         }
      });
    }
  }

  createForm() {
    this.formBrand = [
      {  
        fields: [
          {
            name: 'name',
            label: 'Digite o nome da Marca',
            placeholder: 'Nome da Marca',
            size: 100,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  cancel(): void {
    this.dialogRef.close(0);
  }

  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Marca cadastrada com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.dialogRef.close(this.brandId);
      },
      null,
      'CONTINUAR'
    );
  }
}

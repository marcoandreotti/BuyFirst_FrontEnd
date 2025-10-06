import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentConditionService } from '@app/service/https/payment-condition.service';
import { PaymentCondition } from '@data/schema/payment-conditions/payment-condition';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalRegisterComponent implements OnInit {
  paymentForm: FormGroup;
  formPayment: FormRow[] = [];
  model: PaymentCondition;
  editId: number | null;
  paymentTypeId: number | null;
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalRegisterComponent>,
    private _service: PaymentConditionService,
    @Inject(MAT_DIALOG_DATA) public data: PaymentCondition | any
  ) {}

  ngOnInit(): void {
    this.editId = this.data.paymentConditionId;
    this.paymentTypeId = this.data.paymentTypeId;

    if (this.editId > 0) {
      this._service.get(this.editId).subscribe((payment) => {
        if (payment.succeeded) {
          this.model = payment.data;
          this.createForm();
        } else {
          this.modalDialog.apresentaErro('Erro', payment.message);
        }
      });
    } else {
      this.createForm();
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  savePayment() {
    if (!this.paymentForm.valid) {
      this.paymentForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.editId) {
        let model: PaymentCondition = Object.assign(
          new PaymentCondition(),
          this.paymentForm.getRawValue()
        );
        model.paymentTypeId = this.paymentTypeId;
        this._service.add(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      } else {
        let model: PaymentCondition = Object.assign(
          this.model,
          this.paymentForm.getRawValue()
        );
        model.paymentTypeId = this.paymentTypeId;

        this._service.save(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      }
    }
  }

  mensagemSucesso() {
    this.dialogRef.close(true);

    this.modalDialog.apresentaSucesso(
      'Sucesso!',
      'A condição de pagamento foi salva com sucesso',
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

  createForm() {
    this.formPayment = [
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 100,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
      },
      {
        fields: [
          {
            name: 'maturityDateType',
            label: 'Tipo de Data de vencimento',
            placeholder: 'Tipo de Data de vencimento',
            size: 50,
            value: 'id',
            required: true,
            selectName: 'descName',
            select: true,
            useRemove: true,
            useSearch: true,
            list: this._service.getMaturityDateTypeAll(),
            options: [{ name: 'descName', search: true, text: true }],
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'daysByPayment',
            label: 'Dias para o pagamento',
            size: 50,
            value: 'daysByPayment',
            required: true,
          },
          {
            name: 'quantityInstallments',
            label: 'Quantidade de parcela',
            size: 50,
            value: 'quantityInstallments',
            required: true,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'percentageOnPrice',
            label: 'Porcentagem',
            size: 33,
            placeholder: 'Porcentagem',
            value: 'percentageOnPrice',
            required: true,
          },
        ],
        marginTop: '10px',
      },
    ];
  }
}

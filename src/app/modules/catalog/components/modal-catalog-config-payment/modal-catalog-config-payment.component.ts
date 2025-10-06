import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PaymentConditionService } from '@app/service/https/payment-condition.service';
import { RegionService } from '@app/service/https/region.serice';
import { PaymentConditionDto } from '@data/dto/payment-condition/payment-condition.dto';
import { SpecialConditionDto } from '@data/dto/payment-condition/special-condition.dto';
import { PaymentConditionCatalog } from '@data/schema/payment-conditions/payment-condition-catalog';
import { SpecialConditionCatalog } from '@data/schema/payment-conditions/special-condition-catalog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';

@Component({
  selector: 'app-modal-catalog-config-payment',
  templateUrl: './modal-catalog-config-payment.component.html',
  styleUrls: ['./modal-catalog-config-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCatalogConfigPaymentComponent implements OnInit {
  configForm: FormGroup;
  formConfig: FormRow[] = [];
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  infoPayment: string = '';

  //Special Conditions
  modelSpecialCondition: SpecialConditionCatalog;
  colsSpecialCondition: GridColumn[];
  itemMenusSpecialCondition: GridItemMenu[] = [];
  displayedColumnsSpecialCondition: String[];
  specialConditionFormRegion: FormGroup;
  specialConditionFormCnpj: FormGroup;
  formSpecialConditionRegion: FormRow[] = [];
  formSpecialConditionCnpj: FormRow[] = [];
  specialConditionType: number = 2;

  persistenceDb: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalCatalogConfigPaymentComponent>,
    private _regionService: RegionService,
    private _service: PaymentConditionService,
    @Inject(MAT_DIALOG_DATA) public data: PaymentConditionDto
  ) {}

  ngOnInit(): void {
    this.infoPayment = `Conds: ${this.data.name} - ${this.data.maturityDateTypeName}/${this.data.maturityDateTypeDescription}`;
    this.prepareGridSpecialCondition();
    this.createForm();
    this.radioButtonChange(null);
  }

  cancel(): void {
    this.dialogRef.close(this.persistenceDb);
  }

  savePercent() {
    if (!this.configForm.valid) {
      this.configForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      var formModel = Object.assign(
        new SpecialConditionDto(),
        this.configForm.getRawValue()
      );

      let model: PaymentConditionCatalog = {
        paymentConditionId: this.data.paymentConditionId,
        paymentConditionCatalogId: this.data.id,
        percentageOnPrice: formModel.percentageOnPrice
          ? formModel.percentageOnPrice
          : 0,
        catalogId: this.data.catalogId,
        active: this.data.active,
      };

      if (this.data.id && this.data.id > 0) {
        let sub = this._service
          .savePaymentCatalog(model)
          .subscribe((response) => {
            if (response.succeeded) {
              this.persistenceDb = true;
              this.data.percentageOnPrice = formModel.percentageOnPrice
                ? formModel.percentageOnPrice
                : 0;
              this.messageSucesso_Percent();
              sub.unsubscribe();
            } else {
              console.log(response.message);
            }
          });
      } else {
        let sub = this._service
          .addPaymentCatalog(model)
          .subscribe((response) => {
            if (response.succeeded) {
              this.persistenceDb = true;
              this.messageSucesso_Percent();
            } else {
              console.log(response.message);
            }
          });
      }
    }
  }

  createForm() {
    this.formConfig = [
      {
        fields: [
          {
            name: 'percentageOnPrice',
            label: 'Percentual',
            placeholder: 'Percentual',
            size: 20,
            value: 'percentageOnPrice',
            required: false,
            number: true,
            numberType: 'decimal_negative',
          },
        ],
        submit: true,
        submitText: 'Salvar',
        size: 20,
        marginTop: '40px',
      },
    ];
  }

  //Special Condition
  radioButtonChange($event) {
    this.createFormSpecialCondition();
  }

  createFormSpecialCondition() {
    this.formSpecialConditionRegion = [
      {
        fields: [
          {
            name: 'regionId',
            label: 'Region',
            placeholder: 'Region',
            size: 50,
            value: 'regionId',
            select: true,
            required: true,
            selectName: 'name',
            useRemove: true,
            useSearch: false,
            list: this._regionService.getSelectAll(),
            options: [{ name: 'name', search: true, text: true }],
          },
          {
            name: 'percentageOnPrice',
            label: 'Percentual',
            placeholder: 'Percentual',
            size: 30,
            value: 'percentageOnPrice',
            required: false,
            number: true,
            numberType: 'decimal_negative',
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'startDate',
            label: 'Início vigência',
            placeholder: 'Início vigência',
            size: 50,
            value: 'startDate',
            required: true,
            date: true,
          },
          {
            name: 'expirationDate',
            label: 'Termino vigência',
            placeholder: 'Termino vigência',
            size: 50,
            value: 'expirationDate',
            required: false,
            date: true,
          },
        ],
        submit: true,
        submitText: 'Incluir',
        size: 20,
        marginTop: '10px',
      },
    ];

    this.formSpecialConditionCnpj = [
      {
        fields: [
          {
            name: 'cnpj',
            label: 'CNPJ',
            placeholder: 'CNPJ',
            size: 50,
            value: 'cnpj',
            required: true,
            mask: 'CPF_CNPJ',
            maxLength: 18,
          },
          {
            name: 'percentageOnPrice',
            label: 'Percentual',
            placeholder: 'Percentual',
            size: 30,
            value: 'percentageOnPrice',
            required: false,
            number: true,
            numberType: 'decimal_negative',
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'startDate',
            label: 'Início vigência',
            placeholder: 'Início vigência',
            size: 50,
            value: 'startDate',
            required: true,
            date: true,
          },
          {
            name: 'expirationDate',
            label: 'Termino vigência',
            placeholder: 'Termino vigência',
            size: 50,
            value: 'expirationDate',
            required: false,
            date: true,
          },
        ],
        submit: true,
        submitText: 'Incluir',
        size: 20,
        marginTop: '10px',
      },
    ];
  }

  prepareGridSpecialCondition() {
    this.colsSpecialCondition = [
      { name: 'restrictType', title: 'Tipo', show: true },
      { name: 'restrict', title: 'Restrição', show: true },
      {
        name: 'percentageOnPrice',
        title: 'Percentual',
        decimal: true,
        decimalPrecision: 2,
        show: true,
      },
      { name: 'startDate', title: 'Data Inicial', date: true, show: true },
      { name: 'expirationDate', title: 'Data Final', date: true, show: true },
    ];

    this.displayedColumnsSpecialCondition = [
      'restrictType',
      'restrict',
      'percentageOnPrice',
      'startDate',
      'expirationDate',
    ];

    this.itemMenusSpecialCondition = [
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: SpecialConditionDto) => {
          let sub = this._service
            .deleteSpecialConditionCatalog(row.id)
            .subscribe((result) => {
              if (result.succeeded) {
                this.persistenceDb = true;
                this.messageSucesso_SpecialCondition(true);
                sub.unsubscribe();
              } else {
                console.log(result.message);
              }
            });
        },
      },
    ];
  }

  formSpecialConditionSubmit() {
    let form: FormRow | any =
      this.specialConditionType == 1
        ? this.specialConditionFormRegion
        : this.specialConditionFormCnpj;

    if (!form) {
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: SpecialConditionCatalog = Object.assign(
        new SpecialConditionCatalog(),
        this.createFormSpecialCondition(),
        form.getRawValue()
      );

      if (!model.startDate) {
        this.modalDialog.apresentaErro('Erro', 'Preencha a data inicial');
        return;
      }

      model.paymentConditionCatalogId = this.data.id;
      model.restrictConditionType = this.specialConditionType;

      this._service.addSpecialConditionCatalog(model).subscribe((result) => {
        if (result.succeeded) {
          this.persistenceDb = true;
          this.messageSucesso_SpecialCondition(false);
        }
      });
    }
  }

  showSpecialCondition() {
    let subSpecialCondition = this._service
      .getPaymentConditionCatalog(
        this.data.catalogId,
        this.data.paymentConditionId
      )
      .subscribe((result) => {
        if (result.succeeded) {
          this.data.specialConditions = result.data.specialConditions;
          subSpecialCondition.unsubscribe();
        } else {
          console.log(result.message);
        }
      });
  }

  messageSucesso_Percent() {
    var dialog = this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Percentual ajustado com sucesso!`,
      false,
      true,
      null,
      () => {
        dialog.close();
      },
      null,
      'CONTINUAR'
    );
  }

  messageSucesso_SpecialCondition(deleting: boolean) {
    const text = deleting ? 'deletada' : 'salva';

    var dialog = this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Condição especial ${text} com sucesso!`,
      false,
      true,
      null,
      () => {
        dialog.close();
        this.showSpecialCondition();
      },
      null,
      'CONTINUAR'
    );
  }
}

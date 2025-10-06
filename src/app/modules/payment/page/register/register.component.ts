import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { ModalRegisterComponent } from './modal-register/modal-register.component';
import { ReplaySubject } from 'rxjs';
import { PaymentType } from '@data/schema/payment-type/payment-type';
import { PaymentTypeService } from '@app/service/https/payment-type.service';
import { PaymentCondition } from '@data/schema/payment-conditions/payment-condition';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { PaymentConditionService } from '@app/service/https/payment-condition.service';

@Component({
  selector: 'app-payments-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class PaymentRegisterComponent implements OnInit {
  editId: number = null;
  paymentForm: FormGroup;
  formPayment: FormRow[] = [];
  model: PaymentType;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  negociation$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  paymentConditions$: PaymentCondition[];
  cols: GridColumn[] = [];
  dispColumns: String[] = [];
  itemMenus: GridItemMenu[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _service: PaymentTypeService,
    private _paymentConditionService: PaymentConditionService,
    private themeService: ThemeService
  ) {
    this.PrepareGrid();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('condicaopagamento');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.themeService.setTitle('Editando método de pagamento');
        let sub = this._service.get(this.editId).subscribe((payment) => {
          if (payment.succeeded) {
            this.model = payment.data;
            this.model.negociation = this.model.isEcommerce ? '2' : '1';
            this.paymentConditions$ = this.model.paymentConditions;
          } else {
            this.modalDialog.apresentaErro('Erro', payment.message);
          }
          sub.unsubscribe();
        });
      } else {
        this.themeService.setTitle('Novo método de pagamento');
      }
      this.createForm();
    });
  }

  openModal(paymentConditionId: number | null): void {
    const dialogRef = this.dialog.open(ModalRegisterComponent, {
      width: '800px',
      data: { paymentConditionId, paymentTypeId: this.editId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //refresh na lista de conds...
        let sub = this._service.get(this.editId).subscribe((payment) => {
          if (payment.succeeded) {
            this.paymentConditions$ = payment.data.paymentConditions;
          } else {
            this.modalDialog.apresentaErro('Erro', payment.message);
          }
          sub.unsubscribe();
        });
      }
    });
  }

  save() {
    if (!this.paymentForm.valid) {
      this.paymentForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.editId) {
        let model: PaymentType = Object.assign(
          new PaymentType(),
          this.paymentForm.getRawValue()
        );

        model.isEcommerce = model.negociation == '2';
        this._service.add(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      } else {
        let model: PaymentType = Object.assign(
          this.model,
          this.paymentForm.getRawValue()
        );

        model.isEcommerce = model.negociation == '2';
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

  createForm() {
    this.negociation$.next([
      { id: '1', description: 'Direto com a empresa de vendas' },
      { id: '2', description: 'Indireto' },
    ]);

    this.formPayment = [
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 60,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'description',
            label: 'Descrição',
            placeholder: 'Descrição',
            size: 100,
            value: 'id',
            required: true,
            maxLength: 255,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'negociation',
            label: 'Negociação',
            placeholder: 'Negociação',
            size: 60,
            value: 'id',
            select: true,
            selectName: 'description',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this.negociation$,
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  PrepareGrid() {
    this.dispColumns = [
      'paymentConditionId',
      'name',
      'maturityDateTypeName',
      'maturityDateTypeDescription',
      'daysByPayment',
      'quantityInstallments',
      'percentageOnPrice',
      'active',
    ];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      { name: 'paymentConditionId', title: 'ID', show: true },
      { name: 'name', title: 'Nome', show: true },
      { name: 'maturityDateTypeName', title: 'Tipo', show: true },
      { name: 'maturityDateTypeDescription', title: 'Descrição', show: true },
      { name: 'daysByPayment', title: 'Dias para pagto.', show: true },
      { name: 'quantityInstallments', title: 'Qtd. Parcelas', show: true },
      {
        name: 'percentageOnPrice',
        title: 'Percentual',
        show: true,
        decimal: true,
        decimalPrecision: 2,
      },
      { name: 'active', title: 'Ativo', show: true, value: activeValue },
    ];

    this.itemMenus = [
      {
        name: 'Editar',
        icon: 'edit',
        action: (row: PaymentCondition) => {
          this.openModal(row.paymentConditionId);
        },
      },
      {
        name: 'Ativar/Inativar',
        icon: 'done_outline',
        action: (row: PaymentCondition) => {
          let sub = this._paymentConditionService
            .activeInactive(row.paymentConditionId)
            .subscribe((result) => {
              if (result.succeeded) {
                this.mensagemSucesso_Active(!row.active);
                row.active = !row.active;
                sub.unsubscribe();
              } else {
                console.log(result.message);
              }
            });
        },
      },
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: PaymentCondition) => {
          this.modalDialog.apresentaAviso(
            'Excluir',
            'Tem certeza que deseja excluir?',
            true,
            true,
            () => {
              this.modalDialog.dialog.closeAll();
            },
            () => {
              this.modalDialog.dialog.closeAll();

              let sub = this._paymentConditionService
                .delete(row.paymentConditionId)
                .subscribe((result) => {
                  if (result.succeeded) {
                    this.mensagemSucesso_Delete();
                    sub.unsubscribe();
                    this.ngOnInit();
                  } else {
                    console.log(result.message);
                  }
                });
            },
            'NÃO',
            'SIM'
          );
        },
      },
    ];
  }

  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Método de Pagamento ' +
        (this.editId ? 'alterado' : 'cadastrado') +
        ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('condicaopagamento');
      },
      null,
      'CONTINUAR'
    );
  }

  mensagemSucesso_Delete() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Condição de pagamento excluida com sucesso!`,
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

  mensagemSucesso_Active(active: boolean) {
    const text = active ? 'ativa' : 'inativa';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Condição de pagamento ${text} com sucesso!`,
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

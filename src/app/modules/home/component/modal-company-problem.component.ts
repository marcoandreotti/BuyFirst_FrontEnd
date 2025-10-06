import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CompanyService } from '@app/service/https/company.service';
import { QuoteErpHistoricService } from '@app/service/https/quote-erp-historic.service';
import { FilterProductDtoSearch } from '@data/dto/products/product/filter-product.dto';
import { CompanyProblemDto } from '@data/dto/quote/erp/company-problem.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
    selector: 'app-modal-company-problem',
    templateUrl: './modal-company-problem.component.html',
    styleUrls: ['./modal-company-problem.component.scss']
})
export class ModalCompanyProblemComponent implements OnInit {
    lst: CompanyProblemDto[];
    modalDialog = new DialogGenericoFuncoes(this.dialog);
    existsSelected: boolean = false;
    model: CompanyCodeModel = new CompanyCodeModel();
    codeForm: FormGroup;
    formCode: FormRow[] = [];

    constructor(
        public dialog: MatDialog,
        private _quoteHistoricService: QuoteErpHistoricService,
        private _companySevise: CompanyService,
        public dialogRef: MatDialogRef<ModalCompanyProblemComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FilterProductDtoSearch
    ) { }

    ngOnInit(): void {
        let sub = this._quoteHistoricService.GetAllQuoteErpHistoricWithoutCodeSac().subscribe((res) => {
            this.lst = res.data;
            sub.unsubscribe();
        });
        this.createFormCode();
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        if (!this.codeForm.valid) {
            this.modalDialog.apresentaErro('Erro', 'Preencha o código do grupo');
        } else {
            if (this.existsSelected) {

                let modal = this.modalDialog.apresentaAvisoObs(
                    'Confirma?',
                    'Caso queira, pode alterar esse código no cadastro de compradores...',
                    '',
                    true,
                    true,
                    () => {
                        modal.close();
                    },
                    () => {
                        let model: CompanyCodeModel = Object.assign(
                            new CompanyCodeModel(),
                            this.codeForm.getRawValue()
                        );

                        let ids: number[] = this.lst.filter(function (e) {
                            if (e.selected) return e.buyerId;
                        }).map(s => s.buyerId);


                        this._companySevise.updateComanyCodeSac(ids, model.companyCodeSac).subscribe((result) => {
                            if (result.succeeded){
                                if (ids.length == this.lst.length) {
                                    modal.close();
                                    this.dialogRef.close(true);
                                } else {
                                    modal.close();
                                    this.dialogRef.close(false);
                                }
                            } else {
                                modal.close();
                                this.modalDialog.apresentaErro('Erro', result.message);
                            }
                          });
                    },
                    'NÃO',
                    'SIM'
                );
            } else {
                this.modalDialog.apresentaErro('Erro', 'Não há empresa selecionada');
            }
        }

    }

    onSelectedRow(comp: CompanyProblemDto) {
        comp.selected = !comp.selected;
        this.CheckedAction();
    }

    //AUX
    CheckedAction() {
        this.existsSelected = this.lst.some(function (p) {
            return p.selected === true;
        });
    }

    createFormCode() {
        this.formCode = [
            {
                fields: [
                    {
                        name: 'companyCodeSac',
                        label: 'Código do Grupo',
                        placeholder: 'Código do Grupo',
                        size: 100,
                        value: 'companyCodeSac',
                        required: true,
                        maxLength: 15,
                    },
                ],
            },
        ];
    }

}

export class CompanyCodeModel {
    companyCodeSac: number;
}
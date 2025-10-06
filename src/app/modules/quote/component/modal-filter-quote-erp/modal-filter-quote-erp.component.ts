import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProductErpService } from '@app/service/https/product-erp.service';
import { FilterDto } from '@data/dto/filter.dto';
import { FilterProductDto, FilterProductDtoSearch } from '@data/dto/products/product/filter-product.dto';
import { FilterQuoteErpHistoricDto, FilterQuoteErpHistoricSearch } from '@data/dto/quote/erp/filter-quote-erp-historic.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
    selector: 'app-modal-filter-quote-erp.component',
    templateUrl: './modal-filter-quote-erp.component.html',
    styleUrls: ['./modal-filter-quote-erp.component.scss']
})
export class ModalFilterQuoteErpComponent implements OnInit {
    titleModal: string = 'Filtro';
    model: FilterQuoteErpHistoricDto;
    modalDialog = new DialogGenericoFuncoes(this.dialog);

    idForm: FormGroup;
    formId: FormRow[] = [];
    modelIdFilter: ModalFilter;

    defForm: FormGroup;
    formDef: FormRow[] = [];
    modelDefaultFilter: FilterDto;

    constructor(
        public dialog: MatDialog,
        private _service: ProductErpService,
        public dialogRef: MatDialogRef<ModalFilterQuoteErpComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FilterQuoteErpHistoricSearch
    ) { }

    ngOnInit(): void {
        this.model = this.data.data;
        switch (this.data.column) {
            case 'productId':
                this.titleModal = "Filtar pelo ID do Produto";
                this.modelIdFilter = new ModalFilter();
                this.modelIdFilter.id = this.model.productId;
                this.CreateFormId('ID Produto BF');
                break;
            case 'companyCodeSac':
                this.titleModal = "Filtar pelo Grupo";
                this.modelIdFilter = new ModalFilter();
                this.modelIdFilter.id = this.model.companyCodeSac;
                this.CreateFormId('Código do Grupo');
                break;
            case 'productErpCode':
                this.titleModal = "Filtar pelo Código do produto Erp";
                this.modelIdFilter = new ModalFilter();
                this.modelIdFilter.id = this.model.productErpCode;
                this.CreateFormId('Código produto Erp');
                break;
            default:
                this.titleModal = "Filtar Nome do Produto";
                this.CreateFormDefault();
                break;
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onClearFilter() {
        switch (this.data.column) {
            case 'productId':
                this.model.productId = null;
                break;
            case 'companyCodeSac':
                this.model.companyCodeSac = null;
                break;
            case 'productErpCode':
                this.model.productErpCode = null;
                break;
            case 'buyerName':
                this.model.buyerArguments = null;
                break;
            default:
                this.model.productArguments = [];
                break;
        }
        this.dialogRef.close(this.model);
    }

    onDefSubmit() {
        if (!this.defForm.valid) {
            this.defForm.markAsPending();
            this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
        } else {
            let model: FilterDto = Object.assign(
                new FilterDto(),
                this.defForm.getRawValue()
            );

            if (model) {
                if (this.data.column == 'default') {
                    this.model.productArguments.push(model);
                } else {
                    this.model.buyerArguments.push(model);
                }
            }

            this.defForm.reset();
        }
    }

    onDefRemoveFilter(row: FilterDto) {
        let newModelFilter: FilterDto[] = [];
        this.model.productArguments.forEach((r) => {
            if (r.argument != row.argument && r.type != row.type) {
                newModelFilter.push(r);
            }
        });
        if (this.data.column == 'default') {
            this.model.productArguments = newModelFilter;
        } else {
            this.model.buyerArguments = newModelFilter;
        }
    }

    onSubmit() {
        if (this.idForm) {
            let model: ModalFilter = Object.assign(
                this.modelIdFilter,
                this.idForm.getRawValue()
            );

            if (model) {
                switch (this.data.column) {
                    case 'productId':
                        this.model.productId = model.id;
                        break;
                    case 'companyCodeSac':
                        this.model.companyCodeSac = model.id;
                        break;
                    case 'productErpCode':
                        this.model.productErpCode = model.id;
                        break;
                }
            }
        }
        this.dialogRef.close(this.model);
    }

    onClickSort(direction: string): void {
        this.model.sort.active = this.data.column;
        this.model.sort.direction = direction == 'a' ? 'asc' : 'desc';
        this.dialogRef.close(this.model);
    }

    CreateFormId(label: string) {
        this.formId = [
            {
                fields: [
                    {
                        name: 'id',
                        label: `${label}`,
                        placeholder: `${label} (pode conter vários separados por ; - ponto e virgula ou Tatulação)`,
                        value: 'id',
                        textArea: true,
                        textAreaRows: 5,
                        size: 100,
                    }
                ],
            }
        ];
    }

    CreateFormDefault() {
        this.formDef = [
            {
                fields: [
                    {
                        name: 'type',
                        label: 'Tipo de filtro',
                        placeholder: 'Tipo de filtro',
                        size: 50,
                        value: 'id',
                        required: true,
                        selectName: 'description',
                        select: true,
                        useRemove: true,
                        useSearch: true,
                        list: this._service.getFilterTypeAll(),
                        options: [{ name: 'description', search: true, text: true }],
                    },
                ],
            },
            {
                fields: [
                    {
                        name: 'argument',
                        label: 'Filtro',
                        placeholder: 'Filtro',
                        value: 'argument',
                        required: true,
                        size: 100,
                    }
                ],
                submit: true,
                submitText: 'Adicionar',
                size: 20,
                marginTop: '2px',
            }
        ];
    }
}

export class ModalFilter {
    id?: string | null;
}
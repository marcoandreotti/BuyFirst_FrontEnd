import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProductErpService } from '@app/service/https/product-erp.service';
import { FilterDto } from '@data/dto/filter.dto';
import { FilterProductLinkErp, FilterProductLinkErpSearch } from '@data/dto/products/product-erp/link/filter-product-link-erp';
import { FilterProductDto, FilterProductDtoSearch } from '@data/dto/products/product/filter-product.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
    selector: 'app-modal-filter-product',
    templateUrl: './modal-filter-product.component.html',
    styleUrls: ['./modal-filter-product.component.scss']
})
export class ModalFilterProductComponent implements OnInit {
    titleModal: string = 'Filtro';
    model: FilterProductDto;
    modalDialog = new DialogGenericoFuncoes(this.dialog);

    prodForm: FormGroup;
    formProd: FormRow[] = [];
    modelProdFilter: ProdFilter;

    defForm: FormGroup;
    formDef: FormRow[] = [];
    modelDefaultFilter: FilterDto;

    constructor(
        public dialog: MatDialog,
        private _service: ProductErpService,
        public dialogRef: MatDialogRef<ModalFilterProductComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FilterProductDtoSearch
    ) { }

    ngOnInit(): void {
        this.model = this.data.data;
        switch (this.data.column) {
            case 'productId':
                this.titleModal = "Filtar Pelo ID do Produto";
                this.modelProdFilter = new ProdFilter();
                this.modelProdFilter.productId = this.model.productId;
                this.CreateFormProduct();
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
            default:
                this.model.arguments = [];
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
                this.model.arguments.push(model);
            }
        }
    }

    onDefRemoveFilter(row: FilterDto) {
        let newModelFilter: FilterDto[] = [];
        this.model.arguments.forEach((r) => {
            if (r.argument != row.argument && r.type != row.type) {
                newModelFilter.push(r);
            }
        });
        this.model.arguments = newModelFilter;
    }

    onSubmit() {
        switch (this.data.column) {
            case 'productId':
                let model: ProdFilter = Object.assign(
                    this.modelProdFilter,
                    this.prodForm.getRawValue()
                );

                if (model) {
                    this.model.productId = model.productId;
                }
                break;
        }
        this.dialogRef.close(this.model);
    }

    onClickSort(direction: string): void {
        this.model.sort.active = this.data.column;
        this.model.sort.direction = direction == 'a' ? 'asc' : 'desc';
        this.dialogRef.close(this.model);
    }

    CreateFormProduct() {
        this.formProd = [
            {
                fields: [
                    {
                        name: 'productId',
                        label: 'ID Produto BF',
                        placeholder: 'ID Produto (pode conter vários separados por ; - ponto e virgula ou Tatulação)',
                        value: 'productId',
                        textArea: true,
                        textAreaRows: 5,
                        size: 100,
                    }
                ],
                // marginTop: '2px',
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

export class ProdFilter {
    productId?: string | null;
}
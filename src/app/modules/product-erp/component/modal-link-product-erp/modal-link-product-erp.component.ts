import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GroupService } from '@app/service/https/group.service';
import { ProductErpService } from '@app/service/https/product-erp.service';
import { ProductsService } from '@app/service/https/products.service';
import { SubGroupService } from '@app/service/https/subgroup.service';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';
import { Product } from '@data/schema/products/product';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { Group } from '@data/schema/products/groups/group';
import { UnitOfMeasure } from '@data/schema/products/unit-of-measure/unit-of-measure';
import { ProductLinkErpDto } from '@data/dto/products/product-erp/product-link-erp.dto';
import { ReferencesMatch } from '@data/dto/products/product-erp/references-match.dto';
import { ProductErpMatchDto } from '@data/dto/products/product-erp/link/product-erp-match.dto';

@Component({
    selector: 'app-modal-link-product-erp',
    templateUrl: './modal-link-product-erp.component.html',
    styleUrls: ['./modal-link-product-erp.component.scss']
})
export class ModalLinkProductErpComponent implements OnInit {
    lstProds: ProductLinkErpDto[] = [];
    modelProduct: Product;
    modelReferences: ReferencesMatch = new ReferencesMatch();

    productForm: FormGroup;
    formProduct: FormRow[] = [];
    refsForm: FormGroup;
    formRefs: FormRow[] = [];

    subGrupos$: Observable<SubGroup[]>;
    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(
        public dialog: MatDialog,
        private _service: ProductErpService,
        private _produtos: ProductsService,
        private _grupos: GroupService,
        private _subgrupos: SubGroupService,
        private _unidades: UnitOfMeasureService,
        public dialogRef: MatDialogRef<ModalLinkProductErpComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductLinkErpDto[]
    ) { }

    ngOnInit(): void {
        this.lstProds = this.data;
        this.getProd(this.lstProds[0].productId);

        const ids = this.lstProds.map(p => p.productId);
        let sub = this._service.getAllReferences(ids).subscribe((ref) => {
            this.modelReferences = ref.data;
            this.createFormRefs();
            sub.unsubscribe();
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        if (!this.productForm.valid) {
            this.productForm.markAsPending();
            this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
        } else {
            this.modelProduct = Object.assign(
                new Product(),
                this.productForm.getRawValue()
            );

            this.modelReferences = Object.assign(
                new ReferencesMatch(),
                this.refsForm.getRawValue()
            );

            const ids = this.lstProds.map(p => p.productId);

            var modelMatch: ProductErpMatchDto = {
                productIds: ids,
                description: this.modelProduct.description,
                name: this.modelProduct.name,
                productReferences: this.modelReferences.references,
                subGroupId: this.modelProduct.subGroupId,
                unitOfMeasureId: this.modelProduct.unitOfMeasureId,
                productErpOrphans: null
            }

            let sub = this._service.CreateMatchErp(modelMatch).subscribe((result) => {
                if (result.succeeded) {
                    this.dialogRef.close(true);
                } else {
                    this.modalDialog.apresentaErro('Erro', result.message);
                }
                sub.unsubscribe();
            })
        }
    }

    onSelectedProd(productId: number) {
        this.getProd(productId);
    }

    getProd(productId: number) {
        this._produtos.get(productId).subscribe((produto) => {
            this.modelProduct = produto.data;
            this.modelProduct.groupId = produto.data.subGroup.group.groupId;
            this.createForm();
        });
    }

    createForm() {
        this.formProduct = [
            {
                fields: [
                    {
                        name: 'name',
                        label: 'Nome',
                        placeholder: 'Nome',
                        size: 100,
                        value: 'name',
                        required: true,
                        maxLength: 180,
                    },
                ],
            },
            {
                fields: [
                    {
                        name: 'description',
                        label: 'Descrição',
                        placeholder: 'Descrição',
                        size: 100,
                        textArea: true,
                        textAreaRows: 3,
                        value: 'description',
                        required: false,
                        maxLength: 500,
                    },
                ],
                marginTop: '10px',
            },
            {
                fields: [
                    {
                        name: 'groupId',
                        label: 'Categoria',
                        placeholder: 'Categoria',
                        size: 33,
                        value: 'groupId',
                        select: true,
                        required: false,
                        selectName: 'name',
                        useSearch: true,
                        list: this._grupos.getAll(),
                        options: [{ name: 'name', search: true, text: true }],
                        onChange: (value: Group) => {
                            if (value) {
                                this.subGrupos$ = this._subgrupos.getSelectAll(value.groupId);
                            } else {
                                this.subGrupos$ = new Observable<SubGroup[]>();
                            }
                            this.createForm();
                        },
                    },
                    {
                        name: 'subGroupId',
                        label: 'Sub Categoria',
                        placeholder: 'Sub Categoria',
                        size: 33,
                        value: 'subGroupId',
                        select: true,
                        required: true,
                        selectName: 'name',
                        useSearch: true,
                        list: this.subGrupos$,
                        options: [{ name: 'name', search: true, text: true }],
                        onChange: (value: SubGroup) => { },
                    },
                    {
                        name: 'unitOfMeasureId',
                        label: 'Unidade de Medida',
                        placeholder: 'Unidade de Medida',
                        size: 33,
                        value: 'unitOfMeasureId',
                        select: true,
                        required: true,
                        selectName: 'name',
                        useSearch: true,
                        list: this._unidades.getAll(),
                        options: [
                            { name: 'acronym', search: true, text: true },
                            { name: 'name', search: true, text: true },
                        ],
                        onChange: (value: UnitOfMeasure) => { },
                    },
                ],
                marginTop: '10px',
            },
        ];
    }

    createFormRefs() {
        this.formRefs = [
            {
                fields: [
                    {
                        name: 'references',
                        label: 'Referencias',
                        placeholder: 'Separe por ponto e virgula (;)',
                        size: 100,
                        textArea: true,
                        textAreaRows: 14,
                        value: 'references',
                        required: false,
                    },
                ],
            }
        ];
    }
}

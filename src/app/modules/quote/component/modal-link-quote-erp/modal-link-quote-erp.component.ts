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
import { ReferencesMatch } from '@data/dto/products/product-erp/references-match.dto';
import { ProductErpMatchDto, ProductErpOrphansDto } from '@data/dto/products/product-erp/link/product-erp-match.dto';
import { QuoteErpHistoricDto } from '@data/dto/quote/quote-erp-historic.dto';

@Component({
    selector: 'app-modal-link-quote-erp',
    templateUrl: './modal-link-quote-erp.component.html',
    styleUrls: ['./modal-link-quote-erp.component.scss']
})
export class ModalLinkQuoteErpComponent implements OnInit {
    lstProds: QuoteErpHistoricDto[] = [];
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
        public dialogRef: MatDialogRef<ModalLinkQuoteErpComponent>,
        @Inject(MAT_DIALOG_DATA) public data: QuoteErpHistoricDto[]
    ) { }

    ngOnInit(): void {
        this.lstProds = this.data;
        const ids = this.data.filter((x) => { if (x.productId != null) return x; }).map(p => p.productId);
        if (ids) {
            this.getProd(this.data.find((x) => { return x.productId == ids[0]; }));
            let sub = this._service.getAllReferences(ids).subscribe((ref) => {
                this.modelReferences = ref.data;
                sub.unsubscribe();
            });
        } else {
            //habilitar search/prod
            this.getProd(this.data[0]);
        }
        this.createFormRefs();
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

            const ids = this.lstProds.filter((x) => x.productId > 0).map(p => p.productId);
            let orphans: ProductErpOrphansDto[] = this.lstProds.filter((x) => !x.productId).map((p) => {
                return {
                    companyCodeSac: p.companyCodeSac,
                    productErpCode: p.productErpCode
                };
            });

            var modelMatch: ProductErpMatchDto = {
                productIds: ids,
                description: this.modelProduct.description,
                name: this.modelProduct.name,
                productReferences: this.modelReferences.references,
                subGroupId: this.modelProduct.subGroupId,
                unitOfMeasureId: this.modelProduct.unitOfMeasureId,
                productErpOrphans: orphans
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

    onSelectedProd(prod: QuoteErpHistoricDto) {
        this.getProd(prod);
    }

    getProd(prod: QuoteErpHistoricDto) {
        if (prod.productId) {
            this._produtos.get(prod.productId).subscribe((produto) => {
                this.modelProduct = produto.data;
                this.modelProduct.groupId = produto.data.subGroup.group.groupId;
                this.createForm();
            });
        } else {
            let groupId = 1;
            let subGroupId = 1;
            let unitOfMeasureId = 20;
            if (this.modelProduct && this.modelProduct.groupId > 0) {
                groupId = this.modelProduct.groupId;
                subGroupId = this.modelProduct.subGroupId;
                unitOfMeasureId = this.modelProduct.unitOfMeasureId;
            }

            this.modelProduct = new Product();
            this.modelProduct.productId = 0;
            this.modelProduct.name = prod.productName;
            this.modelProduct.description = prod.productName;
            this.modelProduct.groupId = groupId;
            this.modelProduct.subGroupId = subGroupId;
            this.modelProduct.unitOfMeasureId = unitOfMeasureId;
            this.createForm();
        }
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

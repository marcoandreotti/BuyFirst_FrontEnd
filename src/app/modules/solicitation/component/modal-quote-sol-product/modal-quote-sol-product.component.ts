import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { QuoteSolProduct } from '@data/schema/quote/solicitation/quote-sol-product';
import { SubGroupService } from '@app/service/https/subgroup.service';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';
import { BrandService } from '@app/service/https/brand.service';
import { UnitOfMeasure } from '@data/schema/products/unit-of-measure/unit-of-measure';
import { ResponseSelectedDto } from '@data/dto/response-selected.dto';
import { Brand } from '@data/schema/products/brand/brand';
import { QuoteSolProductBrand } from '@data/schema/quote/solicitation/quote-sol-product-brand';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BrandFilteredDto } from '@data/dto/products/brands/brand-filtered.dto';
import { QuoteSolProductAddress } from '@data/schema/quote/solicitation/quote-sol-product-address';
import { AddressService } from '@app/service/https/address.service';

@Component({
    selector: 'app-modal-quote-sol-product',
    templateUrl: './modal-quote-sol-product.component.html',
    styleUrls: ['./modal-quote-sol-product.component.scss'],
})
export class ModalSolProductComponent implements OnInit {
    model: QuoteSolProduct;
    prodForm: FormGroup;
    formProd: FormRow[] = [];

    groupSelectdText: string;
    unitOfMeasureAcronyn: string;

    listBrands: QuoteSolProductBrand[] = [];
    showBrandAdd: boolean = false;
    filteredBrands: Brand[] = [];
    brandSearchForm: FormGroup;
    isLoadingSearch: boolean = false;
    isValidSearchForm: boolean = true;

    addressForm: FormGroup;
    formAddressArray = new FormArray([]);
    listAddresses: QuoteSolProductAddress[] = [];

    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(
        private _brandService: BrandService,
        private _subGroupService: SubGroupService,
        private _unitOfMeasureService: UnitOfMeasureService,
        private _addressService: AddressService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalSolProductComponent>,
        public fb: FormBuilder,
        public httpClient: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: { prod: QuoteSolProduct, listAllAddresses: QuoteSolProductAddress[] }
    ) {
        this.model = data.prod;
        this.listBrands = data.prod.brands;
        this.listAddresses = data.listAllAddresses;
    }

    ngOnInit() {
        this.createForm();
        this.createFormAddresses();
        this.createBrandFormFiltered();
    }

    onSubmit() {

        let brandSearch: string = this.brandSearchForm.controls['brandSearchInput'].value;
        if (!this.listBrands || this.listBrands.length <= 0) {
            if (!brandSearch) {
                //// Todo: Deixar enviar nulla
                // this.modalDialog.apresentaErro('Erro', 'Preencha a marca');
                // return;
            } else {
                this.onAddBrand();
            }
        }

        if (!this.prodForm.valid) {
            this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
        } else {
            let m: QuoteSolProduct = Object.assign(
                new QuoteSolProduct(),
                this.prodForm.getRawValue()
            );

            this.model.groupSearch = this.groupSelectdText;
            this.model.subGroupId = m.subGroupId;
            this.model.unitOfMeasureAcronym = this.unitOfMeasureAcronyn;
            this.model.productSearch = m.productSearch;
            // this.model.deliveryAddresses = this.model?.deliveryAddresses ?? null;
            this.model.brands = this.listBrands;
            this.model.referenceCodeSearch = m.referenceCodeSearch;
            this.model.unitOfMeasureId = m.unitOfMeasureId;

            var addressesQtd = this.formAddressArray.value.filter((e) => e.quantity > 0);
            if (addressesQtd && addressesQtd.length > 0) {
                this.model.deliveryAddresses = addressesQtd;
                this.model.quantity = addressesQtd.reduce((sum, current) => sum + current.quantity, 0);
            } else {
                this.model.quantity = m.quantity;
                this.model.deliveryAddresses = null;
            }

            this.dialogRef.close(this.model);
        }
    }

    onSearchBrandAutocomplet(event) {
        var selectObj = event.option.value;

        if (!this.listBrands) this.listBrands = [];
        var idx = this.listBrands.findIndex((e) => { return e.brandId === selectObj.brandId; })

        if (idx < 0) {
            this.listBrands.push({
                quoteSolProductBrandId: 0,
                quoteSolProductId: 0,
                brandId: selectObj.brandId,
                brand: selectObj
            });
        }
        this.brandSearchForm.reset();
    }

    onAddBrand() {
        let brandSearch: string = this.brandSearchForm.controls['brandSearchInput'].value;
        if (!this.brandSearchForm.valid) {
            this.modalDialog.apresentaErro('Erro', 'Preencha a marca');
            return;
        } else {
            if (!this.listBrands) this.listBrands = [];
            this.listBrands.push({
                quoteSolProductBrandId: 0,
                quoteSolProductId: 0,
                brandId: 0,
                brand: {
                    brandId: 0,
                    name: brandSearch.toUpperCase(),
                    active: true
                }
            });
            this.brandSearchForm.reset();
        }
    }

    onRemoveBrand(qBrand: QuoteSolProductBrand) {
        let newList: QuoteSolProductBrand[] = [];

        this.listBrands.filter(e => {
            if (e.brand.name != qBrand.brand.name)
                newList.push(e);
        });
        this.listBrands = newList;
    }

    createForm() {
        this.formProd = [
            {
                fields: [
                    {
                        name: 'productSearch',
                        label: 'Produto',
                        placeholder: 'Produto',
                        size: 100,
                        value: 'productSearch',
                        required: true,
                        maxLength: 255,
                    }
                ],
                marginTop: '5px',
            },
            {
                fields: [
                    {
                        name: 'subGroupId',
                        label: 'Categoria *',
                        placeholder: 'Categoria *',
                        size: 45,
                        value: 'id',
                        select: true,
                        selectName: 'value',
                        useSearch: true,
                        useRemove: true,
                        required: true,
                        list: this._subGroupService.GetAllSubGroupsConcatenate(),
                        options: [{ name: 'value', search: true, text: true }],
                        onChange: (value: ResponseSelectedDto) => {
                            if (value) this.groupSelectdText = value.value;
                        },
                    },
                    {
                        name: 'unitOfMeasureId',
                        label: 'Unidade de Medida *',
                        placeholder: 'Unidade de Medida *',
                        size: 20,
                        value: 'unitOfMeasureId',
                        select: true,
                        selectName: 'name',
                        useSearch: true,
                        useRemove: true,
                        required: true,
                        list: this._unitOfMeasureService.getAll(),
                        options: [
                            { name: 'acronym', search: true, text: true },
                            { name: 'name', search: true, text: true },
                        ],
                        onChange: (value: UnitOfMeasure) => {
                            if (value) this.unitOfMeasureAcronyn = value.acronym;
                        },
                    },
                    {
                        name: 'quantity',
                        label: 'Quantidade *',
                        placeholder: 'Quantidade desejada *',
                        size: 10,
                        value: 'quantity',
                        required: true,
                        number: true,
                        numberType: 'decimal',
                    },
                    {
                        name: 'referenceCodeSearch',
                        label: 'Código de referência',
                        placeholder: '(Opcional) Código de referência do mercado',
                        size: 20,
                        value: 'referenceCodeSearch',
                        maxLength: 150,
                    }
                ],
                marginTop: '5px',
            },
        ];

    }

    createFormAddresses() {
        this.listAddresses.forEach((e) => {
            const form = this.fb.group({
                quoteSolProductAddressId: [e.quoteSolProductAddressId],
                quoteSolProductId: [e.quoteSolProductId],
                deliveryAddressId: [e.deliveryAddressId],
                concatAddress: [e.concatAddress],
                quantity: [e.quantity]
            });
            this.formAddressArray.push(form);
        });
        this.addressForm = new FormGroup({
            addresses: this.formAddressArray
        });
    }

    createBrandFormFiltered() {
        this.brandSearchForm = this.fb.group({
            brandSearchInput: null,
        });

        this.brandSearchForm
            .get('brandSearchInput')
            .valueChanges.pipe(
                debounceTime(500),
                tap(() => (this.isLoadingSearch = true)),
                switchMap((value) =>
                    this._brandService.getAll(value.toUpperCase(), true, 1, 300).pipe(
                        finalize(() => {
                            return (this.isLoadingSearch = false);
                        })
                    )
                )
            )
            .subscribe((brands) => {
                const valueInput = this.brandSearchForm.controls['brandSearchInput'].value.toUpperCase();
                this.showBrandAdd = (!brands.data || brands.data.length <= 0) || brands.data.findIndex(e => { return e.name.trim() === valueInput;}) < 0;
                this.filteredBrands = brands.data;
            });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    brandDisplayFn(entity: BrandFilteredDto) {
        if (entity) {
            return entity.name;
        }
    }

    getOptions() {
        return { align: 'rigth', prefix: ' ', suffix: '', thousands: '.', decimal: ',', precision: 2, allowNegative: false, max: (999999999999.99) };
    }

}
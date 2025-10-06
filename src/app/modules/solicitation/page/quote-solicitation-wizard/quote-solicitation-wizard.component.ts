import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@app/service/theme.service';
import { Login } from '@data/schema/login/login';
import { QuoteSolicitationService } from '@app/service/https/quote-solicitation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormRow } from '@shared/component/form/form';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { Address } from '@data/schema/persons/address';
import { QuoteSol } from '@data/schema/quote/solicitation/quote-sol';
import { QuoteSolProduct } from '@data/schema/quote/solicitation/quote-sol-product';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';
import { UnitOfMeasure } from '@data/schema/products/unit-of-measure/unit-of-measure';
import { SubGroupService } from '@app/service/https/subgroup.service';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { ResponseSelectedDto } from '@data/dto/response-selected.dto';
import { UploadSolProductsComponent } from '@modules/solicitation/component/upload-sol-products/upload-sol-products.component';
import { ProductFilteredDto, ProductSelectSearchDto } from '@data/dto/products/product-filtered.dto';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { ProductsService } from '@app/service/https/products.service';
import { AddressService } from '@app/service/https/address.service';
import { QuoteSolProductAddress } from '@data/schema/quote/solicitation/quote-sol-product-address';
import { ModalSolProductAddressesComponent } from '@modules/solicitation/component/modal-quote-sol-product-addresses/modal-quote-sol-product-addresses.component';
import { PaymentConditionService } from '@app/service/https/payment-condition.service';
import { Observable } from 'rxjs';
import { ModalQuoteSolPhaseComponent } from '@modules/solicitation/component/modal-quote-sool-phase-note/modal-quote-sool-phase-note.component';
import { BrandFilteredDto } from '@data/dto/products/brands/brand-filtered.dto';
import { Brand } from '@data/schema/products/brand/brand';
import { BrandService } from '@app/service/https/brand.service';
import { QuoteSolProductBrand } from '@data/schema/quote/solicitation/quote-sol-product-brand';
import { ModalSolProductComponent } from '@modules/solicitation/component/modal-quote-sol-product/modal-quote-sol-product.component';

@Component({
    selector: 'app-quote-solicitation-wizard',
    templateUrl: './quote-solicitation-wizard.component.html',
    styleUrls: ['./quote-solicitation-wizard.component.scss'],
})

export class QuoteSolicitationWizardComponent implements OnInit {
    auth: Login;
    isLoading: boolean = false;
    date: Date = new Date();

    editId: number = null;

    model: QuoteSol;
    modelSolProd: QuoteSolProduct;
    lstAllAddress: QuoteSolProductAddress[] = [];
    listSol: QuoteSolProduct[] = [];

    colsSol: GridColumn[];
    displayedColumnsSol: String[];
    itemMenusSol: GridItemMenu[];
    groupSelectdText: string;
    unitOfMeasureAcronyn: string;

    listAddress: Address[] = [];
    selectedAddress: Address;
    idxAddress: number = 0;

    listBrands: QuoteSolProductBrand[] = [];
    showBrandAdd: boolean = false;

    payments$: Observable<ResponseSelectedDto[]>;
    paymentSelectdText: string;

    quoteForm: FormGroup;
    formQuote: FormRow[] = [];

    solForm: FormGroup;
    formSol: FormRow[] = [];

    modalDialog = new DialogGenericoFuncoes(this.dialog);

    showExpanded: boolean = true;
    disabledSearch: boolean = true;

    filteredProducts: ProductSelectSearchDto[] = [];
    searchForm: FormGroup;

    filteredBrands: Brand[] = [];
    brandSearchForm: FormGroup;

    isLoadingSearch: boolean = false;
    isValidSearchForm: boolean = true;
    listProducts: ProductSelectSearchDto[] = [];

    canProcess: boolean = false;

    constructor(
        private _auth: AuthService,
        private dialog: MatDialog,
        private themeService: ThemeService,
        private _companyService: CompanyService,
        private _addressService: AddressService,
        private _brandService: BrandService,
        private _paymentSupplierService: PaymentConditionService,
        private _service: QuoteSolicitationService,
        private _subGroupService: SubGroupService,
        private _unitOfMeasureService: UnitOfMeasureService,
        private router: Router,
        private route: ActivatedRoute,
        public _productService: ProductsService,
        private fb: FormBuilder
    ) {
        this.auth = this._auth.getState();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute('solicitacoes');
        this.createFormFiltered();
        this.createBrandFormFiltered();

        this.route.paramMap.subscribe((params) => {
            this.editId = +params.get('id');

            if (this.editId > 0) {
                this._service.get(this.editId).subscribe((result) => {
                    if (result.succeeded) {
                        this.model = result.data;
                        this.listSol = result.data.products;
                        this.selectedAddress = result.data.deliveryAddress;
                        this.themeService.setTitle(`Editando Cotação nro: ${this.editId} de ${new Date(this.model.openingDate).toLocaleDateString()}`);

                        this.payments$ = this._paymentSupplierService.getSelectedPaymentCompany(result.data.buyerId, true);

                        if (new Date(this.model.expectedDate) < new Date()) {
                            this.model.expectedDate = this.getNextDate();
                            this.showExpanded = true;
                            this.canProcess = false;
                        } else {
                            this.showExpanded = false;
                            this.canProcess = true;
                        }

                        this.createForm();
                        this.createFormProductSol();
                        this.createGrid();
                        this.getInitialDeliveryAddresses();
                        this.searchAddresses(result.data.buyerId);
                    } else {
                        this.modalDialog.apresentaErro('Erro', result.message);
                    }
                });
            } else {
                this.themeService.setTitle(`Nova Cotação - Hoje ${this.date.toLocaleDateString()}`);
                this.payments$ = this._paymentSupplierService.getSelectedPaymentCompany(this.auth.companiesSelected[0].companyId, true);
                this.canProcess = false;

                this.newQuoteSol();
                this.createForm();
                this.createGrid();
            }
        });
    }

    onSearchAutocomplet(event) {
        var selectObj = event.option.value;

        var idx = this.listProducts.findIndex((e) => { return e.productId === selectObj.productId; })

        if (idx < 0) {
            this.modelSolProd.productSearch = selectObj.name.toUpperCase();
            this.modelSolProd.unitOfMeasureId = selectObj.unitOfMeasureId;
            this.modelSolProd.subGroupId = selectObj.subGProdroupId;

            this.modelSolProd.groupSearch = selectObj.groupSearch.toUpperCase();
            this.modelSolProd.unitOfMeasureAcronym = selectObj.unitOfMeasureAProdcronym.toUpperCase();

            if (selectObj.subGroupId > 1) {
                this.solForm.controls['subGroupId'].setValue(selectObj.subGroupId);
            }

            this.solForm.controls['unitOfMeasureId'].setValue(selectObj.unitOfMeasureId);
            this.createFormProductSol();
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

    onSubmitProduct() {
        let productSearch: string = this.searchForm.controls['searchInput'].value?.name ?? this.searchForm.controls['searchInput'].value;

        if (!this.searchForm.valid) {
            this.modalDialog.apresentaErro('Erro', 'Preencha o produto');
            return;
        }

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

        if (!this.solForm.valid) {
            this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
        } else {
            let m: QuoteSolProduct = Object.assign(
                new QuoteSolProduct(),
                this.solForm.getRawValue()
            );

            m.quoteSolId = this.editId;
            m.groupSearch = this.groupSelectdText.toUpperCase();
            m.unitOfMeasureAcronym = this.unitOfMeasureAcronyn.toUpperCase();
            m.productSearch = productSearch.toUpperCase();
            m.deliveryAddresses = this.modelSolProd?.deliveryAddresses ?? null;
            m.phase = 10;
            m.brands = this.listBrands;

            let existsItem = this.listSol.find(
                (e) => (e.groupSearch == m.groupSearch &&
                    e.productSearch == m.productSearch)
            );

            if (!existsItem) {
                this.listSol = [...this.listSol.concat(m)];
                if (this.listSol && this.listSol.length == 1 && this.selectedAddress) this.showExpanded = false;
            } else {
                existsItem.quantity = m.quantity;
                existsItem.referenceCodeSearch = m.referenceCodeSearch;
                existsItem.unitOfMeasureId = m.unitOfMeasureId;
                existsItem.deliveryAddresses = m.deliveryAddresses;
            }

            this.solForm.reset();
            if (this.modelSolProd) {
                this.modelSolProd.deliveryAddresses = null;
            }
            this.searchForm.reset();
            this.brandSearchForm.reset();
            this.listBrands = [];

            this.canProcess = false;
        }
    }

    onSubmitQuoteSol() {
        this.isLoading = true;
        if (!this.quoteForm.valid) {
            this.quoteForm.markAsPending();
            this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
            this.isLoading = false;
            return;
        }
        if (!this.listSol || this.listSol.length <= 0) {
            this.modalDialog.apresentaErro('Erro', 'É necessário inserir itens para cotação');
            this.isLoading = false;
            return;
        }

        if (this.existNoGroup()) {
            this.modalDialog.apresentaErro('Erro', 'Há produtos sem a definição da categoria.');
            this.isLoading = false;
            return;
        }

        let model: QuoteSol = Object.assign(
            new QuoteSol(),
            this.quoteForm.getRawValue()
        );

        if (new Date(this.model.expectedDate) < new Date()) {
            this.modalDialog.apresentaErro('Erro', 'Tempo para retorno menor que a data atual!');
            this.isLoading = false;
            return;
        }

        if (!this.editId) {
            this.model.buyerId = model.buyerId;
            this.model.expectedDate = model.expectedDate;
            this.model.quoteSolId = 0;
            this.model.deliveryAddressId = this.selectedAddress.addressId;
            this.model.deliveryAddress = this.selectedAddress;
            this.model.products = this.listSol;

            this._service.add(this.model).subscribe((result) => {
                if (result.succeeded) {
                    this.editId = result.data;
                    this.messagemSucesso(true);
                } else {
                    this.modalDialog.apresentaErro('Erro', result.message);
                    this.isLoading = false;
                }
            });
        } else {
            this.model.expectedDate = model.expectedDate;
            this.model.quoteSolId = this.editId;
            this.model.deliveryAddress = this.selectedAddress;
            this.model.products = this.listSol;

            this._service.save(this.model).subscribe((result) => {
                if (result.succeeded) {
                    this.messagemSucesso(false);
                } else {
                    this.isLoading = false;
                }
            });
        }
    }

    onProcessQuoteSol() {
        this._service.processingquotesolicitation(this.editId).subscribe((result) => {
            if (result.succeeded) {
                this.messagemProcessamentoSucesso();
            } else {
                this.isLoading = false;
            }
        });
    }

    onShowExpanded() {
        this.showExpanded = !this.showExpanded;
        if (this.showExpanded) {
            this.canProcess = false;
        }
    }

    onDelete(prod: QuoteSolProduct) {
        if (prod.quoteSolProductId > 0) {
            prod.phase = 999;
            let newList: QuoteSolProduct[] = [];
            this.listSol.forEach(e => {
                if (e.productSearch != prod.productSearch) {
                    newList.push(e);
                }
            });
            newList.push(prod);
            this.listSol = newList;
        } else {
            let newList: QuoteSolProduct[] = [];
            this.listSol.forEach(e => {
                if (e.productSearch != prod.productSearch) {
                    newList.push(e);
                }
            });
            this.listSol = newList;
        }
        this.canProcess = false;
    }

    onEdit(prod: QuoteSolProduct) {
        //Zerando as quantidades não setadas
        this.lstAllAddress.forEach((e) => {
            e.quantity = prod.deliveryAddresses?.find((x) => x.deliveryAddressId == e.deliveryAddressId)?.quantity ?? 0;
        });

        const dialogRef = this.dialog.open(ModalSolProductComponent, {
            data: { prod: prod, listAllAddresses: this.lstAllAddress },
        });

        dialogRef.afterClosed().subscribe((result: QuoteSolProduct) => {
            if (result) {
                let existsItem = this.listSol.find(
                    (e) => (e.groupSearch == prod.groupSearch && e.productSearch == prod.productSearch)
                );
                existsItem = result;

                this.canProcess = false;
            }
        });
    }

    onUndo(prod: QuoteSolProduct) {
        prod.phase = 10;
        prod.phaseNote = null;
        this.canProcess = false;
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
        this.formQuote = [
            {
                fields: [
                    {
                        name: 'buyerId',
                        label: 'Empresa *',
                        placeholder: 'Selecione a empresa *',
                        size: 60,
                        value: 'companyId',
                        select: true,
                        selectName: 'name',
                        useSearch: true,
                        required: true,
                        disabled: this.editId > 0 || (!this.auth.isBuyFirst && this.auth.companiesSelected.length == 1),
                        list: this._companyService.getListCompany(true),
                        options: [{ name: 'name', search: true, text: true }],
                        onChange: (value: CompanyDto) => {
                            if (value) {
                                if (this.model.buyerId != value.companyId) {
                                    this.model.buyerId = value.companyId;
                                    this.model.buyerName = value.name;

                                    this.payments$ = this._paymentSupplierService.getSelectedPaymentCompany(value.companyId, true);

                                    this.searchAddresses(value.companyId);
                                    this.newQuoteSolProduct();
                                    this.createFormProductSol();
                                }
                            } else {
                                this.model.buyerId = 0;
                                this.payments$ = new Observable<ResponseSelectedDto[]>();
                            }
                        },
                    },
                    {
                        name: 'paymentConditionSupplierId',
                        label: 'Condição de pagamento *',
                        placeholder: 'Condição de pagamento *',
                        size: 30,
                        value: 'id',
                        select: true,
                        selectName: 'value',
                        useSearch: true,
                        required: true,
                        list: this.payments$,
                        options: [{ name: 'value', search: true, text: true }],
                        onChange: (value: ResponseSelectedDto) => {
                            if (value) this.paymentSelectdText = value.value;
                        },
                    },
                    {
                        name: 'expectedDate',
                        label: 'Tempo limite para o retorno *',
                        placeholder: 'Defina a data limite para o retorno *',
                        size: 20,
                        value: 'expectedDate',
                        required: true,
                        date: true,
                        useHour: true,
                        disabled: (this.model && this.model.phase > 10),
                    },
                ],
                marginTop: '10px',
            },
            {
                fields: [
                    {
                        name: 'note',
                        label: 'Observações',
                        placeholder: 'Observações',
                        value: 'note',
                        textArea: true,
                        textAreaRows: 2,
                        size: 100,
                    }
                ]
            },
        ];
    }

    createFormProductSol() {
        this.formSol = [
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
                    },
                    // {
                    //     name: 'brandSearch',
                    //     label: 'Marca',
                    //     placeholder: '(Opcional) Marca preferida',
                    //     size: 20,
                    //     value: 'brandSearch',
                    //     maxLength: 150,
                    // },
                ],
                marginTop: '5px',
            },
        ];

    }

    createFormFiltered(text: string = null) {
        this.searchForm = this.fb.group({
            searchInput: text,
        });

        this.searchForm
            .get('searchInput')
            .valueChanges.pipe(
                debounceTime(500),
                tap(() => (this.isLoadingSearch = true)),
                switchMap((value) =>
                    this._productService.getFilteredSearch(value, this.disabledSearch).pipe(
                        finalize(() => {
                            return (this.isLoadingSearch = false);
                        })
                    )
                )
            )
            .subscribe((products) => {
                this.filteredProducts = products;
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
                this.showBrandAdd = (!brands.data || brands.data.length <= 0) || brands.data.findIndex(e => { return e.name.toUpperCase().trim() === valueInput; }) < 0;
                this.filteredBrands = brands.data;
            });
    }

    createGrid() {
        this.colsSol = [
            { name: 'groupSearch', title: 'Categoria', show: true },
            { name: 'productSearch', title: 'Produto', show: true },
            { name: 'quantity', title: 'Qtd', show: true, decimal: true },
            { name: 'referenceCodeSearch', title: 'Ref.', show: true },
            { name: 'brandSearch', title: 'Marca', show: true },
            { name: 'unitOfMeasureAcronym', title: 'UN.', show: true }
        ];
        this.displayedColumnsSol = [
            'groupSearch',
            'productSearch',
            'quantity',
            'referenceCodeSearch',
            'brandSearch',
            'unitOfMeasureAcronym'
        ];
        this.itemMenusSol = [
            {
                name: 'Excluir',
                icon: 'delete',
                action: (item: QuoteSolProduct) => {
                    let jsonComparer: string = null;
                    if (item.quoteSolProductId != undefined && item.quoteSolProductId > 0) {
                        let sub = this._service
                            .removeQuoteSolProduct(this.editId, item.quoteSolProductId)
                            .subscribe((result) => {
                                if (result.succeeded) {
                                    jsonComparer = JSON.stringify(item);

                                    let list: QuoteSolProduct[] = [];
                                    this.listSol.forEach((value, index) => {
                                        if (JSON.stringify(value) != jsonComparer) list.push(value);
                                    });
                                    this.listSol = list;

                                    // this.mensagemSucesso_Remove();
                                    sub.unsubscribe();
                                } else {
                                    console.log(result.message);
                                }
                            });
                    } else {
                        jsonComparer = JSON.stringify(item);

                        let list: QuoteSolProduct[] = [];
                        this.listSol.forEach((value, index) => {
                            if (JSON.stringify(value) != jsonComparer) list.push(value);
                        });
                        this.listSol = list;
                    }
                },
            },
        ];
    }

    searchAddresses(companyId: number) {
        let sub = this._companyService.GetDeliveryAddresses(companyId).subscribe((result) => {
            this.listAddress = result;
            if (result) {
                if (!this.editId) {
                    this.selectedAddress = result[this.idxAddress];

                    if (!this.listSol || this.listSol.length <= 0) {
                        this.newQuoteSolProduct();
                        this.createFormProductSol();
                        this.showExpanded = (this.auth.companiesSelected.length + result.length > 2);
                    }
                } else {
                    this.selectedAddress = result.find((e) => e.addressId === this.model.deliveryAddressId);
                }
            }

            sub.unsubscribe()
        });
    }

    stepAddresses(step: number) {
        if (step < 0 && this.idxAddress > 0 || step > 0 && this.listAddress && this.idxAddress < this.listAddress.length - 1) {
            this.idxAddress += step;
            this.selectedAddress = this.listAddress[this.idxAddress];
        }
    }

    newQuoteSol() {
        this.model = {
            quoteSolId: 0,
            buyerId: this.auth.companiesSelected[0].companyId,
            buyerName: this.auth.companiesSelected[0].document + ' - ' + this.auth.companiesSelected[0].name,
            paymentConditionSupplierId: 0,
            deliveryAddressId: 0,
            externalApplicationId: 0,
            externalCode: null,
            openingDate: new Date().toISOString(),
            note: null,
            expectedDate: this.getNextDate(),
            externalPhase: 0,
            phase: 0,
            products: [],
            deliveryAddress: null
        };

        this.payments$.subscribe(e => {
            this.model.paymentConditionSupplierId = e[0].id;
        });

        this.searchAddresses(this.model.buyerId);
        this.newQuoteSolProduct();
        this.createFormProductSol();
        this.getInitialDeliveryAddresses();
    }

    newQuoteSolProduct() {
        this.modelSolProd = {
            quoteSolProductId: 0,
            quoteSolId: this.editId,
            subGroupId: 0,
            productSearch: null,
            quantity: 0,
            referenceCodeSearch: null,
            brands: null,
            unitOfMeasureId: null,
            productRetries: [],
            groupSearch: null,
            unitOfMeasureAcronym: null,
            deliveryAddresses: null,
            phase: 10,
            phaseNote: null
        }
    }

    getNextDate(): string {
        let fator: number = 1;
        if (this.date.getDay() == 0 || this.date.getDay() >= 5) {
            fator += 2;
        }

        var dataResult = new Date(this.date.getTime() + (fator * 48 * 60 * 60 * 1000));

        // Menos Sabado e Domingo
        var weekDay = dataResult.getDay() + 1;
        if (weekDay == 0) { //Domingo
            dataResult = new Date(dataResult.getTime() + (fator * 24 * 60 * 60 * 1000));
        } else if (weekDay == 7) { //Sabado
            dataResult = new Date(dataResult.getTime() + (fator * 48 * 60 * 60 * 1000));
        }

        return dataResult.toISOString()
    }

    showModalUpload(): void {
        const dialogRef = this.dialog.open(UploadSolProductsComponent, {
            data: this.editId,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result) {
                    this.listSol = [...this.listSol.concat(result)];
                }
            }
        });
    }

    showModalAddresses() {
        this.modelSolProd = Object.assign(
            new QuoteSolProduct(),
            this.solForm.getRawValue()
        );

        //Zerando as quantidades não setadas
        this.lstAllAddress.forEach((e) => {
            e.quantity = this.modelSolProd.deliveryAddresses?.find((x) => x.deliveryAddressId == e.deliveryAddressId).quantity ?? 0;
        });

        const dialogRef = this.dialog.open(ModalSolProductAddressesComponent, {
            data: this.lstAllAddress,
        });

        dialogRef.afterClosed().subscribe((result: QuoteSolProductAddress[]) => {
            if (result) {
                var addressesQtd = result.filter((e) => e.quantity > 0);
                if (addressesQtd && addressesQtd.length > 0) {
                    if (addressesQtd.length == 1 && addressesQtd.find(e => e.deliveryAddressId === this.selectedAddress.addressId)) {
                        this.modelSolProd.deliveryAddresses = null;
                    } else {
                        this.modelSolProd.deliveryAddresses = addressesQtd;
                    }
                    this.modelSolProd.quantity = addressesQtd.reduce((sum, current) => sum + current.quantity, 0);
                    this.solForm.controls["quantity"].setValue(this.modelSolProd.quantity);
                }
            }
        });
    }

    getInitialDeliveryAddresses() {
        var sub = this._addressService.GetSelectedAccessAddresses(this.model.buyerId).subscribe((r) => {
            if (r) {
                this.lstAllAddress = [];
                r.forEach((e) => {
                    this.lstAllAddress.push({
                        quoteSolProductAddressId: 0,
                        quoteSolProductId: 0,
                        deliveryAddressId: e.id,
                        address: null,
                        quantity: 0,
                        concatAddress: e.value
                    });
                });
            }
            sub.unsubscribe();
        });
    }

    getImputNote(): string | any {
        return new Promise(resolve => {
            const dialogRef = this.dialog.open(ModalQuoteSolPhaseComponent);

            dialogRef.afterClosed().subscribe((result: string) => {
                if (result) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            });
        });
    }

    isMinorDate(expectedDate: Date): boolean {
        return new Date(expectedDate) < new Date()
    }

    existNoGroup() {
        var find = this.listSol.filter(
            (e) => (!e.groupSearch || e.groupSearch == '')
        );

        return find != null && find.length > 0;
    }

    messagemSucesso(isNew: boolean) {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            'Cotação salva com sucesso!',
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
                if (isNew) {
                    this.router.navigate([this.router.url + `/${this.editId}`]);
                } else {
                    this.ngOnInit();
                }

                this.isLoading = false;
            },
            null,
            'CONTINUAR'
        );
    }

    messagemProcessamentoSucesso() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            'Cotação processada com sucesso!',
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
                this.router.navigate([this.router.url.replace('solicitacao', 'cotacao')]);
                this.isLoading = false;
            },
            null,
            'CONTINUAR'
        );
    }

    displayFn(entity: ProductFilteredDto) {
        if (entity) {
            // return String(entity.productId) + ' - ' +  entity.name;
            return entity.name;
        }
    }

    brandDisplayFn(entity: BrandFilteredDto) {
        if (entity) {
            return entity.name;
        }
    }
}
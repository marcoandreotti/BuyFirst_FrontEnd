import { Component, Inject, OnInit } from '@angular/core';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProductsService } from '@app/service/https/products.service';
import { Product } from '@data/schema/products/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { ProductFilteredDto } from '@data/dto/products/product-filtered.dto';
import { ProductSupplierMatchDto } from '@data/dto/match/product-supplier-match.dto';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';

@Component({
    selector: 'app-match-search-product',
    templateUrl: './match-search-product.component.html',
    styleUrls: ['./match-search-product.component.scss'],
})
export class MatchSearchProductComponent implements OnInit {
    tagSearch: string = 'tag_match_search_product';
    modalDialog = new DialogGenericoFuncoes(this.dialog);
    model: ProductSupplierMatchDto;
    modelProduct: Product = new Product();
    listProducts: ProductFilteredDto[] = [];

    filteredProducts: ProductFilteredDto[] = [];
    searchForm: FormGroup;
    isLoading: boolean = false;
    isValidSearchForm: boolean = true;

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<MatchSearchProductComponent>,
        public _service: ProductsService,
        private _prodSupplierService: ProductSupplierService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: ProductSupplierMatchDto
    ) {
    }

    ngOnInit(): void {
        this.model = this.data;
        this.createFormFiltered();

        //Carregar match Automático
        this.getProductMatch();
    }

    onSearchAutocomplet(event) {
        var selectObj = event.option.value;
        console.log(selectObj);

        var idx = this.listProducts.findIndex((e) => { return e.productId === selectObj.productId; })

        if (idx < 0) {
            this.listProducts.push(selectObj);
        }

        this.searchForm.reset();
    }

    cancel(): void {
        this.dialogRef.close(false);
    }

    sendProduct(productId: number, name: string) {
        if (!this.modelProduct || this.modelProduct.productId != productId) {
            let modal = this.modalDialog.apresentaAvisoObs(
                'Aviso',
                `Tem certeza que deseja vincular?`,
                `Será vinculado o produto: ${name}!`,
                true,
                true,
                () => {
                    modal.close();
                },
                () => {
                    modal.close();
                    this._prodSupplierService.addLink(productId, this.model.productSupplierId).subscribe((result) => {
                        this.dialogRef.close(result.succeeded);
                    });
                },
                'NÃO',
                'SIM'
            );
        } else {
            this.modalDialog.apresentaErro('Aviso', 'Produto já selecionado!');
        }
    }

    //AUX
    createFormFiltered() {
        this.searchForm = this.fb.group({
            searchInput: null,
        });

        this.searchForm
            .get('searchInput')
            .valueChanges.pipe(
                debounceTime(500),
                tap(() => (this.isLoading = true)),
                switchMap((value) =>
                    this._service.getFiltered(value).pipe(
                        finalize(() => {
                            return (this.isLoading = false);
                        })
                    )
                )
            )
            .subscribe((products) => {
                this.filteredProducts = products;
            });
    }

    getProductMatch() {
        let sub = this._prodSupplierService
            .getFuzzyMatch(this.model.productSupplierId, 3, 3).subscribe((result) => {
                if (result && result.succeeded) {
                    let items: ProductFilteredDto[] = [];
                    result.data.forEach((e) => {
                        const item: ProductFilteredDto = {
                            productId: e.productId,
                            name: e.name,
                            groupName: e.groupName,
                            subGroupName: e.subGroupName,
                            unitOfMeasureAcronym: e.unitOfMeasureAcronym,
                            references: [e.referenceCode],
                        };
                        items.push(item);
                    });
                    this.listProducts = items;
                }
                sub.unsubscribe();
            });
    }

    displayFn(entity: ProductFilteredDto) {
        if (entity) {
            return String(entity.productId) + ' - ' +  entity.name;
        }
    }
}

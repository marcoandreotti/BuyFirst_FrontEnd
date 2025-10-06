import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductErpService } from '@app/service/https/product-erp.service';
import { ThemeService } from '@app/service/theme.service';
import { GroupProductsQuoteErpDto } from '@data/dto/products/product-erp/product-quote-erp.dto';
import { ProductTotalsGroupErpDto } from '@data/dto/products/product-erp/product-totals-group-erp.dto';
import { SupplierCatalogDto } from '@data/dto/products/product/supplier-catalog/supplier-catalog.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';

@Component({
    selector: 'app-product-erp-analysis',
    templateUrl: './product-erp-analysis.component.html',
    styleUrls: ['./product-erp-analysis.component.scss'],
})
export class ProductErpAnalysisComponent implements OnInit {
    productId: number;
    model: ProductTotalsGroupErpDto;

    lstProducts: GroupProductsQuoteErpDto[];
    lstSuppliers: SupplierCatalogDto[];

    rdoShowResult: string = '1';
    modalDialog = new DialogGenericoFuncoes(this.dialog);
    
    lastCompanyCodeSac: number = 0;
    isAppliedStyle: boolean = false;
    
    loadingProduct: boolean = true;
    loadingSupplier: boolean = true;

    constructor(private dialog: MatDialog,
        private _service: ProductErpService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);
        this.themeService.setTitle('Produto FindParts x Grupos/Compradores x Fornecedores/Catálogos');

        this.route.paramMap.subscribe((params) => {
            this.productId = +params.get('productId');
            if (this.productId > 0) {
                let sub = this._service.GetTotalsProductGroupErp(this.productId).subscribe((result) => {
                    if (result.succeeded) {
                        this.model = result.data;
                        
                        let subS = this._service.GetGroupProductsQuoteErp(this.productId).subscribe((res) => {
                            if (res.succeeded) {
                                this.lstProducts = res.data;
                                if (!res.data) this.rdoShowResult = '2';
                            } else {
                                this.modalDialog.apresentaErro('Erro', res.message);
                            }
                            subS.unsubscribe()
                            this.loadingProduct = false;
                        });

                        let subSu = this._service.GetSuppliersCatalogsByProductId(this.productId).subscribe((ress) => {
                            if (ress.succeeded) {
                                this.lstSuppliers = ress.data;
                            } else {
                                this.modalDialog.apresentaErro('Erro', ress.message);
                            }
                            subSu.unsubscribe()
                            this.loadingSupplier = false;
                        });
                    } else {
                        this.modalDialog.apresentaErro('Erro', result.message);
                    }
                    sub.unsubscribe();
                });
            } else {
                this.modalDialog.apresentaErro('Erro', "Não foi informado o Identificador do produto");
            }
        });
    }

    onOpenAnalysisGroup(companyCodeSac: number): string {
        return window.location.href.substring(0, window.location.href.indexOf('#')) + `#/compradores/analise/${companyCodeSac}`;
    }

    onExportDetailCsv(productId: number) {
        this._service.getDetailCsv(productId);
    }

    getCssGroup(companyCodeSac: number): boolean {
        if (companyCodeSac != this.lastCompanyCodeSac){
            if (!this.isAppliedStyle) {
                this.isAppliedStyle = true;
            }  else {
                this.isAppliedStyle = false;
            }
        }
        this.lastCompanyCodeSac = companyCodeSac;
        return this.isAppliedStyle;
    }

    radioButtonChange($event) {
        this.rdoShowResult = $event.value;
    }
    
}
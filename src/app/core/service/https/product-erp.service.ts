import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { ProductLinkErpDto } from '@data/dto/products/product-erp/product-link-erp.dto';
import { FilterProductLinkErp } from '@data/dto/products/product-erp/link/filter-product-link-erp';
import { FilterTypeDto } from '@data/dto/filter-type.dto';
import { map } from 'rxjs/operators';
import { ReferencesMatch } from '@data/dto/products/product-erp/references-match.dto';
import { ProductErpMatchDto } from '@data/dto/products/product-erp/link/product-erp-match.dto';
import { GroupProductsQuoteErpDto } from '@data/dto/products/product-erp/product-quote-erp.dto';
import { ProductTotalsGroupErpDto } from '@data/dto/products/product-erp/product-totals-group-erp.dto';
import { SupplierCatalogDto } from '@data/dto/products/product/supplier-catalog/supplier-catalog.dto';

@Injectable()
export class ProductErpService {

    constructor(private http: HttpClient) { }

    private urlBase = `${environment.serverUrl}/ProductLinkErp`;

    getAll(filter: FilterProductLinkErp): Observable<BfResponse<ProductLinkErpDto[]>> {
        let url = `${this.urlBase}/getall`;
        return this.http.post<BfResponse<ProductLinkErpDto[]>>(url, filter);
    }

    getAllReferences(ids: number[]): Observable<BfResponse<ReferencesMatch>> {
        let url = `${this.urlBase}/getallreferences`;
        return this.http.post<BfResponse<ReferencesMatch>>(url, { productIds: ids });
    }

    GetTotalsProductGroupErp(productId: number): Observable<BfResponse<ProductTotalsGroupErpDto>> {
        const url = `${this.urlBase}/gettotalsproductgrouperp/${productId}`;
        return this.http.get<BfResponse<ProductTotalsGroupErpDto>>(url);
    }

    GetGroupProductsQuoteErp(productId: number): Observable<BfResponse<GroupProductsQuoteErpDto[]>> {
        const url = `${this.urlBase}/getgroupproductsquoteerp/${productId}`;
        return this.http.get<BfResponse<GroupProductsQuoteErpDto[]>>(url);
    }

    GetSuppliersCatalogsByProductId(productId: number): Observable<BfResponse<SupplierCatalogDto[]>> {
        const url = `${this.urlBase}/getsupplierscatalogsbyproductid/${productId}`;
        return this.http.get<BfResponse<SupplierCatalogDto[]>>(url);
    }

    // GetDetail(productId): Observable<BfResponse<GroupErpDto[]>> {
    //     const url = `${this.urlBase}/getdetail?ProductId=${productId}`;
    //     return this.http.get<BfResponse<GroupErpDto[]>>(url);
    // }

    // getAnalysis(productId): Observable<BfResponse<ProductLinkErpDto>> {
    //     const url = `${this.urlBase}/getdetail?ProductId=${productId}`;
    //     return this.http.get<BfResponse<ProductLinkErpDto>>(url);
    // }

    getCsv(filter: FilterProductLinkErp): string | any {
        let url = `${this.urlBase}/getcsv`;

        this.http.post<BfResponse<string>>(url, filter).subscribe((res) => {
            const binaryString = window.atob(res.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            var fileURL = URL.createObjectURL(
                new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
            );

            const element = document.createElement('a');
            element.href = fileURL;
            element.download = `Produtos_ERP_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
            document.body.appendChild(element);
            element.click();
            element.remove();
        });
    }

    getDetailCsv(productId: number): string | any {
        let url = `${this.urlBase}/getdetailcsv`;

        this.http.post<BfResponse<string>>(url, {productId: productId}).subscribe((res) => {
            const binaryString = window.atob(res.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            var fileURL = URL.createObjectURL(
                new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
            );

            const element = document.createElement('a');
            element.href = fileURL;
            element.download = `Detalhe_Produto_ERP_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
            document.body.appendChild(element);
            element.click();
            element.remove();
        });
    }

    GetDetailCsv(productId: number): string | any {
        let url = `${this.urlBase}/getdetailcsv/${productId}`;

        this.http.get<BfResponse<string>>(url).subscribe((res) => {
            const binaryString = window.atob(res.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            var fileURL = URL.createObjectURL(
                new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
            );

            const element = document.createElement('a');
            element.href = fileURL;
            element.download = `Produtos_BF_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
            document.body.appendChild(element);
            element.click();
            element.remove();
        });
    }

    CreateMatchErp(model: ProductErpMatchDto): Observable<BfResponse<boolean>> {
        const url = `${this.urlBase}/creatematcherp`;
        return this.http.post<BfResponse<boolean>>(url, model);
      }
    
    // Aux
    getFilterTypeAll(): Observable<FilterTypeDto[]> {
        const url = `${this.urlBase}/get-filtertype`;
        return this.http.get<BfResponse<FilterTypeDto[]>>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs/Observable';
import { Product } from '@data/schema/products/product';
import { ProductReference } from '@data/schema/products/product-references/product-reference';
import { ProductWaitingQueueDto } from '@data/dto/products/product/product-waiting-queue.dto';
import { ProductFilteredDto, ProductSelectSearchDto } from '@data/dto/products/product-filtered.dto';
import { map } from 'rxjs/operators';
import { ProductAnalysisDto } from '@data/dto/products/analysis/product-analysis.dto';
import { FilterProductDto } from '@data/dto/products/product/filter-product.dto';
import { Subscriber } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/Product`;

  getAll(filter: FilterProductDto): Observable<BfResponse<ProductAnalysisDto[]>> {
    let url = `${this.urlBase}/getall`;
    return this.http.post<BfResponse<ProductAnalysisDto[]>>(url, filter);
  }

  getCsv(filter: FilterProductDto): string | any {
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
      element.download = `Produtos_BF_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  get(productId): Observable<BfResponse<Product>> {
    const url = `${this.urlBase}/${productId}`;
    return this.http.get<BfResponse<Product>>(url);
  }

  getFiltered(argument: string): Observable<ProductFilteredDto[]> {
    let url = `${this.urlBase}/getfiltered?argument=${argument}`;

    return this.http.get<BfResponse<ProductFilteredDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getFilteredSearch(argument: string, disabledSearch: boolean = false): Observable<ProductSelectSearchDto[]> {
    let url = `${this.urlBase}/getfilteredsearch?argument=${argument}`;

    if (disabledSearch) return new Observable<ProductSelectSearchDto[]>((subscriber: Subscriber<ProductSelectSearchDto[]>) => subscriber.next([]));

    return this.http.get<BfResponse<ProductSelectSearchDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  activeInactive(id: number) {
    const url = `${this.urlBase}/activeInactive/`;
    return this.http.post<BfResponse<any>>(url, { productId: id });
  }

  add(model: Product) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/deleteall`;
    return this.http.post<BfResponse<any>>(url, { ids: [id] });
  }

  deleteAll(ids: number[]) {
    const url = `${this.urlBase}/deleteall`;
    return this.http.post<BfResponse<any>>(url, { ids: ids });
  }

  save(model: Product) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  removeReference(
    productId: number,
    referenceCode: string
  ): Observable<BfResponse<ProductReference[]>> {
    const url = `${this.urlBase}/removeReference`;
    return this.http.post<BfResponse<ProductReference[]>>(url, {
      productId,
      referenceCode,
    });
  }

  getreferences(productId: number): Observable<BfResponse<ProductReference[]>> {
    const url = `${this.urlBase}/getreferences/${productId}`;
    return this.http.get<BfResponse<ProductReference[]>>(url);
  }

  uploadFile(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');

    const url = `${this.urlBase}/import`;
    return this.http.post<BfResponse<ProductWaitingQueueDto[]>>(url, formData, {
      headers,
      responseType: 'json',
      reportProgress: true,
      observe: 'events',
    });
  }
}

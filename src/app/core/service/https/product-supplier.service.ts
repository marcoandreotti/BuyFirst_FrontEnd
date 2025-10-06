import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs/Observable';
import { ProductSupplier } from '@data/schema/products/products-supplier/product-supplier';
import { ProductSupplierMatchDto } from '@data/dto/match/product-supplier-match.dto';
import { MatchLinkDto } from '@data/dto/match/match-link.dto';
import { ProductSupplierDto } from '@data/dto/products/product-supplier/product-supplier.dto';
import { map } from 'rxjs/operators';
import { ProductMatchDto, ProductSupplierAndProductMatchDto } from '@data/dto/match/product-match.dto';
import { ProductsAnalysisMatchDto } from '@data/dto/products/analysis/product-analysis-match.dto';
import { ProductSupplierWaitingQueueDto } from '@data/dto/products/product-supplier/product-supplier-waiting-queue.dto';
import { Sort } from '@angular/material/sort';
import { ProductSupplierFile } from '@data/schema/products/products-supplier/product-supplier-file';
import { element } from 'protractor';

@Injectable()
export class ProductSupplierService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/ProductSupplier`;
  private urlBaseFile = `${environment.serverUrl}/ProductSupplierFile`;

  getAll(
    active: boolean,
    argument: string,
    brandid: number | null,
    supplierid: number | null,
    referenceCode: string,
    pageNumber: number,
    pageSize: number,
    sort: Sort
  ): Observable<BfResponse<ProductSupplier[]>> {
    var url = `${this.urlBase}/getall?PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (argument && argument.length > 0) {
      url += `&Argument=${argument}`;
    }

    if (brandid && brandid > 0) {
      url += `&brandid=${brandid}`;
    }

    if (supplierid && supplierid > 0) {
      url += `&supplierid=${supplierid}`;
    }

    if (referenceCode && referenceCode.length > 0) {
      url += `&referenceCode=${referenceCode}`;
    }
    return this.http.get<BfResponse<ProductSupplier[]>>(url);
  }

  getProductsSupplierSelect(
    catalogId: number
  ): Observable<ProductSupplierDto[]> {
    const url = `${this.urlBase}/getproductsselectlink?catalogId=${catalogId}`;
    return this.http.get<BfResponse<ProductSupplierDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  get(productId): Observable<BfResponse<ProductSupplier>> {
    const url = `${this.urlBase}/${productId}`;
    return this.http.get<BfResponse<ProductSupplier>>(url);
  }

  activeInactive(id: number) {
    const url = `${this.urlBase}/activeInactive/`;
    return this.http.post<BfResponse<any>>(url, { productSupplierId: id });
  }

  add(model: ProductSupplier) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  save(model: ProductSupplier) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  //Match

  getNoMatch(
    companyId: number | null,
    argument: string | null,
    active: boolean | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<ProductSupplierMatchDto[]>> {
    var url = `${this.urlBase}/getnomatch?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (companyId) {
      url += `&companyId=${companyId}`;
    }

    if (argument) {
      url += `&argument=${argument}`;
    }

    if (active != null) {
      url += `&active=${active}`;
    }

    return this.http.get<BfResponse<ProductSupplierMatchDto[]>>(url);
  }

  getAnalysisMatch(
    companyId: number,
    productName: string | null,
    groupId: number | null,
    subGroupId: number | null,
    brandId: number | null,
    referenceCode: string | null,
    initialDate: Date | null,
    endDate: Date | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<ProductsAnalysisMatchDto[]>> {
    var url = `${this.urlBase}/getanalysismatch?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    if (companyId && companyId > 0) {
      url += `&CompanyId=${companyId}`;
    }

    if (productName && productName.length > 0) {
      url += `&ProductName=${productName}`;
    }

    if (groupId && groupId > 0) {
      url += `&GroupId=${groupId}`;
    }

    if (subGroupId && subGroupId > 0) {
      url += `&SubGroupId=${subGroupId}`;
    }

    if (brandId && brandId > 0) {
      url += `&BrandId=${brandId}`;
    }

    if (referenceCode && referenceCode.length > 0) {
      url += `&ReferenceCode=${referenceCode}`;
    }

    if (initialDate) {
      try {
        url += `&InitialDate=${initialDate.toISOString()}`;
      } catch {
        url += `&InitialDate=${initialDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&EndDate=${endDate.toISOString()}`;
      } catch {
        url += `&EndDate=${endDate}`;
      }
    }

    return this.http.get<BfResponse<ProductsAnalysisMatchDto[]>>(url);
  }

  getFuzzyMatch(
    productSupplierId: number,
    amountOfResults: number,
    type: number
  ): Observable<BfResponse<ProductMatchDto[]>> {
    var url = `${this.urlBase}/getfuzzymatch`;
    type--;

    const params = { productSupplierId, amountOfResults, type };
    return this.http.post<BfResponse<ProductMatchDto[]>>(url, params);
  }

  getFuzzyMatchList(
    productSupplierIds: number[],
    amountOfResults: number,
    type: number
  ): Observable<BfResponse<ProductSupplierAndProductMatchDto[]>> {
    var url = `${this.urlBase}/getfuzzymatchlist`;
    type--;

    const params = { productSupplierIds, amountOfResults, type };
    return this.http.post<BfResponse<ProductSupplierAndProductMatchDto[]>>(
      url,
      params
    );
  }

  executAutomaticMatch(companyId: number) {
    const url = `${this.urlBase}/executeautommatch`;
    return this.http.post<BfResponse<number>>(url, { companyId });
  }

  addLink(
    productId: number,
    productSupplierId: number
  ): Observable<BfResponse<any>> {
    var url = `${this.urlBase}/addlink`;

    const params = { productId, productSupplierId };
    return this.http.post<BfResponse<any>>(url, params);
  }

  addLinks(matchLinks: MatchLinkDto[]): Observable<BfResponse<any>> {
    var url = `${this.urlBase}/addlinks`;
    return this.http.post<BfResponse<any>>(url, matchLinks);
  }

  deleteLink(productSupplierLinkId: number) {
    var url = `${this.urlBase}/deletelink`;

    const params = { Id: productSupplierLinkId };
    return this.http.post<BfResponse<any>>(url, params);
  }

  active(ids: number[]): Observable<BfResponse<any>> {
    var url = `${this.urlBase}/active`;
    return this.http.put<BfResponse<any>>(url, {
      ids: ids,
      active: true,
      notes: null,
    });
  }

  inactive(ids: number[], notes: string): Observable<BfResponse<any>> {
    var url = `${this.urlBase}/active`;
    return this.http.put<BfResponse<any>>(url, {
      ids: ids,
      active: false,
      notes: notes,
    });
  }

  uploadFile(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');

    const url = `${this.urlBase}/import`;
    return this.http.post<BfResponse<ProductSupplierWaitingQueueDto[]>>(
      url,
      formData,
      {
        headers,
        responseType: 'json',
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  //Upload Files
  uploadFiles(formData: FormData): Observable<any> {
    const url = `${this.urlBaseFile}/uploadjpgfile`;
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');

    return this.http.post<BfResponse<any>>(
        url,
        formData,
        {
          headers,
          responseType: 'json',
          reportProgress: true,
          observe: 'events',
        }
      );
    }

    removeFiles(productSupplierFileId: number) {
      var url = `${this.urlBaseFile}/deletefile/${productSupplierFileId}`;
      return this.http.delete<BfResponse<any>>(url);
    }
  
}

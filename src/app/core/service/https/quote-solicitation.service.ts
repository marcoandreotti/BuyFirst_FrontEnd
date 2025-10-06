import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { QuoteSolicitationDto } from '@data/dto/quote/quote-sol/quote-solicitation.dto';
import { Sort } from '@angular/material/sort';
import { QuoteSol } from '@data/schema/quote/solicitation/quote-sol';
import { ProductSelectSearchDto } from '@data/dto/products/product-filtered.dto';
import { QuoteSolDto } from '@data/dto/quote/quote-sol/quote-sol.dto';
import { QuoteSolOrderDto } from '@data/dto/quote/quote-sol/quote-sol-order/quote-sol-order.dto';
import { QuoteSolProductDto } from '@data/dto/quote/quote-sol/quote-sol-product.dto';
import { SelectedEnumDto } from '@data/dto/quote/select-enum.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class QuoteSolicitationService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/QuoteSolicitation`;

  getAll(
    startDate: Date,
    endDate: Date,
    buyerId: number,
    quoteSolSituations: number[],
    openingDate: boolean,
    argument: string,
    pageNumber: number,
    pageSize: number,
    sort: Sort): Observable<BfResponse<QuoteSolicitationDto[]>> {
    var url = `${this.urlBase}/getall?PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}&openingDate=${openingDate}`;
    
    if (startDate) {
      try {
        url += `&startDate=${startDate.toISOString()}`;
      } catch {
        url += `&startDate=${startDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&endDate=${endDate.toISOString()}`;
      } catch {
        url += `&endDate=${endDate}`;
      }
    }

    if (argument && argument.length > 0) {
      url += `&Argument=${argument}`;
    }

    if (buyerId && buyerId > 0) {
      url += `&buyerId=${buyerId}`;
    }

    if (quoteSolSituations && quoteSolSituations.length > 0){
      quoteSolSituations.forEach(value => {
        url += `&quoteSolSituations=${value}`;
      });
    }

    return this.http.get<BfResponse<QuoteSolicitationDto[]>>(url);
  }

  get(id): Observable<BfResponse<QuoteSol>> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<BfResponse<QuoteSol>>(url);
  }

  add(model: QuoteSol) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: QuoteSol) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  //Products Wizard
  removeQuoteSolProduct(quoteSolId: number, quoteSolProductId: number) {
    const url = `${this.urlBase}/removequotesolproduct`;
    return this.http.post<BfResponse<any>>(url, { quoteSolId: quoteSolId, quoteSolProductId: quoteSolProductId });
  }

  //Products Wizard
  processingquotesolicitation(quoteSolId: number) {
    const url = `${this.urlBase}/processingquotesolicitation`;
    return this.http.post<BfResponse<any>>(url, { quoteSolId: quoteSolId });
  }

  consultingquotesolicitation(quoteSolId: number): Observable<BfResponse<QuoteSolDto>> {
    const url = `${this.urlBase}/consultingquotesolicitation`;
    return this.http.post<BfResponse<QuoteSolDto>>(url, { quoteSolId: quoteSolId });  
  }

  //Products Retry
  saveAdjusts(quoteSolId: number, quoteSolProducts: QuoteSolProductDto[]) {
    const url = `${this.urlBase}/saveadjusts`;
    return this.http.post<BfResponse<any>>(url, { quoteSolId: quoteSolId, quoteSolProducts: quoteSolProducts });
  }

  //Products Retry
  rebuildRanking(quoteSolId: number){
    const url = `${this.urlBase}/rebuildranking`;
    return this.http.post<BfResponse<any>>(url, {quoteSolId: quoteSolId});
  }

  //Products Retry
  interruptWait(quoteSolId: number){
    const url = `${this.urlBase}/interruptwait`;
    return this.http.post<BfResponse<any>>(url, {quoteSolId: quoteSolId});
  }

  uploadFile(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');

    const url = `${this.urlBase}/import`;
    return this.http.post<BfResponse<ProductSelectSearchDto[]>>(url, formData, {
      headers,
      responseType: 'json',
      reportProgress: true,
      observe: 'events',
    });
  }

  //Order
  getOrdersummary(quoteSolId: number): Observable<BfResponse<QuoteSolOrderDto>> {
    const url = `${this.urlBase}/ordersummary`;
    return this.http.post<BfResponse<QuoteSolOrderDto>>(url, { quoteSolId: quoteSolId });  
  }

  /////Enum = Situation
  getSituations(): Observable<SelectedEnumDto[]> {
    const url = `${this.urlBase}/getsituations`;
    return this.http.get<BfResponse<SelectedEnumDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}
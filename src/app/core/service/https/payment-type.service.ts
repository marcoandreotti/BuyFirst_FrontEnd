import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentType } from '@data/schema/payment-type/payment-type';

@Injectable()
export class PaymentTypeService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/PaymentType`;

  getSelectAll(paymentTypeId: number): Observable<PaymentType[]> {
    const url = `${this.urlBase}/${paymentTypeId}`;
    return this.http.get<BfResponse<PaymentType[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getAll(
    argument: string | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<PaymentType[]>> {
    let url = `${this.urlBase}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (argument) {
      url += `&argument=${argument}`;
    }

    return this.http.get<BfResponse<PaymentType[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get(paymentTypeId): Observable<BfResponse<PaymentType>> {
    const url = `${this.urlBase}/${paymentTypeId}`;
    return this.http.get<BfResponse<PaymentType>>(url);
  }

  activeInactive(id: number) {
    const url = `${this.urlBase}/activeInactive/`;
    return this.http.post<BfResponse<any>>(url, { id });
  }

  add(model: PaymentType) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  save(model: PaymentType) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }
}

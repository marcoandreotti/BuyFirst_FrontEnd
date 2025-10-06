import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { OrderSolicitationDto } from '@data/dto/order/order-sol/order-solicitation.dto';
import { OrderSolDto } from '@data/dto/order/order-sol/order-sol.dto';

@Injectable()
export class OrderSolicitationService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/OrderSolicitation`;

  getAll(
    startDate: Date,
    endDate: Date,
    buyerId: number,
    argument: string,
    pageNumber: number,
    pageSize: number,
    sort: Sort): Observable<BfResponse<OrderSolicitationDto[]>> {
    var url = `${this.urlBase}/getall?PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

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
      url += `&argument=${argument}`;
    }

    if (buyerId && buyerId > 0) {
      url += `&buyerId=${buyerId}`;
    }


    return this.http.get<BfResponse<OrderSolicitationDto[]>>(url);
  }

  get(id): Observable<BfResponse<OrderSolDto>> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<BfResponse<OrderSolDto>>(url);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  sendOrderSol(quoteSolId: number, billingAddressId: number, notes: string) {
    const url = `${this.urlBase}/sendordersol`;
    return this.http.post<BfResponse<boolean>>(url, { quoteSolId: quoteSolId, billingAddressId: billingAddressId, notes: notes });
  }

  confirmeddelivery(orderSolId: number) {
    const url = `${this.urlBase}/confirmeddelivery`;
    return this.http.post<BfResponse<boolean>>(url, { orderSolId: orderSolId });
  }

}
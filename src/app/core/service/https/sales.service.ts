import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs/Observable';
import { Order } from '@data/schema/orders/order-summary/order';
import { Sort } from '@angular/material/sort';
import { MyOrderDto } from '@data/dto/sales-force/my-order.dto';

@Injectable()
export class SalesService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/Order`;

  getLatestSales(pageNumber: number, pageSize: number) {
    const url = `${this.urlBase}/getmysales?PageNumber=${pageNumber}&PageSize=${pageSize}&IsHome=true`;
    return this.http.get<BfResponse<MyOrderDto[]>>(url);
  }

  getLatestPurchases(pageNumber: number, pageSize: number) {
    const url = `${this.urlBase}/getmyorders?PageNumber=${pageNumber}&PageSize=${pageSize}&IsHome=true`;
    return this.http.get<BfResponse<MyOrderDto[]>>(url);
  }

  getAllSellers(
    supplierId: number | null,
    argument: string,
    overallStatusId: number | null,
    orderId: number | null,
    initialDate: Date | null,
    endDate: Date | null,
    pageNumber: number,
    pageSize: number,
    sort: Sort,
    isHome: boolean = false
  ): Observable<BfResponse<MyOrderDto[]>> {
    var url = `${this.urlBase}/getmysales?PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (supplierId && supplierId > 0) {
      url += `&supplierId=${supplierId}`;
    }

    if (argument && argument.length > 0) {
      url += `&Argument=${argument}`;
    }

    if (overallStatusId && overallStatusId > 0) {
      url += `&overallStatusId=${overallStatusId}`;
    }

    url += `&isHome=${isHome}`;

    if (orderId && orderId > 0) {
      url += `&orderId=${orderId}`;
    }

    if (initialDate) {
      try {
        url += `&initialDate=${initialDate.toISOString()}`;
      } catch {
        url += `&initialDate=${initialDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&endDate=${endDate.toISOString()}`;
      } catch {
        url += `&endDate=${endDate}`;
      }
    }

    return this.http.get<BfResponse<MyOrderDto[]>>(url);
  }

  getAllPurchases(
    buyerId: number | null,
    argument: string,
    overallStatusId: number | null,
    orderId: number | null,
    initialDate: Date | null,
    endDate: Date | null,
    pageNumber: number,
    pageSize: number,
    sort: Sort,
    isHome: boolean = false
  ): Observable<BfResponse<MyOrderDto[]>> {
    var url = `${this.urlBase}/getmyorders?PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (buyerId && buyerId > 0) {
      url += `&supplierId=${buyerId}`;
    }

    if (argument && argument.length > 0) {
      url += `&Argument=${argument}`;
    }

    if (overallStatusId && overallStatusId > 0) {
      url += `&overallStatusId=${overallStatusId}`;
    }

    url += `&isHome=${isHome}`;

    if (orderId && orderId > 0) {
      url += `&orderId=${orderId}`;
    }

    if (initialDate) {
      try {
        url += `&initialDate=${initialDate.toISOString()}`;
      } catch {
        url += `&initialDate=${initialDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&endDate=${endDate.toISOString()}`;
      } catch {
        url += `&endDate=${endDate}`;
      }
    }

    return this.http.get<BfResponse<MyOrderDto[]>>(url);
  }

  getDetail(orderId: number): Observable<BfResponse<Order>> {
    const url = `${this.urlBase}/getsummary/${orderId}`;
    return this.http.get<BfResponse<Order>>(url);
  }

  printOrderPdf(orderId: number): string | any {
    const url = `${this.urlBase}/printorderconfirmation?OrderId=${orderId}`;
    this.http.get<BfResponse<string>>(url).subscribe((res) => {
      const binaryString = window.atob(res.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      var fileURL = URL.createObjectURL(
        new Blob([bytes], { type: 'application/pdf' })
      );
      
      window.open(fileURL, '_blank');
    });
  }
}

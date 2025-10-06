import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentCondition } from '@data/schema/payment-conditions/payment-condition';
import { MaturityDateTypeDto } from '@data/dto/payment-condition/maturity-date-type.dto';
import { PaymentTypeDto } from '@data/dto/payment-condition/payment-type.dto';
import { PaymentConditionSupplier } from '@data/schema/payment-conditions/payment-condition-supplier';
import { PaymentConditionCatalog } from '@data/schema/payment-conditions/payment-condition-catalog';
import { PaymentConditionDto } from '@data/dto/payment-condition/payment-condition.dto';
import { SpecialConditionSupplier } from '@data/schema/payment-conditions/special-condition-supplier';
import { SpecialConditionCatalog } from '@data/schema/payment-conditions/special-condition-catalog';
import { ResponseSelectedDto } from '@data/dto/response-selected.dto';

@Injectable()
export class PaymentConditionService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/payment`;
  private urlBasePaymentSupplier = `${environment.serverUrl}/PaymentConditionSupplier`;
  private urlBasePaymentCatalog = `${environment.serverUrl}/PaymentConditionCatalog`;
  private urlBaseSpecialConditionSupplier = `${environment.serverUrl}/SpecialConditionSupplier`;
  private urlBaseSpecialConditionCatalog = `${environment.serverUrl}/SpecialConditionCatalog`;

  getSelectAll(): Observable<PaymentCondition[]> {
    const url = `${this.urlBase}?pageNumber=1&pageSize=1000`;
    return this.http.get<BfResponse<PaymentCondition[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getAll(
    argument: string | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<PaymentCondition[]>> {
    let url = `${this.urlBase}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (argument) {
      url += `&argument=${argument}`;
    }

    return this.http.get<BfResponse<PaymentCondition[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get(paymentConditionId): Observable<BfResponse<PaymentCondition>> {
    const url = `${this.urlBase}/${paymentConditionId}`;
    return this.http.get<BfResponse<PaymentCondition>>(url);
  }

  activeInactive(id: number) {
    const url = `${this.urlBase}/active/`;
    return this.http.post<BfResponse<any>>(url, { id });
  }

  add(model: PaymentCondition) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  save(model: PaymentCondition) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  //Supplier
  activePaymentSupplier(id: number) {
    const url = `${this.urlBasePaymentSupplier}/active`;
    return this.http.post<BfResponse<any>>(url, { id });
  }

  addPaymentSupplier(model: PaymentConditionSupplier) {
    const url = `${this.urlBasePaymentSupplier}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  addSpecialConditionSupplier(model: SpecialConditionSupplier) {
    const url = `${this.urlBaseSpecialConditionSupplier}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  savePaymentSupplier(model: PaymentConditionSupplier) {
    const url = `${this.urlBasePaymentSupplier}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  deletePaymentSupplier(id: number) {
    const url = `${this.urlBasePaymentSupplier}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  deleteSpecialConditionSupplier(id: number) {
    const url = `${this.urlBaseSpecialConditionSupplier}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  getPaymentConditionSupplierAll(supplierId: number, isEcommerce: boolean = false) {
    const url = `${this.urlBasePaymentSupplier}?SupplierId=${supplierId}&IsEcommerce=${isEcommerce}`;
    return this.http.get<BfResponse<PaymentTypeDto[]>>(url);
  }

  getPaymentConditionSupplier(supplierId: number, paymentConditionid: number) {
    const url = `${this.urlBasePaymentSupplier}/getpaymentconditions?Id=${paymentConditionid}&SupplierId=${supplierId}`;
    return this.http.get<BfResponse<PaymentConditionDto>>(url);
  }

  //Selected
  getSelectedPaymentCompany(companyId: number, isEcommerce: boolean): Observable<ResponseSelectedDto[]> {
    let url = `${this.urlBasePaymentSupplier}/getselectedpaymentcompany?CompanyId=${companyId}&IsEcommerce=${isEcommerce}`;
    return this.http.get<BfResponse<ResponseSelectedDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  //Catalog
  activePaymentCatalog(id: number) {
    const url = `${this.urlBasePaymentCatalog}/active`;
    return this.http.post<BfResponse<any>>(url, { id });
  }

  addPaymentCatalog(model: PaymentConditionCatalog) {
    const url = `${this.urlBasePaymentCatalog}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  addSpecialConditionCatalog(model: SpecialConditionCatalog) {
    const url = `${this.urlBaseSpecialConditionCatalog}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  savePaymentCatalog(model: PaymentConditionCatalog) {
    const url = `${this.urlBasePaymentCatalog}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  deletePaymentCatalog(id: number) {
    const url = `${this.urlBasePaymentCatalog}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  deleteSpecialConditionCatalog(id: number) {
    const url = `${this.urlBaseSpecialConditionCatalog}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  getPaymentConditionCatalogAll(catalogId: number, isEcommerce: boolean = false) {
    const url = `${this.urlBasePaymentCatalog}?CatalogId=${catalogId}&IsEcommerce=${isEcommerce}`;
    return this.http.get<BfResponse<PaymentTypeDto[]>>(url);
  }

  getPaymentConditionCatalog(catalogId: number, paymentConditionid: number) {
    const url = `${this.urlBasePaymentCatalog}/getpaymentconditions?Id=${paymentConditionid}&CatalogId=${catalogId}`;
    return this.http.get<BfResponse<PaymentConditionDto>>(url);
  }

  // Aux
  getMaturityDateTypeAll(): Observable<MaturityDateTypeDto[]> {
    const url = `${this.urlBase}/get-maturitydatetypes`;
    return this.http.get<BfResponse<MaturityDateTypeDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}

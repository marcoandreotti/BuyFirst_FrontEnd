import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { Supplier } from '@data/schema/persons/companies/suppliers/supplier';
import { Sort } from '@angular/material/sort';

@Injectable()
export class SupplierService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/Supplier`;

  getAll(
    argument: string,
    pageNumber: number,
    pageSize: number,
    sort: Sort,
  ): Observable<BfResponse<Supplier[]>> {
    let url = `${this.urlBase}?pageNumber=${pageNumber}&pageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (argument) {
      url += `&argument=${argument}`;
    }

    return this.http.get<BfResponse<Supplier[]>>(url);
  }
  
  get(supplierId): Observable<BfResponse<Supplier>> {
    const url = `${this.urlBase}/${supplierId}`;
    return this.http.get<BfResponse<Supplier>>(url);
  }

  add(model: Supplier) {
    const url = `${this.urlBase}`;

    model.regionsIds = model.regions ? model.regions.map(r => r.regionId): null;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Supplier) {
    const url = `${this.urlBase}`;

    model.regionsIds = model.regions ? model.regions.map(r => r.regionId): null;
    return this.http.put<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }
  
  activeInactive(id: number) {
    const url = `${this.urlBase}/activeInactive/`;
    return this.http.post<BfResponse<any>>(url, { companyId: id });
  }

}

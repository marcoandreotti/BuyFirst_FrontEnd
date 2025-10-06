import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { Buyer } from '@data/schema/persons/companies/buyers/buyer';
import { Sort } from '@angular/material/sort';

@Injectable()
export class BuyerService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/Buyer`;

  getAll(
    argument: string,
    pageNumber: number,
    pageSize: number,
    sort: Sort,
  ): Observable<BfResponse<Buyer[]>> {
    let url = `${this.urlBase}?pageNumber=${pageNumber}&pageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (argument) {
      url += `&argument=${argument}`;
    }

    return this.http.get<BfResponse<Buyer[]>>(url);
  }

  get(buyerId): Observable<BfResponse<Buyer>> {
    const url = `${this.urlBase}/${buyerId}`;
    return this.http.get<BfResponse<Buyer>>(url);
  }

  add(model: Buyer) {
    const url = `${this.urlBase}`;

    model.regionsIds = model.regions ? model.regions.map(r => r.regionId) : null;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Buyer) {
    const url = `${this.urlBase}`;

    model.regionsIds = model.regions ? model.regions.map(r => r.regionId) : null;
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

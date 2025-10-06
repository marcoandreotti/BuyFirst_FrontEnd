import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Brand } from '@data/schema/products/brand/brand';


@Injectable()
export class BrandService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/Brand`;

  getSelecteddAll(): Observable<Brand[]> {
    const url = `${this.urlBase}/getselectedall`;
    return this.http.get<BfResponse<Brand[]>>(url).pipe(
      map(response => { return response.data })
    );
  }

  getAll(
    argument: string | null,
    active: boolean | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<Brand[]>> {
    let url = `${this.urlBase}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (argument) {
      url += `&argument=${argument}`;
    }
    if (active != null) {
      url += `&active=${active}`;
    }
    
    return this.http.get<BfResponse<Brand[]>>(url);
  }

  get(brandId): Observable<BfResponse<Brand>> {
    const url = `${this.urlBase}/${brandId}`;
    return this.http.get<BfResponse<Brand>>(url);
  }

  add(model: Brand) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Brand) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }
}

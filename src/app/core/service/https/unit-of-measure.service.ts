import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnitOfMeasure } from '@data/schema/products/unit-of-measure/unit-of-measure';

@Injectable()
export class UnitOfMeasureService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/UnitOfMeasure`;

  getAll(): Observable<UnitOfMeasure[]> {
    const url = `${this.urlBase}`;
    return this.http.get<BfResponse<UnitOfMeasure[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getUnitOfMeasureAll(
    argument: string | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<UnitOfMeasure[]>> {
    let url = `${this.urlBase}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (argument) {
      url += `&argument=${argument}`;
    }

    return this.http.get<BfResponse<UnitOfMeasure[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSelectAll(): Observable<UnitOfMeasure[]> {
    let url = `${this.urlBase}?pageNumber=1&pageSize=1000`;

    return this.http.get<BfResponse<UnitOfMeasure[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  get(unitOfMeasureId): Observable<BfResponse<UnitOfMeasure>> {
    const url = `${this.urlBase}/${unitOfMeasureId}`;
    return this.http.get<BfResponse<UnitOfMeasure>>(url);
  }

  add(model: UnitOfMeasure) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: UnitOfMeasure) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }
}

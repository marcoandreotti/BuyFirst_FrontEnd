import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Region } from '@data/schema/Regions/region';

@Injectable()
export class RegionService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/region`;

  getAll(
    argument: string | null,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<Region[]>> {
    let url = `${this.urlBase}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (argument) {
      url += `&argument=${argument}`;
    }

    return this.http.get<BfResponse<Region[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSelectAll(): Observable<Region[]> {
    let url = `${this.urlBase}?pageNumber=1&pageSize=1000`;

    return this.http.get<BfResponse<Region[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  get(regionId): Observable<BfResponse<Region>> {
    const url = `${this.urlBase}/${regionId}`;
    return this.http.get<BfResponse<Region>>(url);
  }

  add(model: Region) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Region) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  //Aux
  removeRegionTarget(companyId: number, regionId: number) {
    const url = `${this.urlBase}/removeregiontarget`;
    return this.http.post<BfResponse<any>>(url, { companyId, regionId });
  }
}

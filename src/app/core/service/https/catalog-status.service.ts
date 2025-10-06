import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Region } from '@data/schema/Regions/region';
import { CatalogStatus } from '@data/schema/Catalogs/catalog-status';

@Injectable()
export class CatalogStatusService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/catalogstatus`;

  getAll(
    catalogId: number
  ): Observable<BfResponse<CatalogStatus[]>> {
    let url = `${this.urlBase}?catalogId=${catalogId}`;

    return this.http.get<BfResponse<CatalogStatus[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  add(model: CatalogStatus) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

}

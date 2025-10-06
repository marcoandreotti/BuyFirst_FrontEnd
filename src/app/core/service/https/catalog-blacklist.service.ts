import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlackListDto } from '@data/dto/black-lists/black-list.dto';
import { CatalogBlackList } from '@data/schema/Catalogs/catalog-black-lists';

@Injectable()
export class CatalogBlackListService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/catalogblacklist`;

  getAll(catalogId: number): Observable<BfResponse<BlackListDto[]>> {
    let url = `${this.urlBase}?catalogId=${catalogId}`;

    return this.http.get<BfResponse<BlackListDto[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  add(model: CatalogBlackList) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }
}

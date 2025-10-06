import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlackList } from '@data/schema/black-lists/black-lists';
import { BlackListDto } from '@data/dto/black-lists/black-list.dto';

@Injectable()
export class BlackListService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/blacklist`;

  getAll(companyId: number): Observable<BfResponse<BlackListDto[]>> {
    let url = `${this.urlBase}?companyId=${companyId}`;

    return this.http.get<BfResponse<BlackListDto[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  add(model: BlackList) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }
}

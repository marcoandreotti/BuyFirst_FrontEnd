import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from '@data/schema/products/groups/group';


@Injectable()
export class GroupService {

  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/Group`;

  getAll(): Observable<Group[]> {
    const url = `${this.urlBase}`;
    return this.http.get<BfResponse<Group[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  get(groupId): Observable<BfResponse<Group>> {
    const url = `${this.urlBase}/${groupId}`;
    return this.http.get<BfResponse<Group>>(url);
  }

  add(model: Group) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Group) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

}

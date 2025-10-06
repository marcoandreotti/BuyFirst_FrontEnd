import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { ResponseSelectedDto } from '@data/dto/response-selected.dto';

@Injectable()
export class SubGroupService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/SubGroup`;

  getSelectAll(groupId: number): Observable<SubGroup[]> {
    const url = `${this.urlBase}/getall/${groupId}`;
    return this.http.get<BfResponse<SubGroup[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getAll(groupId: number): Observable<BfResponse<SubGroup[]>> {
    const url = `${this.urlBase}/getall/${groupId}`;
    return this.http.get<BfResponse<SubGroup[]>>(url);
  }

  get(groupId): Observable<BfResponse<SubGroup>> {
    const url = `${this.urlBase}/${groupId}`;
    return this.http.get<BfResponse<SubGroup>>(url);
  }

  add(model: SubGroup) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: SubGroup) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  //AUX
  GetAllSubGroupsConcatenate(): Observable<ResponseSelectedDto[]> {
    const url = `${this.urlBase}/getallsubgroupsconcatenate`;
    return this.http.get<BfResponse<ResponseSelectedDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
  
}

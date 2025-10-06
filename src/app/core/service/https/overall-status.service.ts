import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OverallStatus } from '@data/schema/overall-status/overall-status';
import { OverallStatusDto } from '@data/dto/overall-status/overall-status.dto';

@Injectable()
export class OverallStatusService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/overallstatus`;

  getAll(entityStatus: string): Observable<BfResponse<OverallStatus[]>> {
    let url = `${this.urlBase}?entityStatus=${entityStatus}`;

    return this.http.get<BfResponse<OverallStatus[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSelectAll(
    entityStatus: string,
    idException: number
  ): Observable<OverallStatusDto[]> {
    let url = `${this.urlBase}/getselectall?entityStatus=${entityStatus}`;

    url += `&idException=${idException}`;

    return this.http.get<BfResponse<OverallStatusDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}

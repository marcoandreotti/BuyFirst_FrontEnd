import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseSelectedDto } from '@data/dto/response-selected.dto';
import { BfResponse } from '@data/schema/response';

@Injectable()
export class AddressService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/Address`;

  GetSelectedAccessAddresses(companyId: number): Observable<ResponseSelectedDto[]> {
    let url = `${this.urlBase}/getselectedaccessdeliveryaddresses/${companyId}`;
    return this.http.get<BfResponse<ResponseSelectedDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}

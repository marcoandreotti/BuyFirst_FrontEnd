import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExternalApplicationDto } from '@data/dto/external-application/external-application.dto';
import { ExternalApplicationConfigDto } from '@data/dto/external-application/external-application-config.dto';

@Injectable()
export class ExternalApplicationService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}`;

  getAll(): Observable<ExternalApplicationDto[]> {
    const url = `${this.urlBase}/externalapplication/getall`;
    return this.http.get<BfResponse<ExternalApplicationDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  //99Kote
  getExternalConfig99Kote(): Observable<ExternalApplicationConfigDto[]> {
    const url = `${this.urlBase}/getgroups99kote`;
    return this.http.get<BfResponse<ExternalApplicationConfigDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}

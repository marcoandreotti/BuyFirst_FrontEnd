import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';

@Injectable()
export class BuyFirstService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/BuyFirst`;

  
}

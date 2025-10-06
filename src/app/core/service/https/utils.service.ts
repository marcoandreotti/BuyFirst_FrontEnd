import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UtilsService {
  constructor(private http: HttpClient) { }

  urlBase = `${environment.serverUrl}/utils`;



}

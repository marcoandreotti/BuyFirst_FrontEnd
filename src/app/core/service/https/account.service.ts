import { RoleDto } from './../../../data/dto/accounts/roles.dto';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Login } from '@data/schema/login/login';
import { Usuario } from '@data/schema/usuarios/usuarios';
import { map } from 'rxjs/operators';
import { ResetPassword } from '@data/dto/accounts/reset-password.dto';
import { UserDTO } from '@data/dto/accounts/user.dto';

@Injectable()
export class AccountService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/account`;

  logIn(email: string, password: string) {
    const url = `${this.urlBase}/authenticate`;
    return this.http.post<BfResponse<Login>>(url, { email, password });
  }

  getAll(
    argument: string,
    resultType: number,
    active: boolean,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<UserDTO[]>> | any {
    let url = `${this.urlBase}/get-all?&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (argument && argument.length > 0) {
      url += `&Argument=${argument}`;
    }
    if (resultType) {
      url += `&ResultType=${resultType}`;
    }
    if (active != null) {
      url += `&active=${active}`;
    }

    return this.http.get<BfResponse<UserDTO[]>>(url);
  } 

  get(id: Number): Observable<BfResponse<Usuario>> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<BfResponse<Usuario>>(url);
  }

  getPersonUserData(id: Number): Observable<BfResponse<Usuario>> {
    const url = `${this.urlBase}/getPersonUserData`;
    return this.http.get<BfResponse<Usuario>>(url);
  }

  getRoles(): Observable<RoleDto[]> {
    const url = `${this.urlBase}/get-roles`;
    return this.http.get<BfResponse<RoleDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  register(model: Usuario) {
    const url = `${this.urlBase}/register`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Usuario) {
    const url = `${this.urlBase}/update`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  //
  savePersonalData(model: Usuario) {
    const url = `${this.urlBase}/updatePersonalData`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  activeInactive(id: number) {
    const url = `${this.urlBase}/activeInactive/${id}`;
    return this.http.post<BfResponse<any>>(url, { id });
  }

  // delete(id: number) {
  //   const url = `${this.urlBase}/${id}`;
  //   return this.http.delete<BfResponse<any>>(url);
  // }

  forgotPassword(email: string) {
    const url = `${this.urlBase}/forgot-password`;
    return this.http.post<BfResponse<any>>(url, { email: email });
  }

  resetPassword(model: ResetPassword) {
    const url = `${this.urlBase}/reset-password`;
    return this.http.post<BfResponse<any>>(url, model);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { AuthService } from '../auth.service';
import { Login } from '@data/schema/login/login';
import { CompanyCodeSacDto } from '@data/dto/companies/erp/company-code-sac.dto';
import { QuoteErpHistoricAnalytical } from '@data/dto/quote/quote-erp-historic-analytical.dto';
import { AddressDto } from '@data/dto/persons/address.dto';
import { Address } from '@data/schema/persons/address';
import { CompanyConfig99KDto } from '@data/dto/companies/company-config-99k.dto';

@Injectable()
export class CompanyService {
  auth: Login;

  constructor(private _auth: AuthService, private http: HttpClient) {
    this.auth = this._auth.getState();
  }

  private urlBase = `${environment.serverUrl}/Company`;
  private urlBaseAddress = `${environment.serverUrl}/Address`;

  getAll(): Observable<CompanyDto[]> {
    const url = `${this.urlBase}/getall`;
    return this.http.get<BfResponse<CompanyDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getFiltered(argument: string, type: number | null): Observable<CompanyDto[]> {
    let url = `${this.urlBase}/getfiltered?argument=${argument}`;

    if (type) {
      url += `&type=${type}`;
    }

    return this.http.get<BfResponse<CompanyDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getListCompany(onlySuppliers: boolean = false): Observable<CompanyDto[]> {
    const url = `${this.urlBase}/getlistcompanies?onlySuppliers=${onlySuppliers}`;
    return this.http.get<BfResponse<CompanyDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  //Erp
  getAllCompaniesByCodeSac(compnayCodeSac: number): Observable<CompanyCodeSacDto> {
    const url = `${this.urlBase}/getallcompaniesbycodesac/${compnayCodeSac}`;
    return this.http.get<BfResponse<CompanyCodeSacDto>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  //CompanyCodeSac - Update
  updateComanyCodeSac(ids: number[], companyCodeSac: number) {
    const url = `${this.urlBase}/updatecodesac`;
    return this.http.post<BfResponse<any>>(url, { ids: ids, companyCodeSac: companyCodeSac });
  }

  //Addresses
  GetDeliveryAddresses(companyId: number): Observable<Address[]> {
    const url = `${this.urlBaseAddress}/getdeliveryaddresses/${companyId}`;
    return this.http.get<BfResponse<Address[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  GetBillingAddresses(companyId: number): Observable<Address[]> {
    const url = `${this.urlBaseAddress}/getbillingaddresses/${companyId}`;
    return this.http.get<BfResponse<Address[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  //Configs - Update
  saveCompanyConfig99K(configModel: CompanyConfig99KDto) {
    const url = `${this.urlBase}/savecompanyconfig99k`;
    return this.http.post<BfResponse<any>>(url, configModel);
  }

}

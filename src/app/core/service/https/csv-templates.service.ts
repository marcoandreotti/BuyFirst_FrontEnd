import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';

@Injectable()
export class CsvTemplatesService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/CsvTemplates`;

  getCsvExemple(
    csvTemplateType: number
  ): string | any {
    let url = `${this.urlBase}/getcsvtemplate?CsvTemplateType=${csvTemplateType}`;

    this.http.get<BfResponse<string>>(url).subscribe((res) => {
      const binaryString = window.atob(res.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      var fileURL = URL.createObjectURL(
        new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
      );

      const element = document.createElement('a');
      element.href = fileURL;
      element.download = `Exemplo_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }
}

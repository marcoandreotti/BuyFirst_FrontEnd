import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BfResponse } from '@data/schema/response';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { finalize } from 'rxjs/operators';
import { QuoteSolicitationService } from '@app/service/https/quote-solicitation.service';
import { ProductSelectSearchDto } from '@data/dto/products/product-filtered.dto';
import { CsvTemplatesService } from '@app/service/https/csv-templates.service';

@Component({
  selector: 'app-upload-sol-products',
  templateUrl: './upload-sol-products.component.html',
  styleUrls: ['./upload-sol-products.component.scss'],
})
export class UploadSolProductsComponent implements OnInit {
  uploadProgress = 0;
  selectedFile: File;
  uploading: boolean = false;
  withProductBF: boolean = true;
  validate: boolean = true;
  errorMsg = '';
  quoteSolId: number;
  response: BfResponse<boolean> | any;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  listProducts: ProductSelectSearchDto[] | any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public _csvTemplateService: CsvTemplatesService,
    public dialogRef: MatDialogRef<UploadSolProductsComponent>,
    private _service: QuoteSolicitationService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.quoteSolId = data;
  }

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close();
  }

  chooseFile(files: FileList) {
    this.selectedFile = null;
    this.errorMsg = '';
    this.uploadProgress = 0;
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files.item(0);
  }

  upload() {
    if (!this.selectedFile) {
      this.errorMsg = 'Escolha um arquivo.';
      return;
    }
    this.uploading = true;

    let formData: FormData = new FormData();
    formData.append('formFile', this.selectedFile, this.selectedFile.name);
    formData.append('quoteSolId', this.quoteSolId.toString());

    this._service
      .uploadFile(formData)
      .pipe(
        finalize(() => {
          this.uploading = false;
          this.selectedFile = null;
        })
      )
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            this.response = event.body;
            this.listProducts = event.body.data;
            if (this.listProducts && this.listProducts.length > 0)
            {
              this.dialogRef.close(this.listProducts);
            } else {
              this.messagemSucesso();
            }
          }
        },
        (error) => {
          this.errorMsg = error.message;
        }
      );
  }

  onExporteTemplate() {
    this._csvTemplateService.getCsvExemple(3);
  }

  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Produtos importados com sucesso!',
      false,
      true,
      null,
      () => {
        this.selectedFile;
        this.uploading = false;
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }

  humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
    );

    return bytes.toFixed(dp) + ' ' + units[u];
  }
}

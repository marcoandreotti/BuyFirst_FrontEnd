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
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { ProductSupplierWaitingQueueDto } from '@data/dto/products/product-supplier/product-supplier-waiting-queue.dto';

@Component({
  selector: 'app-upload-supplier-product',
  templateUrl: './upload-supplier-product.component.html',
  styleUrls: ['./upload-supplier-product.component.scss'],
})
export class UploadProductSupplierComponent implements OnInit {
  uploadProgress = 0;
  selectedFile: File;
  uploading: boolean = false;
  withProductBF: boolean = true;
  validate: boolean = true;
  errorMsg = '';
  companyId: number;
  response: BfResponse<boolean> | any;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  productWaitingQueueResponse: ProductSupplierWaitingQueueDto[] | any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadProductSupplierComponent>,
    private _service: ProductSupplierService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.companyId = data;
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
    formData.append('companyId', this.companyId.toString());
    formData.append('withBF', this.withProductBF ? "true" : "false");
    formData.append('validate', this.validate ? "true" : "false");

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
            this.productWaitingQueueResponse = event.body.data;
            if (this.productWaitingQueueResponse && this.productWaitingQueueResponse.length > 0)
            {
              this.dialogRef.close(this.productWaitingQueueResponse);
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

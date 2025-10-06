import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BfResponse } from '@data/schema/response';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { finalize } from 'rxjs/operators';
import { ProductsService } from '@app/service/https/products.service';
import { ProductWaitingQueueDto } from '@data/dto/products/product/product-waiting-queue.dto';

@Component({
  selector: 'app-upload-bf-product',
  templateUrl: './upload-bf-product.component.html',
  styleUrls: ['./upload-bf-product.component.scss'],
})
export class UploadProductBfComponent implements OnInit {
  uploadProgress = 0;
  selectedFile: File;
  uploading: boolean = false;
  errorMsg = '';
  response: BfResponse<boolean> | any;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  productWaitingQueueResponse: ProductWaitingQueueDto[] | any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadProductBfComponent>,
    private _service: ProductsService
  ) {}

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

    this._service
      .uploadFile(formData)
      .pipe(
        finalize(() => {
          this.reset();
        })
      )
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            this.response = event.body.succeeded;
            this.productWaitingQueueResponse = event.body.data;
            this.messagemSucesso();
          }
        },
        (error) => {
          this.errorMsg = error.message;
        }
      );
  }

  cancelUpload() {
    this.reset();
  }

  reset() {
    this.uploading = false;
    this.selectedFile = null;
    this.uploadProgress = null;
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

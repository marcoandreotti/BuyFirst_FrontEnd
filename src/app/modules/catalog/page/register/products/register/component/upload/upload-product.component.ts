import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BfResponse } from '@data/schema/response';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { finalize } from 'rxjs/operators';
import { CatalogDto } from '@data/dto/catalogs/catalog.dto';

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss'],
})
export class UploadProductComponent implements OnInit {
  uploadProgress = 0;
  selectedFile: File;
  uploading: boolean = false;
  errorMsg = '';
  catalogId: number;
  response: BfResponse<boolean> | any;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  catalogResponse: CatalogDto | any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadProductComponent>,
    private _service: CatalogsService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.catalogId = data;
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
    formData.append('catalogId', this.catalogId.toString());

    let sub = this._service
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
            this.response = event.body.succeeded;
            this.catalogResponse = event.body.data;
            if (this.catalogResponse && (this.catalogResponse.waitingQueue && this.catalogResponse.waitingQueue.length > 0))
            {
              this.dialogRef.close(this.catalogResponse);
            } else {
              this.messagemSucesso();
            }

            this.messagemSucesso();
          }
          sub.unsubscribe();
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

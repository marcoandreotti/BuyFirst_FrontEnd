import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { OverallStatusService } from '@app/service/https/overall-status.service';
import { CatalogConfigRequestDto } from '@data/dto/catalogs/catalog-config-request.dto';
import { CatalogDto } from '@data/dto/catalogs/catalog.dto';
import { OverallStatusDto } from '@data/dto/overall-status/overall-status.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-modal-config',
  templateUrl: './modal-config.component.html',
  styleUrls: ['./modal-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCatalogConfigComponent implements OnInit {
  model: CatalogConfigRequestDto;
  configForm: FormGroup;
  editCatalogId: number = null;
  formConfig: FormRow[] = [];
  overallStatus$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalCatalogConfigComponent>,
    public _overallStatusService: OverallStatusService,
    public _catalogService: CatalogsService,
    @Inject(MAT_DIALOG_DATA) public data: CatalogDto
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.editCatalogId = this.data.catalogId;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (!this.configForm.valid) {
      this.configForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      this.model = Object.assign(
        new CatalogConfigRequestDto(),
        this.configForm.getRawValue()
      );
      this.model.catalogId = this.editCatalogId;
      let sub = this._catalogService.updatestatus(this.model).subscribe((response) => {
         if (response.succeeded){
            this.dialogRef.close(this.model);
         } else {
            console.log(response.message);
         }
         sub.unsubscribe();
      });
    }
  }

  createForm() {
    this.formConfig = [
      {
        fields: [
          {
            name: 'overallStatusId',
            label: 'Status',
            placeholder: 'Status',
            size: 50,
            value: 'overallStatusId',
            select: true,
            required: true,
            selectName: 'description',
            useSearch: true,
            list: this._overallStatusService.getSelectAll(
              'Catalog',
              this.data.overallStatusId
            ),
            options: [{ name: 'name', search: true, text: true }],
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'reason',
            label: 'Motivo',
            placeholder: 'Descriva o motivo',
            size: 100,
            value: 'reason',
            required: true,
            maxLength: 255,
          },
        ],
        marginTop: '10px',
      },
    ];
  }
}

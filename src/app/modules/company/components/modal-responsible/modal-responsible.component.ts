import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Responsible } from '@data/schema/persons/responsible';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-modal-responsible',
  templateUrl: './modal-responsible.component.html',
  styleUrls: ['./modal-responsible.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalResponsibleComponent implements OnInit {
  responsibleForm: FormGroup;
  editResponsibleId: number = null;
  formResponsible: FormRow[] = [];
  typesResponsible$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalResponsibleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Responsible
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.editResponsibleId = this.data.responsibleId;
    this.data.type = this.data.type;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveResponsible() {
    if (!this.responsibleForm.valid) {
      this.responsibleForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      this.data = Object.assign(
        new Responsible(),
        this.responsibleForm.getRawValue()
      );
      this.data.type = this.data.type;
      this.data.responsibleId = this.editResponsibleId;

      this.dialogRef.close(this.data);
    }
  }

  createForm() {
    this.typesResponsible$.next([
      { id: 1, description: 'Principal' },
      { id: 2, description: 'Comum' },
    ]);

    this.formResponsible = [
      {
        fields: [
          {
            name: 'type',
            label: 'Tipo de contato',
            placeholder: 'Tipo de contato',
            size: 50,
            value: 'id',
            required: true,
            select: true,
            selectName: 'description',
            list: this.typesResponsible$,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 100,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
      },
      {
        fields: [
          {
            name: 'email',
            label: 'E-mail',
            placeholder: 'E-mail',
            size: 50,
            value: 'email',
            required: true,
            maxLength: 100,
          },
          {
            name: 'cellphone',
            label: 'Celular',
            placeholder: 'Celular',
            size: 50,
            value: 'cellphone',
            required: true,
            mask: '(00)00000-0000',
            maxLength: 15,
          },
        ],
        marginTop: '10px',
      },
    ];
  }
}

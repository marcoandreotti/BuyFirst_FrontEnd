import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigMatchDto } from '@data/dto/match/config-match.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-modal-config',
  templateUrl: './modal-config.component.html',
  styleUrls: ['./modal-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalConfigComponent implements OnInit {
  configForm: FormGroup;
  modelConfig: ConfigMatchDto;
  formConfig: FormRow[] = [];
  typesMatch$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  tagStorageConfigMatch: string = 'config_match_storage';
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalConfigComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.modelConfig = this.getConfigMatch();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveConfigMatch() {
    if (!this.configForm.valid) {
      this.configForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: ConfigMatchDto = Object.assign(
        new ConfigMatchDto(),
        this.configForm.getRawValue()
      );

      localStorage.setItem(this.tagStorageConfigMatch, JSON.stringify(model));
      this.mensagemSucesso();
    }
  }

  getConfigMatch() {
    var data = localStorage.getItem(this.tagStorageConfigMatch);
    if (!data) {
      return { type: 1, amountOfResults: 3, totalRegister: 50, defaultNotes: 'Produto desativado pelo Administrador' };
    } else {
      return JSON.parse(data);
    }
  }

  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso!',
      'A configuração foi salva com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }

  createForm() {
    this.typesMatch$.next([
      { type: 1, description: 'Por Código de Referência' },
      { type: 2, description: 'Por Código Externo (ERP)' },
      { type: 3, description: 'Por Nome' },
    ]);

    this.formConfig = [
      {
        fields: [
          {
            name: 'type',
            label: 'Tipo de pesquisa',
            placeholder: 'Tipo de pesquisa',
            size: 100,
            value: 'type',
            select: true,
            selectName: 'description',
            required: true,
            useRemove: true,
            list: this.typesMatch$,
          },
        ],
      },
      {
        fields: [
          {
            name: 'amountOfResults',
            label: 'Quantidade de semelhanças',
            size: 100,
            value: 'amountOfResults',
            slider: true,
            slidermin: 3,
            slidermax: 10,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'totalRegister',
            label: 'Total de registros',
            size: 100,
            value: 'totalRegister',
            slider: true,
            sliderstep: 50,
            slidermin: 50,
            slidermax: 150,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'defaultNotes',
            label: 'Mensagem de inativação padrão',
            size: 255,
            value: 'defaultNotes',
          },
        ],
        marginTop: '10px',
      },
    ];
  }
}

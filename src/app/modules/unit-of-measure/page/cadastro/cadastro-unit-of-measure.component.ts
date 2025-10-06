import { UnitOfMeasure } from './../../../../data/schema/products/unit-of-measure/unit-of-measure';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';

@Component({
  selector: 'app-cadastro-unit-of-measure',
  templateUrl: './cadastro-unit-of-measure.component.html',
  styleUrls: ['./cadastro-unit-of-measure.component.scss'],
})
export class CadastroUnitOfMeasureComponent implements OnInit {
  editId: number = null;
  unitOfMeasureForm: FormGroup;
  formUnitOfMeasure: FormRow[] = [];
  model: UnitOfMeasure;
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _service: UnitOfMeasureService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('unidadesmedida');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.themeService.setTitle('Editando Unidade de Medida');
        this._service.get(this.editId).subscribe((unitofmeasure) => {
          if (unitofmeasure.succeeded) {
            this.model = unitofmeasure.data;
            this.createForm();
          } else {
            this.modalDialog.apresentaErro(
              'Erro',
              unitofmeasure.message
            );
          }
        });
      } else {
        this.themeService.setTitle('Nova Unidade de Medida');
        this.createForm();
      }
    });
  }

  save() {
     if (!this.unitOfMeasureForm.valid) {
      this.unitOfMeasureForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.editId) {
        let model: UnitOfMeasure = Object.assign(
          new UnitOfMeasure(),
          this.unitOfMeasureForm.getRawValue()
        );

        model.active = true;

        this._service.add(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      } else {
        let model: UnitOfMeasure = Object.assign(this.model, this.unitOfMeasureForm.getRawValue());
        model.active = true;
        this._service.save(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      }
    }
  }

  createForm() {
    this.formUnitOfMeasure = [
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 40,
            value: 'name',
            required: true,
            maxLength: 20,
          },
          {
            name: 'acronym',
            label: 'Und. de Medida',
            placeholder: 'Und. de Medida',
            size: 20,
            value: 'acronym',
            required: true,
            maxLength: 5,
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Unidade de Medida ' +
        (this.editId ? 'alterado' : 'cadastrado') +
        ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('unidadesmedida');
      },
      null,
      'CONTINUAR'
    );
  }
}

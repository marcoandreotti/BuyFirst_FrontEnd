import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RegionService } from '@app/service/https/region.serice';
import { ThemeService } from '@app/service/theme.service';
import { Region } from '@data/schema/Regions/region';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
  selector: 'app-region-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegionRegisterComponent implements OnInit {
  editId: number = null;
  regionForm: FormGroup;
  formRegion: FormRow[] = [];
  model: Region;
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _service: RegionService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('regioes');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.themeService.setTitle('Editando Região');
        this._service.get(this.editId).subscribe((region) => {
          if (region.succeeded) {
            this.model = region.data;
            this.createForm();
          } else {
            this.modalDialog.apresentaErro('Erro', region.message);
          }
        });
      } else {
        this.themeService.setTitle('Nova Região');
        this.createForm();
      }
    });
  }

  save() {
    if (!this.regionForm.valid) {
      this.regionForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.editId) {
        let model: Region = Object.assign(
          new Region(),
          this.regionForm.getRawValue()
        );
        model.composition = 'Todas as localidades';
        model.compositionType = 2;
        model.active = true;

        this._service.add(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      } else {
        let model: Region = Object.assign(
          this.model,
          this.regionForm.getRawValue()
        );
        model.composition = 'Todas as localidades';
        model.compositionType = 2;
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
    this.formRegion = [
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 40,
            value: 'name',
            required: true,
            maxLength: 50,
          },
          {
            name: 'stateAcronym',
            label: 'UF',
            placeholder: 'UF',
            size: 10,
            value: 'stateAcronym',
            required: true,
            maxLength: 2,
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Fornecedor ' +
        (this.editId ? 'alterado' : 'cadastrado') +
        ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('regioes');
      },
      null,
      'CONTINUAR'
    );
  }
}

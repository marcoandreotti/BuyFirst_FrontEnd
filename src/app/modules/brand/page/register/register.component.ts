import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';
import { Brand } from '@data/schema/products/brand/brand';
import { BrandService } from '@app/service/https/brand.service';

@Component({
  selector: 'app-brand-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class BrandRegisterComponent implements OnInit {
  editId: number = null;
  brandForm: FormGroup;
  formBrand: FormRow[] = [];
  model: Brand;
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _service: BrandService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('marcas');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.themeService.setTitle('Editando Marca');
        this._service.get(this.editId).subscribe((brand) => {
          if (brand.succeeded) {
            this.model = brand.data;
            this.createForm();
          } else {
            this.modalDialog.apresentaErro('Erro', brand.message);
          }
        });
      } else {
        this.themeService.setTitle('Nova Marca');
        this.createForm();
      }
    });
  }

  save() {
    if (!this.brandForm.valid) {
      this.brandForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.editId) {
        let model: Brand = Object.assign(
          new Brand(),
          this.brandForm.getRawValue()
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
        let model: Brand = Object.assign(
          this.model,
          this.brandForm.getRawValue()
        );
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
    this.formBrand = [
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
        ],
        marginTop: '10px',
      },
    ];
  }

  mensagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Marca ' + (this.editId ? 'alterado' : 'cadastrado') + ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('marcas');
      },
      null,
      'CONTINUAR'
    );
  }
}

import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogGenericoFuncoes } from '../../../../shared/component/dialog-generico/dialog-generico.funcoes';
import { AuthService } from '@app/service/auth.service';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { ProductsService } from '@app/service/https/products.service';
import { GroupService } from '@app/service/https/group.service';
import { SubGroupService } from '@app/service/https/subgroup.service';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { Group } from '@data/schema/products/groups/group';
import { UnitOfMeasure } from '@data/schema/products/unit-of-measure/unit-of-measure';
import { Product } from '@data/schema/products/product';
import { ProductReference } from '@data/schema/products/product-references/product-reference';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';

@Component({
  selector: 'app-product-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class ProductRegisterComponent {
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  model: Product;
  modelRefence: ProductReference = new ProductReference();
  editId: number = null;
  productForm: FormGroup;
  form: FormRow[] = [];
  productFormReference: FormGroup;
  formReference: FormRow[] = [];
  subGrupos$: Observable<SubGroup[]>;
  rows: ProductReference[] = [];
  cols: GridColumn[] = [{ name: 'referenceCode', title: 'Código', show: true }];
  displayedColumns: String[] = ['referenceCode'];
  itemMenus: GridItemMenu[] = [
    {
      name: 'Excluir',
      icon: 'delete',
      action: (item: ProductReference) => {
        let referenceCode: string = null; 
        if (item.productReferenceId != undefined && item.productReferenceId > 0) {
          let sub = this._produtos
            .removeReference(this.editId, item.referenceCode)
            .subscribe((result) => {
              if (result.succeeded) {
                referenceCode = item.referenceCode;
                
                let list: ProductReference[] = [];
                this.rows.forEach((value, index) => {
                  if (value.referenceCode != referenceCode) list.push(value);
                });
                this.rows = list;
                
                this.mensagemSucesso_Remove();
                sub.unsubscribe();
              } else {
                console.log(result.message);
              }
            });
        } else {
          referenceCode = item.referenceCode;

          let list: ProductReference[] = [];
          this.rows.forEach((value, index) => {
            if (value.referenceCode != referenceCode) list.push(value);
          });
          this.rows = list;
        }
      },
    },
  ];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private themeService: ThemeService,
    private _produtos: ProductsService,
    private _grupos: GroupService,
    private _subgrupos: SubGroupService,
    private _unidades: UnitOfMeasureService
  ) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('produtos');

    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.themeService.setTitle('Editando Produto');
        this._produtos.get(this.editId).subscribe((produto) => {
          this.model = produto.data;
          this.model.groupId = produto.data.subGroup.group.groupId;
          this.rows = produto.data.productReferences;
        });
      } else {
        this.themeService.setTitle('Novo Produto');
      }
      this.createForm();
      this.createFormReference();
    });
  }

  createForm() {
    this.form = [
      {
        fields: [
          {
            name: 'name',
            label: 'Nome',
            placeholder: 'Nome',
            size: 100,
            value: 'name',
            required: true,
            maxLength: 180,
          },
        ],
      },
      {
        fields: [
          {
            name: 'description',
            label: 'Descrição',
            placeholder: 'Descrição',
            size: 100,
            textArea: true,
            textAreaRows: 4,
            value: 'description',
            required: false,
            maxLength: 500,
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'groupId',
            label: 'Categoria',
            placeholder: 'Categoria',
            size: 33,
            value: 'groupId',
            select: true,
            required: false,
            selectName: 'name',
            useSearch: true,
            list: this._grupos.getAll(),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: Group) => {
              if (value) {
                this.subGrupos$ = this._subgrupos.getSelectAll(value.groupId);
              } else {
                this.subGrupos$ = new Observable<SubGroup[]>();
              }
              this.createForm();
            },
          },
          {
            name: 'subGroupId',
            label: 'Sub Categoria',
            placeholder: 'Sub Categoria',
            size: 33,
            value: 'subGroupId',
            select: true,
            required: true,
            selectName: 'name',
            useSearch: true,
            list: this.subGrupos$,
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: SubGroup) => {},
          },
          {
            name: 'unitOfMeasureId',
            label: 'Unidade de Medida',
            placeholder: 'Unidade de Medida',
            size: 33,
            value: 'unitOfMeasureId',
            select: true,
            required: true,
            selectName: 'name',
            useSearch: true,
            list: this._unidades.getAll(),
            options: [
              { name: 'acronym', search: true, text: true },
              { name: 'name', search: true, text: true },
            ],
            onChange: (value: UnitOfMeasure) => {},
          },
        ],
        marginTop: '10px',
      },
    ];
  }

  createFormReference() {
    this.formReference = [
      {
        fields: [
          {
            name: 'referenceCode',
            label: 'Código Paralélo',
            placeholder: 'Código Paralélo',
            size: 80,
            value: 'referenceCode',
            required: true,
            maxLength: 50,
          },
        ],
        submit: true,
        submitText: 'Inserir',
        size: 20,
        marginTop: '40px',
      },
    ];
  }

  formReferenceSubmit() {
    if (!this.productFormReference.valid) {
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      let model: ProductReference = Object.assign(
        new ProductReference(),
        this.productFormReference.getRawValue()
      );

      if (model.referenceCode) {
        let existsReference = this.rows.find(
          (e) => e.referenceCode === model.referenceCode
        );
        if (!existsReference) {
          this.rows = [...this.rows.concat(model)];
          this.productFormReference.reset();
        } else {
          this.modalDialog.apresentaErro(
            'Erro',
            'Código paralélo já existente'
          );
        }
      }
    }
  }

  save() {
    if (!this.productForm.valid) {
      this.productForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (this.rows.length == 0) {
        this.modalDialog.apresentaErro(
          'Erro',
          'Preencha pelo menos um código paralélo'
        );
        return;
      }

      let model: Product = Object.assign(
        new Product(),
        this.productForm.getRawValue()
      );
      model.companyManagementId = this._auth.getState().companyId;
      model.referenceCodes = this.rows.map((v) => {
        return v.referenceCode;
      });

      if (!this.editId) {
        this._produtos.add(model).subscribe((result) => {
          this.messagemSucesso();
        });
      } else {
        model.productId = this.editId;
        this._produtos.save(model).subscribe((result) => {
          this.messagemSucesso();
        });
      }
    }
  }

  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Produto ' + (this.editId ? 'alterado' : 'cadastrado') + ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl('produtos');
      },
      null,
      'CONTINUAR'
    );
  }

  mensagemSucesso_Remove() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Referência removida com sucesso!`,
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
}

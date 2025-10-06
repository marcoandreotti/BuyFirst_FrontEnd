import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { CatalogProduct } from '@data/schema/Catalogs/catalog-product';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { NoteDto } from '@data/dto/note.dto';
import { SelectedEnumDto } from '@data/dto/quote/select-enum.dto';

@Component({
  selector: 'app-catalogos-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class CatalogProductRegisterComponent {
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  model: CatalogProduct;
  catalogId: number = null;
  editProductId: number = null;
  catalogProductForm: FormGroup;
  form: FormRow[] = [];
  routeState: any;

  productType: number = 0;
  modelNote: NoteDto;
  noteForm: FormGroup;
  formNote: FormRow[] = [];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private _service: CatalogsService,
    private _productSupplier: ProductSupplierService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.catalogId = +params.get('id');
      this.editProductId = +params.get('idProduct');
      this.themeService.setBackRoute(
        `catalogos/cadastro/${this.catalogId}/produtos`
      );

      if (this.editProductId > 0) {
        this.themeService.setTitle('Editando Catálogo Produto');

        this._service.getProduct(this.editProductId).subscribe((product) => {
          this.model = product.data;
          if (product.data.note) {
            this.modelNote = new NoteDto();
            this.modelNote.text = product.data.note;
          }
        });
      } else {
        this.themeService.setTitle('Novo Catálogo Produto');
        this.model = new CatalogProduct();
        this.model.type = 1;
      }

      this.createForm();
    });
  }

  save() {
    if (!this.catalogProductForm.valid) {
      this.catalogProductForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      this.model = Object.assign(
        new CatalogProduct(),
        this.catalogProductForm.getRawValue()
      );
      this.model.catalogId = this.catalogId;

      if (this.productType == 2 || this.productType == 3) {
        this.modelNote = Object.assign(
          new NoteDto(),
          this.noteForm.getRawValue()
        );
        this.model.note = this.modelNote.text;
      } else {
        this.model.note = null;
      }

      if (this.model.availableQuantity < this.model.salesMinimumQuantity) {
        this.modalDialog.apresentaErro('Erro', 'Quantidade mínima maior que o estque');
        return;
      }

      if (this.model.salesMinimumQuantity <= 0) {
        this.model.salesMinimumQuantity = 1;
      }
      this.model.salesMaximumQuantity = this.model.availableQuantity;

      if (!this.editProductId) {
        this._service.addProduct(this.model).subscribe((result) => {
          this.editProductId = result.data;
          this.messagemSucesso();
        });
      } else {
        this.model.catalogProductId = this.editProductId;
        this._service.saveProduct(this.model).subscribe((result) => {
          this.messagemSucesso();
        });
      }
    }
  }

  createForm() {
    this.form = [
      {
        fields: [
          {
            name: 'productSupplierLinkId',
            label: 'Produto',
            placeholder: 'Produto',
            size: 100,
            value: 'productSupplierLinkId',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: true,
            useRemove: this.editProductId == 0,
            disabled: this.editProductId > 0,
            list: this._productSupplier.getProductsSupplierSelect(
              this.catalogId
            ),
            options: [{ name: 'name', search: true, text: true }],
          },
        ],
      },
      {
        fields: [
          {
            name: 'deliveryTime',
            label: 'Dias para entrega',
            placeholder: 'Dias para entrega',
            size: 20,
            value: 'deliveryTime',
            required: true,
            number: true,
            numberType: 'inteiro',
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'availableQuantity',
            label: 'Quantidade',
            placeholder: 'Quantidade',
            size: 30,
            value: 'availableQuantity',
            required: true,
            number: true,
            numberType: 'decimal',
          },
          {
            name: 'salesMinimumQuantity',
            label: 'Quantidade mínima de venda',
            placeholder: 'Quantidade mínima de venda',
            size: 22,
            value: 'salesMinimumQuantity',
            required: false,
            number: true,
            numberType: 'decimal',
          },
        ],
        marginTop: '10px',
      },
      {
        fields: [
          {
            name: 'price',
            label: 'Valor',
            placeholder: 'Valor',
            size: 30,
            value: 'price',
            required: true,
            number: true,
            numberType: 'decimal',
          },
          {
            name: 'type',
            label: 'Tipo de produto',
            placeholder: 'Tipo de produto',
            size: 22,
            value: 'id',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: true,
            useRemove: true,
            list: this._service.getCatalogProductType(),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: SelectedEnumDto) => {
              if (value) {
                this.productType = value.id;
              } else {
                this.productType = 0;
              }
            }
          },
        ],
        marginTop: '10px',
      },

    ];

    this.formNote = [
      {
        fields: [
          {
            name: 'text',
            label: 'Observações',
            placeholder: 'Observações',
            size: 500,
            textArea: true,
            textAreaRows: 4,
            value: 'text',
            required: false,
          },
        ],
        marginTop: '10px',
      },
    ];

  }



  //Aux
  messagemSucesso() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      'Produto ' +
      (this.catalogId ? 'alterado' : 'cadastrado') +
      ' com sucesso!',
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.router.navigateByUrl(this.router.url.substring(1, this.router.url.lastIndexOf('/cadastro/')));
      },
      null,
      'CONTINUAR'
    );
  }
}

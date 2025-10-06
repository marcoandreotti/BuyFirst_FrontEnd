import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormRow } from '@shared/component/form/form';
import { ThemeService } from '@app/service/theme.service';
import { ProductsService } from '@app/service/https/products.service';
import { GroupService } from '@app/service/https/group.service';
import { SubGroupService } from '@app/service/https/subgroup.service';
import { PageEvent } from '@angular/material/paginator';
import { Group } from '@data/schema/products/groups/group';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { UploadProductBfComponent } from '../register/component/upload/upload-bf-product.component';
import { Sort } from '@angular/material/sort';
import { ProductAnalysisDto } from '@data/dto/products/analysis/product-analysis.dto';
import { FilterArgumentComplement } from '@data/util/filter-argument-complement';
import { FormGroup } from '@angular/forms';
import { FilterProductDto } from '@data/dto/products/product/filter-product.dto';
import { ModalFilterProductComponent } from '@modules/product/component/modal-filter-product/modal-filter-product.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalLinkProductErpComponent } from '@modules/product-erp/component/modal-link-product-erp/modal-link-product-erp.component';
import { ProductLinkErpDto } from '@data/dto/products/product-erp/product-link-erp.dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  lstProds: ProductAnalysisDto[] = [];
  rdoShowResult: string = '3';

  modelSerarch: FilterArgumentComplement = new FilterArgumentComplement();
  searchForm: FormGroup;
  formSearch: FormRow[] = [];

  lastFilterTag: string = 'last_filter_produtos';
  totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 300;
  sort: Sort = { active: 'default', direction: 'asc' };
  iconSort: string = 'south';

  subGrupos$: Observable<SubGroup[]>;
  showGotoPage: boolean = false;
  listPages$: any[] = [];
  existsSelected: boolean = false;
  showReferences: boolean = false;

  filterReq: FilterProductDto;
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  loading: boolean = false;

  constructor(
    private _auth: AuthService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private _produtos: ProductsService,
    private _grupos: GroupService,
    private _subgrupos: SubGroupService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getLastFilter();

    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Produtos');

    this.pageIndex = 0;
    this.createFormArgument();

    this.filter();
  }

  radioButtonChange($event) {
    this.rdoShowResult = $event.value;
    this.filterReq.situation = Number($event.value);
    this.filter();
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.filter();
  }

  onSelectedRow(prod: ProductAnalysisDto) {
    prod.selected = !prod.selected;
    this.CheckedAction();
  }

  onSelectAll() {
    this.lstProds.forEach((e) => {
      e.selected = true;
    });
    this.existsSelected = true;
  }

  onClearAll() {
    this.pageIndex = 0;

    this.modelSerarch.argument = null;
    this.searchForm.reset();

    this.filterReq = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      sort: this.sort,
      productId: null,
      referenceCode: null,
      arguments: [],
      situation: Number(this.rdoShowResult)
    };
    this.filter();
  }

  onRefreshProds() {
    this.filter();
  }

  onSort(active: string) {
    if (this.sort.active == active) {
      this.sort.direction = this.sort.direction == 'asc' ? 'desc' : 'asc';
    } else {
      this.sort.active = active;
      this.sort.direction = 'asc';
    }

    this.changeSorter(this.sort);
  }

  onAscendant(active: string) {
    if (this.sort.active != active || this.sort.direction != 'asc') {
      this.sort.active = active;
      this.sort.direction = 'asc';
      this.changeSorter(this.sort);
    }
  }

  onDescendant(active: string) {
    if (this.sort.active != active || this.sort.direction != 'desc') {
      this.sort.active = active;
      this.sort.direction = 'desc';
      this.changeSorter(this.sort);
    }
  }

  onClickShowGotoPage() {
    this.showGotoPage = true;
    var totalRegister = this.pageSize;

    let lstPages: any[] = [];
    var arrayLength = Number((this.totalRecords / totalRegister).toPrecision(1));
    let indexOff: number = 1;
    for (let index = 1; index < arrayLength; index++) {
      lstPages.push({ id: index - 1, description: `${indexOff} - ${index * totalRegister}` });
      indexOff += totalRegister;
    }

    this.listPages$ = lstPages;
  }

  onUpdateManualPage($event) {
    this.pageIndex = $event;
    this.onPageEvent({
      previousPageIndex: $event - 1,
      pageIndex: $event,
      pageSize: this.pageSize,
      length: this.totalRecords,
    });
  }

  onOpenAnalysis(prod: ProductAnalysisDto) {
    const link = window.location.href.replace('produtos', 'matcherp') + `/analise/${prod.productId}`;
    this.router.navigate([]).then(result => { window.open(link); });
  }

  onActive(row) {
    let sub = this._produtos
      .activeInactive(row.productId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.mensagemSucesso_Active(!row.active);
          row.active = !row.active;
          sub.unsubscribe();
        } else {
          console.log(result.message);
        }
      });
  }

  onCreate() {
    this.router.navigate([this.router.url + '/cadastro']);
  }

  onEdit(productId: number) {
    this.router.navigate([
      this.router.url + '/cadastro',
      productId,
    ]);
  }

  onRemoveItems() {
    let modal = this.modalDialog.apresentaAvisoObs(
      'Cuidado!',
      'Tem certeza que deseja excluir definitivamente?',
      'Serão removidos os produtos e os matches com os compradores, caso não houver relacionamentos com outras operações da aplicação!',
      true,
      true,
      () => {
        modal.close();
      },
      () => {
        if (this.existsSelected) {
          let ids: number[] = this.lstProds.filter(function (e) {
            if (e.selected) return e.productId;
          }).map(s => s.productId);
          let sub = this._produtos.deleteAll(ids).subscribe(s => {
            if (s.succeeded) {
              if (s.data && s.data.length > 0) {
                this.filter();
                this.mensagemSucesso_Excluir_ex();
              } else {
                this.mensagemSucesso_Excluir();
              }
            } else {
              this.modalDialog.apresentaErro('Erro', s.message);
            }
            sub.unsubscribe();
          })
          modal.close();
        } else {
          modal.close();
          this.modalDialog.apresentaErro('Erro', 'Não há item(ns) selecionado(s)!');
        }
      },
      'NÃO',
      'SIM'
    );
  }

  onExportCsv() {
    this._produtos.getCsv(this.filterReq);
  }

  onGroupProducts() {
    if (this.existsSelected) {
      let lstSelecteds: ProductLinkErpDto[] = this.lstProds.filter((p) => p.selected).map((x) => {
        return {
          productId: x.productId,
          name: x.productName,
          unitOfMeasureAcronym: x.unitOfMeasureAcronym,
          quantityGroupCompanies: x.quantityCodeSac,
          groupName: x.groupName,
          subGroupName: x.subGroupName,
          supplierCodes: null,
          quantityMatchesSupplier: x.quantitySupplier,
          selected: x.selected,
          matchError: false
        };
      });

      const dialogRef = this.dialog.open(ModalLinkProductErpComponent, {
        data: lstSelecteds
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.mensagemSucesso_Match();
        }
      });
    }
  }

  filter() {
    this.loading = true;
    try {
      Object.assign(
        this.modelSerarch,
        this.searchForm.getRawValue()
      );
    } catch (e) {
      console.log(e);
    }
    this.filterReq.referenceCode = this.modelSerarch.argument;
    this.filterReq.groupId = this.modelSerarch.groupId;
    this.filterReq.subGroupId = this.modelSerarch.subGroupId;

    this.filterReq.pageNumber = this.pageIndex + 1;
    this.filterReq.pageSize = this.pageSize;
    this.filterReq.sort = this.sort;
    this.filterReq.situation = Number(this.rdoShowResult);

    if (this.filterReq) {
      this.SaveLastFilter();
    }

    let sub = this._produtos
      .getAll(this.filterReq)
      .subscribe((res) => {
        this.lstProds = res.data;
        this.totalRecords = res.totalRecords;
        this.CheckedAction();
        this.loading = false;
        sub.unsubscribe();
      });
  }

  changeSorter(event: Sort) {
    this.pageIndex = 0;

    this.sort = event;
    if (!this.sort.direction) this.sort.direction = 'asc';
    this.filter();
    this.iconSort = this.sort.direction == 'asc' ? 'south' : 'north';
  }

  SaveLastFilter() {
    if (this.filterReq) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(this.filterReq));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          productId: null,
          situation: Number(this.rdoShowResult),
          arguments: [],
          groupId: null,
          subGroupId: null,
          referenceCode: null,
          pageNumber: this.pageIndex + 1,
          pageSize: this.pageSize,
          sort: this.sort
        })
      );
    }
  }

  getLastFilter() {
    var data = localStorage.getItem(this.lastFilterTag);

    if (data == null || data == 'undefined') {
      this.filterReq = {
        productId: null,
        situation: Number(this.rdoShowResult),
        arguments: [],
        groupId: null,
        subGroupId: null,
        referenceCode: null,
        pageNumber: this.pageIndex + 1,
        pageSize: this.pageSize,
        sort: this.sort,
      };
      localStorage.setItem(this.lastFilterTag, JSON.stringify(this.filterReq));
    } else {
      this.filterReq = JSON.parse(data);
    }
    this.modelSerarch.argument = this.filterReq.referenceCode;
    this.modelSerarch.groupId = this.filterReq.groupId;
    this.modelSerarch.subGroupId = this.filterReq.subGroupId;
    this.rdoShowResult = this.filterReq.situation.toString();
  }

  showModalUpload(): void {
    const dialogRef = this.dialog.open(UploadProductBfComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  createFormArgument() {
    this.formSearch = [
      {
        fields: [
          {
            name: 'argument',
            label: 'Referencias',
            placeholder: 'Referencias separadas por ";"',
            size: 50,
            value: 'argument',
          },
          {
            name: 'groupId',
            label: 'Categoria',
            placeholder: 'Categoria',
            size: 25,
            value: 'groupId',
            select: true,
            selectName: 'name',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this._grupos.getAll(),
            onChange: (value: Group) => {
              if (value) {
                this.subGrupos$ = this._subgrupos.getSelectAll(value.groupId);
              } else {
                this.subGrupos$ = new Observable<SubGroup[]>();
              }
              this.createFormArgument();
            },
          },
          {
            name: 'subGroupId',
            label: 'Sub-Categoria',
            placeholder: 'Sub-Categoria',
            size: 25,
            value: 'subGroupId',
            select: true,
            selectName: 'name',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this.subGrupos$,
            onChange: (value: SubGroup) => { },
          },
        ],
      }
    ];
  }

  showModalFilter(column: string) {
    const dialogRef = this.dialog.open(ModalFilterProductComponent, {
      data: { column: column, data: this.filterReq }
    });

    dialogRef.afterClosed().subscribe((result: FilterProductDto) => {
      if (result) {
        this.filterReq = result;
        this.changeSorter(result.sort);
      }
    });
  }


  //AUX
  CheckedAction() {
    this.existsSelected = this.lstProds.some(function (p) {
      return p.selected === true;
    });
  }

  clearSelected() {
    this.lstProds.filter((e) => e.selected).forEach((p) => {
      p.selected = false;
    });
  }


  mensagemSucesso_Active(active: boolean) {
    const text = active ? 'ativo' : 'inativo';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Produto ${text} com sucesso!`,
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

  mensagemSucesso_Excluir() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Foram excluidos itens!`,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.filter();
      },
      null,
      'CONTINUAR'
    );
  }

  mensagemSucesso_Excluir_ex() {
    this.modalDialog.apresentaAvisoObs(
      'Acho que apagou!?',
      'Há registros com relacionamentos em outras operações na aplicação',
      'Os itens sem relacionamentos, foram excluidos com sucesso!',
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

  mensagemSucesso_Match() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Match criado com sucesso!`,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
        this.filter();
      },
      null,
      'CONTINUAR'
    );
  }

}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { ThemeService } from '@app/service/theme.service';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { Login } from '@data/schema/login/login';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { BfResponse } from '@data/schema/response';
import { FormRow } from '@shared/component/form/form';
import { ProductsAnalysisMatchDto } from '@data/dto/products/analysis/product-analysis-match.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { BrandService } from '@app/service/https/brand.service';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '@app/service/https/group.service';
import { SubGroupService } from '@app/service/https/subgroup.service';
import { Group } from '@data/schema/products/groups/group';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-match-analysis',
  templateUrl: './match-analysis.component.html',
  styleUrls: ['./match-analysis.component.scss'],
})
export class MatchAnalysisComponent implements OnInit {
  auth: Login;
  lastFilter: any;
  lastFilterTag: string = 'last_filter_match_analysis';
  pageIndex: number = 0;
  pageSize: number = 25;
  subGrupos$: Observable<SubGroup[]>;

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  itemMenus: GridItemMenu[] = [];
  modelIdentity: string = 'productSupplierLinkId';
  produtos$: BfResponse<ProductsAnalysisMatchDto[]>;

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private route: ActivatedRoute,
    private _auth: AuthService,
    private dialog: MatDialog,
    private _service: ProductSupplierService,
    private _companyService: CompanyService,
    private _brandService: BrandService,
    private themeService: ThemeService,
    private _grupos: GroupService,
    private _subgrupos: SubGroupService
  ) {
    this.auth = this._auth.getState();
    this.PrepareGrid();
    this.PrepareFilters();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('matchs');
    this.themeService.setTitle("Analise Match's");

    this.lastFilter = this.getLastFilter();
    this.filter(this.lastFilter);
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.filter(this.lastFilter);
  }

  onFilter(event) {
    this.pageIndex = 0;

    this.filter(event);
  }

  filter(event) {
    if (event) {
      this.SaveLastFilter(event);
      this.lastFilter = event;
    } else {
      event = this.lastFilter;
    }

    let sub = this._service
      .getAnalysisMatch(
        event?.companyId ?? null,
        event?.productName ?? null,
        event?.groupId ?? null,
        event?.subGroupId ?? null,
        event?.brandId ?? null,
        event?.referenceCode ?? null,
        event?.initialDate ?? null,
        event?.endDate ?? null,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe((res) => {
        this.produtos$ = res;
        sub.unsubscribe();
      });
  }

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          companyId: null,
          productName: null,
          groupId: null,
          subGroupId: null,
          brandId: null,
          referenceCode: null,
          initialDate: null,
          endDate: null,
        })
      );
    }
  }

  getLastFilter() {
    var data = localStorage.getItem(this.lastFilterTag);
    if (data == 'undefined') {
      return null;
    } else {
      return JSON.parse(data);
    }
  }

  PrepareGrid() {
    this.displayedColumns = [
      'productName',
      'productSupplierName',
      'productGroupName',
      'productSubGroupName',
      'brandName',
      'productUnitOfMeasureAcronym',
      'productSupplierUnitOfMeasureAcronym',
      'productSupplierReferenceCode',
      'productReferenceCode',
    ];

    this.cols = [
      { name: 'productName', title: 'Produto BF', show: true },
      { name: 'productSupplierName', title: 'Produto de venda', show: true },
      { name: 'productGroupName', title: 'Grupo', show: true },
      { name: 'productSubGroupName', title: 'SubGrupo', show: true },
      { name: 'brandName', title: 'Marca', show: true },
      { name: 'productUnitOfMeasureAcronym', title: 'Un.BF', show: true },
      {
        name: 'productSupplierUnitOfMeasureAcronym',
        title: 'Un.For.',
        show: true,
      },
      { name: 'productSupplierReferenceCode', title: 'Ref. BF', show: true },
      { name: 'productReferenceCode', title: 'Ref. For.', show: true },
    ];

    this.itemMenus = [
      // {
      //   name: 'Ativar/Inativar',
      //   icon: 'done_outline',
      //   action: (row: ProductsAnalysisMatchDto) => {},
      // },
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: ProductsAnalysisMatchDto) => {
          this.modalDialog.apresentaAviso(
            'Excluir',
            'Tem certeza que deseja excluir?',
            true,
            true,
            () => {
              this.modalDialog.dialog.closeAll();
            },
            () => {
              this.modalDialog.dialog.closeAll();
              let sub = this._service
                .deleteLink(row.productSupplierLinkId)
                .subscribe((result) => {
                  if (result.succeeded) {
                    this.mensagemSucesso_Delete();
                    sub.unsubscribe();
                    this.filter(this.lastFilter);
                  } else {
                    console.log(result.message);
                  }
                });
            },
            'NÃO',
            'SIM'
          );
        },
      },
    ];
  }

  PrepareFilters() {
    this.filters = [
      {
        fields: [
          {
            name: 'companyId',
            label: 'Empresa',
            placeholder: 'Empresa',
            size: 60,
            value: 'companyId',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: false,
            useRemove: !this.auth.isSupplier,
            disabled: this.auth.isSupplier,
            list: this._companyService.getListCompany(true),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: CompanyDto) => {},
          },
          {
            name: 'productName',
            label: 'Nome do Produto',
            placeholder: 'Nome do Produto',
            size: 50,
            value: 'productName',
          },
          {
            name: 'referenceCode',
            label: 'Código de Referência',
            placeholder: 'Código de Referência',
            size: 15,
            value: 'referenceCode',
          },
        ],
      },
      {
        fields: [
          {
            name: 'groupId',
            label: 'Categoria',
            placeholder: 'Categoria',
            size: 15,
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
              this.PrepareFilters();
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
            onChange: (value: SubGroup) => {},
          },
          {
            name: 'brandId',
            label: 'Marca',
            placeholder: 'Marca',
            size: 15,
            value: 'brandId',
            select: true,
            selectName: 'name',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this._brandService.getSelecteddAll(),
          },
          {
            name: 'initialDate',
            label: 'Data Inicial',
            placeholder: 'Data Inicial',
            size: 15,
            value: 'initialDate',
            date: true,
            range: false,
          },
          {
            name: 'endDate',
            label: 'Data Final',
            placeholder: 'Data Final',
            size: 15,
            value: 'endDate',
            date: true,
            range: false,
          },
        ],
        marginTop: '10px',
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  mensagemSucesso_Delete() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Vínculo excluido com sucesso!`,
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

  mensagemSucesso_Active(active: boolean) {
    const text = active ? 'ativo' : 'inativo';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Vínculo ${text} com sucesso!`,
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

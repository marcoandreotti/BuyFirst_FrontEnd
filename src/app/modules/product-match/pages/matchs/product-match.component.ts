import { MatchConfirmComponent } from '../../component/match-confirm/match-confirm.component';
import { Component, OnInit } from '@angular/core';
import { FormRow } from '@shared/component/form/form';
import { Observable, ReplaySubject } from 'rxjs';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { ThemeService } from '@app/service/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfigComponent } from '@modules/product-match/component/modal-config/modal-config.component';
import { ConfigMatchDto } from '@data/dto/match/config-match.dto';
import { ProductSupplierMatchDto } from '@data/dto/match/product-supplier-match.dto';
import { CompanyService } from '@app/service/https/company.service';
import { AuthService } from '@app/service/auth.service';
import { Login } from '@data/schema/login/login';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { MatTableDataSource } from '@angular/material/table';
import { ProductMatchDto } from '@data/dto/match/product-match.dto';
import { ConfirmMatchDto } from '@data/dto/match/confirm-match.dto';
import { ModalMatchAutomaticComponent } from '@modules/product-match/component/modal-match-automatic/modal-match-automatic.component';
import { root } from 'rxjs/internal-compatibility';
import { Router } from '@angular/router';
import { BrandService } from '@app/service/https/brand.service';
import { PageEvent } from '@angular/material/paginator';
import { MatchSearchProductComponent } from '@modules/product-match/component/match-search-product/match-search-product.component';
import { Product } from '@data/schema/products/product';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';

@Component({
  selector: 'app-product-match',
  templateUrl: './product-match.component.html',
  styleUrls: ['./product-match.component.scss'],
})
export class ProductMatchComponent implements OnInit {
  dataSource = new MatTableDataSource<ProductSupplierMatchDto>();
  resolveDataSource = new MatTableDataSource<ProductSupplierMatchDto>();
  problemDataSource = new MatTableDataSource<ProductSupplierMatchDto>();

  selection = new SelectionModel<ProductSupplierMatchDto>(true, []);
  selectedTab = new FormControl(0);

  filterForm: FormGroup;
  formFilter: FormRow[] = [];
  modelFilter: FilerMatch = new FilerMatch();
  statusFilters$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  companySelected: CompanyDto = null;

  auth: Login;
  displayedColumns_NotMatch: String[] = [];
  displayedColumns_Resolve: String[] = [];
  displayedColumns_Problem: String[] = [];
  modelConfig$: Observable<ConfigMatchDto>;
  tagStorageConfigMatch: string = 'config_match_storage';
  lastFilterTag_Analysis: string = 'last_filter_match_analysis';

  totalRecords: number = 0;
  totalExecutMatch: number = 0;
  totalWarningMatch: number = 0;

  noMatch_pageIndex: number = 0;
  showGotoPage: boolean = false;
  listPages$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private _auth: AuthService,
    private _brandService: BrandService,
    private router: Router,
    private themeService: ThemeService,
    private _service: ProductSupplierService,
    public dialog: MatDialog,
    private _companyService: CompanyService
  ) {
    this.auth = this._auth.getState();
    this.PrepareMatchConfig();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Produtos match');

    this.createForm();
    this.PrepareColumnsNoMatch();
    this.PrepareColumnsResolve();
    this.PrepareColumnsProblem();

    this.onFilter();
  }

  onFilter() {
    this.clearPage();
    let filter: FilerMatch = new FilerMatch();
    if (this.filterForm) {
      filter = Object.assign(new FilerMatch(), this.filterForm.getRawValue());
    }

    var sub = this._service
      .getNoMatch(
        filter.companyId,
        filter.argument,
        filter.active ? filter.active == '1' : null,
        this.noMatch_pageIndex + 1,
        this.getConfigMatch().totalRegister
      )
      .subscribe((e) => {
        this.dataSource = new MatTableDataSource<ProductSupplierMatchDto>(
          e.data
        );
        this.totalRecords = e.totalRecords;
        sub.unsubscribe();
      });
  }

  onResolve(productSupplier: ProductSupplierMatchDto) {
    const _config = this.getConfigMatch();

    //Removendo o produto selecionado
    let dtaSoruce = this.dataSource.data.filter(
      (e) => e.productSupplierId != productSupplier.productSupplierId
    );

    //Caso já exista dados à resolver, crio uma nova variável
    let dtResolve = this.resolveDataSource.data;
    let dtProblem = this.problemDataSource.data;

    this._service
      .getFuzzyMatch(
        productSupplier.productSupplierId,
        _config.amountOfResults,
        _config.type
      )
      .subscribe((result) => {
        if (result && result.succeeded) {
          if (result.data.length > 0) {
            productSupplier.productMatchs = result.data;
            dtResolve.push(productSupplier);
          } else {
            productSupplier.message = 'Semelhança não encontrada';
            dtProblem.push(productSupplier);
          }
        } else {
          productSupplier.message = result.message;
          dtProblem.push(productSupplier);
        }

        //Refresh dadasources...
        this.resolveDataSource =
          new MatTableDataSource<ProductSupplierMatchDto>(dtResolve);
        this.problemDataSource =
          new MatTableDataSource<ProductSupplierMatchDto>(dtProblem);

        this.totalWarningMatch = this.problemDataSource.data.length;
        this.totalExecutMatch = this.resolveDataSource.data.length;
      });

    this.dataSource = new MatTableDataSource<ProductSupplierMatchDto>(
      dtaSoruce
    );
    // this.totalRecords = this.dataSource.data.length;
  }

  onResolveAll() {
    const _config = this.getConfigMatch();
    //Caso já exista dados à resolver, crio uma nova instancia
    let dtResolve: ProductSupplierMatchDto[] = this.resolveDataSource.data;
    let dtProblem: ProductSupplierMatchDto[] = this.problemDataSource.data;

    let dtaSoruce = this.dataSource.data.filter(
      (e) => !this.selection.selected.includes(e) || !e.active
    );
    let dtSourceResolve = this.dataSource.data.filter(
      (e) => e.active && this.selection.selected.includes(e)
    );

    this._service
      .getFuzzyMatchList(
        dtSourceResolve.map(({ productSupplierId }) => productSupplierId),
        _config.amountOfResults,
        _config.type
      )
      .subscribe((result) => {
        if (result && result.succeeded) {
          result.data.forEach((res) => {
            const prodDto: ProductSupplierMatchDto = dtSourceResolve.find(
              (e) => e.productSupplierId == res.productSupplierId
            );
            if (prodDto && res.productMatchs.length > 0) {
              prodDto.productMatchs = res.productMatchs;
              dtResolve.push(prodDto);
              this.resolveDataSource =
                new MatTableDataSource<ProductSupplierMatchDto>(dtResolve);
            } else {
              prodDto.message = 'Semelhança não encontrada';
              dtProblem.push(prodDto);
            }
          });
        } else {
          result.data.forEach((res) => {
            const prodDto: ProductSupplierMatchDto = dtSourceResolve.find(
              (e) => e.productSupplierId == res.productSupplierId
            );
            prodDto.message = result.message;
            dtProblem.push(prodDto);
          });
        }
        this.problemDataSource =
          new MatTableDataSource<ProductSupplierMatchDto>(dtProblem);
        this.totalExecutMatch = this.resolveDataSource.data.length;
        this.totalWarningMatch = this.problemDataSource.data.length;
      });

    this.dataSource = new MatTableDataSource<ProductSupplierMatchDto>(
      dtaSoruce
    );
    // this.totalRecords = this.dataSource.data.length;

    this.selection = new SelectionModel<ProductSupplierMatchDto>(true, []);
  }

  onActive(productSupplier: ProductSupplierMatchDto) {
    let ids: number[] = [];
    ids.push(productSupplier.productSupplierId);

    if (!productSupplier.active) {
      this._service.active(ids).subscribe((e) => {
        if (e.succeeded) {
          productSupplier.active = !productSupplier.active;
        } else {
          console.log(e.message);
        }
      });
    } else {
      this._service
        .inactive(ids, this.getConfigMatch().defaultNotes)
        .subscribe((e) => {
          if (e.succeeded) {
            productSupplier.active = !productSupplier.active;
          } else {
            console.log(e.message);
          }
        });
    }
  }

  onActiveAll() {
    let idsInactives = this.dataSource.data
      .filter((e) => this.selection.selected.includes(e) && !e.active)
      .map((x) => x.productSupplierId);

    let idsActives = this.dataSource.data
      .filter((e) => this.selection.selected.includes(e) && e.active)
      .map((x) => x.productSupplierId);

    if (idsInactives) {
      this._service.active(idsInactives).subscribe((e) => {
        if (e.succeeded) {
          this.onFilter();
        } else {
          console.log(e.message);
        }
      });
    }
    if (idsActives) {
      this._service
        .inactive(idsActives, this.getConfigMatch().defaultNotes)
        .subscribe((e) => {
          if (e.succeeded) {
            this.onFilter();
          } else {
            console.log(e.message);
          }
        });
    }
  }

  onSaveMatch() {
    let lstConfirmMatchs: ConfirmMatchDto[] = [];

    this.resolveDataSource.data.forEach((e) => {
      const product: ProductMatchDto = e.productMatchs.filter(
        (x) => x.selected
      )[0];
      if (product) {
        const match = new ConfirmMatchDto({
          productId: product.productId,
          productSupplierId: e.productSupplierId,
          product: product,
          productSupplier: e,
        });
        lstConfirmMatchs.push(match);
      }
    });

    if (lstConfirmMatchs.length <= 0) {
      return;
    }
    const dialogRef = this.dialog.open(MatchConfirmComponent, {
      data: lstConfirmMatchs,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clearPage();
        this.ngOnInit();
        this.selectedTab.setValue(0);
      } else {
        this.resolveDataSource =
          new MatTableDataSource<ProductSupplierMatchDto>(
            this.resolveDataSource.data
          );
      }
    });
  }

  onClickShowGotoPage() {
    this.showGotoPage = true;
    var totalRegister = this.getConfigMatch().totalRegister;

    let lstPages: any[] = [];
    var arrayLength = Number((this.totalRecords / totalRegister).toPrecision(1));
    let indexOff: number = 1;
    for (let index = 1; index < arrayLength; index++) {
      lstPages.push({ id: index - 1, description: `${indexOff} - ${index * totalRegister}` });
      indexOff += totalRegister;
    }

    this.listPages$.next(lstPages);
  }

  updateManualPage($event) {

    this.noMatch_pageIndex = $event;
    this.pageNoMatchEvent({
      previousPageIndex: $event - 1,
      pageIndex: $event,
      pageSize: this.getConfigMatch().totalRegister,
      length: this.totalRecords,
    });
  }

  selectResolveRow(productSupplierId: number, product: ProductMatchDto) {
    if (product.selected) {
      product.selected = false;
    } else {
      this.resolveDataSource.data
        .find((e) => e.productSupplierId == productSupplierId)
        .productMatchs.forEach((r) => {
          r.selected = false;
        });
      product.selected = true;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  pageNoMatchEvent($event: PageEvent) {
    this.noMatch_pageIndex = $event.pageIndex;
    this.onFilter();
  }

  PrepareColumnsNoMatch() {
    this.displayedColumns_NotMatch = [
      'select',
      'companyName',
      'referenceCode',
      'name',
      'brandName',
      'unitOfMeasureAcronym',
      'actions',
    ];
  }

  PrepareColumnsResolve() {
    this.displayedColumns_Resolve = [
      'companyName',
      'referenceCode',
      'name',
      'brandName',
      'unitOfMeasureAcronym',
      'actions',
    ];
  }

  PrepareColumnsProblem() {
    this.displayedColumns_Problem = [
      'companyName',
      'referenceCode',
      'name',
      'brandName',
      'message',
    ];
  }

  createForm() {
    this.statusFilters$.next([
      { id: '1', description: 'Ativos' },
      { id: '2', description: 'Inativos' },
    ]);

    this.formFilter = [
      {
        fields: [
          {
            name: 'companyId',
            label: 'Empresa',
            placeholder: 'Empresa',
            size: 35,
            value: 'companyId',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: false,
            useRemove: !this.auth.isSupplier,
            disabled: this.auth.isSupplier,
            list: this._companyService.getListCompany(true),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: CompanyDto) => {
              if (value) {
                this.companySelected = value;
                this.onFilter();
              } else {
                this.companySelected = null;
              }
            },
          },
          {
            name: 'argument',
            label: 'Pesquisar',
            placeholder: 'Trecho do Produto ou Referencia ou Marca',
            size: 25,
            value: 'argument',
          },
          {
            name: 'active',
            label: 'Ativos e Inativos',
            placeholder: 'Ativos e Inativos',
            size: 15,
            value: 'id',
            select: true,
            selectName: 'description',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this.statusFilters$,
          },
          {
            name: 'create',
            label: 'Data',
            placeholder: 'Data',
            size: 15,
            value: 'create',
            date: true,
            range: false,
          },
        ],
        submit: true,
        submitText: 'Filtrar',
        size: 10,
        marginTop: '2px',
      },
    ];
  }

  showModalConfig(): void {
    const dialogRef = this.dialog.open(ModalConfigComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  showModalMatchAutom(): void {
    this.companySelected.quantityRegisterNoMatch = this.totalRecords;

    const dialogRef = this.dialog.open(ModalMatchAutomaticComponent, {
      data: this.companySelected,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onFilter();
    });
  }

  showSearchModal(productSupplier: ProductSupplierMatchDto): void {
    const dialogRef = this.dialog.open(MatchSearchProductComponent, {
      data: productSupplier,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onFilter();
        this.mensagemSucesso_Search();
      } else {

      }
    });
  }

  goAnalysisMatch() {
    localStorage.setItem(
      this.lastFilterTag_Analysis,
      JSON.stringify({
        companyId: this.companySelected.companyId,
        productName: null,
        groupId: null,
        subGroupId: null,
        brandId: null,
        initialDate: null,
        endDate: null,
        referenceCode: null,
      })
    );

    this.router.navigate([this.router.url + '/matchanalysis']);
  }

  showConfirmModal(productSupplier: ProductSupplierMatchDto | any): void {
    const dialogRef = this.dialog.open(MatchConfirmComponent, {
      data: productSupplier,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  //Configurações de pesquisa Match
  getConfigMatch() {
    var data = localStorage.getItem(this.tagStorageConfigMatch);
    if (!data) {
      return {
        type: 1,
        amountOfResults: 3,
        totalRegister: 50,
        defaultNotes: 'Product inactivated by Administrator',
      };
    } else {
      return JSON.parse(data);
    }
  }

  PrepareMatchConfig() {
    var data = localStorage.getItem(this.tagStorageConfigMatch);
    if (!data) {
      localStorage.setItem(
        this.tagStorageConfigMatch,
        JSON.stringify({ type: 1, amountOfResults: 3, totalRegister: 50 })
      );
    }
  }

  clearPage() {
    this.showGotoPage = false;

    this.dataSource = new MatTableDataSource<ProductSupplierMatchDto>();
    this.resolveDataSource = new MatTableDataSource<ProductSupplierMatchDto>();
    this.problemDataSource = new MatTableDataSource<ProductSupplierMatchDto>();

    this.selection = new SelectionModel<ProductSupplierMatchDto>(true, []);

    this.totalRecords = 0;
    this.totalExecutMatch = 0;
    this.totalWarningMatch = 0;
  }
  
  mensagemSucesso_Search() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Vinculo criado com sucesso!`,
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

export class FilerMatch {
  companyId?: number | null;
  argument?: string | null;
  create?: Date | null;
  active?: string | null;
}

import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@app/service/theme.service';
import { PageEvent } from '@angular/material/paginator';
import { Login } from '@data/schema/login/login';
import { BfResponse } from '@data/schema/response';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { FormRow } from '@shared/component/form/form';
import { FishingPriceDto } from '@data/dto/fishing-price/fishing-price.dto';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { FishingSearch } from '@data/dto/fishing-price/fishing-search.dto';
import { MatDialog } from '@angular/material/dialog';
import { ModalPricesComponent } from '@modules/fishing-price/component/fishing-modal-price/modal-prices.component';
import { ShoppingCartService } from '@app/service/https/shopping-cart.service';
import { AuthService } from '@app/service/auth.service';

@Component({
  selector: 'app-search-price',
  templateUrl: './search-price.component.html',
  styleUrls: ['./search-price.component.scss'],
})
export class SearchPriceComponent implements OnInit {
  auth: Login;
  companyId: number;
  offers$: BfResponse<FishingPriceDto[]>;
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  idEstabelecimento: number = null;
  modelIdentity: string = 'productSupplierId';
  pageIndex: number = 0;
  pageSize: number = 25;
  itemMenus: GridItemMenu[] = [];

  selectedButtonToggleVal: string = 'list';
  totalShoppingCart: number = 0;
  totalFavorite: number = 0;
  onlyFavorites: boolean = false;
  onlyShoppinCarts: boolean = false;

  constructor(private _auth: AuthService, 
    private themeService: ThemeService,
    public dialog: MatDialog,
    private _catalog: CatalogsService,
    private _shoppingCartService: ShoppingCartService,
  ) {
    this.auth = this._auth.getState();

    this.PrepareColumns();
    this.PrepareItensMenu();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Preços e condições');

    this.search(null);
  }

  onSubmitPesquisar($event) {
    this.onlyFavorites = false;
    this.onlyShoppinCarts = false;
    this.search($event);
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.search(null);
  }

  onShowPrices(row: FishingPriceDto) {
    this.dialog.open(ModalPricesComponent, {
      data: row,
    });
  }

  onFavoriteSubmit() {
    if (this.totalFavorite > 0) {
      this.pageIndex = 0;
      this.onlyShoppinCarts = false;
      this.onlyFavorites = true;
      this.search(null);
    }
  }

  onDeleteAllFavoriteSubmit() {
    var sub = this._shoppingCartService
      .deleteAllFavorites()
      .subscribe((res) => {
        if (res.succeeded && res.data == true) {
          this.onlyShoppinCarts = false;
          this.onlyFavorites = false;
          this.search(null);
          sub.unsubscribe();
        }
      });
  }

  onShoppingCartSubmit() {
    if (this.totalShoppingCart > 0) {
      this.pageIndex = 0;
      this.onlyFavorites = false;
      this.onlyShoppinCarts = true;
      this.search(null);
    }
  }

  onDeleteAllShoppingCartSubmit() {
    var sub = this._shoppingCartService
      .deleteAllShoppingCarts()
      .subscribe((res) => {
        if (res.succeeded && res.data == true) {
          this.onlyFavorites = false;
          this.onlyShoppinCarts = false;
          this.search(null);
          sub.unsubscribe();
        }
      });
  }

  onButtonToggleSubmit(val: string) {
    this.selectedButtonToggleVal = val;
  }

  onButtonToggleChange(val: string) {
    this.selectedButtonToggleVal = val;
  }

  onFavorite(prod: FishingPriceDto) {
    if (!prod.favorite) {
      this._shoppingCartService
        .addFavorite(prod.productSupplierId)
        .subscribe((res) => {
          if (res.succeeded && res.data > 0) {
            prod.favorite = true;
            this.totalFavorite += 1;
          }
        });
    } else {
      this._shoppingCartService
        .deleteFavorite(prod.productSupplierId)
        .subscribe((res) => {
          if (res.succeeded && res.data == true) {
            prod.favorite = false;
            this.totalFavorite -= 1;
          }
        });
    }
  }

  onShoppingCart(prod: FishingPriceDto) {
    const quantity: number = prod.Quantity > 0 ? prod.Quantity : prod.salesMinimumQuantity;
    if (!prod.shoppingCart) {
      this._shoppingCartService
        .addShoppingCart(prod.productSupplierId, quantity)
        .subscribe((res) => {
          if (res.succeeded && res.data > 0) {
            prod.shoppingCart = true;
            this.totalShoppingCart += 1;
          }
        });
    } else {
      this._shoppingCartService
        .deleteShoppingCart(prod.productSupplierId)
        .subscribe((res) => {
          if (res.succeeded && res.data == true) {
            prod.shoppingCart = false;
            this.totalShoppingCart -= 1;
          }
        });
    }
  }

  search(event: FishingSearch) {
    if (!event) {
      event = this.getFilterSearch();

      if (event && event.resultTypeStyle) {
        this.selectedButtonToggleVal = event.resultTypeStyle;
      } else {
        this.selectedButtonToggleVal = 'list';
      }
    }

    if (this.onlyFavorites == true) {
      event.onlyFavorites = this.onlyFavorites;
    }

    if (this.onlyShoppinCarts == true) {
      event.onlyShoppingCarts = this.onlyShoppinCarts;
    }

    event.pageNumber = this.pageIndex + 1;
    event.pageSize = this.pageSize;

    let sub = this._catalog.fishingprices(event).subscribe((res) => {
      this.offers$ = res;
      this.totalFavorite = res.totalFavorites;
      this.totalShoppingCart = res.totalShoppingCarts;
      sub.unsubscribe();
    });
  }

  getFilterSearch() {
    return JSON.parse(localStorage.getItem('last_filter_fishing_price'));
  }

  PrepareColumns() {
    this.displayedColumns = [
      'favorite',
      'companyName',
      'referenceCode',
      'productSupplierName',
      'brandName',
      'groupName',
      'subGroupName',
      'unitOfMeasureAcronym',
      'lowestPrice',
    ];

    this.cols = [
      { name: 'favorite', title: 'Favorite', show: true, showFavorite: true },
      { name: 'companyName', title: 'Fornecedor', show: this.auth.isBuyFirst },
      { name: 'referenceCode', title: 'Referência', show: true },
      { name: 'productSupplierName', title: 'Produto', show: true },
      { name: 'brandName', title: 'Marca', show: true },
      { name: 'groupName', title: 'Categoria', show: true },
      { name: 'subGroupName', title: 'Sub Categoria', show: true },
      { name: 'unitOfMeasureAcronym', title: 'Un.', show: true },
      {
        name: 'lowestPrice',
        title: 'Preço',
        decimal: true,
        decimalPrecision: 2,
        prefix: 'R$ ',
        show: true,
      },
    ];
  }

  PrepareItensMenu() {
    this.itemMenus = [
      {
        name: 'Favoritar',
        icon: 'favorite_border',
        action: (item) => {
          this.onFavorite(item);
        },
      },
      {
        name: 'Ver Condições',
        icon: 'paid',
        action: (row) => {
          this.onShowPrices(row);
        },
      },
      {
        name: 'Adicionar em Compras',
        icon: 'add_shopping_cart',
        action: (item) => {
          this.onShoppingCart(item);
        },
      },
    ];
  }
}

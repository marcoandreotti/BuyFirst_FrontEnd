import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/service/auth.service';
import { CatalogsService } from '@app/service/https/catalogs.service';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { ThemeService } from '@app/service/theme.service';
import { FishingPriceDto } from '@data/dto/fishing-price/fishing-price.dto';
import { Login } from '@data/schema/login/login';
import { BfResponse } from '@data/schema/response';
import { FormRow } from '@shared/component/form/form';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';

@Component({
  selector: 'detail-shopping',
  templateUrl: './detail-shopping.component.html',
  styleUrls: ['./detail-shopping.component.scss'],
})
export class DetailShoppingComponent implements OnInit {
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

  constructor(
    private themeService: ThemeService,
    public dialog: MatDialog,
    private _catalog: CatalogsService,
    private _productSupplier: ProductSupplierService,
    private _auth: AuthService
  ) {
    this.auth = _auth.getState();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Detalhes da compra');

  }
}

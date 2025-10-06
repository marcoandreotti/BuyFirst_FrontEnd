import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from '@app/guard/auth.guard';
import { NoAuthGuard } from '@app/guard/no-auth.guard';
import { throwIfAlreadyLoaded } from '@app/guard/module-import.guard';
import {
  ErrorInterceptor,
  LoadingInterceptor,
  TokenInterceptor,
} from '@app/interceptor/token.interceptor';
import { AuthService } from './service/auth.service';
import { MobileService } from './service/mobile.service';
import { AccountService } from './service/https/account.service';
import { ThemeService } from './service/theme.service';
import { CatalogsService } from './service/https/catalogs.service';
import { ProductsService } from './service/https/products.service';
import { GroupService } from './service/https/group.service';
import { SubGroupService } from './service/https/subgroup.service';
import { UnitOfMeasureService } from './service/https/unit-of-measure.service';
import { SalesService } from './service/https/sales.service';
import { ProductSupplierService } from './service/https/product-supplier.service';
import { BrandService } from './service/https/brand.service';
import { CompanyService } from './service/https/company.service';
import { RegionService } from './service/https/region.serice';
import { PaymentConditionService } from './service/https/payment-condition.service';
import { BuyerService } from './service/https/buyers.service';
import { SupplierService } from './service/https/suppliers.service';
import { PaymentTypeService } from './service/https/payment-type.service';
import { BlackListService } from './service/https/blacklist.service';
import { CatalogBlackListService } from './service/https/catalog-blacklist.service';
import { CatalogStatusService } from './service/https/catalog-status.service';
import { OverallStatusService } from './service/https/overall-status.service';
import { BuyFirstService } from './service/https/buyfirst.service';
import { ExternalApplicationService } from './service/https/external-application.service';
import { CsvTemplatesService } from './service/https/csv-templates.service';
import { ShoppingCartService } from './service/https/shopping-cart.service';
import { ProductErpService } from './service/https/product-erp.service';
import { QuoteErpHistoricService } from './service/https/quote-erp-historic.service';
import { QuoteSolicitationService } from './service/https/quote-solicitation.service';
import { AddressService } from './service/https/address.service';
import { OrderSolicitationService } from './service/https/order-solicitation.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    AccountService,
    AddressService,
    AuthGuard,
    AuthService,
    BlackListService,
    BrandService,
    BuyerService,
    BuyFirstService,
    CatalogBlackListService,
    CatalogsService,
    CatalogStatusService,
    CompanyService,
    GroupService,
    MobileService,
    NoAuthGuard,
    OrderSolicitationService,
    OverallStatusService,
    PaymentConditionService,
    PaymentTypeService,
    ProductsService,
    ProductSupplierService,
    ProductErpService,
    RegionService,
    QuoteSolicitationService,
    SalesService,
    SubGroupService,
    SupplierService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ThemeService,
    UnitOfMeasureService,
    QuoteErpHistoricService,
    ExternalApplicationService,
    CsvTemplatesService,
    ShoppingCartService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

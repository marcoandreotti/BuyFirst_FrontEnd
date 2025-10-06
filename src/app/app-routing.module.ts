import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { AuthGuard } from '@app/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@modules/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@modules/usuarios/usuarios.module').then((m) => m.UsuariosModule
          ),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('@modules/product/products.module').then((m) => m.ProductsModule
          ),
      },
      {
        path: 'produtosfornecedor',
        loadChildren: () =>
          import('@modules/product-supplier/products-supplier.module').then((m) => m.ProductsSupplierModule
          ),
      },
      {
        path: 'catalogos',
        loadChildren: () =>
          import('@modules/catalog/catalogs.module').then((m) => m.CatalogsModule
          ),
      },
      {
        path: 'vendas',
        loadChildren: () =>
          import('@modules/sale/sales.module').then((m) => m.SalesModule),
      },
      {
        path: 'relatorios',
        loadChildren: () =>
          import('@modules/relatorios/relatorios.module').then((m) => m.RelatoriosModule
          ),
      },
      {
        path: 'configuracoes',
        loadChildren: () =>
          import('@modules/configuracoes/configuracoes.module').then((m) => m.ConfiguracoesModule
          ),
      },
      {
        path: 'matchs',
        loadChildren: () =>
          import('@modules/product-match/product-match.module').then((m) => m.ProductMatchModule
          ),
      },
      {
        path: 'compradores',
        loadChildren: () =>
          import('@modules/company/buyers/buyer.module').then((m) => m.BuyerModule
          ),
      },
      {
        path: 'fornecedores',
        loadChildren: () =>
          import('@modules/company/suppliers/supplier.module').then((m) => m.SupplierModule
          ),
      },
      {
        path: 'grupoempresas',
        loadChildren: () =>
          import('@modules/company/companies.module').then((m) => m.CompaniesModule
          ),
      },
      {
        path: 'regioes',
        loadChildren: () =>
          import('@modules/region/regions.module').then((m) => m.RegionsModule),
      },
      {
        path: 'unidadesmedida',
        loadChildren: () =>
          import('@modules/unit-of-measure/unit-of-measure.module').then((m) => m.UnitOfMeasureModule
          ),
      },
      {
        path: 'marcas',
        loadChildren: () =>
          import('@modules/brand/brand.module').then((m) => m.BrandModule),
      },
      {
        path: 'condicaopagamento',
        loadChildren: () =>
          import('@modules/payment/payments.module').then((m) => m.PaymentsModule
          ),
      },
      {
        path: 'grupos',
        loadChildren: () =>
          import('@modules/group/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: 'pesquisar',
        loadChildren: () =>
          import('@modules/fishing-price/fishing-prices.module').then((m) => m.FishingPricesModule
          ),
      },
      {
        path: 'detalhecarrinho',
        loadChildren: () =>
          import('@modules/shopping-cart/shopping-cart.module').then((m) => m.DetailShoppingModule
          ),
      },
      {
        path: 'cotacao',
        loadChildren: () =>
          import('@modules/quote/quotes.module').then((m) => m.QuotesModule),
      },
      {
        path: 'mydata',
        loadChildren: () =>
          import('@modules/personalData/personal-data.module').then((m) => m.PersonalDataModule),
      },
      {
        path: 'matcherp',
        loadChildren: () =>
          import('@modules/product-erp/product-erp.module').then((m) => m.ProductErpModule),
      },
      {
        path: 'solicitacoes',
        loadChildren: () =>
          import('@modules/solicitation/solicitation.module').then((m) => m.SolicitationModule),
      },
      {
        path: 'pedidossolicitacoes',
        loadChildren: () =>
          import('@modules/order-solicitation/order-solicitation.module').then((m) => m.OrderSolicitationModule),
      }
    ],
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

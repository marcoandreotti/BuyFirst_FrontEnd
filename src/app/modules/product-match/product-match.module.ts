import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductMatchRoutes } from './product-match-routing.module';
import { ProductMatchComponent } from './pages/matchs/product-match.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalConfigComponent } from './component/modal-config/modal-config.component';
import { MatchConfirmComponent } from './component/match-confirm/match-confirm.component';
import { ModalMatchAutomaticComponent } from './component/modal-match-automatic/modal-match-automatic.component';
import { MatchAnalysisComponent } from './pages/analysis/match-analysis.component';
import { MatchSearchProductComponent } from './component/match-search-product/match-search-product.component';

@NgModule({
  declarations: [
    ProductMatchComponent,
    ModalConfigComponent,
    MatchConfirmComponent,
    ModalMatchAutomaticComponent,
    MatchAnalysisComponent,
    MatchSearchProductComponent
  ],
  imports: [
    SharedModule,
    MatTooltipModule,
    ProductMatchRoutes,
    MatDialogModule,
  ],
  providers: [],
})
export class ProductMatchModule {}

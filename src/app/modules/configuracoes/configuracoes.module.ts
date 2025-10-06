import { ConfiguracoesComponent } from './page/configuracoes.component';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '@shared/shared.module';
import { ConfiguracoesRoutes } from './configuracoes-routing.module';

@NgModule({
  declarations: [ConfiguracoesComponent],
  imports: [ConfiguracoesRoutes, SharedModule, MatTooltipModule],
})
export class ConfiguracoesModule {}

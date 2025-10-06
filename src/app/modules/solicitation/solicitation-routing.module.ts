import { Routes, RouterModule } from '@angular/router';
import { QuoteSolicitationRetryComponent } from './page/quote-solicitation-retry/quote-solicitation-retry.component';
import { QuoteSolicitationWizardComponent } from './page/quote-solicitation-wizard/quote-solicitation-wizard.component';
import { QuoteSolicitationsComponent } from './page/quote-solicitations/quote-solicitations.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteSolicitationsComponent,
  },
  {
    path: 'solicitacao',
    component: QuoteSolicitationWizardComponent,
  },
  {
    path: 'solicitacao/:id',
    component: QuoteSolicitationWizardComponent,
  },
  {
    path: 'cotacao/:id',
    component: QuoteSolicitationRetryComponent,
  }
];

export const SolicitationRoutes = RouterModule.forChild(routes);

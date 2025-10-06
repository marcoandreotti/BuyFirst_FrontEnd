import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterarSenhaComponent } from './page/alterar-senha/alterar-senha.component';

import { LoginComponent } from './page/login/login.component';
import { EsqueceuSenhaComponent } from './page/esqueceu-senha/esqueceu-senha.component';
import { RegistrarComponent } from './page/registrar/registrar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'esqueceu-senha',
        component: EsqueceuSenhaComponent,
      },
      {
        path: 'alterar-senha',
        component: AlterarSenhaComponent,
      },
      {
        path: 'registrar',
        component: RegistrarComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './page/login/login.component';
import { SharedModule } from '@shared/shared.module';

import { AuthRoutingModule } from './auth.routing';
import { EsqueceuSenhaComponent } from './page/esqueceu-senha/esqueceu-senha.component';
import { AlterarSenhaComponent } from './page/alterar-senha/alterar-senha.component';
import { RegistrarComponent } from './page/registrar/registrar.component';
import { CustomValidators } from 'app/providers/custom-validators';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    LoginComponent,
    EsqueceuSenhaComponent,
    AlterarSenhaComponent,
    RegistrarComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    MatTooltipModule
  ],
  providers: [
    CustomValidators
  ]
})


export class AuthModule { }

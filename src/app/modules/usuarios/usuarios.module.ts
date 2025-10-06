import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UsuariosCadastroComponent } from './page/cadastro/cadastro.component';
import { UsuariosComponent } from './page/usuarios/usuarios.component';
import { UsuariosRoutes } from './usuarios-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [UsuariosComponent, UsuariosCadastroComponent],
  imports: [
    UsuariosRoutes,
    MatTooltipModule,
    SharedModule
  ],
  providers: [],
})
export class UsuariosModule { }



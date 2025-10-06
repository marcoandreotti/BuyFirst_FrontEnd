import { Action } from '@ngrx/store';;

export enum GridActionTypes {
  ABRIR_CONFIGURAR_COLUNA = 'Abre o  menu de opções de colunas',
  FECHAR_CONFIGURAR_COLUNA = 'Fechar o menu de opções de colunas',
}

export class AbrirConfigurarColuna implements Action {
  readonly type = GridActionTypes.ABRIR_CONFIGURAR_COLUNA;
  constructor() { }
}

export class FecharConfigurarColuna implements Action {
  readonly type = GridActionTypes.FECHAR_CONFIGURAR_COLUNA;
  constructor() { }
}

export type GridActions = AbrirConfigurarColuna | FecharConfigurarColuna;


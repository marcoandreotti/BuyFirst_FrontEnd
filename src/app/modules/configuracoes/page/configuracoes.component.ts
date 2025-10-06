import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss'],
})
export class ConfiguracoesComponent implements OnInit {
  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('home');
    this.themeService.setTitle('Configurações');
  }

  onClickRegion(){
    this.router.navigateByUrl('regioes');
  }

  onClickUnitOfMeasure(){
    this.router.navigateByUrl('unidadesmedida');
  }

  onClickBrand(){
    this.router.navigateByUrl('marcas');
  }

  onClickPayment(){
    this.router.navigateByUrl('condicaopagamento');
  }

  onClickGroups(){
    this.router.navigateByUrl('grupos');
  }
}

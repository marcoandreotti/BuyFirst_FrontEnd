import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '@app/service/https/sales.service';
import { ThemeService } from '@app/service/theme.service';
import { Order } from '@data/schema/orders/order-summary/order';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.scss']
})

export class PrintOrderComponent implements OnInit {

  name = "Angular PDF";
  orderId: number;
  model: Order;
  deliveryAddress: string;
  billingAddress: string;
  document: string;

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private _vendas: SalesService
  ) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('vendas');
    this.themeService.setTitle('Detalhes da Venda');

    this.route.paramMap.subscribe((params) => {
      this.orderId = +params.get('id');
      this._vendas.getDetail(this.orderId).subscribe((order) => {
        this.model = order.data;
        this.document = order.data.buyer.document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
      });
    });
  }

  print(): void {
    window.open();
  }
}

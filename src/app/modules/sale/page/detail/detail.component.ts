import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '@app/service/https/sales.service';
import { ThemeService } from '@app/service/theme.service';
import { Order } from '@data/schema/orders/order-summary/order';
import { Address } from '@data/schema/persons/address';
import { MASKS } from 'ng-brazil';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class SaleDetailComponent implements OnInit {
  model: Order;
  deliveryAddress: string;
  billingAddress: string;
  orderId: number;
  displayElement: boolean = false;

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private _service: SalesService,
  ) {}

  ngOnInit(): void {
    this.themeService.setBackRoute('vendas');
    this.themeService.setTitle('Detalhes da Venda');

    this.route.paramMap.subscribe((params) => {
      this.orderId = +params.get('id');
      this._service.getDetail(this.orderId).subscribe((order) => {
        this.model = order.data;
        if (this.model.note.trim().length <= 0){
          this.model.note = null;
        }
        this.deliveryAddress = this.MountAddress(
          order.data.buyer.deliveryAddress
        );
        this.billingAddress = this.MountAddress(
          order.data.buyer.billingAddress
        );
      });
    });
  }

  MountAddress(address: Address) {
    var result = address.street;
    if (address.number) {
      result += ', ' + address.number;
    }
    if (address.neighborhood) {
      result += ', ' + address.neighborhood;
    }
    if (address.location) {
      result += ' - ' + address.location;
    }
    if (address.stateAcronym) {
      result += '/' + address.stateAcronym;
    }

    return result;
  }

  StatusVendaShow(){
    this.displayElement = !this.displayElement;
  }
}

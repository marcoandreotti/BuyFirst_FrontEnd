import { Component, OnInit, Input } from '@angular/core';
import { GridOptionMenu } from '../grid/grid.config';


@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {

  @Input() title: string;
  @Input() list: GridOptionMenu[] = [];
  @Input() maxHeight: any = 'auto';
  @Input() orientation: string = 'vertical';
  @Input() itensPerLine: number = 5;

  constructor() { }

  ngOnInit(): void {
  }


}

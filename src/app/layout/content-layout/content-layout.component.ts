import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MobileService } from '@app/service/mobile.service';
import { isNumeric } from 'rxjs/internal-compatibility';
@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit {
  constructor(private router: Router, private mobile: MobileService) {}

  ngOnInit(): void {
    this.isRegister();
  }

  isRegister() {
    if (this.mobile.isMobile()) {
      return false;
    } else {
      return (
        (this.router.url.indexOf('cotacao') + this.router.url.indexOf('solicitacao') + this.router.url.indexOf('detalhe') + this.router.url.indexOf('analise') < 0 ) &&
        (isNumeric(this.router.url.slice(-1)) ||
        this.router.url.slice(-8) == 'cadastro' ||
        this.router.url.slice(-6) == 'mydata')
      );
    }
  }
}

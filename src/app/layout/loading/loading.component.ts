import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ThemeService } from '@app/service/theme.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit {


  isLoading$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isLoading$ = this.themeService.getLoading();
  }

  ngOnInit() { }

}

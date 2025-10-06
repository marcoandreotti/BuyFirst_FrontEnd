import { Component, Input, OnInit } from '@angular/core';
import { MobileService } from '@app/service/mobile.service';
import { ThemeService } from '@app/service/theme.service';
import { Observable } from 'rxjs';
import { GridItemMenu, GridOption, GridOptionDir } from '../grid.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  dirs: GridOptionDir[] = [GridOptionDir.LEFT, GridOptionDir.RIGHT];
  @Input() options: GridOption[];
  @Input() topMenus: GridItemMenu[] = [];
  isDark$: Observable<boolean>;
  @Input() alwaysFilters: boolean = false;
  @Input() filterLength: number = 0;
  @Input() filterEvent;
  @Input() haveFilters: boolean = false;

  constructor(private themeService: ThemeService, private mobile: MobileService) {
    this.isDark$ = this.themeService.getDarkTheme();
  }

  ngOnInit(): void {
  }

  getOptions() {
    if (this.options) {
      return (!this.mobile.isMobile() && this.alwaysFilters) ? this.options.filter(o => o.icon != 'tune') : this.options;
    } else {
      return [];
    }
  }


}

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MobileService } from '@app/service/mobile.service';
import { ThemeService } from '@app/service/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import defaultLanguage from "./../assets/i18n/br.json";

declare const tinycolor: any;

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  title = "buy-first";
  @HostBinding('class') className = '';
  mySubscription: Subscription;
  primaryColorPalette: Color[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private translate: TranslateService, private themeService: ThemeService, private overlay: OverlayContainer, private mobile: MobileService) {

    this.savePrimaryColor();

    translate.setTranslation('br', defaultLanguage);
    this.translate.setDefaultLang('br');
    this.translate.use('br');

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.themeService.getDarkTheme().subscribe((isDark) => {
      const darkClassName = 'darkMode';
      this.className = isDark ? darkClassName : '';
      if (isDark) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }

      if (this.mobile.isMobile()) {
        this.overlay.getContainerElement().classList.add('mobile');
      } else {
        this.overlay.getContainerElement().classList.remove('mobile');
      }
    })
  }

  savePrimaryColor() {
    this.primaryColorPalette = computeColors(this.themeService.getPrimaryColor());
    updateTheme(this.primaryColorPalette, 'primary');
  }
}

function updateTheme(colors: Color[], theme: string) {
  colors.forEach(color => {
    document.documentElement.style.setProperty(
      `--theme-${theme}-${color.name}`,
      color.hex
    );
    document.documentElement.style.setProperty(
      `--theme-${theme}-contrast-${color.name}`,
      color.darkContrast ? 'rgba(black, 0.87)' : 'white'
    );
  });
}

function computeColors(hex: string): Color[] {
  return [
    getColorObject(tinycolor(hex).lighten(52), '50'),
    getColorObject(tinycolor(hex).lighten(37), '100'),
    getColorObject(tinycolor(hex).lighten(26), '200'),
    getColorObject(tinycolor(hex).lighten(12), '300'),
    getColorObject(tinycolor(hex).lighten(6), '400'),
    getColorObject(tinycolor(hex), '500'),
    getColorObject(tinycolor(hex).darken(6), '600'),
    getColorObject(tinycolor(hex).darken(12), '700'),
    getColorObject(tinycolor(hex).darken(18), '800'),
    getColorObject(tinycolor(hex).darken(24), '900'),
    getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
    getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
    getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
    getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
  ];
}

function getColorObject(value, name): Color {
  const c = tinycolor(value);
  return {
    name: name,
    hex: c.toHexString(),
    darkContrast: c.isLight()
  };
}

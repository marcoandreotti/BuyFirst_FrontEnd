import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';

import { CoreModule } from '@app/core.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { AuthModule } from '@modules/auth/auth.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SimpleLayoutComponent } from './layout/simple-layout/simple-layout.component';
import { MenuComponent } from './layout/menu/menu.component';
import { ServicesComponent } from './shared/component/services/services.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingComponent } from './layout/loading/loading.component';
import { environment } from '@env';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './layout/notification/notification.component';
import { NgxPrintModule } from 'ngx-print';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    NavComponent,
    NotificationComponent,
    MenuComponent,
    LoadingComponent,
    FooterComponent,
    AuthLayoutComponent,
    SimpleLayoutComponent,
    ServicesComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    CoreModule,
    NgxPrintModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot([]),
    EffectsModule.forRoot([]),
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

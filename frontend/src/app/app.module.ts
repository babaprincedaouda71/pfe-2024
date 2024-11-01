import {APP_INITIALIZER, ErrorHandler, Injectable, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import localeFr from '@angular/common/locales/fr';

// Importation des fichierss nécessaires
// icons
import {TablerIconsModule} from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import {MaterialModule} from './material.module';

// Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {ErrorComponent} from "./_utils/error/error.component";
import {DatePipe, registerLocaleData} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams
} from "angular-calendar";
import {MAT_DATE_LOCALE, MatNativeDateModule,} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {GlobalErrorHandlerService} from "./_services/global-error-handler.service";

// Les fichiers de traduction
export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/*
* Keyckloak initializer
* */
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        // url: 'http://keycloak:8080',
        // url: 'http://57.128.221.44:8080',
        url: 'http://51.254.114.223:8080',
        // url: 'http://localhost:8080',
        realm: 'gs-pfe-2024',
        // realm: 'master',
        clientId: 'frontend'
      },
      initOptions: {
        // onLoad: 'login-required',
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

@Injectable()
class CustomeDateFormatter extends CalendarNativeDateFormatter {
  override dayViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {hour: "numeric", minute: "numeric"}).format(date)
  }

  override weekViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {hour: "numeric", minute: "numeric"}).format(date)
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TablerIconsModule.pick(TablerIcons),
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    HttpClientModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatDatepicker,
    MatNativeDateModule,
    MatInputModule,
    CalendarModule.forRoot(
      {
        provide : DateAdapter,
        useFactory : adapterFactory
      }
    ),
    MatSnackBarModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideAnimationsAsync(),
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'fr'}, // Définit la locale française
    {
      provide: LOCALE_ID,
      useValue: 'fr'
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomeDateFormatter
    },
    {
      provide : ErrorHandler,
      useClass: GlobalErrorHandlerService
    }
  ],
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

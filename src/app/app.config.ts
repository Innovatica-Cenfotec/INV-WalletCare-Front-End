import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { accessTokenInterceptor } from './interceptors/access-token.interceptor';
import { handleErrorsInterceptor } from './interceptors/handle-errors.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import es from '@angular/common/locales/es'
import { provideNzIcons } from './icons-provider';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';

import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
registerLocaleData(es);

/**
 * Set the configuration for the Ng-Zorro theme
 */
const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#063578',
    primaryBg: '#e4e4e4',
    primaryHover: '#75a4de',

    successBorder: '#3e7422',
    successBg: '#ffffff',
    success: '#3e7422',

    warning: '#b17a0c',
    warningBg: '#ffffff',
    warningBorder: '#b17a0c',

    error: '#d23537',
    errorBg: '#ffffff',
    errorBorder: '#d23537',

    info: '#063578',
    link: '#000000',
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    provideRouter(routes),
    provideNzIcons(),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        accessTokenInterceptor,
        //handleErrorsInterceptor
      ])
    ), provideAnimationsAsync()
  ]
};
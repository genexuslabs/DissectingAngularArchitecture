import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from "@angular/core";
import { RouterModule } from "@angular/router";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { ServiceWorkerModule } from "@angular/service-worker";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from "@angular/common/http";

import { defineCustomElements } from "@genexus/web-controls-library/loader";
import { defineCustomElements as defineCustomElementsReporting } from "@genexus/reporting-controls-library/loader";
import { defineCustomElements as defineCustomElementsChameleon} from '@genexus/chameleon-controls-library/loader';
import { CookieService } from "ngx-cookie-service";
import { VirtualScrollerModule } from "@genexus/ngx-virtual-scroller";

import { AppComponent } from "app/app.component";
import { routes } from "app/app.routing";
import { AppBarService } from "app/gx/base/app-bar.service";
import { RetryInterceptor } from "app/gx/utils/retry-interceptor";
import { RequestQueueInterceptor } from "app/gx/http/request-queue-interceptor";
import { AppContainer } from "app/gx/base/app-container";
import { AuthInterceptor } from "app/gx/auth/auth-interceptor";
import { CsrfToken } from "app/gx/http/csrf-token";
import { VisibilityService } from "app/gx/base/visibility.service";

import { environment } from "./environments/environment";


if (environment.production) {
  enableProdMode();
}

function initializeAppFactory(app: AppContainer, sec:CsrfToken): () => Promise<any> {
  return async () => {
    await app.initApp("LightCRM");
    await app.initLanguage("English");
    await sec.refreshToken();
    await app.initTheme("GeneXusUnanimo.UnanimoAngular");
    return Promise.resolve();
  };
}

defineCustomElements(window);
defineCustomElementsReporting(window);
defineCustomElementsChameleon(window);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule, 
      RouterModule.forRoot(routes, {}), 
      VirtualScrollerModule,
      ServiceWorkerModule.register("ngsw-worker.js", {
        enabled: environment.registerServiceWorkers
      })
    ),
    CookieService,
    VisibilityService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppContainer, CsrfToken],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestQueueInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptor,
      multi: true
    },
    AppBarService,
    provideHttpClient(withInterceptorsFromDi())
  ]
});

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { enableProdMode } from "@angular/core";
import { environment } from "./environments/environment";
import { defineCustomElements } from "@genexus/web-controls-library/loader";

if (environment.production) {
  enableProdMode();
}

defineCustomElements(window);
platformBrowserDynamic().bootstrapModule(AppModule);

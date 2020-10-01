import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule as NgCommonModule } from "@angular/common";

import { ComponentHostComponent } from "app/gx/ui/controls/component-host/component-host.component";
import { ComponentOutletDirective } from "app/gx/ui/controls/component-host/component-outlet.directive";
import { FormPropertiesDirective } from "app/gx/ui/controls/form/form-properties.directive";
import { VisibleWith } from "app/gx/base/visible-with.directive";
import { ImageUploadComponent } from "app/gx/ui/controls/image-upload/image-upload.component";
import { FileUploadComponent } from "app/gx/ui/controls/file-upload/file-upload.component";
import { GeolocationComponent } from "app/gx/ui/controls/geolocation/geolocation.component";
import { AudioControllerComponent } from "app/gx/ui/controls/audio-controller/audio-controller.component";
import { HttpInterceptorProviders } from './gx/http/url-caching-interceptor';
import { ResolveRelativeUrlPipe } from "./gx/utils/resolve-relative-url/resolve-relative-url.pipe";
import { LoadCachedUriPipe } from "./gx/utils/uri-cache/load-cached-uri.pipe";
import { TranslatePipe } from "./gx/utils/translate.pipe";
import { DefaultPipe } from "./gx/utils/default.pipe";
import { NotPipe } from "./gx/utils/not.pipe";
import { DateToISOStringPipe } from "./gx/utils/date-to-iso-string.pipe";
import { DatetimeToISOStringPipe } from "./gx/utils/datetime-to-iso-string.pipe";
import { TimeToISOStringPipe } from "./gx/utils/time-to-iso-string.pipe";


@NgModule({
  imports: [NgCommonModule, FormsModule],
  declarations: [
    ComponentOutletDirective,
    ComponentHostComponent,
    FormPropertiesDirective,
    VisibleWith,
    ImageUploadComponent,
    FileUploadComponent,
    GeolocationComponent,
    AudioControllerComponent,
    ResolveRelativeUrlPipe,
    LoadCachedUriPipe,
    TranslatePipe,
    DefaultPipe,
    DateToISOStringPipe,
    DatetimeToISOStringPipe,
    TimeToISOStringPipe,
    NotPipe
  ],
  bootstrap: [],
  exports: [
    ComponentOutletDirective,
    ComponentHostComponent,
    FormPropertiesDirective,
    VisibleWith,
    ImageUploadComponent,
    FileUploadComponent,
    GeolocationComponent,
    AudioControllerComponent,
    ResolveRelativeUrlPipe,
    LoadCachedUriPipe,
    TranslatePipe,
    DefaultPipe,
    DateToISOStringPipe,
    DatetimeToISOStringPipe,
    TimeToISOStringPipe,
    NotPipe
  ],
  providers: HttpInterceptorProviders,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonModule { }

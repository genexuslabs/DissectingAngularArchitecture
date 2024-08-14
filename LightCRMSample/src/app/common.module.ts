import { NgModule } from "@angular/core";
import { CommonModule as NgCommonModule, NgTemplateOutlet, NgIf, NgFor, NgClass, AsyncPipe } from "@angular/common";

import { FormsModule } from '@angular/forms';
import { UsercontrolsModule } from './usercontrols.module';
import { VirtualScrollerModule } from '@genexus/ngx-virtual-scroller';

import { ComponentHostComponent } from "app/gx/ui/controls/component-host/component-host.component";
import { ComponentOutletDirective } from "app/gx/ui/controls/component-host/component-outlet.directive";
import { FormPropertiesDirective } from "app/gx/ui/controls/form/form-properties.directive";
import { VisibleWith } from "app/gx/base/visible-with.directive";
import { ImageUploadComponent } from "app/gx/ui/controls/image-upload/image-upload.component";
import { FileUploadComponent } from "app/gx/ui/controls/file-upload/file-upload.component";
import { GeolocationComponent } from "app/gx/ui/controls/geolocation/geolocation.component";
import { AudioControllerComponent } from "app/gx/ui/controls/audio-controller/audio-controller.component";

import { ResolveRelativeUrlPipe } from "app/gx/utils/resolve-relative-url.pipe";
import { TranslatePipe } from "app/gx/utils/translate.pipe";
import { DefaultPipe } from "app/gx/utils/default.pipe";
import { NotPipe } from "app/gx/utils/not.pipe";
import { DateToISOStringPipe } from "app/gx/utils/date-to-iso-string.pipe";
import { DatetimeToISOStringPipe } from "app/gx/utils/datetime-to-iso-string.pipe";
import { TimeToISOStringPipe } from "app/gx/utils/time-to-iso-string.pipe";
import { GuidToStringPipe } from "app/gx/utils/guid-to-string.pipe";
import { GeographyToCoordsPipe } from "app/gx/utils/geography-to-coords.pipe";
import { JsonToGaugePipe } from "app/gx/utils/json-to-gauge.pipe";
import { ClassSplitPipe } from "app/gx/utils/class-split.pipe";
import { ImageNameToSrcsetPipe } from "app/gx/utils/image-name-to-srcset.pipe";
import { ImageToSrcsetPipe } from "app/gx/utils/image-to-srcset.pipe";
import { ImageToURLPipe } from "app/gx/utils/image-to-url.pipe";
import { BinaryToURLPipe } from "app/gx/utils/binary-to-url.pipe";
import { AudioToURLPipe } from "app/gx/utils/audio-to-url.pipe"
import { VideoToURLPipe } from "app/gx/utils/video-to-url.pipe"
import { SafePipe } from "app/gx/ui/controls/safe-pipe/safe-pipe.component";
import { ClassToGxClassPipe } from "app/gx/utils/class-to-gxclass.pipe";
import { CollectionSlicePipe } from "./gx/utils/collection-slice.pipe";
import { ApplyContextPipe } from "app/gx/utils/apply-context.pipe";
import { BigNumberToStringPipe } from "app/gx/utils/bignumber-to-string.pipe";


@NgModule({
  imports: [
    FormsModule,
    UsercontrolsModule,
    NgCommonModule,
    VirtualScrollerModule,
    ComponentOutletDirective,
    ComponentHostComponent,
    FormPropertiesDirective,
    VisibleWith,
    ImageUploadComponent,
    FileUploadComponent,
    GeolocationComponent,
    AudioControllerComponent,
    ResolveRelativeUrlPipe,
    TranslatePipe,
    DefaultPipe,
    DateToISOStringPipe,
    DatetimeToISOStringPipe,
    TimeToISOStringPipe,
    GuidToStringPipe,
    GeographyToCoordsPipe,
    JsonToGaugePipe,
    NotPipe,
    ClassSplitPipe,
    ClassToGxClassPipe,
    ImageNameToSrcsetPipe,
    ImageToSrcsetPipe,
    ImageToURLPipe,
    BinaryToURLPipe,
    AudioToURLPipe,
    VideoToURLPipe,
    SafePipe,
    CollectionSlicePipe,
    ApplyContextPipe,
    BigNumberToStringPipe,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    NgTemplateOutlet
  ],
  exports: [
    FormsModule,
    UsercontrolsModule,
    VirtualScrollerModule,
    ComponentOutletDirective,
    ComponentHostComponent,
    FormPropertiesDirective,
    VisibleWith,
    ImageUploadComponent,
    FileUploadComponent,
    GeolocationComponent,
    AudioControllerComponent,
    ResolveRelativeUrlPipe,
    TranslatePipe,
    DefaultPipe,
    DateToISOStringPipe,
    DatetimeToISOStringPipe,
    TimeToISOStringPipe,
    GuidToStringPipe,
    GeographyToCoordsPipe,
    JsonToGaugePipe,
    NotPipe,
    ClassSplitPipe,
    ClassToGxClassPipe,
    ImageNameToSrcsetPipe,
    ImageToSrcsetPipe,
    ImageToURLPipe,
    BinaryToURLPipe,
    AudioToURLPipe,
    VideoToURLPipe,
    SafePipe,
    CollectionSlicePipe,
    ApplyContextPipe,
    BigNumberToStringPipe,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    NgTemplateOutlet
  ]
})
export class CommonModule { }

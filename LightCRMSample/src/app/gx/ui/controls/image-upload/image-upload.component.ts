import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import { AppContainer } from "app/gx/base/app-container";
import { Title } from "@angular/platform-browser";
import { UriCacheService } from "app/gx/utils/uri-cache/uri-cache.service";
import { TranslatePipe } from "app/gx/utils/translate.pipe";

@Component({
  selector: "gx-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
  standalone: true,
  imports: [TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageUploadComponent {
  @Input() alt = "";
  @Input() autoGrow = true;
  @Input() cssClass: string = null;
  @Input() disabled = false;
  @Input() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Input() lazyLoad = true;
  @Input() lowResolutionSrc = "";
  @Input() scaleType: "contain" | "cover" | "fill" | "none" | "tile";
  @Input() src = "";
  @Input() srcset = "";
  @Input() highlightable = false;
  @Input() readonly = false;
  @Input() modalTitle = null;
  @Input() changeButtonText = "Change image...";
  @Input() removeButtonText = "Remove image";
  @Input() cancelButtonText = "GXM_cancel";

  @Output() click: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onImageChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild("imageUpload", { static: false }) imageUpload;

  constructor(
    protected uriCacheService: UriCacheService,
    protected app: AppContainer,
    protected titleService: Title
  ) { }

  ngOnChanges(eventInfo) {
    if (!eventInfo.srcset?.currentValue) {
      this.src = '';
    }
  }

  handleImageChange(event: CustomEvent) {
    // This stopPropagation() allows to not call the external event, defined
    // when using the Angular's control
    event.stopPropagation();

    // The image was removed
    if (event.detail == null) {
      this.src = null;
      this.srcset = null;
      this.alt = "";
      this.onImageChanged.emit("");
    }
    // The image was updated
    else {
      const imageFile: File = event.detail as File;
      this.fileSelectedAction(imageFile);
    }
  }

  clickImageAction(event) {
    // This stopPropagation() allows to not call the external event, defined
    // when using the Angular's control
    event.stopPropagation();

    this.click.emit(event);
  }

  async fileSelectedAction(file: File) {
    if (file) {
      const gxImageUpload = this.imageUpload
        .nativeElement as HTMLGxImagePickerElement;
      const fileURL = await this.uriCacheService.store(file);
      this.src = fileURL;
      this.alt = gxImageUpload.alt;
      this.onImageChanged.emit(fileURL);
    }
    return;
  }

  translate(key: string) {
    return this.app.translate(key);
  }
}

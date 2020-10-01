import { Component, Input, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppContainer } from 'app/gx/base/app-container';
import { ImageUploadService } from './image-upload.service';
import { Title } from '@angular/platform-browser';
import { UriCacheService } from '../../../utils/uri-cache/uri-cache.service';

@Component({
  selector: 'gx-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [
    ImageUploadService,
  ]
})

export class ImageUploadComponent implements OnChanges {

  @Input() src = '';
  @Input() disabled = false;
  @Input() readonly = false;

  @Output() onImageChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('fileInput', { static: false }) file;

  src1 = '';
  show = false;
  modalTitle: string;
  uploading = false;

  updateButtonCaption = "Add Image";
  clearButtonVisible = false;

  constructor(
    protected uploadService: ImageUploadService,
    protected uriCacheService: UriCacheService,
    protected app: AppContainer,
    protected titleService: Title) {
  }

  ngOnChanges() {
    this.modalTitle = this.titleService.getTitle();
    this.updateButtons();
  }

  updateButtons() {
    if (!this.src || this.src === '') {
      this.updateButtonCaption = 'Add Image';
      this.clearButtonVisible = false;
    }
    else {
      this.updateButtonCaption = 'Change Image';
      this.clearButtonVisible = true;
    }
  }

  updateImageAction() {
    this.show = !this.show;
  }

  clearImageAction() {
    this.src = null;
    this.updateButtons();
    this.onImageChanged.emit('');
  }

  async fileSelectedAction() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.uploading = true;
        let result = await this.uploadService.uploadFile(files[key]);
        if (result.object_id) {
          await this.updateImageSrc(files[key]);
          this.updateImageUrl(result);
        }
        this.updateButtons();
        this.uploading = false;
        this.show = false;
        return;
      }
    }
  }

  closeAction() {
    this.show = false;
  }

  translate(key: string) {
    return this.app.translate(key);
  }

  updateImageSrc(file): Promise<any> {
    return new Promise(complete => {
      if (FileReader && file) {
        const fr = new FileReader();
        fr.onload = () => {
          this.src = fr.result.toString();
          complete();
        }
        fr.readAsDataURL(file);
      }
    });
  }

  updateImageUrl(uploadResult) {
    if (uploadResult.object_id) {
      this.uriCacheService.storeImage(uploadResult.object_id, this.src);
      this.onImageChanged.emit(uploadResult.object_id);
    }
  }
}
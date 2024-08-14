import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { AppContainer } from 'app/gx/base/app-container';
import { UriCacheService } from "app/gx/utils/uri-cache/uri-cache.service";
import { TranslatePipe } from "app/gx/utils/translate.pipe";
import { NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'gx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FileUploadComponent implements OnChanges {

  @Input() fileSource = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() accept = '';

  @Output() onFileChanged: EventEmitter<object> = new EventEmitter<object>();

  @ViewChild('fileInput', { static: false }) file;

  showDialog = false;
  modalTitle: string;
  uploading = false;
  fileShowName = '';

  constructor(
    protected uriCacheService: UriCacheService,
    protected app: AppContainer,
    protected titleService: Title) {
  }

  ngOnChanges() {
    this.modalTitle = this.titleService.getTitle();
    if (!this.fileShowName) {
      this.fileShowName = this.fileSource.slice(this.fileSource.lastIndexOf("/") + 1);
    }
  }

  triggerAction() {
    if (this.fileSource === '') {
      this.file.nativeElement.click();
    } else {
      this.showDialog = !this.showDialog;
    }
  }

  viewFile() {
    if (!this.showDialog) {
      this.app.open(this.fileSource);
    }
  }

  clearFileAction() {
    this.file.nativeElement.value = ''
    this.fileSource = '';
    this.uploading = false;
    this.onFileChanged.emit({ uri: '', name: '' });
  }

  async onFileSelected() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.uploading = true;
        const fileURL = await this.uriCacheService.store(files[key]);
        this.onFileChanged.emit({ uri: fileURL, name: files[key].name });
        this.uploading = false;
        this.showDialog = false;
        this.fileShowName = files[key].name;
        return;
      }
    }
  }

  closeAction() {
    this.showDialog = false;
  }

  translate(key: string) {
    return this.app.translate(key);
  }
}
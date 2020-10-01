import { Component, Input, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppContainer } from 'app/gx/base/app-container';
import { FileUploadService } from './file-upload.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'gx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    FileUploadService,
  ]
})

export class FileUploadComponent implements OnChanges {

  @Input() fileSource = '';
  @Input() disabled = false;
  @Input() readonly = false;

  @Output() onFileChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('fileInput', { static: false }) file;

  src1 = '';
  show = false;
  modalTitle: string;
  uploading = false;

  updateButtonCaption = "Add File";
  clearButtonVisible = false;

  constructor(
    protected uploadService: FileUploadService,
    protected app: AppContainer,
    protected titleService: Title) {
  }

  ngOnChanges() {
    this.modalTitle = this.titleService.getTitle();
    this.updateButtons();
  }

  updateButtons() {
    if (!this.fileSource || this.fileSource === '') {
      this.updateButtonCaption = 'Add File';
      this.clearButtonVisible = false;
    }
    else {
      this.updateButtonCaption = 'Change File';
      this.clearButtonVisible = true;
    }
  }

  updateFileAction() {
    this.show = !this.show;
  }

  clearFileAction() {
    this.fileSource = null;
    this.updateButtons();
    this.onFileChanged.emit('');
  }

  async fileSelectedAction() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.uploading = true;
        let result = await this.uploadService.uploadFile(files[key]);
        if (result.object_id) {
          await this.updateFileSrc(files[key]);
          this.updateFileUrl(result);
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

  updateFileSrc(file): Promise<any> {
    return new Promise(complete => {
      if (FileReader && file) {
        const fr = new FileReader();
        fr.onload = () => {
          this.file = fr.result.toString();
          complete();
        }
        fr.readAsDataURL(file);
      }
    });
  }

  updateFileUrl(uploadResult) {
    if (uploadResult.object_id) {
      this.onFileChanged.emit(uploadResult.object_id);
    }
  }
}
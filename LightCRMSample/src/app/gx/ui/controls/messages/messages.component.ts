import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { AppContainer } from 'app/gx/base/app-container';
import { UIMessage } from './ui-message.dt';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'gx-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnChanges {
  @Input() message: UIMessage;

  statusMessage: string;
  statusMessageType: string;
  statusOpened = false;
  statusCount = 0;
  statusDuration = 3;   // 3 seconds
  statusBarClass = "";

  modalTitle: string;
  modalMessage: string;
  modalOpened = false;

  confirmCaption: string;
  allowCancelAction = false;

  onConfirm: () => void;
  onCancel: () => void;

  constructor(protected app: AppContainer, protected titleService: Title) {
  }

  async ngOnChanges() {
    this.modalTitle = this.titleService.getTitle();
    if (this.message) {
      if (this.message.type === "message") {
        this.showStatusMessage();
      }
      else if (this.message.type === "messageWarning") {
        this.showStatusMessage('warning');
      }
      else if (this.message.type === "messageError") {
        this.showStatusMessage('error');
      }
      else if (this.message.type === "error") {
        this.showErrorMessage();
      }
      else if (this.message.type === "confirm") {
        this.showConfirmMessage();
      }
    }
  }

  showStatusMessage(type = 'info') {
    this.onConfirm = this.message.onConfirm ;
    this.statusBarClass = "show"
    this.statusCount = this.statusDuration;
    this.statusMessage = this.message.text;
    this.statusMessageType = type;
    if (!this.statusOpened) {
      this.statusOpened = true;
      let interval = setInterval(() => {
        if (this.statusCount > 0) {
          this.statusCount--;
        } else {
          this.statusBarClass = ""
          this.statusMessage = null;
          this.statusOpened = false;
          clearInterval(interval);
        }
      }, 1000);
    }
    if (this.onConfirm)
      this.onConfirm();
  }

  showErrorMessage() {
    this.onConfirm = this.message.onConfirm ;
    this.confirmCaption = this.translate("GXM_Ok");
    this.allowCancelAction = false;
    this.modalOpened = true;
    this.modalMessage = this.message.text;
  }

  showConfirmMessage() {
    this.onConfirm = this.message.onConfirm;
    this.onCancel = this.message.onCancel;
    this.confirmCaption = this.translate("GXM_Confirm");
    this.allowCancelAction = true;
    this.modalOpened = true;
    this.modalMessage = this.message.text;
  }

  closeAction() {
    this.modalOpened = false;
    if (this.onCancel)
      this.onCancel();
  }

  confirmAction() {
    this.modalOpened = false;
    if (this.onConfirm)
      this.onConfirm();
  }

  cancelAction() {
    this.modalOpened = false;
    if (this.onCancel)
      this.onCancel();
  }

  translate(key: string) {
    return this.app.translate(key);
  }
}

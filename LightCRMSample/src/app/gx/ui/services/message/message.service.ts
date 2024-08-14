import { Injectable, ComponentRef } from '@angular/core';
import { ModalMessageComponent } from './modal-message.component';
import { UIMessage } from './ui-message.dt';
import { ToastMessageComponent } from './toast-message.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  modalComponent: ComponentRef<ModalMessageComponent>;
  toastComponent: ComponentRef<ToastMessageComponent>;

  showToastMessage(viewContainerRef, appMessage: UIMessage) {

    if (!this.toastComponent) {
      this.toastComponent = viewContainerRef.createComponent(ToastMessageComponent) as ComponentRef<any>;
    }
    this.toastComponent.instance.appMessage = { ...appMessage, type: "message" };
  }

  showConfirmMessage(viewContainerRef, appMessage: UIMessage) {

    if (!this.modalComponent) {
      this.modalComponent = viewContainerRef.createComponent(ModalMessageComponent) as ComponentRef<any>;
    }
    this.modalComponent.instance.appMessage = { ...appMessage, type: "confirm" };
    this.modalComponent.instance.errorStatus = "open";
  }

  showModalMessage(viewContainerRef, appMessage: UIMessage) {

    if (!this.modalComponent) {
      this.modalComponent = viewContainerRef.createComponent(ModalMessageComponent) as ComponentRef<any>;
    }
    this.modalComponent.instance.appMessage = { ...appMessage, type: "message" };
    this.modalComponent.instance.errorStatus = "open";
  }

  hideMessage() {
    this.modalComponent.instance.errorStatus = null;
  }

}
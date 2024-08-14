import {
  publish as gxPublish,
  subscribe as gxSubscribe,
  unSubscribe as gxUnSubscribe,
} from "@genexus/web-standard-functions/dist/lib-esm/web/globalEvents";
import { Injectable, ViewContainerRef, inject } from '@angular/core';
import { MessageService } from "app/gx/ui/services/message/message.service";
import { Title } from '@angular/platform-browser';
import { AppContainer } from "app/gx/base/app-container";
import { ProgressService } from 'app/gx/ui/services/progress/progress.service';


@Injectable({
  providedIn: 'root',
})
export class WsfSubscriptionsService {

  private dsSetOptionSubscription: any;
  private messageFnSubscription: any
  private confirmFnSubscription: any

  messageService = inject(MessageService);
  titleService = inject(Title);
  app = inject(AppContainer);
  progressService = inject(ProgressService);

  start = (viewContainerRef: ViewContainerRef) => {

    // Start subscriptions to w-s-f function calls

    this.messageFnSubscription = gxSubscribe(
      "gx-standard-api-to-generator_msg",
      (id: string, msg: string, type: string) => {
        if (
          type.toLocaleLowerCase() === "nowait" ||
          type.toLocaleLowerCase() === "status"
        ) {
          this.messageService.showToastMessage(
            viewContainerRef,
            {
              id: id,
              title: this.titleService.getTitle(),
              text: msg,
            });
          gxPublish("gx-standard-api-to-generator_msg_" + id + "_ok");
        }
        else {
          this.progressService.hide();
          this.messageService.showModalMessage(
            viewContainerRef,
            {
              id: id,
              title: this.titleService.getTitle(),
              text: msg,
              confirmCaption: "GXM_Ok",
              onConfirm: () => {
                this.messageService.hideMessage();
                gxPublish("gx-standard-api-to-generator_msg_" + id + "_ok");
              },
            });
        }
      }
    );

    this.confirmFnSubscription = gxSubscribe(
      "gx-standard-api-to-generator_confirm",
      (id: string, msg: string) => {
        this.progressService.hide();
        this.messageService.showConfirmMessage(
          viewContainerRef,
          {
            id: id,
            title: this.titleService.getTitle(),
            text: msg,
            confirmCaption: "GXM_Confirm",
            cancelCaption: "GXM_cancel",
            onConfirm: () => {
              this.messageService.hideMessage();
              gxPublish("gx-standard-api-to-generator_confirm_" + id + "_ok");
            },
            onCancel: () => {
              this.messageService.hideMessage();
              gxPublish("gx-standard-api-to-generator_confirm_" + id + "_cancel");
            },
          });
      }
    );

    this.dsSetOptionSubscription = gxSubscribe(
      "gx-standard-api-to-generator_dsSetOption",
      (id: string, name: string, value: string) => {
        this.app.refreshUIContext();
        gxPublish("gx-standard-api-to-generator_dsSetOption_" + id + "_ok");
      }
    );

  }

  ngOnDestroy() {
    gxUnSubscribe(this.messageFnSubscription);
    gxUnSubscribe(this.confirmFnSubscription);
    gxUnSubscribe(this.dsSetOptionSubscription);
  }
}
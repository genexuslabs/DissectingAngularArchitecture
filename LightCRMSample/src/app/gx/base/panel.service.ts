import { inject } from '@angular/core';
import { Router } from "@angular/router";
import { msg } from "@genexus/web-standard-functions/dist/lib-esm/misc/msg";
import { GAMService } from "app/gx/auth/gam.service";
import { AppContainer } from "./app-container";
import { GxCollectionData } from "./gxcollection.dt";
import { TypeConversions } from "./type-conversion";
import { HttpResponse } from "@angular/common/http";

export type PanelServiceData<T> = {
  data: T;
  metadata: PanelServiceMetadata;
};

export type PanelServiceMetadata = {
  hasNextPage?: boolean;
  recordCount?: number;
  recordCountSupported: boolean;
};

export class PanelService {

  protected router = inject(Router);
  protected loginService = inject(GAMService);
  protected app = inject(AppContainer);

  gxids = [];
  oldData = {};

  get state() {
    return {
      gxids: this.gxids,
      oldData: this.oldData
    }
  }

  set state(o) {
    this.gxids = o?.gxids ?? [];
    this.oldData = o?.oldData ?? {};
  }

  start() {
    this.gxids = [];
  }

  getGxid(serviceId: number) {
    if (!this.gxids[serviceId]) {
      this.gxids[serviceId] = Math.floor(Math.random() * 100000000 + 1);
    }
    return this.gxids[serviceId];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Data conversions and manupulation to/from server
  //
  mergeDataToInstance(newData, currInstance, ignored, type) {
    // Collect data to update
    const toUpdate = [];
    for (const pty in newData) {
      if (
        (this.oldData[pty] == undefined ||
          this.oldData[pty] !== newData[pty]) &&
        ignored.indexOf(pty) == -1
      ) {
        toUpdate.push(pty);
      }
    }

    // Create and update new entity from new data
    const newInstance = TypeConversions.objectToClass(newData, type);
    for (const pty in currInstance) {
      if (toUpdate.indexOf(pty) == -1) {
        newInstance[pty] = currInstance[pty];
      }
    }
    // Register old data to check chagnes in next update
    this.oldData = newData;

    return newInstance;
  }

  responseToCollection<T>(response: HttpResponse<any>, type: { new(): T }) {
    return {
      data: new GxCollectionData<T>().setType(type).deserialize(response.body),
      metadata: TypeConversions.httpHeadersToResponseMetadata(response.headers),
    };
  }

  getJsonPayload(data: any): string {
    let jsonData: string | null = null;
    if (typeof data === "string") {
      jsonData = data;
    } else {
      jsonData = JSON.stringify(data, (key, value) => {
        if (key === "uiModel") {
          return undefined;
        }
        return value;
      });
    }
    return jsonData;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Error management
  //
  public async handleError(e: any): Promise<any> {
    let message = null;
    if (e && e.error && e.error.error && e.error.error.message) {
      message = e.error.error.message || e.message;
    } else if (e && e.message) {
      message = e.message;
    }
    if (message) {
      await msg(message);
    }
    return Promise.resolve(message || e);
  }
}

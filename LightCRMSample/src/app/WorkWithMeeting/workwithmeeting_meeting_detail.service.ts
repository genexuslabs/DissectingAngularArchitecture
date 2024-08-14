import { Injectable, inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

import { Settings } from 'app/app.settings';
import { AppContainer } from 'app/gx/base/app-container';
import { PanelService, PanelServiceData } from "app/gx/base/panel.service";
import { EndpointConnector } from "app/gx/base/endpoint.connector";
import { GAMService } from "app/gx/auth/gam.service";
import { UriCacheService } from 'app/gx/utils/uri-cache/uri-cache.service';
import { IBlob } from '@genexus/web-standard-functions/dist/lib-esm/types/IBlob';


import { format as Core_format } from '@genexus/web-standard-functions/dist/lib-esm/text/format';
import { BusinessComponent } from 'app/gx/base/business-component';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UITextblockElement } from 'app/gx/ui/model/ui-textblock';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { UITabElement } from 'app/gx/ui/model/ui-tab';
import { UITabpageElement } from 'app/gx/ui/model/ui-tab';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';

@Injectable()
export class WorkWithMeeting_Meeting_DetailService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithMeeting_Meeting_Detail = async (MeetingId: number, currInstance): Promise<WorkWithMeeting_Meeting_DetailData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithMeeting_Meeting_Detail"+ "?gxid="+this.getGxid(0)+ "&MeetingId="+'' + MeetingId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithMeeting_Meeting_DetailData);
    } catch (error) {
      return this.handleError(error);
    }
  }


}

export class WorkWithMeeting_Meeting_DetailLocalModel {
  Mode: string;
  MeetingId: number;

  constructor() {
    this.Mode = "";
    this.MeetingId = 0;

  }

}

export class WorkWithMeeting_Meeting_DetailData {
  MeetingId: number;
  MeetingTitle: string;

  _bc_md5_hash_WorkWithMeeting_Meeting_Detail: string;

  constructor() {
    this.MeetingId = 0;
    this.MeetingTitle = "";

    this._bc_md5_hash_WorkWithMeeting_Meeting_Detail = "";

  }

}


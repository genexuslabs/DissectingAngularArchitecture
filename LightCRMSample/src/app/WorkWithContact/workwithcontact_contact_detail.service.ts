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
import { MeetingData } from 'app/Meeting/meeting.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UITextblockElement } from 'app/gx/ui/model/ui-textblock';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { UITabElement } from 'app/gx/ui/model/ui-tab';
import { UITabpageElement } from 'app/gx/ui/model/ui-tab';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { MeetingService } from 'app/Meeting/meeting.service';

@Injectable()
export class WorkWithContact_Contact_DetailService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithContact_Contact_Detail = async (ContactId: number, CompanyId: number, currInstance): Promise<WorkWithContact_Contact_DetailData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithContact_Contact_Detail"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithContact_Contact_DetailData);
    } catch (error) {
      return this.handleError(error);
    }
  }


}

export class WorkWithContact_Contact_DetailLocalModel {
  Mode: string;
  ContactId: number;
  CompanyId: number;

  constructor() {
    this.Mode = "";
    this.ContactId = 0;
    this.CompanyId = 0;

  }

}

export class WorkWithContact_Contact_DetailData {
  ContactId: number;
  CompanyId: number;
  ContactName: string;

  _bc_md5_hash_WorkWithContact_Contact_Detail: string;

  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.ContactName = "";

    this._bc_md5_hash_WorkWithContact_Contact_Detail = "";

  }

}


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


import { GridControllerData } from 'app/gx/base/grid-data';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { UIListPagingType } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { msg as GeneXus__SD__Interop_msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { sdtMeetingData } from 'app/sdtMeeting/sdtmeeting.dt';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { GlobalEvents } from 'app/gx/base/global-events';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';

@Injectable()
export class WorkWithMeeting_Meeting_ListService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithMeeting_Meeting_List_Grid1 = async (Search: string, SearchText: string, start: number, count: number): Promise< PanelServiceData<GxCollectionData<WorkWithMeeting_Meeting_List_Grid1Data>> > => {
    try {
      const response = await EndpointConnector.getResponse(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithMeeting_Meeting_List_Grid1"+ "?gxid="+this.getGxid(0)+ "&Search="+Search+ "&SearchText="+SearchText+ "&start="+'' + start+ "&count="+'' + count, {cacheable: false, recordCount: true });
      return this.responseToCollection(response, WorkWithMeeting_Meeting_List_Grid1Data);
    } catch (error) {
      return this.handleError(error);
    }
  }


  DeleteMeeting = async (MeetingId?:any): Promise<any> => {
      const body = {
        MeetingId: MeetingId
      };
      try {
        const data = await EndpointConnector.postData1(this.http, Settings.SERVICE_API_ENDPOINT + "DeleteMeeting", this.getJsonPayload(body));
        return {
  };
      } catch (error) {
        return this.handleError(error);
      }
  };

}

export class WorkWithMeeting_Meeting_ListLocalModel {
  Meeting: sdtMeetingData;
  Bool: number;
  Ameetingid: number;

  constructor() {
    this.Meeting = new sdtMeetingData();
    this.Bool = 0;
    this.Ameetingid = 0;

  }

}

export class WorkWithMeeting_Meeting_ListData {
  Search: string;

  constructor() {
    this.Search = "";

  }

}

export class WorkWithMeeting_Meeting_List_Grid1Data {
  MeetingId: number;
  MeetingTitle: string;
  MeetingDate: GxDatetime;
  CompanyId: number;
  CompanyName: string;
  ContactId: number;
  ContactName: string;
  MeetingNote: string;
  MeetingGeolocation: string;
  MeetingAddress: string;

  Gxdesc_companyid: string;

  constructor() {
    this.MeetingId = 0;
    this.MeetingTitle = "";
    this.MeetingDate = new GxDatetime(0,0,0);
    this.CompanyId = 0;
    this.CompanyName = "";
    this.ContactId = 0;
    this.ContactName = "";
    this.MeetingNote = "";
    this.MeetingGeolocation = "";
    this.MeetingAddress = "";

    this.Gxdesc_companyid = "";

  }

}


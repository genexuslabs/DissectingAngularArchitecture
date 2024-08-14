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
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { BusinessComponent } from 'app/gx/base/business-component';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Injectable()
export class WorkWithContact_Contact_Section_MeetingService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithContact_Contact_Section_Meeting = async (ContactId: number, CompanyId: number, currInstance): Promise<WorkWithContact_Contact_Section_MeetingData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithContact_Contact_Section_Meeting"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithContact_Contact_Section_MeetingData);
    } catch (error) {
      return this.handleError(error);
    }
  }
  getWorkWithContact_Contact_Section_Meeting_GridMeeting = async (ContactId: number, CompanyId: number, start: number, count: number): Promise< PanelServiceData<GxCollectionData<WorkWithContact_Contact_Section_Meeting_GridMeetingData>> > => {
    try {
      const response = await EndpointConnector.getResponse(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithContact_Contact_Section_Meeting_GridMeeting"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId+ "&start="+'' + start+ "&count="+'' + count, {cacheable: false, recordCount: true });
      return this.responseToCollection(response, WorkWithContact_Contact_Section_Meeting_GridMeetingData);
    } catch (error) {
      return this.handleError(error);
    }
  }


}

export class WorkWithContact_Contact_Section_MeetingLocalModel {
  Meeting: MeetingData;
  Mode: string;
  ContactId: number;
  CompanyId: number;

  constructor() {
    this.Meeting = new MeetingData();
    this.Mode = "";
    this.ContactId = 0;
    this.CompanyId = 0;

  }

}

export class WorkWithContact_Contact_Section_MeetingData {
  ContactId: number;
  CompanyId: number;

  Gxdesc_companyid: string;
  _bc_md5_hash_WorkWithContact_Contact_Section_Meeting: string;

  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;

    this.Gxdesc_companyid = "";
    this._bc_md5_hash_WorkWithContact_Contact_Section_Meeting = "";

  }

}

export class WorkWithContact_Contact_Section_Meeting_GridMeetingData {
  MeetingId: number;
  MeetingDate: GxDatetime;
  MeetingTitle: string;
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
    this.MeetingDate = new GxDatetime(0,0,0);
    this.MeetingTitle = "";
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


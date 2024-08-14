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


import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UISelectElement } from 'app/gx/ui/model/ui-select';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';
import { UIHidecodeController } from 'app/gx/ui/model/ui-hidecode-controller';

@Injectable()
export class WorkWithMeeting_Meeting_Section_GeneralService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithMeeting_Meeting_Section_General = async (MeetingId: number, currInstance): Promise<WorkWithMeeting_Meeting_Section_GeneralData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithMeeting_Meeting_Section_General"+ "?gxid="+this.getGxid(0)+ "&MeetingId="+'' + MeetingId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithMeeting_Meeting_Section_GeneralData);
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidHcProvider = async (CompanyName: string): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithMeeting_Meeting_Section_General/CompanyId_hc"+ "?gxid="+this.getGxid(0)+ "&CompanyName="+CompanyName);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidHcrevProvider = async (CompanyId: number): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithMeeting_Meeting_Section_General/CompanyId_hc_rev"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidSgProvider = async (CompanyName: string): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithMeeting_Meeting_Section_General/CompanyId_sg"+ "?gxid="+this.getGxid(0)+ "&CompanyName="+CompanyName);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  get_promptCompanyName = async (CompanyId: number): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithMeeting_Meeting_Section_General/AfterAttCompanyIdCompanyName/"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  get_promptContactId = async (ContactId: number, CompanyId: number): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithMeeting_Meeting_Section_General/AfterAttContactIdContactName/"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }


}

export class WorkWithMeeting_Meeting_Section_GeneralLocalModel {
  Mode: string;
  MeetingId: number;

  constructor() {
    this.Mode = "";
    this.MeetingId = 0;

  }

}

export class WorkWithMeeting_Meeting_Section_GeneralData {
  MeetingId: number;
  CompanyName: string;
  ContactName: string;
  MeetingTitle: string;
  MeetingDate: GxDatetime;
  MeetingNote: string;
  MeetingGeolocation: string;
  CompanyId: number;
  ContactId: number;
  MeetingAddress: string;

  Gxdesc_companyid: string;
  _bc_md5_hash_WorkWithMeeting_Meeting_Section_General: string;

  constructor() {
    this.MeetingId = 0;
    this.CompanyName = "";
    this.ContactName = "";
    this.MeetingTitle = "";
    this.MeetingDate = new GxDatetime(0,0,0);
    this.MeetingNote = "";
    this.MeetingGeolocation = "";
    this.CompanyId = 0;
    this.ContactId = 0;
    this.MeetingAddress = "";

    this.Gxdesc_companyid = "";
    this._bc_md5_hash_WorkWithMeeting_Meeting_Section_General = "";

  }

  public get $MeetingDate() {
    return [new GxDatetime(0,0,0),"LocalizedTime"];
  }


}


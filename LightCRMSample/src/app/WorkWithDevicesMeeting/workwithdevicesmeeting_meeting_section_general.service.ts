import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

import { Settings } from 'app/app.settings';
import { PanelService } from "app/gx/base/panel.service";
import { EndpointConnector } from "app/gx/base/endpoint.connector";
import { LoginService } from "app/gx/auth/login.service";
import { Type, Transform } from 'class-transformer';
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';


import { BusinessComponent } from 'app/gx/base/business-component';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Injectable()
export class WorkWithDevicesMeeting_Meeting_Section_GeneralService extends PanelService {

    constructor(private http: HttpClient, private _router:Router, private _loginService: LoginService) {
      super(_router, _loginService);
    }

  async getWorkWithDevicesMeeting_Meeting_Section_General( MeetingId : number): Promise<WorkWithDevicesMeeting_Meeting_Section_GeneralData> {
        try {
            return await EndpointConnector.getDataForType<WorkWithDevicesMeeting_Meeting_Section_GeneralData>(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithDevicesMeeting_Meeting_Section_General"+ "?gxid="+this.getGxid(0)+ "&MeetingId="+'' + MeetingId, WorkWithDevicesMeeting_Meeting_Section_GeneralData);
        	
        }
        catch (error) {
          return this.handleError(error);
        }

  }
  async get_promptCompanyName( CompanyId : number): Promise<any> {
        try {
        	var response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithDevicesMeeting_Meeting_Section_General/AfterAttCompanyIdCompanyName"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
            return response as any
        	
        }
        catch (error) {
          return this.handleError(error);
        }

  }
  async get_promptContactName( ContactId : number, CompanyId : number): Promise<any> {
        try {
        	var response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithDevicesMeeting_Meeting_Section_General/AfterAttContactIdContactName"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId);
            return response as any
        	
        }
        catch (error) {
          return this.handleError(error);
        }

  }


  // Actions

}

// Data structures
export class WorkWithDevicesMeeting_Meeting_Section_GeneralData {
  MeetingId: number;CompanyName: string;ContactName: string;MeetingTitle: string;MeetingDate: Date;MeetingNote: string;MeetingGeolocation: string;ContactId: number;CompanyId: number;
  _bc_md5_hash_WorkWithDevicesMeeting_Meeting_Section_General: string;


  constructor() {
    this.MeetingId = 0;
    this.CompanyName = "";
    this.ContactName = "";
    this.MeetingTitle = "";
    this.MeetingDate = new Date();
    this.MeetingNote = "";
    this.MeetingGeolocation = "";
    this.ContactId = 0;
    this.CompanyId = 0;

    this._bc_md5_hash_WorkWithDevicesMeeting_Meeting_Section_General = "";

  }
}


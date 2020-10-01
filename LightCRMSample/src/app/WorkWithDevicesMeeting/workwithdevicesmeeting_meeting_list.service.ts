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


import { GridControllerData } from 'app/gx/base/grid-dataset';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { msg as GeneXus__SD__Interop_msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { sdtMeetingData } from 'app/sdtMeeting/sdtmeeting.dt';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';
import { UITableElement } from 'app/gx/ui/model/ui-table';

@Injectable()
export class WorkWithDevicesMeeting_Meeting_ListService extends PanelService {

    constructor(private http: HttpClient, private _router:Router, private _loginService: LoginService) {
      super(_router, _loginService);
    }

  async getWorkWithDevicesMeeting_Meeting_List_Grid1( start : number, count : number): Promise<GxCollectionData<WorkWithDevicesMeeting_Meeting_List_Grid1Data>> {
        try {
        	
        	return await EndpointConnector.getDataCollectionForType<WorkWithDevicesMeeting_Meeting_List_Grid1Data>(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithDevicesMeeting_Meeting_List_Grid1"+ "?gxid="+this.getGxid(0)+ "&start="+'' + start+ "&count="+'' + count, WorkWithDevicesMeeting_Meeting_List_Grid1Data);	
        }
        catch (error) {
          return this.handleError(error);
        }

  }


  // Actions
  async DeleteMeeting(MeetingId?:any) : Promise<any> {
      let body = {
        MeetingId: MeetingId
      };
      try {
        var response = await EndpointConnector.postData(this.http, Settings.SERVICE_API_ENDPOINT + "DeleteMeeting", body );
        return response;
      }
  	catch(error)
      {
        return this.handleError(error);
      }
  }


}

// Data structures
export class WorkWithDevicesMeeting_Meeting_List_Grid1Data {
  MeetingId: number;MeetingTitle: string;

  constructor() {
    this.MeetingId = 0;
    this.MeetingTitle = "";

  }
}


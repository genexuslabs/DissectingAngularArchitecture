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
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { UIListElement } from 'app/gx/ui/model/ui-list';

@Injectable()
export class WorkWithDevicesCompany_Company_Section_ContactService extends PanelService {

    constructor(private http: HttpClient, private _router:Router, private _loginService: LoginService) {
      super(_router, _loginService);
    }

  async getWorkWithDevicesCompany_Company_Section_Contact_Grid1( CompanyId : number, start : number, count : number): Promise<GxCollectionData<WorkWithDevicesCompany_Company_Section_Contact_Grid1Data>> {
        try {
        	
        	return await EndpointConnector.getDataCollectionForType<WorkWithDevicesCompany_Company_Section_Contact_Grid1Data>(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithDevicesCompany_Company_Section_Contact_Grid1"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId+ "&start="+'' + start+ "&count="+'' + count, WorkWithDevicesCompany_Company_Section_Contact_Grid1Data);	
        }
        catch (error) {
          return this.handleError(error);
        }

  }


  // Actions

}

// Data structures
export class WorkWithDevicesCompany_Company_Section_Contact_Grid1Data {
  ContactId: number;CompanyId: number;ContactName: string;ContactPhoto: string;

  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.ContactName = "";
    this.ContactPhoto = "";

  }
}


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
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Injectable()
export class WorkWithDevicesContact_Contact_Section_GeneralService extends PanelService {

    constructor(private http: HttpClient, private _router:Router, private _loginService: LoginService) {
      super(_router, _loginService);
    }

  async getWorkWithDevicesContact_Contact_Section_General( ContactId : number, CompanyId : number): Promise<WorkWithDevicesContact_Contact_Section_GeneralData> {
        try {
            return await EndpointConnector.getDataForType<WorkWithDevicesContact_Contact_Section_GeneralData>(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithDevicesContact_Contact_Section_General"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId, WorkWithDevicesContact_Contact_Section_GeneralData);
        	
        }
        catch (error) {
          return this.handleError(error);
        }

  }
  async get_promptCompanyName( CompanyId : number): Promise<any> {
        try {
        	var response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithDevicesContact_Contact_Section_General/AfterAttCompanyIdCompanyName"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
            return response as any
        	
        }
        catch (error) {
          return this.handleError(error);
        }

  }


  // Actions

}

// Data structures
export class WorkWithDevicesContact_Contact_Section_GeneralData {
  ContactId: number;CompanyId: number;ContactPhoto: string;ContactName: string;CompanyName: string;ContactEmail: string;
  _bc_md5_hash_WorkWithDevicesContact_Contact_Section_General: string;


  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.ContactPhoto = "";
    this.ContactName = "";
    this.CompanyName = "";
    this.ContactEmail = "";

    this._bc_md5_hash_WorkWithDevicesContact_Contact_Section_General = "";

  }
}


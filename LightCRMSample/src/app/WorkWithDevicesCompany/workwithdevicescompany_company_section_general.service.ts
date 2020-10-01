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
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Injectable()
export class WorkWithDevicesCompany_Company_Section_GeneralService extends PanelService {

    constructor(private http: HttpClient, private _router:Router, private _loginService: LoginService) {
      super(_router, _loginService);
    }

  async getWorkWithDevicesCompany_Company_Section_General( CompanyId : number): Promise<WorkWithDevicesCompany_Company_Section_GeneralData> {
        try {
            return await EndpointConnector.getDataForType<WorkWithDevicesCompany_Company_Section_GeneralData>(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithDevicesCompany_Company_Section_General"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId, WorkWithDevicesCompany_Company_Section_GeneralData);
        	
        }
        catch (error) {
          return this.handleError(error);
        }

  }


  // Actions

}

// Data structures
export class WorkWithDevicesCompany_Company_Section_GeneralData {
  CompanyId: number;CompanyLogo: string;CompanyName: string;CompanyAddress: string;CompanyPhone: string;
  _bc_md5_hash_WorkWithDevicesCompany_Company_Section_General: string;


  constructor() {
    this.CompanyId = 0;
    this.CompanyLogo = "";
    this.CompanyName = "";
    this.CompanyAddress = "";
    this.CompanyPhone = "";

    this._bc_md5_hash_WorkWithDevicesCompany_Company_Section_General = "";

  }
}


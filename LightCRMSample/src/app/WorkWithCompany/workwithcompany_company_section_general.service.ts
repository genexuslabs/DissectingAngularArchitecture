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


import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { UISelectElement } from 'app/gx/ui/model/ui-select';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';
import { UIHidecodeController } from 'app/gx/ui/model/ui-hidecode-controller';

@Injectable()
export class WorkWithCompany_Company_Section_GeneralService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithCompany_Company_Section_General = async (CompanyId: number, currInstance): Promise<WorkWithCompany_Company_Section_GeneralData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithCompany_Company_Section_General"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithCompany_Company_Section_GeneralData);
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidHcProvider = async (CompanyName: string): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithCompany_Company_Section_General/CompanyId_hc"+ "?gxid="+this.getGxid(0)+ "&CompanyName="+CompanyName);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidHcrevProvider = async (CompanyId: number): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithCompany_Company_Section_General/CompanyId_hc_rev"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidSgProvider = async (CompanyName: string): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithCompany_Company_Section_General/CompanyId_sg"+ "?gxid="+this.getGxid(0)+ "&CompanyName="+CompanyName);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }


  async _upload_for_Company(blob: IBlob): Promise<IBlob> {
    const file = await this._uriCache.getFile(blob.uri);
    if (file) {
      const response = await EndpointConnector.uploadGXobject(this.http, 'Company', file);
      const blob1 = TypeConversions.CloneInstance(blob);
      blob1.uri = response.object_id;
      return blob1;
    }
    return blob;
  }
}

export class WorkWithCompany_Company_Section_GeneralLocalModel {
  Mode: string;
  CompanyId: number;

  constructor() {
    this.Mode = "";
    this.CompanyId = 0;

  }

}

export class WorkWithCompany_Company_Section_GeneralData {
  CompanyId: number;
  CompanyLogo: GxImage;
  CompanyName: string;
  CompanyAddress: string;
  CompanyPhone: string;

  Gxdesc_companyid: string;
  _bc_md5_hash_WorkWithCompany_Company_Section_General: string;

  constructor() {
    this.CompanyId = 0;
    this.CompanyLogo = new GxImage();
    this.CompanyName = "";
    this.CompanyAddress = "";
    this.CompanyPhone = "";

    this.Gxdesc_companyid = "";
    this._bc_md5_hash_WorkWithCompany_Company_Section_General = "";

  }

}


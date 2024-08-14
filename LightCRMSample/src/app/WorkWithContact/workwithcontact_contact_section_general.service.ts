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
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UISelectElement } from 'app/gx/ui/model/ui-select';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';
import { UIHidecodeController } from 'app/gx/ui/model/ui-hidecode-controller';

@Injectable()
export class WorkWithContact_Contact_Section_GeneralService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithContact_Contact_Section_General = async (ContactId: number, CompanyId: number, currInstance): Promise<WorkWithContact_Contact_Section_GeneralData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithContact_Contact_Section_General"+ "?gxid="+this.getGxid(0)+ "&ContactId="+'' + ContactId+ "&CompanyId="+'' + CompanyId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithContact_Contact_Section_GeneralData);
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidHcProvider = async (CompanyName: string): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithContact_Contact_Section_General/CompanyId_hc"+ "?gxid="+this.getGxid(0)+ "&CompanyName="+CompanyName);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidHcrevProvider = async (CompanyId: number): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithContact_Contact_Section_General/CompanyId_hc_rev"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  getctrlCompanyidSgProvider = async (CompanyName: string): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithContact_Contact_Section_General/CompanyId_sg"+ "?gxid="+this.getGxid(0)+ "&CompanyName="+CompanyName);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }
  get_promptCompanyName = async (CompanyId: number): Promise<any> => {
    try {
      const response = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "sdsvc_WorkWithContact_Contact_Section_General/AfterAttCompanyIdCompanyName/"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return response as any
    } catch (error) {
      return this.handleError(error);
    }
  }


  async _upload_for_Contact(blob: IBlob): Promise<IBlob> {
    const file = await this._uriCache.getFile(blob.uri);
    if (file) {
      const response = await EndpointConnector.uploadGXobject(this.http, 'Contact', file);
      const blob1 = TypeConversions.CloneInstance(blob);
      blob1.uri = response.object_id;
      return blob1;
    }
    return blob;
  }
}

export class WorkWithContact_Contact_Section_GeneralLocalModel {
  Mode: string;
  ContactId: number;
  CompanyId: number;

  constructor() {
    this.Mode = "";
    this.ContactId = 0;
    this.CompanyId = 0;

  }

}

export class WorkWithContact_Contact_Section_GeneralData {
  ContactId: number;
  CompanyId: number;
  ContactPhoto: GxImage;
  ContactName: string;
  CompanyName: string;
  ContactEmail: string;

  Gxdesc_companyid: string;
  _bc_md5_hash_WorkWithContact_Contact_Section_General: string;

  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.ContactPhoto = new GxImage();
    this.ContactName = "";
    this.CompanyName = "";
    this.ContactEmail = "";

    this.Gxdesc_companyid = "";
    this._bc_md5_hash_WorkWithContact_Contact_Section_General = "";

  }

}


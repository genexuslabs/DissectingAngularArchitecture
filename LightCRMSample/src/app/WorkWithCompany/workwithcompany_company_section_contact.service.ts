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
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Injectable()
export class WorkWithCompany_Company_Section_ContactService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithCompany_Company_Section_Contact = async (CompanyId: number, currInstance): Promise<WorkWithCompany_Company_Section_ContactData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithCompany_Company_Section_Contact"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithCompany_Company_Section_ContactData);
    } catch (error) {
      return this.handleError(error);
    }
  }
  getWorkWithCompany_Company_Section_Contact_GridContact = async (CompanyId: number, start: number, count: number): Promise< PanelServiceData<GxCollectionData<WorkWithCompany_Company_Section_Contact_GridContactData>> > => {
    try {
      const response = await EndpointConnector.getResponse(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithCompany_Company_Section_Contact_GridContact"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId+ "&start="+'' + start+ "&count="+'' + count, {cacheable: false, recordCount: true });
      return this.responseToCollection(response, WorkWithCompany_Company_Section_Contact_GridContactData);
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

export class WorkWithCompany_Company_Section_ContactLocalModel {
  Contact: ContactData;
  Mode: string;
  CompanyId: number;

  constructor() {
    this.Contact = new ContactData();
    this.Mode = "";
    this.CompanyId = 0;

  }

}

export class WorkWithCompany_Company_Section_ContactData {
  CompanyId: number;

  Gxdesc_companyid: string;
  _bc_md5_hash_WorkWithCompany_Company_Section_Contact: string;

  constructor() {
    this.CompanyId = 0;

    this.Gxdesc_companyid = "";
    this._bc_md5_hash_WorkWithCompany_Company_Section_Contact = "";

  }

}

export class WorkWithCompany_Company_Section_Contact_GridContactData {
  ContactId: number;
  CompanyId: number;
  CompanyName: string;
  ContactName: string;
  ContactPhoto: GxImage;
  ContactEmail: string;

  Gxdesc_companyid: string;

  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.CompanyName = "";
    this.ContactName = "";
    this.ContactPhoto = new GxImage();
    this.ContactEmail = "";

    this.Gxdesc_companyid = "";

  }

}


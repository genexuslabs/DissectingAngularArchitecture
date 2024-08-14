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


import { format as Core_format } from '@genexus/web-standard-functions/dist/lib-esm/text/format';
import { ContactData } from 'app/Contact/contact.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UITextblockElement } from 'app/gx/ui/model/ui-textblock';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { UITabElement } from 'app/gx/ui/model/ui-tab';
import { UITabpageElement } from 'app/gx/ui/model/ui-tab';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { ContactService } from 'app/Contact/contact.service';

@Injectable()
export class WorkWithCompany_Company_DetailService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getWorkWithCompany_Company_Detail = async (CompanyId: number, currInstance): Promise<WorkWithCompany_Company_DetailData> => {
    try {
      const newData = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + "WorkWithCompany_Company_Detail"+ "?gxid="+this.getGxid(0)+ "&CompanyId="+'' + CompanyId);
      return this.mergeDataToInstance(newData, currInstance, [], WorkWithCompany_Company_DetailData);
    } catch (error) {
      return this.handleError(error);
    }
  }


}

export class WorkWithCompany_Company_DetailLocalModel {
  Mode: string;
  CompanyId: number;

  constructor() {
    this.Mode = "";
    this.CompanyId = 0;

  }

}

export class WorkWithCompany_Company_DetailData {
  CompanyId: number;
  CompanyName: string;

  _bc_md5_hash_WorkWithCompany_Company_Detail: string;

  constructor() {
    this.CompanyId = 0;
    this.CompanyName = "";

    this._bc_md5_hash_WorkWithCompany_Company_Detail = "";

  }

}


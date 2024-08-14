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
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';

@Injectable()
export class SelectCompany_Level_DetailService extends PanelService {
  private http = inject(HttpClient);
  private _uriCache = inject(UriCacheService);


  getSelectCompany_Level_Detail_Grid1 = async (Pcompanyid: number, SearchText: string, start: number, count: number): Promise< PanelServiceData<GxCollectionData<SelectCompany_Level_Detail_Grid1Data>> > => {
    try {
      const response = await EndpointConnector.getResponse(this.http, Settings.SERVICE_API_ENDPOINT + "SelectCompany_Level_Detail_Grid1"+ "?gxid="+this.getGxid(0)+ "&Pcompanyid="+'' + Pcompanyid+ "&SearchText="+SearchText+ "&start="+'' + start+ "&count="+'' + count, {cacheable: false, recordCount: false });
      return this.responseToCollection(response, SelectCompany_Level_Detail_Grid1Data);
    } catch (error) {
      return this.handleError(error);
    }
  }


}

export class SelectCompany_Level_DetailLocalModel {
  Pcompanyid: number;

  constructor() {
    this.Pcompanyid = 0;

  }

}

export class SelectCompany_Level_Detail_Grid1Data {
  CompanyId: number;
  CompanyName: string;
  CompanyLogo: GxImage;

  constructor() {
    this.CompanyId = 0;
    this.CompanyName = "";
    this.CompanyLogo = new GxImage();

  }

}


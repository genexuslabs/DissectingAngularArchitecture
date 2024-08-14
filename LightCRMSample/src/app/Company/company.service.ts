import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http"

import { AppContainer } from 'app/gx/base/app-container';
import { EndpointConnector } from 'app/gx/base/endpoint.connector';
import { Settings } from 'app/app.settings';
import { BusinessComponentService } from 'app/gx/base/business-component';
import { UriCacheService } from 'app/gx/utils/uri-cache/uri-cache.service';
import { IBlob } from '@genexus/web-standard-functions/dist/lib-esm/types/IBlob';
import { CompanyData } from './company.dt';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

@Injectable()
export class CompanyService extends BusinessComponentService<CompanyData>{
  protected http = inject(HttpClient);
  protected app = inject(AppContainer);
  private _uriCache = inject(UriCacheService);

  async initialize(): Promise<CompanyData> {
    try {
      this.setError(0) ;
      const data = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/_default');
      return this.objectToClass(data, CompanyData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async get(CompanyId:number ): Promise<CompanyData> {
    try {
      this.setError(0);
      const data = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/'+ '' + CompanyId );
      return this.objectToClass(data, CompanyData);
    }
    catch (error) {
      this.setError(1, error);
      const data = new CompanyData();
      data.CompanyId = CompanyId;
      return data;
    }
  }
  async delete(Company:CompanyData): Promise<CompanyData> {
    try {
      this.setError(0);
      const data = await EndpointConnector.deleteData(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/'+ '' + Company.CompanyId);
      return this.objectToClass(data, CompanyData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async post(bcCompany:CompanyData): Promise<CompanyData> {
    try {
      this.setError(0);
      const Company = TypeConversions.CloneInstance(bcCompany);
      Company.CompanyLogo = await this._upload_for_Company(Company.CompanyLogo) as GxImage;

      const data = await EndpointConnector.postData1(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/'+ '' + Company.CompanyId, TypeConversions.serializeClass(Company));
      return this.objectToClass(data, CompanyData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async put(bcCompany:CompanyData): Promise<CompanyData> {
    try {
      this.setError(0);
      const Company = TypeConversions.CloneInstance(bcCompany);
      Company.CompanyLogo = await this._upload_for_Company(Company.CompanyLogo) as GxImage;

      const data = await EndpointConnector.putData(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/'+ '' + Company.CompanyId, TypeConversions.serializeClass(Company));
      return this.objectToClass(data, CompanyData);
    }
    catch (error) {
      this.setError(1, error);
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
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

import { EndpointConnector } from 'app/gx/base/endpoint.connector';
import { Settings } from 'app/app.settings';
import { BusinessComponentService } from 'app/gx/base/business-component';
import { CompanyData } from './company.dt';

@Injectable()
export class CompanyService extends BusinessComponentService<CompanyData>{

  constructor(protected http: HttpClient) {
    super( http);
  }

  async initialize(): Promise<CompanyData> {
    try {
      return await EndpointConnector.getDataForType<CompanyData>(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/_default', CompanyData)
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async get( CompanyId:number ): Promise<CompanyData> {
    try {
      return await EndpointConnector.getDataForType<CompanyData>(this.http, Settings.SERVICE_API_ENDPOINT + 'Company/'+ CompanyId , CompanyData)
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async delete( Company:CompanyData): Promise<CompanyData> {
    try {
      var response = await this.http.delete(Settings.SERVICE_API_ENDPOINT + 'Company/'+ Company.CompanyId).toPromise();
      return response as CompanyData;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async post( Company:CompanyData): Promise<CompanyData> {
    try {
      var response = await this.http.post(Settings.SERVICE_API_ENDPOINT + 'Company/'+ Company.CompanyId, JSON.stringify(Company), { headers: this.getHeaders('post')}).toPromise();
      return response as CompanyData;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async put( Company:CompanyData): Promise<CompanyData> {
    try {
      var response = await this.http.put(Settings.SERVICE_API_ENDPOINT + 'Company/'+ Company.CompanyId, JSON.stringify(Company), { headers: this.getHeaders('put')}).toPromise();
      return response as CompanyData;
    }
    catch (error) {
      this.handleError(error);
    }
  }


}

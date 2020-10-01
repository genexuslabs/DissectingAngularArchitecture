import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

import { EndpointConnector } from 'app/gx/base/endpoint.connector';
import { Settings } from 'app/app.settings';
import { BusinessComponentService } from 'app/gx/base/business-component';
import { ContactData } from './contact.dt';

@Injectable()
export class ContactService extends BusinessComponentService<ContactData>{

  constructor(protected http: HttpClient) {
    super( http);
  }

  async initialize(): Promise<ContactData> {
    try {
      return await EndpointConnector.getDataForType<ContactData>(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/_default', ContactData)
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async get( ContactId:number , CompanyId:number ): Promise<ContactData> {
    try {
      return await EndpointConnector.getDataForType<ContactData>(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/'+ ContactId + ',' + CompanyId , ContactData)
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async delete( Contact:ContactData): Promise<ContactData> {
    try {
      var response = await this.http.delete(Settings.SERVICE_API_ENDPOINT + 'Contact/'+ Contact.ContactId+ ',' + + Contact.CompanyId).toPromise();
      return response as ContactData;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async post( Contact:ContactData): Promise<ContactData> {
    try {
      var response = await this.http.post(Settings.SERVICE_API_ENDPOINT + 'Contact/'+ Contact.ContactId+ ',' + + Contact.CompanyId, JSON.stringify(Contact), { headers: this.getHeaders('post')}).toPromise();
      return response as ContactData;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async put( Contact:ContactData): Promise<ContactData> {
    try {
      var response = await this.http.put(Settings.SERVICE_API_ENDPOINT + 'Contact/'+ Contact.ContactId+ ',' + + Contact.CompanyId, JSON.stringify(Contact), { headers: this.getHeaders('put')}).toPromise();
      return response as ContactData;
    }
    catch (error) {
      this.handleError(error);
    }
  }


}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http"

import { AppContainer } from 'app/gx/base/app-container';
import { EndpointConnector } from 'app/gx/base/endpoint.connector';
import { Settings } from 'app/app.settings';
import { BusinessComponentService } from 'app/gx/base/business-component';
import { UriCacheService } from 'app/gx/utils/uri-cache/uri-cache.service';
import { IBlob } from '@genexus/web-standard-functions/dist/lib-esm/types/IBlob';
import { ContactData } from './contact.dt';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

@Injectable()
export class ContactService extends BusinessComponentService<ContactData>{
  protected http = inject(HttpClient);
  protected app = inject(AppContainer);
  private _uriCache = inject(UriCacheService);

  async initialize(): Promise<ContactData> {
    try {
      this.setError(0) ;
      const data = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/_default');
      return this.objectToClass(data, ContactData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async get(ContactId:number , CompanyId:number ): Promise<ContactData> {
    try {
      this.setError(0);
      const data = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/'+ '' + ContactId + ',' + '' + CompanyId );
      return this.objectToClass(data, ContactData);
    }
    catch (error) {
      this.setError(1, error);
      const data = new ContactData();
      data.ContactId = ContactId;
      data.CompanyId = CompanyId;
      return data;
    }
  }
  async delete(Contact:ContactData): Promise<ContactData> {
    try {
      this.setError(0);
      const data = await EndpointConnector.deleteData(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/'+ '' + Contact.ContactId+ ','+ '' + Contact.CompanyId);
      return this.objectToClass(data, ContactData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async post(bcContact:ContactData): Promise<ContactData> {
    try {
      this.setError(0);
      const Contact = TypeConversions.CloneInstance(bcContact);
      Contact.ContactPhoto = await this._upload_for_Contact(Contact.ContactPhoto) as GxImage;

      const data = await EndpointConnector.postData1(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/'+ '' + Contact.ContactId+ ','+ '' + Contact.CompanyId, TypeConversions.serializeClass(Contact));
      return this.objectToClass(data, ContactData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async put(bcContact:ContactData): Promise<ContactData> {
    try {
      this.setError(0);
      const Contact = TypeConversions.CloneInstance(bcContact);
      Contact.ContactPhoto = await this._upload_for_Contact(Contact.ContactPhoto) as GxImage;

      const data = await EndpointConnector.putData(this.http, Settings.SERVICE_API_ENDPOINT + 'Contact/'+ '' + Contact.ContactId+ ','+ '' + Contact.CompanyId, TypeConversions.serializeClass(Contact));
      return this.objectToClass(data, ContactData);
    }
    catch (error) {
      this.setError(1, error);
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
import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http"

import { AppContainer } from 'app/gx/base/app-container';
import { EndpointConnector } from 'app/gx/base/endpoint.connector';
import { Settings } from 'app/app.settings';
import { BusinessComponentService } from 'app/gx/base/business-component';
import { UriCacheService } from 'app/gx/utils/uri-cache/uri-cache.service';
import { IBlob } from '@genexus/web-standard-functions/dist/lib-esm/types/IBlob';
import { MeetingData } from './meeting.dt';
import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

@Injectable()
export class MeetingService extends BusinessComponentService<MeetingData>{
  protected http = inject(HttpClient);
  protected app = inject(AppContainer);
  private _uriCache = inject(UriCacheService);

  async initialize(): Promise<MeetingData> {
    try {
      this.setError(0) ;
      const data = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/_default');
      return this.objectToClass(data, MeetingData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async get(MeetingId:number ): Promise<MeetingData> {
    try {
      this.setError(0);
      const data = await EndpointConnector.getData(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ '' + MeetingId );
      return this.objectToClass(data, MeetingData);
    }
    catch (error) {
      this.setError(1, error);
      const data = new MeetingData();
      data.MeetingId = MeetingId;
      return data;
    }
  }
  async delete(Meeting:MeetingData): Promise<MeetingData> {
    try {
      this.setError(0);
      const data = await EndpointConnector.deleteData(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ '' + Meeting.MeetingId);
      return this.objectToClass(data, MeetingData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async post(bcMeeting:MeetingData): Promise<MeetingData> {
    try {
      this.setError(0);
      const Meeting = TypeConversions.CloneInstance(bcMeeting);
      const data = await EndpointConnector.postData1(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ '' + Meeting.MeetingId, TypeConversions.serializeClass(Meeting));
      return this.objectToClass(data, MeetingData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async put(bcMeeting:MeetingData): Promise<MeetingData> {
    try {
      this.setError(0);
      const Meeting = TypeConversions.CloneInstance(bcMeeting);
      const data = await EndpointConnector.putData(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ '' + Meeting.MeetingId, TypeConversions.serializeClass(Meeting));
      return this.objectToClass(data, MeetingData);
    }
    catch (error) {
      this.setError(1, error);
    }
  }
  async _upload_for_Meeting(blob: IBlob): Promise<IBlob> {
    const file = await this._uriCache.getFile(blob.uri);
    if (file) {
      const response = await EndpointConnector.uploadGXobject(this.http, 'Meeting', file);
      const blob1 = TypeConversions.CloneInstance(blob);
      blob1.uri = response.object_id;
      return blob1;
    }
    return blob;
  }
} 
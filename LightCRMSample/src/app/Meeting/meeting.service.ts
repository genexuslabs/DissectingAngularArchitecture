import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

import { EndpointConnector } from 'app/gx/base/endpoint.connector';
import { Settings } from 'app/app.settings';
import { BusinessComponentService } from 'app/gx/base/business-component';
import { MeetingData } from './meeting.dt';

@Injectable()
export class MeetingService extends BusinessComponentService<MeetingData>{

  constructor(protected http: HttpClient) {
    super( http);
  }

  async initialize(): Promise<MeetingData> {
    try {
      return await EndpointConnector.getDataForType<MeetingData>(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/_default', MeetingData)
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async get( MeetingId:number ): Promise<MeetingData> {
    try {
      return await EndpointConnector.getDataForType<MeetingData>(this.http, Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ MeetingId , MeetingData)
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async delete( Meeting:MeetingData): Promise<MeetingData> {
    try {
      var response = await this.http.delete(Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ Meeting.MeetingId).toPromise();
      return response as MeetingData;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async post( Meeting:MeetingData): Promise<MeetingData> {
    try {
      var response = await this.http.post(Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ Meeting.MeetingId, JSON.stringify(Meeting), { headers: this.getHeaders('post')}).toPromise();
      return response as MeetingData;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async put( Meeting:MeetingData): Promise<MeetingData> {
    try {
      var response = await this.http.put(Settings.SERVICE_API_ENDPOINT + 'Meeting/'+ Meeting.MeetingId, JSON.stringify(Meeting), { headers: this.getHeaders('put')}).toPromise();
      return response as MeetingData;
    }
    catch (error) {
      this.handleError(error);
    }
  }


}

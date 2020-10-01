import { Injectable } from '@angular/core';
import { LoginService } from '../../../auth/login.service';
import { HttpClient } from "@angular/common/http"
import { EndpointConnector } from '../../../base/endpoint.connector';

@Injectable()
export class FileUploadService {

  constructor( private _http: HttpClient, private _loginService: LoginService) {
  }

  uploadFile( file: File ): Promise<any> {
    return EndpointConnector.uploadGXobject( this._http, this._loginService, file);
  }
}
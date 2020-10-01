import { Injectable } from '@angular/core';
import { LoginService } from '../../../auth/login.service';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Settings} from 'app/app.settings';
import { EndpointConnector } from '../../../base/endpoint.connector';

@Injectable()
export class ImageUploadService {

  constructor( private _http: HttpClient, private _loginService: LoginService) {
  }

  uploadFile( file: File ): Promise<any> {
    return EndpointConnector.uploadGXobject( this._http, this._loginService, file);
  }
}
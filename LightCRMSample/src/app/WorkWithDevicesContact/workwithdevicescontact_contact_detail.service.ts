import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

import { Settings } from 'app/app.settings';
import { PanelService } from "app/gx/base/panel.service";
import { EndpointConnector } from "app/gx/base/endpoint.connector";
import { LoginService } from "app/gx/auth/login.service";
import { Type, Transform } from 'class-transformer';
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';



@Injectable()
export class WorkWithDevicesContact_Contact_DetailService extends PanelService {

    constructor(private http: HttpClient, private _router:Router, private _loginService: LoginService) {
      super(_router, _loginService);
    }


  // Actions

}

// Data structures

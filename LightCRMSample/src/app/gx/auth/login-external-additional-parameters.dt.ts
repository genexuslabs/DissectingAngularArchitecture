import { GxCollectionData } from "app/gx/base/gxcollection.dt";

export class LoginExternalAdditionalParametersData {
  Repository: string;
  AuthenticationTypeName: string;
  OTPStep: Number;
  UseTwoFactorAuthentication: Boolean
  Properties = undefined;

  public get _Properties() {
    if (this._Properties == undefined) {
      this.Properties = new GxCollectionData<LoginExternalAdditionalParameters_PropertyData>().setType(LoginExternalAdditionalParameters_PropertyData);
    }
    return this.Properties;
  }

  public set _Properties(value) {
    this.Properties = value;
  }
}

export class LoginExternalAdditionalParameters_PropertyData {
  Id: string;
  Value: string;
}
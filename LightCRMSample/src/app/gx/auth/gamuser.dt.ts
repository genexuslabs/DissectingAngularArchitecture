export class GAMUser {
  FirstName: string;
  LastName: string;
  EMail: string;
  Login: string;
  GUID: string;
  ExternalId: string;
  IsAutoRegisteredUser: boolean;

  public getId(): string {
    return this.GUID;
  }

  public getEmail(): string {
    return this.EMail;
  }

  public get(): any {
    return this;
  }

  public getLogin(): string {
    return this.Login
  }

  public getName(): string {
    return this.FirstName + " " + this.LastName;
  }

  public getExternalId(): string {
    return this.ExternalId;
  }

  public isAnonymous(): boolean {
    return this.IsAutoRegisteredUser;
  }

}
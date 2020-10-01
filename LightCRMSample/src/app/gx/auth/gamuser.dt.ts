export class GAMUser {
  FirstName: string;
  LastName: string;
  EMail: string;
  Login: string;
  GUID: string;
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

  public isAnonymous(): boolean {
    return this.IsAutoRegisteredUser;
  }

}
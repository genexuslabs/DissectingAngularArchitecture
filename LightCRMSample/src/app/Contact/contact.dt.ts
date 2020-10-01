
export class ContactData {
  ContactId: number;
  CompanyId: number;
  CompanyName: string;
  ContactName: string;
  ContactPhoto: string;
  ContactEmail: string;
  gx_md5_hash: string;

  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.CompanyName = "";
    this.ContactName = "";
    this.ContactPhoto = "";
    this.ContactEmail = "";
    this.gx_md5_hash = "";

  }
}
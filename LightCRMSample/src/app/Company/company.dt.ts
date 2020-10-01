
export class CompanyData {
  CompanyId: number;
  CompanyName: string;
  CompanyAddress: string;
  CompanyPhone: string;
  CompanyLogo: string;
  gx_md5_hash: string;

  constructor() {
    this.CompanyId = 0;
    this.CompanyName = "";
    this.CompanyAddress = "";
    this.CompanyPhone = "";
    this.CompanyLogo = "";
    this.gx_md5_hash = "";

  }
}
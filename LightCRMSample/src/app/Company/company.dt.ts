import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

export class CompanyData {
  CompanyId: number;

  CompanyName: string;

  CompanyAddress: string;

  CompanyPhone: string;

  CompanyLogo: GxImage;

  gx_md5_hash: string;


  constructor() {
    this.CompanyId = 0;
    this.CompanyName = "";
    this.CompanyAddress = "";
    this.CompanyPhone = "";
    this.CompanyLogo = new GxImage();
    this.gx_md5_hash = "";

  }


} 
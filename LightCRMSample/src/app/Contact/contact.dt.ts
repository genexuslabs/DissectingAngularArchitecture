import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

export class ContactData {
  ContactId: number;

  CompanyId: number;

  CompanyName: string;

  ContactName: string;

  ContactPhoto: GxImage;

  ContactEmail: string;

  gx_md5_hash: string;


  constructor() {
    this.ContactId = 0;
    this.CompanyId = 0;
    this.CompanyName = "";
    this.ContactName = "";
    this.ContactPhoto = new GxImage();
    this.ContactEmail = "";
    this.gx_md5_hash = "";

  }


} 
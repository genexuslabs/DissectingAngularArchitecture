import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

export class MeetingData {
  MeetingId: number;

  MeetingDate: GxDatetime;

  MeetingTitle: string;

  CompanyId: number;

  CompanyName: string;

  ContactId: number;

  ContactName: string;

  MeetingNote: string;

  MeetingGeolocation: string;

  MeetingAddress: string;

  gx_md5_hash: string;


  constructor() {
    this.MeetingId = 0;
    this.MeetingDate = new GxDatetime(0,0,0);
    this.MeetingTitle = "";
    this.CompanyId = 0;
    this.CompanyName = "";
    this.ContactId = 0;
    this.ContactName = "";
    this.MeetingNote = "";
    this.MeetingGeolocation = "";
    this.MeetingAddress = "";
    this.gx_md5_hash = "";

  }


} 
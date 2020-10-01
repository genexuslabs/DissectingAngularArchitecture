
export class MeetingData {
  MeetingId: number;
  MeetingDate: Date;
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
    this.MeetingDate = new Date();
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
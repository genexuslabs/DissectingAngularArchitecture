import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { GxSdtData } from 'app/gx/base/gxsdt.dt';

export class Messages extends GxCollectionData<Message> {
  constructor() {
    super();
    this.setType(Message);
  }
}

export class Message extends GxSdtData {
  Id: string;
  Type: number;
  Description: string;

  constructor() {
    super();
    this.Id = "";
    this.Type = 0;
    this.Description = "";
  }
}

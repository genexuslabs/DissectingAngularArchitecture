import { GxCollectionData } from '../base/gxcollection.dt';

export class Messages extends GxCollectionData<Message> {
}

export class Message {
  Id: string;
  Type: number;
  Description: string;
}

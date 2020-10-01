import { GxCollectionData } from "./gxcollection.dt";

export class GxSdtData extends GxCollectionData<any> {

  static fromJson(obj: any, json: string, ) {
    Object.assign(obj, JSON.parse(json));
  }

  static toJson(obj: any): string {
    return JSON.stringify(obj)
  }

}

import { Geography } from '@genexus/web-standard-functions/dist/lib-esm/types/geography';
import { ISerializable } from "@genexus/web-standard-functions/dist/lib-esm/types/type-serialization";

export class GxGeography extends Geography implements ISerializable {
  
  serialize() {
    return this.toString();
  }
  
  deserialize(x) {
    return Geography.fromString(x);
  }
 
}
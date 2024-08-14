import { TypeConversions } from "./type-conversion";
import { ISerializable } from "@genexus/web-standard-functions/dist/lib-esm/types/type-serialization";

export class GxSdtData implements ISerializable {

  toJson(): string {
    return JSON.stringify(this.serialize());
  }

  fromJson(json: string) {
    this.initialize();
    Object.assign(this, this.deserialize(JSON.parse(json)));
  }

  initialize() {
  }

  serialize() {
    return TypeConversions.sweepClassToObject(this);
  }

  deserialize(obj) {
    return TypeConversions.sweepObjectToClass(obj, this);
  }

}


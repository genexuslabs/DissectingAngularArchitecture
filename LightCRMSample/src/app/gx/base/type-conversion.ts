import { GxCollectionData } from "./gxcollection.dt";
import { ISerializable, isSerializable } from "@genexus/web-standard-functions/dist/lib-esm/types/type-serialization";
import { GxBigNumber } from "@genexus/web-standard-functions/dist/lib-esm/types/gxbignumber";
import { HttpHeaders } from "@angular/common/http";
import { PanelServiceMetadata } from "./panel.service";

export class TypeConversions {
  ///////////////////////////////////////////////////////////////////////////////////////
  // Object <-> Class conversion and serialization

  static objectToClass<T>(obj, type: { new(): T }): any {
    const inst = TypeConversions.CreateInstance(type, Array.isArray(obj));
    if (isSerializable(inst)) {
      return (inst as ISerializable).deserialize(obj);
    } else if (obj && typeof obj === "object") {
      return TypeConversions.sweepObjectToClass(obj, inst);
    } else {
      return obj;
    }
  }

  static sweepObjectToClass<T>(obj, inst: T) {
    for (const pty of Object.keys(obj)) {
      if (obj[pty] === null || obj[pty] === undefined) {
        inst[pty] = obj[pty];
      } else {
        const instPtyValue = TypeConversions.getClassPropertyDefault(inst, pty);
        if (typeof instPtyValue === "object") {
          let ptyType = instPtyValue.constructor;
          if (instPtyValue instanceof GxCollectionData) {
            ptyType = (instPtyValue as GxCollectionData<any>).itemClass;
          }
          inst[pty] = TypeConversions.objectToClass(obj[pty], ptyType);
        } else {
          inst[pty] = TypeConversions.fixTypeToClass(obj[pty], inst[pty]);
        }
      }
    }
    return inst;
  }

  static getClassPropertyDefault(inst, pty) {
    if (inst[`\$${pty}`]) {
      return inst[`\$${pty}`][0];
    }
    return inst[`_${pty}`] ?? inst[pty]
  }

  static fixTypeToClass(sourceValue, targetValue) {
    if (typeof sourceValue === "string" && typeof targetValue === "number") {
      // Numbers should need conversion from string to number type
      return +sourceValue;
    }
    return sourceValue;
  }

  static classToObject<T>(obj, type: { new(): T } = null) {
    if (isSerializable(obj)) {
      return (obj as ISerializable).serialize();
    } else if (typeof obj === "object") {
      return TypeConversions.sweepClassToObject(obj);
    } else {
      return obj;
    }
  }

  static sweepClassToObject(inst) {
    const obj = {};
    for (const pty in inst) {
      if (pty.startsWith("_gx")) continue; // Exclude '_gx' properties
      if (inst[pty] === null || inst[pty] === undefined) {
        obj[pty] = inst[pty];
      } else if (typeof inst[pty] === "object") {
        let ptyType = inst[pty].constructor;
        if (inst[pty] instanceof GxCollectionData) {
          const itemType = (inst[pty] as GxCollectionData<any>).itemClass;
          ptyType = itemType;
        }
        obj[pty] = TypeConversions.classToObject(inst[pty], ptyType);
      } else {
        obj[pty] = TypeConversions.fixTypeToObject(inst[pty], obj[pty]);
      }
    }
    return obj;
  }

  static fixTypeToObject(sourceValue, targetValue) {
    return sourceValue;
  }

  static serializeClass(obj): string {
    return JSON.stringify(this.classToObject(obj));
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Type management helpers
  static isTypeOf(type, targetType): boolean {
    const obj = TypeConversions.CreateInstance(type);
    return obj instanceof targetType;
  }

  static CreateInstance<T>(
    type: { new(): T; name: string },
    isCollection = false
  ) {
    if (isCollection) {
      return new GxCollectionData<T>().setType(type);
    } else {
      return type ? new type() : {};
    }
  }

  static CloneInstance(obj) {
    if (typeof obj === "object") {
      const type = obj.constructor;
      return Object.assign(TypeConversions.CreateInstance(type), obj);
    } else {
      return obj;
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // UI date/datetime/time functions
  // * Empty date/datetime/time = ''

  static UINumberFromString(s): number {
    if (Number.isNaN(+s)) {
      return 0;
    }
    return +s;
  }

  static bigNumberFromString(s: string) {
    return new GxBigNumber(s);
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // DATE equality comparer
  static eqDate(d1: Date, d2: Date): boolean {
    return d1.getTime() == d2.getTime();
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // HTTP helpers
  static httpHeadersToResponseMetadata(
    headers: HttpHeaders
  ): PanelServiceMetadata {
    return {
      hasNextPage: headers.get("Hasnextpage")
        ? headers.get("Hasnextpage") === "true"
        : null,
      recordCount:
        headers.get("Recordcount") && headers.get("Recordcount") != "-1"
          ? parseInt(headers.get("Recordcount"))
          : null,
      recordCountSupported:
        headers.get("Recordcountsupported")?.toLowerCase() !== "false",
    };
  }
}

export class Typespec {
  isCollection: boolean;
  type: any;
}

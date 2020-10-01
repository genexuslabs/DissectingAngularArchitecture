import { GxCollectionData } from "./gxcollection.dt";
import { plainToClassFromExist, classToPlain } from "class-transformer";
import { gxRowNumberId } from './grid-dataset';

export class TypeConversions {

  static arrayToCollection<T>(items?: Array<any>, c?: { new(): T; }): GxCollectionData<T> {
    const collection: GxCollectionData<T> = Object.create(
      GxCollectionData.prototype
    );
    if (items) {
      let idx = 0;
      items.forEach(element => {
        const item = TypeConversions.objectToClass<T>(element, c);
        item[gxRowNumberId] = idx++;
        collection.push(item);
      });
    }
    return collection;

  }

  static objectToClass<T>(obj: any, c: { new(): T; }) {
    const obj1 = plainToClassFromExist(new c(), obj);
    return TypeConversions.convertDateContent(obj1, new c());
  }

  static classToObject(obj: any) {
    return classToPlain(obj);
  }

  static convertDateContent(o1: any, c: any): any {
    for (let p in o1) {
      if (c[p] && c[p] instanceof Date) {
        let d = new Date(0, 0, 0, 0, 0, 0);
        if (o1[p] instanceof Date) continue; // hack , this should be handled in previous phases.
        if (o1[p].indexOf("T") > -1) {
          // Format = yyyy-mm-ddThh:mm:ss -> UTC
          const datetimeS = o1[p].split("T");
          const dateS = datetimeS[0].split("-");
          const timeS = datetimeS[1].split(":");
          if (+dateS[0] === 1) {
            d = new Date();
            d.setUTCHours(+timeS[0]);
            d.setUTCMinutes(+timeS[1]);
            d.setUTCSeconds(+timeS[2] || 0);
          } else {
            d = new Date(Date.UTC(+dateS[0], +dateS[1] - 1, +dateS[2], +timeS[0], +timeS[1] || 0, +timeS[2] || 0));
          }
        } else {
          // Format = yyyy-mm-dd -> local
          if (o1[p] !== "0000-00-00") {
            const dateS = o1[p].split("-");
            d = new Date(+dateS[0], +dateS[1] - 1, +dateS[2], 0, 0, 0);
          } else {
            d = null;
          }
        }
        o1[p] = d;
      }
    }
    return o1;
  }

  static timeToISOString(d: Date): string {
    let s = '';
    if (d) {
      const tzo = d.getTimezoneOffset();
      const d1 = new Date(d.getTime() - tzo * 60000);
      const s1 = d1.toISOString();
      const t = s1.indexOf('T');
      if (t > -1) {
        s = s1.substring(t + 1, s1.length);
        s = s.replace('Z', '');
        if (s.indexOf(".") > -1) {
          s = s.substring(0, s.indexOf("."));
        }
      }
    }
    return s;
  }

  static dateToISOString(d: Date): string {
    let s = ''
    if (d) {
      try {
        const tzo = d.getTimezoneOffset();
        const d1 = new Date(d.getTime() - tzo * 60000);
        const s1 = d1.toISOString();
        s = s1.substring(0, s1.indexOf('T'));
        return s
      } catch {
        s = '';
      }
    }
    return s;
  }

  static datetimeToISOString(d: Date): string {
    let s = '';
    if (d) {
      const tzo = d.getTimezoneOffset();
      const d1 = new Date(d.getTime() - tzo * 60000);
      s = d1.toISOString().replace('Z', '');
    }
    return s;
  }

  static datetimeFromISOString(s: string): Date {
    let d: Date;
    const datetimeS = s.split("T");
    if (datetimeS.length > 1) {
      const dateS = datetimeS[0].split("-");
      const timeS = datetimeS[1].split(":");
      d = new Date(Date.UTC(+dateS[0], +dateS[1] - 1, +dateS[2], +timeS[0], +timeS[1], +timeS[2]));
    }
    else if (s.indexOf("-") > 1) {
      const dateS = datetimeS[0].split("-");
      d = new Date(Date.UTC(+dateS[0], +dateS[1] - 1, +dateS[2]));
    }
    else if (s.indexOf(":") > -1) {
      const timeS = datetimeS[0].split(":");
      d = new Date(Date.UTC(1, 1, 1, +timeS[0], +timeS[1] || 0, +timeS[2] || 0));
    }
    else {
      d = new Date(0, 0, 0);
    }
    if (!TypeConversions.isValidDate(d)) {
      // Nos ISO, try to convert from any supported fromat
      d = new Date(s);
    }
    const tzo = d.getTimezoneOffset();
    d = new Date(d.getTime() + tzo * 60000);
    return d;
  }

  static isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
  }
}

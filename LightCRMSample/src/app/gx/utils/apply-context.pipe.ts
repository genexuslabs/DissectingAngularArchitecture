import { Pipe, PipeTransform } from "@angular/core";
import { TypeConversions } from "app/gx/base/type-conversion";

@Pipe({
  name: "applyContext",
  standalone: true,
})
export class ApplyContextPipe implements PipeTransform {

  transform(s: string, context: any): string {
    return this.buildWithContext(context, s);
  }

  buildWithContext(context: any, uri: string) {
    if (uri) {
      const startParmsPos = uri.indexOf("?");
      if (startParmsPos >= 0) {
        const parms = [];
        for (let p of uri.substr(startParmsPos + 1).split(",")) {
          if (p.startsWith("&")) {
            p = p.substr(1);
          }
          if (context[p] !== undefined) {
            const value = TypeConversions.classToObject(context[p]);
            parms.push(value);
          } else {
            parms.push(p);
          }
        }
        return uri.substr(0, startParmsPos) + "?" + parms.join(",");
      }
    }
    return uri;
  }
}

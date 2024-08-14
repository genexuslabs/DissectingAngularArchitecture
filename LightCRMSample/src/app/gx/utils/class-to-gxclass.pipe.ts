import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "classToGxClass",
  standalone: true,
})
export class ClassToGxClassPipe implements PipeTransform {
  private static cache = new Map<string, string>();
  private static readonly properties: {
    [key: string]: { flag: number; suffix: string };
  } = {
    gridRow: { flag: 1, suffix: "--row" },
    gridEvenRow: { flag: 2, suffix: "--even-row" },
    gridOddRow: { flag: 4, suffix: "--odd-row" },
    gridColumn: { flag: 8, suffix: "--column" },
    gridHeaderRow: { flag: 16, suffix: "--header-row" },
    gridColumnHeader: { flag: 32, suffix: "--column-header" },
    gridSelectedRow: { flag: 64, suffix: "--selected-row" },
    gridHoverRow: { flag: 128, suffix: "--hover-row" },
    gridColumnHidden: { flag: 256, suffix: "--column-hidden" },
    gridFocusedRow: { flag: 512, suffix: "--focused-row" },
  };

  transform(baseClasses: string, gxprops: string[]): string {
    if (baseClasses) {
      const key = this.getCacheKey(baseClasses, gxprops);
      return (
        ClassToGxClassPipe.cache.get(key) ??
        this.transformAndCache(key, baseClasses, gxprops)
      );
    } else {
      return "";
    }
  }

  private getCacheKey(baseClasses: string, gxprops: string[]): string {
    return (
      baseClasses +
      "_" +
      gxprops.reduce(
        (flags, property) =>
          flags + ClassToGxClassPipe.properties[property].flag,
        0
      )
    );
  }

  private transformAndCache(
    key: string,
    baseClasses: string,
    gxprops: string[]
  ): string {
    ClassToGxClassPipe.cache.set(
      key,
      baseClasses
        .split(/[\s,]+/)
        .map((baseClass) =>
          gxprops
            .map(
              (property) =>
                baseClass + ClassToGxClassPipe.properties[property].suffix
            )
            .join(" ")
        )
        .join(" ")
    );

    return ClassToGxClassPipe.cache.get(key);
  }
}

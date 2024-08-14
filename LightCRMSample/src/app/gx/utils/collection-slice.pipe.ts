import { Pipe, PipeTransform } from "@angular/core";
import { GxCollectionData } from "../base/gxcollection.dt";

@Pipe({
  name: 'collectionSlice',
  standalone: true
})
export class CollectionSlicePipe<T> implements PipeTransform {

  constructor() { }

  transform(collection: GxCollectionData<T>, start: number, end: number): GxCollectionData<T> {
    return GxCollectionData.fromArray<T>(collection.slice(start, end));
  }
}

import { Pipe, PipeTransform } from "@angular/core";
import { UriCacheService } from "./uri-cache.service";

@Pipe({
    name: 'loadCachedUri'
})
export class LoadCachedUriPipe implements PipeTransform {

  constructor( private urlCacheService: UriCacheService ) { }
  
  transform(uri: string, args?: any): any {
    return this.urlCacheService.getImage( uri);
  }
}
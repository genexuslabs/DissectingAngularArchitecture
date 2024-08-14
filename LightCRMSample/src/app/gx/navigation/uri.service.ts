import { ComponentRef, Injectable, ViewContainerRef, inject } from "@angular/core";
import { LazyLoaderService } from "../base/lazy-loader.service";

@Injectable({
  providedIn: "root",
})
export class UriService {

  lazyLoaderService = inject(LazyLoaderService);

  /**
   * Dynamically creates a component given its name and the host element ref
   * @param componentName 
   * @param viewContainerRef 
   * @returns 
   */
  async loadComponent<T>( 
    componentName:string, 
    viewContainerRef:ViewContainerRef
  ): Promise<ComponentRef<T>> {
    const componentFactory = await this.lazyLoaderService.findComponent(componentName);
    viewContainerRef.clear();
    return viewContainerRef.createComponent(componentFactory);
  }

  /**
   * Looks for a route to dynamically load a panel, considering panel or ww variants, accepting "sd:" spec in the given url.
   * @param callString
   *      Accepted format: ['sd:']'<module>.<object_name>' | ['sd:']'<module>.<object_name>?<encoded_parameters>'
   * @param parameters
   *      Call parameters, if there are parameters in both callString and parameters => all are included
   * @returns
   *      [uri, parameters] where uri is the route to the panel
   */
  async parseDynamicUrl(
    callString: string,
    parameters: string[] = []
  ): Promise<[string, string[]]> {
    const url = callString.startsWith("sd:")
      ? callString.substring(3)
      : callString;
    return await this.parseSDCall(url, parameters);
  }

  /**
   * Looks for a route to dynamically load a panel, considering panel or ww variants.
   * @param callString
   *      Accepted format: '<module>.<object_name>' | '<module>.<object_name>?<encoded_parameters>'
   * @param parameters
   *      Call parameters, if there are parameters in both callString and parameters => all are included
   * @returns
   *      [uri, parameters] where uri is the route to the panel
   */
  async parseSDCall(
    callString: string,
    parameters: string[] = []
  ): Promise<[string, string[]]> {
    // Normalize parameters
    const [uriTokens, uriParameters] = this.parseCallString(callString);
    const [uri, sdParms] = await this.lazyLoaderService.findComponentRoute(uriTokens);
    return [uri, [...parameters, ...uriParameters, ...sdParms]];
  }

  /**
   * Resolves the call to a PRC in the backend, building the method name required to make the call to a backend PRC.
   * @param callString
   *      Accepted format: '<module>.<object_name>' | '<module>.<object_name>?<encoded_parameters>'
   * @param parameters
   *      Call parameters, if there are parameters in both callString and parameters => all are included
   * @returns
   *      [name, parameters] where name is the method that calls the server PRC
   */
  async parsePRCCall(
    callString: string,
    parameters: string[] = []
  ): Promise<[string, string[]]> {
    // Normalize parameters
    const [callTokens, callParameters] = this.parseCallString(callString);
    return [callTokens.join("__"), [...parameters, ...callParameters]];
  }

  /**
   * Parse a dynamic call spec to get URI string elements
   * @param callString
   *      Accepted format: '<module>.<object_name>' | '<module>.<object_name>?<encoded_parameters>'
   * @returns
   *      The elements that conform the given uri
   */
  parseCallString(callString: string): [string[], string[]] {
    const endUri = callString.indexOf("?");
    if (endUri >= 0) {
      // Parameters included in callString
      const callParms = callString
        .substring(endUri + 1)
        .split(",")
        .map((p) => this.decodeURI_ex(p));
      return [callString.substring(0, endUri).split("."), callParms];
    } else {
      return [callString.split("."), []];
    }
  }

  decodeURI_ex(uri) {
    return decodeURI(uri.replace(/\+/g, "%20"));
  }

}


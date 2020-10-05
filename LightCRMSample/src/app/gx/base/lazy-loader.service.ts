import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LazyLoaderService {

  loadedModules = {};

  constructor(
    private router: Router,
    private factoryResolver: ComponentFactoryResolver
  ) { }

  async findComponentFactory(componentPath: string): Promise<ComponentFactory<any>> {
    const cfg = this.findComponentConfig(componentPath, this.router.config);
    if (cfg) {
      const comp = cfg.component;
      const factory = this.factoryResolver.resolveComponentFactory(comp);
      return new Promise((resolve) => { resolve(factory) });
    }
    return null;
  }

  async findComponentRoute(componentPath: string): Promise<string> {
    const cfg = this.findComponentConfig(componentPath, this.router.config);
    return cfg ? cfg.path : null;
  }

  findComponentConfig(typeName: string, routes): any {
    const path = typeName.replace(/^\w+\./g, "").toLocaleLowerCase();
    for (const route of routes) {
      if (route.path.toLocaleLowerCase().indexOf(path) >= 0) {
        return route;
      }
      else if (route.loadChildren) {
        const newRoutes = route._loadedConfig.routes;
        return this.findComponentConfig(typeName, newRoutes);
      }
    }
  }
}
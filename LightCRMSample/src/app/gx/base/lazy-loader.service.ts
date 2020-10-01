import { Injectable, Injector, Compiler, NgModuleFactory, NgModuleRef, ComponentFactory } from '@angular/core';
import { AppModule } from "app/app.module";

@Injectable({
  providedIn: 'root'
})
export class LazyLoaderService {

  loadedModules = {};

  constructor(
    private injector: Injector,
    private compiler: Compiler,
    private appRef: NgModuleRef<AppModule>
  ) { }

  async findComponentFactory(componentPath: string): Promise<ComponentFactory<any>> {
    return await this.findFactoryInModules(componentPath, this.appRef);
  }

  async findFactoryInModules(typeName: string, moduleRef: any): Promise<ComponentFactory<any>> {
    const path = typeName.replace(/^\w+\./g, "").toLocaleLowerCase();
    for (const route of moduleRef.instance.routes) {
      if (route.path.toLocaleLowerCase().indexOf(path) >= 0) {
        return moduleRef.componentFactoryResolver.resolveComponentFactory(route.component);
      }
      else if (route.loadChildren) {
        const tempModule = await route.loadChildren();
        let moduleFactory;
        if (tempModule instanceof NgModuleFactory) {
          // For AOT
          moduleFactory = tempModule;
        } else {
          // For JIT
          if (this.loadedModules[route.path]) {
            // Already JITed
            moduleFactory = this.loadedModules[route.path];
          } else {
            moduleFactory = await this.compiler.compileModuleAsync(tempModule);
            this.loadedModules[route.path] = moduleFactory;
          }
        }
        const moduleRef = moduleFactory.create(this.injector);
        return await this.findFactoryInModules(typeName, moduleRef);
      }
    }
  }

  async findComponentRoute(componentPath: string): Promise<string> {
    return await this.findComponentRouteInModules(componentPath, this.appRef);
  }

  async findComponentRouteInModules(typeName: string, moduleRef: any): Promise<string> {
    const path = typeName.replace(/^\w+\./g, "").toLocaleLowerCase();
    for (const route of moduleRef.instance.routes) {
      if (route.path.toLocaleLowerCase().indexOf(path) >= 0) {
        return route.path;
      }
      else if (route.loadChildren) {
        const tempModule = await route.loadChildren();
        let moduleFactory;
        if (tempModule instanceof NgModuleFactory) {
          // For AOT
          moduleFactory = tempModule;
        } else {
          // For JIT
          if (this.loadedModules[route.path]) {
            // Already JITed
            moduleFactory = this.loadedModules[route.path];
          } else {
            moduleFactory = await this.compiler.compileModuleAsync(tempModule);
            this.loadedModules[route.path] = moduleFactory;
          }
        }
        const moduleRef = moduleFactory.create(this.injector);
        return this.findComponentRouteInModules(typeName, moduleRef);
      }
    }
  }
}
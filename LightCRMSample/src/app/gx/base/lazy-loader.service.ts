import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class LazyLoaderService {
  router = inject(Router);

  async findComponent(
    componentPath: string
  ): Promise<any> {
    const cfg = await this.findComponentConfig(
      componentPath,
      this.router.config
    );
    if (cfg) {
      if (cfg.loadComponent) {
        return new Promise((resolve) => {
          resolve(cfg.loadComponent());
        });
      }
    }
    return null;
  }

  async findComponentRoute(
    componentTokens: string[]
  ): Promise<[string, string[]]> {
    // Try to load a panel => componentTokens = [module1,module2...panel]
    const panelCfg = await this.findComponentConfig(
      componentTokens.join("/"),
      this.router.config
    );
    if (panelCfg) {
      return [panelCfg.path, []];
    }

    // Try to load a WW => componentTokens = [module1, module2, ..., WW, Section, Detail]
    if (componentTokens.length >= 3) {
      let route = componentTokens[0];
      for (let i = 1; i < componentTokens.length; i++) {
        if (componentTokens.length - i >= 3) {
          route = `${route}/${componentTokens[i]}`;
        } else if (componentTokens.length - i === 2) {
          route = `${route}-${componentTokens[i]}`;
        } else if (componentTokens.length - i === 1)
          route = `${route}_${componentTokens[i]}`;
      }
      const wwCfg = await this.findComponentConfig(route, this.router.config);
      if (wwCfg) return [wwCfg.path, []];
    }

    // Try to load a WW => componentTokens = [module1, module2, ..., WW, Section, Detail, Update|Create|Delete]
    if (
      componentTokens.length >= 4 &&
      ["create", "update", "delete"].indexOf(
        componentTokens[componentTokens.length - 1].toLowerCase()
      ) > -1
    ) {
      const componentTokens1 = componentTokens.slice(
        0,
        componentTokens.length - 1
      );
      let route = componentTokens1[0];
      for (let i = 1; i < componentTokens1.length; i++) {
        if (componentTokens1.length - i >= 3) {
          route = `${route}/${componentTokens1[i]}`;
        } else if (componentTokens1.length - i === 2) {
          route = `${route}-${componentTokens1[i]}`;
        } else if (componentTokens1.length - i === 1)
          route = `${route}_${componentTokens1[i]}`;
      }
      const wwCfg = await this.findComponentConfig(route, this.router.config);
      if (wwCfg)
        return [
          wwCfg.path,
          [this.mapToMode(componentTokens[componentTokens.length - 1])],
        ];
    }
    console.warn(
      `Problem in lazy-loading.findComponentConfig for '${componentTokens.join(
        "."
      )}'. Could not resolve using routing info. Ensure '${componentTokens.join(
        "."
      )}' is available in app package.`
    );
    return null;
  }

  private mapToMode(command: string): string {
    switch (command.toLowerCase()) {
      case "create":
        return "'INS'";
      case "update":
        return "'UPD'";
      case "delete":
        return "'DLT'";
    }
    return "";
  }

  private async findComponentConfig(typeName: string, routes): Promise<any> {
    const path = typeName.replace(/^\w+\./g, "").toLocaleLowerCase();
    for (const route of routes) {
      if (this.comparePanelName(route.path, path)) {
        return route;
      } else if (route.loadChildren) {
        const childRoutes = await route.loadChildren();
        return await this.findComponentConfig(typeName, childRoutes);
      }
    }
  }

  private comparePanelName(name: string, panelToMatch: string): boolean {
    if (panelToMatch && panelToMatch.indexOf("-") > -1) {
      // panelToMatch = "<panel>-<level>-<section>"
      return name.toLocaleLowerCase() === panelToMatch;
    } else if (
      panelToMatch &&
      name.toLocaleLowerCase().startsWith(panelToMatch + "-")
    ) {
      // panelToMatch = design time name = "<panel>"
      return true;
    } else {
      // panelToMatch is NOT a panel is a menu object
      return name.toLocaleLowerCase() === panelToMatch;
    }
  }
}

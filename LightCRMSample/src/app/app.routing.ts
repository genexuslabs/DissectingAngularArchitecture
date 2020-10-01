import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppHome } from 'app/app-home.component';
import { LightCRMComponent } from "app/LightCRM/lightcrm.component" ;

export const moduleRoutes: Routes = [
  { path:"", component: AppHome},
  { path: "LightCRM", component: LightCRMComponent } ,
  {
    path: "app",
    loadChildren: () => import("./shared.module").then(mod => mod.SharedModule)
  }
];

export const RoutingModule: ModuleWithProviders = RouterModule.forRoot(moduleRoutes);
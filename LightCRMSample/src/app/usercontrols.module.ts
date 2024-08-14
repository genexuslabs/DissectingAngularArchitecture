import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { GeneXusUnanimo__UserMenuAngularComponent } from "usercontrols/GeneXusUnanimo/UserMenuAngular/usermenuangular.component";
import { GeneXusUnanimo__SelectAngularComponent } from "usercontrols/GeneXusUnanimo/SelectAngular/selectangular.component";
import { GeneXusUnanimo__SidebarAngularComponent } from "usercontrols/GeneXusUnanimo/SidebarAngular/sidebarangular.component";
import { GeneXusUnanimo__TreeviewAngularComponent } from "usercontrols/GeneXusUnanimo/TreeviewAngular/treeviewangular.component";
import { GeneXusUnanimo__StepAngularComponent } from "usercontrols/GeneXusUnanimo/StepAngular/stepangular.component";
import { GeneXusUnanimo__AlertAngularComponent } from "usercontrols/GeneXusUnanimo/AlertAngular/alertangular.component";
import { GeneXusUnanimo__IconAngularComponent } from "usercontrols/GeneXusUnanimo/IconAngular/iconangular.component";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule
  ],
  declarations: [
    GeneXusUnanimo__UserMenuAngularComponent,
    GeneXusUnanimo__SelectAngularComponent,
    GeneXusUnanimo__SidebarAngularComponent,
    GeneXusUnanimo__TreeviewAngularComponent,
    GeneXusUnanimo__StepAngularComponent,
    GeneXusUnanimo__AlertAngularComponent,
    GeneXusUnanimo__IconAngularComponent
  ],
  exports: [
    GeneXusUnanimo__UserMenuAngularComponent,
    GeneXusUnanimo__SelectAngularComponent,
    GeneXusUnanimo__SidebarAngularComponent,
    GeneXusUnanimo__TreeviewAngularComponent,
    GeneXusUnanimo__StepAngularComponent,
    GeneXusUnanimo__AlertAngularComponent,
    GeneXusUnanimo__IconAngularComponent
  ],
  bootstrap: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsercontrolsModule {
}

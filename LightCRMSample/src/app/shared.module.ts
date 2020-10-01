import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { CommonModule as GxCommonModule } from "./common.module";
import { MainModule } from "./main.module";

import { SafePipe } from "app/gx/ui/controls/safe-pipe/safe-pipe.component";
import { WorkWithDevicesCompany_Company_ListComponent } from "app/WorkWithDevicesCompany/workwithdevicescompany_company_list.component" ;
import { WorkWithDevicesCompany_Company_DetailComponent } from "app/WorkWithDevicesCompany/workwithdevicescompany_company_detail.component" ;
import { WorkWithDevicesCompany_Company_Section_GeneralComponent } from "app/WorkWithDevicesCompany/workwithdevicescompany_company_section_general.component" ;
import { WorkWithDevicesCompany_Company_Section_ContactComponent } from "app/WorkWithDevicesCompany/workwithdevicescompany_company_section_contact.component" ;
import { WorkWithDevicesContact_Contact_ListComponent } from "app/WorkWithDevicesContact/workwithdevicescontact_contact_list.component" ;
import { WorkWithDevicesContact_Contact_DetailComponent } from "app/WorkWithDevicesContact/workwithdevicescontact_contact_detail.component" ;
import { WorkWithDevicesContact_Contact_Section_GeneralComponent } from "app/WorkWithDevicesContact/workwithdevicescontact_contact_section_general.component" ;
import { WorkWithDevicesContact_Contact_Section_MeetingComponent } from "app/WorkWithDevicesContact/workwithdevicescontact_contact_section_meeting.component" ;
import { SelectCompany_Level_DetailComponent } from "app/SelectCompany/selectcompany_level_detail.component" ;
import { WorkWithDevicesMeeting_Meeting_ListComponent } from "app/WorkWithDevicesMeeting/workwithdevicesmeeting_meeting_list.component" ;
import { WorkWithDevicesMeeting_Meeting_DetailComponent } from "app/WorkWithDevicesMeeting/workwithdevicesmeeting_meeting_detail.component" ;
import { WorkWithDevicesMeeting_Meeting_Section_GeneralComponent } from "app/WorkWithDevicesMeeting/workwithdevicesmeeting_meeting_section_general.component" ;
import { SelectContact_Level_DetailComponent } from "app/SelectContact/selectcontact_level_detail.component" ;
;

import { SharedRoutingModule, moduleRoutes } from "app/shared-routing.module";

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    SharedRoutingModule, 
    VirtualScrollerModule,
    GxCommonModule,
    MainModule
  ],
  declarations: [
    SafePipe, 
    WorkWithDevicesCompany_Company_ListComponent ,
    WorkWithDevicesCompany_Company_DetailComponent ,
    WorkWithDevicesCompany_Company_Section_GeneralComponent ,
    WorkWithDevicesCompany_Company_Section_ContactComponent ,
    WorkWithDevicesContact_Contact_ListComponent ,
    WorkWithDevicesContact_Contact_DetailComponent ,
    WorkWithDevicesContact_Contact_Section_GeneralComponent ,
    WorkWithDevicesContact_Contact_Section_MeetingComponent ,
    SelectCompany_Level_DetailComponent ,
    WorkWithDevicesMeeting_Meeting_ListComponent ,
    WorkWithDevicesMeeting_Meeting_DetailComponent ,
    WorkWithDevicesMeeting_Meeting_Section_GeneralComponent ,
    SelectContact_Level_DetailComponent 
  ],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
  routes = moduleRoutes;
}

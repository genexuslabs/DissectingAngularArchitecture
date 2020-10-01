import { ModuleWithProviders, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
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

export const moduleRoutes: Routes = [
  { path: "WorkWithDevicesCompany-Company_List", component: WorkWithDevicesCompany_Company_ListComponent } ,
  { path: "WorkWithDevicesCompany-Company_Detail", component: WorkWithDevicesCompany_Company_DetailComponent } ,
  { path: "WorkWithDevicesCompany-Company_Section_General", component: WorkWithDevicesCompany_Company_Section_GeneralComponent } ,
  { path: "WorkWithDevicesCompany-Company_Section_Contact", component: WorkWithDevicesCompany_Company_Section_ContactComponent } ,
  { path: "WorkWithDevicesContact-Contact_List", component: WorkWithDevicesContact_Contact_ListComponent } ,
  { path: "WorkWithDevicesContact-Contact_Detail", component: WorkWithDevicesContact_Contact_DetailComponent } ,
  { path: "WorkWithDevicesContact-Contact_Section_General", component: WorkWithDevicesContact_Contact_Section_GeneralComponent } ,
  { path: "WorkWithDevicesContact-Contact_Section_Meeting", component: WorkWithDevicesContact_Contact_Section_MeetingComponent } ,
  { path: "SelectCompany-Level_Detail", component: SelectCompany_Level_DetailComponent } ,
  { path: "WorkWithDevicesMeeting-Meeting_List", component: WorkWithDevicesMeeting_Meeting_ListComponent } ,
  { path: "WorkWithDevicesMeeting-Meeting_Detail", component: WorkWithDevicesMeeting_Meeting_DetailComponent } ,
  { path: "WorkWithDevicesMeeting-Meeting_Section_General", component: WorkWithDevicesMeeting_Meeting_Section_GeneralComponent } ,
  { path: "SelectContact-Level_Detail", component: SelectContact_Level_DetailComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(moduleRoutes)],
  exports: [RouterModule]
})
export class SharedRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
export const routes: Routes = [
  {path:"", redirectTo: "LightCRM", pathMatch: 'full'},

  { path: "WorkWithCompany-Company_List", loadComponent: () => import('app/WorkWithCompany/workwithcompany_company_list.component').then( m => m.WorkWithCompany_Company_ListComponent)} ,
  { path: "WorkWithCompany-Company_Detail", loadComponent: () => import('app/WorkWithCompany/workwithcompany_company_detail.component').then( m => m.WorkWithCompany_Company_DetailComponent)} ,
  { path: "WorkWithCompany-Company_Section_General", loadComponent: () => import('app/WorkWithCompany/workwithcompany_company_section_general.component').then( m => m.WorkWithCompany_Company_Section_GeneralComponent)} ,
  { path: "WorkWithCompany-Company_Section_Contact", loadComponent: () => import('app/WorkWithCompany/workwithcompany_company_section_contact.component').then( m => m.WorkWithCompany_Company_Section_ContactComponent)} ,
  { path: "WorkWithContact-Contact_List", loadComponent: () => import('app/WorkWithContact/workwithcontact_contact_list.component').then( m => m.WorkWithContact_Contact_ListComponent)} ,
  { path: "WorkWithContact-Contact_Detail", loadComponent: () => import('app/WorkWithContact/workwithcontact_contact_detail.component').then( m => m.WorkWithContact_Contact_DetailComponent)} ,
  { path: "WorkWithContact-Contact_Section_General", loadComponent: () => import('app/WorkWithContact/workwithcontact_contact_section_general.component').then( m => m.WorkWithContact_Contact_Section_GeneralComponent)} ,
  { path: "WorkWithContact-Contact_Section_Meeting", loadComponent: () => import('app/WorkWithContact/workwithcontact_contact_section_meeting.component').then( m => m.WorkWithContact_Contact_Section_MeetingComponent)} ,
  { path: "SelectCompany-Level_Detail", loadComponent: () => import('app/SelectCompany/selectcompany_level_detail.component').then( m => m.SelectCompany_Level_DetailComponent)} ,
  { path: "Gx0010sd-Level_Detail", loadComponent: () => import('app/Gx0010sd/gx0010sd_level_detail.component').then( m => m.Gx0010sd_Level_DetailComponent)} ,
  { path: "WorkWithMeeting-Meeting_List", loadComponent: () => import('app/WorkWithMeeting/workwithmeeting_meeting_list.component').then( m => m.WorkWithMeeting_Meeting_ListComponent)} ,
  { path: "WorkWithMeeting-Meeting_Detail", loadComponent: () => import('app/WorkWithMeeting/workwithmeeting_meeting_detail.component').then( m => m.WorkWithMeeting_Meeting_DetailComponent)} ,
  { path: "WorkWithMeeting-Meeting_Section_General", loadComponent: () => import('app/WorkWithMeeting/workwithmeeting_meeting_section_general.component').then( m => m.WorkWithMeeting_Meeting_Section_GeneralComponent)} ,
  { path: "SelectContact-Level_Detail", loadComponent: () => import('app/SelectContact/selectcontact_level_detail.component').then( m => m.SelectContact_Level_DetailComponent)} ,
  { path: "LightCRM", loadComponent: () => import('app/LightCRM/lightcrm.component').then( m => m.LightCRMComponent)} 
];
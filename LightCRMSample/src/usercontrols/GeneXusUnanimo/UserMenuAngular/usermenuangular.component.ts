import { UIGeneXusUnanimo__UserMenuAngularElement } from "./ui-usermenuangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";

@Component({
  selector: "GeneXusUnanimo__UserMenuAngular",
  templateUrl: "./usermenuangular.component.html",
})
export class GeneXusUnanimo__UserMenuAngularComponent extends UserControlComponent {
  @Input() visible: boolean;
  @Input() UserPhoto: string;
  @Input() UserFullName: string;
  @Input() UserCompany: string;
  @Input() DisplayType: string;
  @Input() ExpandBehavior: string;
  @Input() ShowVerticalSeparator: boolean;
  @Input() ShowLogoutOption: boolean;
  @Input() DropdownItems: any;
  @Input() SelectedItemId: string;
  @Input() SelectedItemTarget: string;
  @Input() LogoutIcon: string;
  @Input() Open: boolean;
  @Output() logout = new EventEmitter();
  @Output() itemClick = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.UserPhoto = "";
    this.UserFullName = "";
    this.UserCompany = "";
    this.DisplayType = "Avatar";
    this.ExpandBehavior = "Hover";
    this.ShowVerticalSeparator = true;
    this.ShowLogoutOption = true;
    this.DropdownItems = null;
    this.SelectedItemId = "";
    this.SelectedItemTarget = "";
    this.LogoutIcon = "";
    this.Open = null;
  }

  handleLogout(event) {
    this.__emitModelUpdate();
    this.logout.emit(event);
  }

  public Logout(data=null) {
    this.__emitModelUpdate();
    this.logout.emit(data);
  }

  handleItemClick(event) {
    this.__emitModelUpdate();
    this.itemClick.emit(event);
  }

  public ItemClick(data=null) {
    this.__emitModelUpdate();
    this.itemClick.emit(data);
  }

  doOpen() {
        if (this.ExpandBehavior === 'Click') {      this.Open = ! this.Open;    }  
  }

  doMouseover() {
        if (this.ExpandBehavior === 'Hover') {      this.Open = true;    }  
  }

  doMouseout() {
        if (this.ExpandBehavior === 'Hover') {      this.Open = false;    }  
  }

  __emitModelUpdate() {
    const model = new UIGeneXusUnanimo__UserMenuAngularElement();
    model.UserPhoto = this.UserPhoto
    model.UserFullName = this.UserFullName
    model.UserCompany = this.UserCompany
    model.DisplayType = this.DisplayType
    model.ExpandBehavior = this.ExpandBehavior
    model.ShowVerticalSeparator = this.ShowVerticalSeparator
    model.ShowLogoutOption = this.ShowLogoutOption
    model.DropdownItems = this.DropdownItems
    model.SelectedItemId = this.SelectedItemId
    model.SelectedItemTarget = this.SelectedItemTarget
    model.LogoutIcon = this.LogoutIcon
    model.Open = this.Open
    this.__modelUpdate.emit(model);
  }
}

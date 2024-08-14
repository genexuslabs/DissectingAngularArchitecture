import { UIGeneXusUnanimo__DropdownAngularElement } from "./ui-dropdownangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";

@Component({
  selector: "GeneXusUnanimo__DropdownAngular",
  templateUrl: "./dropdownangular.component.html",
})
export class GeneXusUnanimo__DropdownAngularComponent extends UserControlComponent {
  @Input() visible: boolean;
  @Input() UserPhoto: string;
  @Input() UserFullName: string;
  @Input() UserCompany: string;
  @Input() DisplayType: string;
  @Input() DropdownItems: any;
  @Input() SelectedItemId: string;
  @Input() SelectedItemTarget: string;
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
    this.DropdownItems = null;
    this.SelectedItemId = "";
    this.SelectedItemTarget = "";
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

  __emitModelUpdate() {
    const model = new UIGeneXusUnanimo__DropdownAngularElement();
    model.UserPhoto = this.UserPhoto
    model.UserFullName = this.UserFullName
    model.UserCompany = this.UserCompany
    model.DisplayType = this.DisplayType
    model.DropdownItems = this.DropdownItems
    model.SelectedItemId = this.SelectedItemId
    model.SelectedItemTarget = this.SelectedItemTarget
    this.__modelUpdate.emit(model);
  }
}

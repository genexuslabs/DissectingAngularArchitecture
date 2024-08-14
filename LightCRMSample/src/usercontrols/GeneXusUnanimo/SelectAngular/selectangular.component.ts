import { UIGeneXusUnanimo__SelectAngularElement } from "./ui-selectangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";

@Component({
  selector: "GeneXusUnanimo__SelectAngular",
  templateUrl: "./selectangular.component.html",
})
export class GeneXusUnanimo__SelectAngularComponent extends UserControlComponent {
  @Input() visible: boolean;
  @Input() Name: string;
  @Input() Class: string;
  @Input() Height: string;
  @Input() OptionHeight: string;
  @Input() Icon: string;
  @Input() ArrowIcon: string;
  @Input() IconAutoColor: boolean;
  @Input() SelectedItem: string;
  @Input() SelectItems: any;
  @Output() itemClick = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.Name = "";
    this.Class = "ch-select";
    this.Height = "";
    this.OptionHeight = "";
    this.Icon = "";
    this.ArrowIcon = "";
    this.IconAutoColor = null;
    this.SelectedItem = "";
    this.SelectItems = null;
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
    const model = new UIGeneXusUnanimo__SelectAngularElement();
    model.Name = this.Name
    model.Class = this.Class
    model.Height = this.Height
    model.OptionHeight = this.OptionHeight
    model.Icon = this.Icon
    model.ArrowIcon = this.ArrowIcon
    model.IconAutoColor = this.IconAutoColor
    model.SelectedItem = this.SelectedItem
    model.SelectItems = this.SelectItems
    this.__modelUpdate.emit(model);
  }
}

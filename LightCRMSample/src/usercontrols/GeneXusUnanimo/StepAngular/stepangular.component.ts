import { UIGeneXusUnanimo__StepAngularElement } from "./ui-stepangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";

@Component({
  selector: "GeneXusUnanimo__StepAngular",
  templateUrl: "./stepangular.component.html",
})
export class GeneXusUnanimo__StepAngularComponent extends UserControlComponent {
  @Input() visible: boolean;
  @Input() Class: string;
  @Input() StepItems: any;
  @Input() SelectedItem: string;
  @Output() itemClick = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.Class = "ch-step";
    this.StepItems = null;
    this.SelectedItem = "";
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
    const model = new UIGeneXusUnanimo__StepAngularElement();
    model.Class = this.Class
    model.StepItems = this.StepItems
    model.SelectedItem = this.SelectedItem
    this.__modelUpdate.emit(model);
  }
}

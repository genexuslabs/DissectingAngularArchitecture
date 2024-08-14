import { UIGeneXusUnanimo__AlertAngularElement } from "./ui-alertangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";

@Component({
  selector: "GeneXusUnanimo__AlertAngular",
  templateUrl: "./alertangular.component.html",
})
export class GeneXusUnanimo__AlertAngularComponent extends UserControlComponent {
  @Input() visible: boolean;
  @Input() Type: string;
  @Input() Title: string;
  @Input() Message: string;
  @Input() Position: string;
  @Input() ShowMultiple: boolean;
  @Input() Count: number;
  @Output() close = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.Type = "info";
    this.Title = "";
    this.Message = "";
    this.Position = null;
    this.ShowMultiple = false;
    this.Count = 0;
  }

  handleClose(event) {
    this.__emitModelUpdate();
    this.close.emit(event);
  }

  public Close(data=null) {
    this.__emitModelUpdate();
    this.close.emit(data);
  }

  __emitModelUpdate() {
    const model = new UIGeneXusUnanimo__AlertAngularElement();
    model.Type = this.Type
    model.Title = this.Title
    model.Message = this.Message
    model.Position = this.Position
    model.ShowMultiple = this.ShowMultiple
    model.Count = this.Count
    this.__modelUpdate.emit(model);
  }
}

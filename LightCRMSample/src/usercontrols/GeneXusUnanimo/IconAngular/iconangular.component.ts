import { UIGeneXusUnanimo__IconAngularElement } from "./ui-iconangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";

@Component({
  selector: "GeneXusUnanimo__IconAngular",
  templateUrl: "./iconangular.component.html",
})
export class GeneXusUnanimo__IconAngularComponent extends UserControlComponent {
  @Input() visible: boolean;
  @Input() source: string;
  @Input() size: string;
  @Input() color: string;
  @Input() autoColor: boolean;
  @Output() gxClick = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.source = "";
    this.size = "";
    this.color = "";
    this.autoColor = false;
  }

  handleClick(event) {
    this.__emitModelUpdate();
    this.gxClick.emit(event);
  }

  public Click(data=null) {
    this.__emitModelUpdate();
    this.gxClick.emit(data);
  }

  __emitModelUpdate() {
    const model = new UIGeneXusUnanimo__IconAngularElement();
    model.source = this.source
    model.size = this.size
    model.color = this.color
    model.autoColor = this.autoColor
    this.__modelUpdate.emit(model);
  }
}

import { UIGeneXusUnanimo__TreeviewAngularElement } from "./ui-treeviewangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";
import { AfterViewInit } from "@angular/core"

@Component({
  selector: "GeneXusUnanimo__TreeviewAngular",
  templateUrl: "./treeviewangular.component.html",
})
export class GeneXusUnanimo__TreeviewAngularComponent extends UserControlComponent implements AfterViewInit{
  @Input() visible: boolean;
  @Input() ToggleCheckboxes: boolean;
  @Input() SingleSelection: boolean;
  @Input() TreeviewItems: any;
  @Input() TreeviewItemsCurrentIndex: number;
  @Input() SelectedItemId: string;
  @Input() SelectedItemTarget: string;
  @Output() itemClick = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.ToggleCheckboxes = null;
    this.SingleSelection = false;
    this.TreeviewItems = null;
    this.TreeviewItemsCurrentIndex = null;
    this.SelectedItemId = "";
    this.SelectedItemTarget = "";
  }

  handleItemClick(event) {
    this.__emitModelUpdate();
    this.itemClick.emit(event);
  }

  public ItemClick(data=null) {
    this.__emitModelUpdate();
    this.itemClick.emit(data);
  }

  ngAfterViewInit() {
    // After show
    this.initTree();
  }

  private initTree() {
    		const UC = this;		const tree = document.getElementById("ch-treeview");				tree.addEventListener("toggleIconClicked", function(e: any){		});	
  }


  __emitModelUpdate() {
    const model = new UIGeneXusUnanimo__TreeviewAngularElement();
    model.ToggleCheckboxes = this.ToggleCheckboxes
    model.SingleSelection = this.SingleSelection
    model.TreeviewItems = this.TreeviewItems
    model.TreeviewItemsCurrentIndex = this.TreeviewItemsCurrentIndex
    model.SelectedItemId = this.SelectedItemId
    model.SelectedItemTarget = this.SelectedItemTarget
    this.__modelUpdate.emit(model);
  }
}

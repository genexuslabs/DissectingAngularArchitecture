import { UIGeneXusUnanimo__SidebarAngularElement } from "./ui-sidebarangular"
import { Component, Input, Output, EventEmitter} from "@angular/core";
import { UserControlComponent } from "app/gx/base/usercontrol.component";
import { AfterViewInit } from "@angular/core"

@Component({
  selector: "GeneXusUnanimo__SidebarAngular",
  templateUrl: "./sidebarangular.component.html",
})
export class GeneXusUnanimo__SidebarAngularComponent extends UserControlComponent implements AfterViewInit{
  @Input() visible: boolean;
  @Input() Title: string;
  @Input() Class: string;
  @Input() FooterText: string;
  @Input() DistanceToTop: number;
  @Input() Collapsible: boolean;
  @Input() SidebarItems: any;
  @Input() ActiveItemId: string;
  @Input() SelectedItemTarget: string;
  @Input() isCollapsed: boolean;
  @Input() IconAutoColor: boolean;
  @Output() itemClick = new EventEmitter();
  @Output() getState = new EventEmitter();
  @Output('modelUpdate') __modelUpdate = new EventEmitter();

  constructor() {
    super();
    this.visible = true;
    this.Title = "";
    this.Class = "ch-sidebar";
    this.FooterText = "";
    this.DistanceToTop = null;
    this.Collapsible = true;
    this.SidebarItems = null;
    this.ActiveItemId = "";
    this.SelectedItemTarget = "";
    this.isCollapsed = null;
    this.IconAutoColor = false;
  }

  handleItemClick(event) {
    this.__emitModelUpdate();
    this.itemClick.emit(event);
  }

  public ItemClick(data=null) {
    this.__emitModelUpdate();
    this.itemClick.emit(data);
  }

  handleGetState(event) {
    this.__emitModelUpdate();
    this.getState.emit(event);
  }

  public GetState(data=null) {
    this.__emitModelUpdate();
    this.getState.emit(data);
  }

  GetActiveItem() {
    		const UC = this;		let activeItem = sessionStorage.getItem("active-item");		UC.SidebarItems.activeItem = activeItem;		return activeItem;	
  }

  ngAfterViewInit() {
    // After show
    this.initSidebar();
  }

  private initSidebar() {
    		const UC = this;		const sidebar = document.getElementById("ch-sidebar-menu");				sidebar.addEventListener("collapseBtnClicked", function(e: any){			UC.isCollapsed = e.detail.isCollapsed;			if (UC.GetState){				UC.GetState();			}		});	
  }


  __emitModelUpdate() {
    const model = new UIGeneXusUnanimo__SidebarAngularElement();
    model.Title = this.Title
    model.Class = this.Class
    model.FooterText = this.FooterText
    model.DistanceToTop = this.DistanceToTop
    model.Collapsible = this.Collapsible
    model.SidebarItems = this.SidebarItems
    model.ActiveItemId = this.ActiveItemId
    model.SelectedItemTarget = this.SelectedItemTarget
    model.isCollapsed = this.isCollapsed
    model.IconAutoColor = this.IconAutoColor
    this.__modelUpdate.emit(model);
  }
}

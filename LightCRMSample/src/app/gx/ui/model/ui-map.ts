import { Geography } from "@genexus/web-standard-functions/dist/lib-esm/types/geography";
import { IListSelectableElement } from "./ui-list";

export interface IMapElement {
  class: any;
  visible: any;
  enabled: any;
  currentItem: any;

  mapCenter: any;
  mapZoom: any;
  selectionLayer: boolean;
}

export class UIMapElement implements IMapElement, IListSelectableElement {
  class = null;
  visible = null;
  enabled = null;
  currentItem: any;

  SelectedIndex = 0;

  mapCenter: any;
  mapZoom: any;
  selectionLayer = null;

  setmapcenter(geopoint: Geography, zoom = 1) {
    this.mapCenter = `${geopoint.latitude},${geopoint.longitude}`;
    this.mapZoom = zoom;
  }

  setzoomlevel(zoom) {
    this.mapZoom = zoom;
  }
}

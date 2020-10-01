export interface IMapElement {

  class: string;
  visible: boolean;
  enabled: boolean;

  currentItem: any;

  mapCenter: any;
  mapZoom: any;
  selectionLayer: boolean;

  onSelectionChanged(eventInfo: any);
  onControlValueChanged(eventInfo: any, geoLocation: any);
  onControlValueChanging(eventInfo: any, geoLocation: any);

  setSelectionChangedAction(action: any);
  setControlValueChangedAction(eventInfo: any);
  setControlValueChangingAction(eventInfo: any);

}

export class UIMapElement implements IMapElement {

  class = null;
  visible = null;
  enabled = null;

  currentItem: any;

  mapCenter: any;
  mapZoom: any;
  selectionLayer = null;

  onSelectionChangedAction: any;
  onControlValueChangedAction: any;
  onControlValueChangingActionAction: any;

  onSelectionChanged(eventInfo: any) {
    if (this.onSelectionChangedAction) {
      this.onSelectionChangedAction();
    }
  }

  onControlValueChanged(eventInfo: any) {
    const geoLocation = eventInfo.detail;

    if (this.onControlValueChangedAction) {
      this.onControlValueChangedAction(this.locationToPoint(geoLocation));
    }
  }

  onControlValueChanging(eventInfo: any) {
    const geoLocation = eventInfo.detail;

    if (this.onControlValueChangingActionAction) {
      this.onControlValueChangingActionAction(this.locationToPoint(geoLocation));
    }
  }

  setSelectionChangedAction(action: any) {
    this.onSelectionChangedAction = action;
  }

  setControlValueChangedAction(action: any) {
    this.onControlValueChangedAction = action;
  }

  setControlValueChangingAction(action: any) {
    this.onControlValueChangingActionAction = action;
  }

  setmapcenter(geopoint: string, zoom: any) {
    this.mapCenter = this.pointToLocation(geopoint);
    this.mapZoom = zoom;
  }

  pointToLocation(point: string): string {
    // 'POINT( <long> <lat>)' => '<lat> , <long>'
    let location = ''
    if (point.indexOf('POINT') > -1) {
      const start = point.indexOf('(');
      const end = point.indexOf(')');
      const gp = point.substring(start + 1, end - 1);
      const coords = gp.split(' ');
      location = coords[1] + ',' + coords[0];
    }
    return location;
  }

  locationToPoint(location: string): string {
    // '<lat> , <long>' => 'POINT(<long> <lat>)'
    let point = ''
    const coords = location.split(',');
    if (coords.length > 1) {
      point = "POINT(coords[1] + ' ' + coords[0])";
    }
    return point;
  }

}
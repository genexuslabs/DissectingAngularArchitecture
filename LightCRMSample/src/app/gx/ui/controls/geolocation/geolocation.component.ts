import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from "@angular/core";
import { Geography } from "@genexus/web-standard-functions/dist/lib-esm/types/geography";
import { GeographyToCoordsPipe } from "../../../utils/geography-to-coords.pipe";
import { NgIf } from "@angular/common";

@Component({
  selector: "gx-geolocation",
  templateUrl: "./geolocation.component.html",
  styleUrls: ["./geolocation.component.scss"],
  standalone: true,
  imports: [NgIf, GeographyToCoordsPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class GeolocationComponent {
  @Input() coords = "";
  @Input() disabled = false;
  @Input() readonly = false;

  @Output() onGeolocationChanged: EventEmitter<Geography> =
    new EventEmitter<Geography>();
  zoom = "1";

  ngOnInit() {
    if (this.coords !== "") {
      this.zoom = "15";
    }
  }

  coordsChanged(x: Geography) {
    if (!this.readonly && !this.disabled) {
      this.onGeolocationChanged.emit(x);
    }
  }
}

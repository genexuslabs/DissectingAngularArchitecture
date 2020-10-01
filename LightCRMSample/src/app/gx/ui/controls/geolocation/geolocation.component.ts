import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "gx-geolocation",
	templateUrl: "./geolocation.component.html",
	styleUrls: ["./geolocation.component.scss"],
})
export class GeolocationComponent {
	@Input() coords = "";
	@Input() disabled = false;
	@Input() readonly = false;

	@Output() onGeolocationChanged: EventEmitter<string> = new EventEmitter<
		string
	>();
	zoom = "1";

	ngOnInit() {
		if (this.coords !== "") {
			this.zoom = "15";
		}
	}

	convertCoords(x: string): string {
		let pt = x.trim().toUpperCase();
		if (pt.startsWith("POINT")) {
			let sCoords = pt.replace(")", "").replace("(", "");
			let coords = sCoords.split(" ");
			return "" + coords[2] + "," + coords[1];
		} else {
			return pt;
		}
	}

	coordsChanged(x: string) {
		if (!this.readonly && !this.disabled) {
			this.onGeolocationChanged.emit(x);
		}
	}
}

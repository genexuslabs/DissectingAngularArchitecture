import { CUSTOM_ELEMENTS_SCHEMA, Component, Input} from "@angular/core";
import { TranslatePipe } from "app/gx/utils/translate.pipe";

@Component({
    selector: "gx-ng-toast-message",
    templateUrl: "./toast-message.component.html",
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [TranslatePipe]
})
export class ToastMessageComponent {
    @Input() appMessage: any;
}

import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { UIProgress } from "./progress.service";
import { ClassSplitPipe } from "app/gx/utils/class-split.pipe";

@Component({
  selector: "gx-ng-progress",
  templateUrl: "./progress.component.html",
  styleUrl: "./progress.component.scss",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClassSplitPipe]
})
export class ProgressComponent {

  @Input() appProgress: UIProgress;

}
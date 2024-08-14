import { ChangeDetectorRef, ComponentRef, Injectable, ViewContainerRef, inject } from '@angular/core';
import { ProgressComponent } from './progress.component';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {

  private progressComponent: ComponentRef<ProgressComponent>;
  private currentSettings: UIProgress = {};
  private viewContainerRef:ViewContainerRef;

  start(viewContainerRef:ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  getClass(): string {
    return this.currentSettings.cssClass || "";
  }

  setClass(c: string) {
    this.updateProgress({ cssClass: c });
  }

  getType(): number {
    // Indeterminate=0, Determinate=1
    return this.currentSettings.type || 0;
  }

  setType(type: number) {
    // Indeterminate=0, Determinate=1
    this.updateProgress({ type: type });
  }

  getTitle(): string {
    return this.currentSettings.title || "";
  }

  setTitle(title: string) {
    this.updateProgress({ title: title });
  }

  getDescription(): string {
    return this.currentSettings.description || "";
  }

  setDescription(description: string) {
    this.updateProgress({ description: description });
  }

  getMaxValue(): number {
    return this.currentSettings.maxValue || 0;
  }

  setMaxValue(value: number) {
    this.updateProgress({ maxValue: value });
  }

  getValue(): number {
    return this.currentSettings.value || 0;
  }

  setValue(value: number) {
    this.updateProgress({ value: value });
  }

  show() {
    this.updateProgress({});
  }

  showWithTitle(title: string) {
    this.updateProgress({ title: title, description: null });
  }

  showWithTitleAndDescription(title: string, description: string) {
    this.updateProgress({ title: title, description: description });
  }

  hide() {
    this.currentSettings = {};
    this.updateProgress(null);
  }

  private updateProgress(settings?: UIProgress) {
    if (!this.progressComponent) {
      this.progressComponent = this.viewContainerRef.createComponent(ProgressComponent) as ComponentRef<any>;
    }
    if (settings) {
      this.currentSettings = {...this.currentSettings, ...settings};
      this.progressComponent.setInput('appProgress', this.currentSettings);
    } else {
      this.progressComponent.setInput('appProgress', undefined);
    }
  }
}

export class UIProgress {
  type?: number = 0;     // 0=indeterminate, 1=determinate
  title?: string = null;
  description?: string = null;
  value?: number = 100;
  maxValue?: number = 100;
  cssClass?: string = null;
  callback?: (ret: boolean) => void;
}
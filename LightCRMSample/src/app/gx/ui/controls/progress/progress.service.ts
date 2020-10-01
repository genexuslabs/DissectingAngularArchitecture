import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {

  private progressSource = new BehaviorSubject<UIProgress>(null);

  private currentSettings: UIProgress = {};

  constructor() {
  }

  getObservable(): Observable<UIProgress> {
    this.currentSettings = {};
    return this.progressSource.asObservable();
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

  showWithTitle(title: string): Promise<any> {
    return new Promise<any>(complete => {
      this.updateProgress(
        {
          title: title,
          description: null,
          callback: complete
        });
    });
  }

  showWithTitleAndDescription(title: string, description: string) {
    this.updateProgress({ title: title, description: description });
  }

  hide() {
    this.currentSettings = {};
    this.updateProgress(null);
  }

  private updateProgress(settings?: UIProgress) {
    if (settings) {
      for (let st in settings) {
        this.currentSettings[st] = settings[st];
      }
      this.progressSource.next(Object.assign({}, this.currentSettings));
    }
    else {
      this.progressSource.next(null);
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
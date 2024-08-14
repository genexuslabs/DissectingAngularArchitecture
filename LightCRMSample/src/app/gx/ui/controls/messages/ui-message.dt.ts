import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  private messageSource = new BehaviorSubject<UIMessage>(null);

  constructor() {
  }

  getObservable(): Observable<UIMessage> {
    return this.messageSource.asObservable();
  }
}

export class UIMessage {
  id: string;
  title: string;
  text: string;
  type: string;
  confirmCaption?: string;
  cancelCaption?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

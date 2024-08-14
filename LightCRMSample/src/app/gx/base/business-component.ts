import { inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppContainer } from 'app/gx/base/app-container';
import { TypeConversions } from "app/gx/base/type-conversion";
import { Messages, Message } from 'app/gx/std/messages.dt';

export class BusinessComponent<D, S extends BusinessComponentService<D>> {

  data: D;
  service: S;

  constructor(dat: D, serv: S) {
    this.data = dat;
    this.service = serv;
  }

  async initialize(defaultBc = null): Promise<D> {
    this.data = await this.service.initialize();
    if (defaultBc) {
      for (const p in this.data) {
        if (this.data.hasOwnProperty(p) && defaultBc.hasOwnProperty(p)) {
          this.data[p] = defaultBc[p];
        }
      }
    }
    return this.data;
  }

  async load(...args: any[]): Promise<D> {
    this.data = await this.service.get(...args);
    return this.data;
  }

  async insert(): Promise<D> {
    this.data = await this.service.post(this.data) ?? this.data;
    return this.data;
  }

  async update(): Promise<D> {
    this.data = await this.service.put(this.data) ?? this.data;
    return this.data;
  }

  async save(): Promise<D> {
    if (this.data["gx_md5_hash"]) {
      await this.update();
    }
    else {
      await this.insert();
    }
    return this.data;

  }

  async delete() {
    await this.service.delete(this.data);
  }

  success(): boolean {
    return this.service.err === 0;
  }

  fail(): boolean {
    return this.service.err !== 0;
  }

  getmessages() {
    if (this.service.err !== 0) {
      const errors = new Messages();
      const message = new Message();
      message.Description = this.service.errMsg;
      errors.add(message);
      return errors;
    } else {
      return new Messages();
    }
  }
}

export class BusinessComponentService<D> {

  protected http = inject(HttpClient);
  protected app = inject(AppContainer);

  getHeaders(type: string): HttpHeaders | null {
    let headers: HttpHeaders | null = null;
    if (type.toLowerCase() === 'post' || type.toLowerCase() === 'put') {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return headers;
  }

  initialize(...args: any[]): Promise<D> {
    return new Promise(null);
  }

  get(...args: any[]): Promise<D> {
    return new Promise(null);
  }

  delete(...args: any[]): Promise<D> {
    return new Promise(null);
  }

  post(...args: any[]): Promise<D> {
    return new Promise(null);
  }

  put(...args: any[]): Promise<D> {
    return new Promise(null);
  }

  setError(errorCode: number, error = null) {
    if (error) {
      this.app.setError(errorCode, error.error?.error?.message ?? error.statusText);
    } else {
      this.app.setError(errorCode, "");
    }
  }

  get err() {
    return this.app.err;
  }

  get errMsg() {
    return this.app.errMsg;
  }

  objectToClass = TypeConversions.objectToClass;
}

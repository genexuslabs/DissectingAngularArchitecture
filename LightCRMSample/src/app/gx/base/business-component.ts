import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

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
    await this.service.post(this.data);
    return this.data;
  }

  async update(): Promise<D> {
    await this.service.put(this.data);
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

}

export class BusinessComponentService<D> {

  constructor(protected http: HttpClient) {
  }

  getHeaders(type: string): HttpHeaders {
    let headers: HttpHeaders = null;
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

  protected handleError(error: any): Promise<any> {
    throw new Error(error.statusText);
  }

}

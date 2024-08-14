import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
}) export class UriCacheService {

  srcMap = new Map();
  cacheLimit = 50;


  get(uri: string): string {
    if (uri) {
      if (this.srcMap.has(uri)) {
        return this.srcMap.get(uri).url;
      }
    }
    return uri;
  }

  async getFile(uri: string): Promise<File> {
    if (uri) {
      if (uri.startsWith('blob:')) {
        let f = this.srcMap.get(uri);
        if (!f) {
          f = { url: uri, name: "upload1", type: (f) ? f.type || "image" : "image" };
        }
        const response = await fetch(f.url);
        const data = await response.blob();
        return new File([data], f.name, {
          type: data.type || f.type,
        });
      }
    }
    return null;
  }

  store(file: File): string {
    if (this.srcMap.size > this.cacheLimit) {
      const elder = this.srcMap.keys().next().value;
      this.srcMap.delete(elder);
    }
    const fileURL = URL.createObjectURL(file);
    this.srcMap.set(fileURL, { url: fileURL, name: file.name, type: file.type });
    return fileURL;
  }
}

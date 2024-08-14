import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root"
})
export class OutletNavigationToComponentInstance {
  navigationComponentOutletToInstance = {};

  save(nid: number, outlet: string, name: string, iid: number) {
    const key = this.getKey(nid, outlet, name);
    this.navigationComponentOutletToInstance[key] = iid;
  }

  get(nid: number, outlet: string, name: string): number {
    const key = this.getKey(nid, outlet, name);
    return this.navigationComponentOutletToInstance[key] ?? 0;
  }

  private getKey(nid: number, outlet: string, componentName: string): string {
    return `${nid}-${outlet}-${componentName}`
  }

  getAllByNID(nid): Array<number> {
    const allNIDs = [];
    for (const [k, v] of Object.entries(this.navigationComponentOutletToInstance)) {
      if (k.startsWith(`${nid}-`)) {
        allNIDs.push(v);
      }
    }
    return allNIDs;
  }

}
import { Observable } from "rxjs";

export class PrefersColorScheme {

  static getObservable(): Observable<string> {
    return new Observable(observer => {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const fn = (e) => {
        observer.next(e.matches ? 'dark' : 'light');
      };
  
      media.addEventListener("change", fn);
  
      return {
        unsubscribe() {
          media.removeEventListener("change", fn);
        }
      };
    });
  }
}

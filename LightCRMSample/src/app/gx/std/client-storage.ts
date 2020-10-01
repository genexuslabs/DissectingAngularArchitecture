export class ClientStorage {

  static Set(key: string, data: string): void {
    window.localStorage.setItem(key, data);
  }

  static Get(key: string): string {
    return window.localStorage.getItem(key);
  }

  static Remove(key: string): void {
    window.localStorage.removeItem(key);
  }

  static Clear(): void {
    window.localStorage.clear();
  }

}

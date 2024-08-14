export class Debounce {
  private static callbackFnTimeout: Map<() => void, any> = new Map<
    () => void,
    any
  >();
  public static delay = 600;

  public static submit(
    callbackFn: () => void,
    thisArg?: object,
    delay?: number
  ) {
    if (delay === 0) {
      clearTimeout(this.callbackFnTimeout.get(callbackFn));
      this.callbackFnTimeout.delete(callbackFn);
      callbackFn.apply(thisArg);
    } else {
      const fnTimer = this.callbackFnTimeout.get(callbackFn);

      if (fnTimer) {
        clearTimeout(fnTimer);
      }
      this.callbackFnTimeout.set(
        callbackFn,
        setTimeout(() => {
          this.callbackFnTimeout.delete(callbackFn);
          callbackFn.apply(thisArg);
        }, delay || this.delay)
      );
    }
  }
}

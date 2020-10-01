export class GxBinary {
  uri: string;

  isempty() {
    return this.uri === "" || this.uri === null;
  }

  toString() {
    return this.uri;
  }

  static fromString(uri: string): GxBinary {
    const b = new GxBinary();
    b.uri = uri;
    return b;
  }
}
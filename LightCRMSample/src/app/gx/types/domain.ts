export class Domain {

  static enumValues: Array<DomainEnum> = new Array<DomainEnum>();
  static elements(): Array<any> {
    return this.enumValues.map((enumValue) => enumValue.value);
  }
  static enumerationDescription(value) {
    return this.enumValues.find(x => x.value === value)?.description;
  }
  static convert(value) {
    return value;
  }
}

export class DomainEnum {
  value: any;
  description: string

  constructor(value: any, description: string) {
    this.value = value;
    this.description = description;
  }
}

export class UserControlComponent {
  arrayify(value): any[] {
    if (!value) {
      return EMPTY_ARRAY;
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }

  resolveVariable(variableName, context) {
    for (const contextObject of context) {
      if (
        contextObject[variableName] !== undefined &&
        contextObject[variableName] !== null
      ) {
        return contextObject[variableName];
      }
    }

    return undefined;
  }
}

const EMPTY_ARRAY = [];

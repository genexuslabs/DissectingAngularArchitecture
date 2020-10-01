export function stringHashCode(stringData: string) {
    var hash = 0;
    var i: number;
    var chr: number;
    for (i = 0; i < stringData.length; i++) {
      chr   = stringData.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
}
export function stringHashCode(stringData: string) {
  let hash = 0;
  let i: number;
  let chr: number;  for (i = 0; i < stringData.length; i++) {
    chr = stringData.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}
/**
 * Flattens a nested object into a flat object with dot-separated keys
 * @param obj - The object to flatten
 * @param prefix - The prefix to use for keys (used recursively)
 * @returns A flat object with dot-separated keys
 */
export function flattenObject<T extends object>(
  obj: T,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};

  const isValidObject = (value: object): boolean =>
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date);

  const flattenRecursive = (curObj: object, curPref: string): void => {
    if (curObj !== null) {
      for (const key in curObj) {
        const newKey = curPref ? `${curPref}.${key}` : key;

        if (isValidObject(curObj[key])) {
          flattenRecursive(curObj[key], newKey);
        } else {
          if (Array.isArray(curObj[key])) {
            result[newKey] = JSON.stringify(curObj[key]);
          } else {
            result[newKey] = String(curObj[key]);
          }
        }
      }
    }
  };

  flattenRecursive(obj, prefix);
  return result;
}

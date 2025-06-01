/**
 * Flattens a nested object into a flat object with dot-separated keys
 * @param obj - The object to flatten
 * @param prefix - The prefix to use for keys (used recursively)
 * @returns A flat object with dot-separated keys
 */
export function flattenObject<T extends Record<string, any>>(
  obj: T,
  prefix = '',
): Record<string, any> {
  const result: Record<string, any> = {};

  const isValidObject = (value: any): boolean =>
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date);

  const flattenRecursive = (
    currentObj: Record<string, any>,
    currentPrefix: string,
  ): void => {
    for (const key of Object.keys(currentObj)) {
      const newKey = currentPrefix ? `${currentPrefix}.${key}` : key;

      if (isValidObject(currentObj[key])) {
        flattenRecursive(currentObj[key], newKey);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result[newKey] = currentObj[key];
      }
    }
  };

  flattenRecursive(obj, prefix);
  return result;
}

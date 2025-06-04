interface KeyValuePair {
  key: string;
  value: string | null;
}

export function unflatten(data: KeyValuePair[]): Record<string, any> {
  const result: Record<string, any> = {};

  for (const item of data) {
    const keys = item.key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      if (
        !current[key] ||
        typeof current[key] !== 'object' ||
        Array.isArray(current[key])
      ) {
        current[key] = {};
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = item.value;
  }

  return result;
}

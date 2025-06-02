import { flattenObject } from './flatten-object.util';

describe('flattenObject', () => {
  it('should flatten a simple object', () => {
    const input = {
      test: {
        screen: 'bonjour',
      },
    };

    const expected = {
      'test.screen': 'bonjour',
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle empty objects', () => {
    const input = {};
    expect(flattenObject(input)).toEqual({});
  });

  it('should handle null and undefined values', () => {
    const input = {
      test: null,
      screen: undefined,
    };

    const expected = {
      test: 'null',
      screen: 'undefined',
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should keep arrays intact', () => {
    const input = {
      test: {
        array: [1, 2, 3],
      },
    };

    const expected = {
      'test.array': '[1,2,3]',
    };

    expect(flattenObject(input)).toEqual(expected);
  });
});

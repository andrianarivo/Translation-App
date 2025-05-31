import { JsonFileValidator } from './json-file.validator';

describe('JsonFileValidator', () => {
  let validator: JsonFileValidator;

  beforeEach(() => {
    validator = new JsonFileValidator();
  });

  describe('isValid', () => {
    it('should return false when file has no buffer', () => {
      const file = {
        originalname: 'test.txt',
      } as Express.Multer.File;

      expect(validator.isValid(file)).toBeFalsy();
    });

    it('should return false when file does not have .json extension', () => {
      const file = {
        originalname: 'test.txt',
        buffer: Buffer.from('{"valid": "json"}'),
      } as Express.Multer.File;

      expect(validator.isValid(file)).toBeFalsy();
    });

    it('should return false when file content is not valid JSON', () => {
      const file = {
        originalname: 'test.json',
        buffer: Buffer.from('invalid json content'),
      } as Express.Multer.File;

      expect(validator.isValid(file)).toBeFalsy();
    });

    it('should return true for valid JSON file', () => {
      const file = {
        originalname: 'test.json',
        buffer: Buffer.from('{"valid": "json"}'),
      } as Express.Multer.File;

      expect(validator.isValid(file)).toBeTruthy();
    });

    it('should return true for valid JSON file with complex content', () => {
      const complexJson = {
        string: 'value',
        number: 123,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        object: {
          nested: 'value',
        },
      };

      const file = {
        originalname: 'test.json',
        buffer: Buffer.from(JSON.stringify(complexJson)),
      } as Express.Multer.File;

      expect(validator.isValid(file)).toBeTruthy();
    });
  });

  describe('buildErrorMessage', () => {
    it('should return correct error message', () => {
      expect(validator.buildErrorMessage()).toBe(
        'File must contain valid JSON',
      );
    });
  });
});

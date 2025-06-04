import { unflatten } from './unflatten-object.util';

describe('unflatten', () => {
  it('should handle empty array', () => {
    const result = unflatten([]);
    expect(result).toEqual({});
  });

  it('should handle single level keys', () => {
    const data = [
      { key: 'name', value: 'John' },
      { key: 'age', value: '30' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      name: 'John',
      age: '30',
    });
  });

  it('should handle nested object keys', () => {
    const data = [
      { key: 'user.name', value: 'John' },
      { key: 'user.age', value: '30' },
      { key: 'user.email', value: 'john@example.com' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      user: {
        name: 'John',
        age: '30',
        email: 'john@example.com',
      },
    });
  });

  it('should handle deeply nested keys', () => {
    const data = [
      { key: 'user.profile.personal.name', value: 'John' },
      { key: 'user.profile.personal.age', value: '30' },
      { key: 'user.profile.settings.theme', value: 'dark' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      user: {
        profile: {
          personal: {
            name: 'John',
            age: '30',
          },
          settings: {
            theme: 'dark',
          },
        },
      },
    });
  });

  it('should handle mixed flat and nested keys', () => {
    const data = [
      { key: 'title', value: 'Test' },
      { key: 'user.name', value: 'John' },
      { key: 'user.age', value: '30' },
      { key: 'status', value: 'active' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      title: 'Test',
      user: {
        name: 'John',
        age: '30',
      },
      status: 'active',
    });
  });

  it('should overwrite existing values when key path conflicts', () => {
    const data = [
      { key: 'user', value: 'simple string' },
      { key: 'user.name', value: 'John' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      user: {
        name: 'John',
      },
    });
  });

  it('should handle array-like existing values by overwriting them', () => {
    const data = [
      { key: 'config.0', value: 'first' },
      { key: 'config.settings.theme', value: 'dark' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      config: {
        '0': 'first',
        settings: {
          theme: 'dark',
        },
      },
    });
  });

  it('should handle keys with empty string values', () => {
    const data = [
      { key: 'user.name', value: '' },
      { key: 'user.email', value: 'john@example.com' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      user: {
        name: '',
        email: 'john@example.com',
      },
    });
  });

  it('should handle duplicate keys by using the last value', () => {
    const data = [
      { key: 'user.name', value: 'John' },
      { key: 'user.name', value: 'Jane' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      user: {
        name: 'Jane',
      },
    });
  });

  it('should handle keys with special characters in values', () => {
    const data = [
      { key: 'user.name', value: 'John "Doe"' },
      { key: 'user.bio', value: 'A person with spaces & symbols!' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      user: {
        name: 'John "Doe"',
        bio: 'A person with spaces & symbols!',
      },
    });
  });

  it('should handle numeric-like keys as strings', () => {
    const data = [
      { key: 'items.0.name', value: 'first' },
      { key: 'items.1.name', value: 'second' },
      { key: 'items.10.name', value: 'tenth' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      items: {
        '0': { name: 'first' },
        '1': { name: 'second' },
        '10': { name: 'tenth' },
      },
    });
  });

  it('should handle complex nested structure with multiple branches', () => {
    const data = [
      { key: 'app.name', value: 'MyApp' },
      { key: 'app.version', value: '1.0.0' },
      { key: 'database.host', value: 'localhost' },
      { key: 'database.port', value: '5432' },
      { key: 'database.credentials.username', value: 'admin' },
      { key: 'database.credentials.password', value: 'secret' },
      { key: 'cache.redis.host', value: 'redis-server' },
      { key: 'cache.redis.port', value: '6379' },
    ];
    const result = unflatten(data);
    expect(result).toEqual({
      app: {
        name: 'MyApp',
        version: '1.0.0',
      },
      database: {
        host: 'localhost',
        port: '5432',
        credentials: {
          username: 'admin',
          password: 'secret',
        },
      },
      cache: {
        redis: {
          host: 'redis-server',
          port: '6379',
        },
      },
    });
  });
});

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import type { yamlDoc } from '../src/interfaces';
import { generateEnvFile, mergeDataFromManifests } from '../src/parser';

describe('mergeDataFromManifests', () => {
  test('should return an empty object if no manifests are provided', () => {
    const result = mergeDataFromManifests([]);
    expect(result).toEqual({});
  });

  test('should merge data from multiple manifests', () => {
    const manifests: yamlDoc[] = [
      { data: { key1: 'value1' } },
      { data: { key2: 'value2' } },
      { data: { key3: 'value3' } },
    ];

    const result = mergeDataFromManifests(manifests);
    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    });
  });

  test('should merge stringData from multiple manifests', () => {
    const manifests: yamlDoc[] = [
      { stringData: { key1: 'value1' } },
      { stringData: { key2: 'value2' } },
      { stringData: { key3: 'value3' } },
    ];

    const result = mergeDataFromManifests(manifests);
    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    });
  });

  test('should merge both data and stringData from multiple manifests', () => {
    const manifests: yamlDoc[] = [
      { data: { key1: 'value1' } },
      { stringData: { key2: 'value2' } },
      { data: { key3: 'value3' }, stringData: { key4: 'value4' } },
    ];

    const result = mergeDataFromManifests(manifests);
    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    });
  });

  test('should override data with stringData if keys are the same', () => {
    const manifests: yamlDoc[] = [
      { data: { key1: 'value1' } },
      { stringData: { key1: 'overrideValue' } },
    ];

    const result = mergeDataFromManifests(manifests);
    expect(result).toEqual({
      key1: 'overrideValue',
    });
  });

  test('should handle manifests with undefined data or stringData', () => {
    const manifests: yamlDoc[] = [
      { data: { key1: 'value1' } },
      { stringData: undefined },
      { data: undefined },
      { stringData: { key2: 'value2' } },
    ];

    const result = mergeDataFromManifests(manifests);
    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });
});

describe('generateEnvFile', () => {
  const testFilePath = '.env.test';

  beforeEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test('should generate a .env file with the correct content', () => {
    const envObject = {
      KEY1: 'value1',
      KEY2: 'value2',
      KEY3: 'value3',
    };

    generateEnvFile(envObject, testFilePath);

    expect(fs.existsSync(testFilePath)).toBe(true);
    const content = fs.readFileSync(testFilePath, 'utf8');
    expect(content).toBe(`KEY1='value1'\nKEY2='value2'\nKEY3='value3'`);
  });

  test('should handle an empty envObject', () => {
    const envObject = {};

    generateEnvFile(envObject, testFilePath);

    expect(fs.existsSync(testFilePath)).toBe(true);
    const content = fs.readFileSync(testFilePath, 'utf8');
    expect(content).toBe('');
  });

  test('should handle special characters in values', () => {
    const envObject = {
      KEY1: 'value with spaces',
      KEY2: 'value_with_underscores',
      KEY3: 'value-with-dashes',
    };

    generateEnvFile(envObject, testFilePath);

    expect(fs.existsSync(testFilePath)).toBe(true);
    const content = fs.readFileSync(testFilePath, 'utf8');
    expect(content).toBe(
      `KEY1='value with spaces'\nKEY2='value_with_underscores'\nKEY3='value-with-dashes'`,
    );
  });
});

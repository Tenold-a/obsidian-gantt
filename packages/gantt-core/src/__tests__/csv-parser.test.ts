import { describe, it, expect } from 'vitest';
import { parseCSV } from '../csv-parser';

describe('parseCSV', () => {
  it('parses simple CSV with headers', () => {
    const result = parseCSV('name,age\nAlice,30\nBob,25');
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('handles quoted fields with embedded delimiters', () => {
    const result = parseCSV('Name,Description\nAlice,"Engineer, Senior"\nBob,"Manager, Product"');
    expect(result).toEqual([
      { Name: 'Alice', Description: 'Engineer, Senior' },
      { Name: 'Bob', Description: 'Manager, Product' },
    ]);
  });

  it('handles escaped quotes (doubled quotes)', () => {
    const result = parseCSV('Name,Quote\nAlice,"She said ""Hello"""\nBob,"He said ""Hi"""');
    expect(result[0].Quote).toBe('She said "Hello"');
    expect(result[1].Quote).toBe('He said "Hi"');
  });

  it('handles empty fields', () => {
    const result = parseCSV('a,b,c\n1,,3\n,2,');
    expect(result).toEqual([
      { a: '1', b: '', c: '3' },
      { a: '', b: '2', c: '' },
    ]);
  });

  it('handles header-only CSV (no data rows)', () => {
    const result = parseCSV('col1,col2,col3');
    expect(result).toEqual([]);
  });

  it('handles empty string', () => {
    const result = parseCSV('');
    expect(result).toEqual([]);
  });

  it('handles custom delimiter (semicolon)', () => {
    const result = parseCSV('name;age\nAlice;30\nBob;25', { delimiter: ';' });
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('handles tab delimiter', () => {
    const result = parseCSV('name\tage\nAlice\t30\nBob\t25', { delimiter: '\t' });
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('strips UTF-8 BOM from first header', () => {
    const text = '﻿name,age\nAlice,30';
    const result = parseCSV(text);
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('preserves whitespace inside quoted fields', () => {
    const result = parseCSV('a,b\n"  padded  ",normal');
    expect(result[0].a).toBe('  padded  ');
  });

  it('handles embedded newlines in quoted fields', () => {
    const result = parseCSV('Name,Note\nAlice,"Line 1\nLine 2"\nBob,"Single line"');
    expect(result).toEqual([
      { Name: 'Alice', Note: 'Line 1\nLine 2' },
      { Name: 'Bob', Note: 'Single line' },
    ]);
  });

  it('handles CRLF line endings', () => {
    const result = parseCSV('name,age\r\nAlice,30\r\nBob,25');
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('handles trailing newline without adding empty row', () => {
    const result = parseCSV('name,age\nAlice,30\n');
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('handles single-column CSV', () => {
    const result = parseCSV('value\n1\n2\n3');
    expect(result).toEqual([
      { value: '1' },
      { value: '2' },
      { value: '3' },
    ]);
  });
});

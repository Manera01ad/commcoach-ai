import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './sanitize';

describe('renderMarkdown (XSS sanitization)', () => {
  it('should render basic markdown', () => {
    const result = renderMarkdown('**bold text**');
    expect(result).toContain('<strong>bold text</strong>');
  });

  it('should strip XSS script tags', () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should strip onerror XSS payloads', () => {
    const result = renderMarkdown('<img src=x onerror=alert(1)>');
    expect(result).not.toContain('onerror');
  });

  it('should strip javascript: protocol links', () => {
    const result = renderMarkdown('[click me](javascript:alert(1))');
    expect(result).not.toContain('javascript:');
  });

  it('should allow safe HTML elements', () => {
    const result = renderMarkdown('# Heading\n\nA paragraph with **bold** and *italic*.');
    expect(result).toContain('<h1>');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('should handle empty input', () => {
    const result = renderMarkdown('');
    expect(result).toBeDefined();
  });
});

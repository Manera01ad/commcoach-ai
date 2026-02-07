import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Renders markdown content and sanitizes the HTML output to prevent XSS attacks.
 */
export const renderMarkdown = (content: string): string => {
  return DOMPurify.sanitize(marked.parse(content) as string);
};

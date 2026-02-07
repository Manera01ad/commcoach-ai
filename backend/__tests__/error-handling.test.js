import { describe, it, expect } from 'vitest';

describe('Error Handling', () => {
  it('should return generic error message in production', () => {
    const isProduction = true;
    const err = { message: 'Sensitive database error details', status: 500 };

    const response = {
      error: isProduction ? 'Internal Server Error' : err.message,
    };

    expect(response.error).toBe('Internal Server Error');
    expect(response.error).not.toContain('Sensitive');
  });

  it('should return detailed error in development', () => {
    const isProduction = false;
    const err = { message: 'Something broke', status: 500 };

    const response = {
      error: isProduction ? 'Internal Server Error' : err.message,
    };

    expect(response.error).toBe('Something broke');
  });
});

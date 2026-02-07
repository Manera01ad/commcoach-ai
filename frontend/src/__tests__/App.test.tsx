import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock Supabase client to avoid network calls in tests
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('App', () => {
  it('should render without crashing when wrapped in providers', async () => {
    const { default: App } = await import('../App');
    const { AuthProvider } = await import('../contexts/AuthContext');
    const { ThemeProvider } = await import('../contexts/ThemeContext');
    const { ToastProvider } = await import('../contexts/ToastContext');

    const { container } = render(
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    );

    expect(container).toBeDefined();
    expect(container.innerHTML).not.toBe('');
  });
});

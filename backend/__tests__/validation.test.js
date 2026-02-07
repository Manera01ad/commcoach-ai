import { describe, it, expect } from 'vitest';
import { schemas } from '../middleware/validation.js';

describe('Validation Schemas', () => {
  describe('signup schema', () => {
    it('should accept a valid signup request', async () => {
      const validData = {
        body: {
          email: 'test@example.com',
          password: 'StrongPass1',
          full_name: 'Test User',
        },
      };

      const result = await schemas.signup.parseAsync(validData);
      expect(result.body.email).toBe('test@example.com');
    });

    it('should reject an invalid email', async () => {
      const invalidData = {
        body: {
          email: 'not-an-email',
          password: 'StrongPass1',
        },
      };

      await expect(schemas.signup.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should reject a weak password (no uppercase)', async () => {
      const weakPassword = {
        body: {
          email: 'test@example.com',
          password: 'weakpass1',
        },
      };

      await expect(schemas.signup.parseAsync(weakPassword)).rejects.toThrow();
    });

    it('should reject a weak password (no number)', async () => {
      const weakPassword = {
        body: {
          email: 'test@example.com',
          password: 'WeakPassword',
        },
      };

      await expect(schemas.signup.parseAsync(weakPassword)).rejects.toThrow();
    });

    it('should reject a short password', async () => {
      const shortPassword = {
        body: {
          email: 'test@example.com',
          password: 'Sh1',
        },
      };

      await expect(schemas.signup.parseAsync(shortPassword)).rejects.toThrow();
    });

    it('should reject a weak password (no lowercase)', async () => {
      const weakPassword = {
        body: {
          email: 'test@example.com',
          password: 'ALLUPPERCASE1',
        },
      };

      await expect(schemas.signup.parseAsync(weakPassword)).rejects.toThrow();
    });
  });

  describe('signin schema', () => {
    it('should accept a valid signin request', async () => {
      const validData = {
        body: {
          email: 'user@example.com',
          password: 'anypassword',
        },
      };

      const result = await schemas.signin.parseAsync(validData);
      expect(result.body.email).toBe('user@example.com');
    });

    it('should reject missing password', async () => {
      const missingPassword = {
        body: {
          email: 'user@example.com',
          password: '',
        },
      };

      await expect(schemas.signin.parseAsync(missingPassword)).rejects.toThrow();
    });
  });

  describe('geminiGenerate schema', () => {
    it('should accept a valid generate request', async () => {
      const validData = {
        body: {
          model: 'gemini-1.5-flash',
          prompt: 'Hello world',
        },
      };

      const result = await schemas.geminiGenerate.parseAsync(validData);
      expect(result.body.model).toBe('gemini-1.5-flash');
    });

    it('should reject missing model', async () => {
      const invalidData = {
        body: {
          model: '',
          prompt: 'Hello',
        },
      };

      await expect(schemas.geminiGenerate.parseAsync(invalidData)).rejects.toThrow();
    });
  });
});

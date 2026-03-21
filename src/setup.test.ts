import { describe, it, expect } from 'vitest';

describe('Initial Setup Test', () => {
    it('should run in node environment', () => {
        expect(typeof process).toBe('object');
        expect(typeof process.version).toBe('string');
    });
});

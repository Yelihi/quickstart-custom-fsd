import { describe, it, expect } from 'vitest';

describe('Initial Setup Test', () => {
    it('should work with jsdom', () => {
        const div = document.createElement('div');
        div.innerHTML = '<h1>Hello Vitest</h1>';
        expect(div.querySelector('h1')?.textContent).toBe('Hello Vitest');
    });
});

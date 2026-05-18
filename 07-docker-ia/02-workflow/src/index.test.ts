import { describe, it, expect } from 'vitest';
import { ping } from './index';

describe('ping', () => {
  it('devuelve pong', () => {
    expect(ping()).toBe('pong');
  });
});

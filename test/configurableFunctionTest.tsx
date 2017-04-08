import { createConfigurableFunction } from '../src';
import * as assert from 'assert';
import 'mocha';

describe('createConfigurableFunction', () => {
  const subtract = (args: { a: number, b: number }) => {
    return args.a - args.b;
  };

  describe('lock', () => {
    it('should allow you to lock certain parameters so they cant be overridden', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractFrom3 = configurableSubtract.lock({ a: 3 });
      assert.equal(subtractFrom3({ a: 5, b: 2 }), 1);
    });

    it('should allow you to default certain parameters so they arent required', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractFrom3 = configurableSubtract.lock({ a: 3 });
      assert.equal(subtractFrom3({ b: 1 }), 2);
    });

    it('should allow you to specify many arguments at once', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractWithAllArgsLocked = configurableSubtract.lock({ a: 10, b: 4 });
      assert.equal(subtractWithAllArgsLocked({ a: 5, b: 2 }), 6);
    });

    it('should anot allow you to override previous locked values with new calls to lock', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractFrom3 = configurableSubtract.lock({ a: 3 });
      const brokenSubtractFrom4 = subtractFrom3.lock({ a: 4 });
      assert.equal(brokenSubtractFrom4({ b: 1 }), 2);
    });
  });

  describe('default', () => {
    it('should allow you to default certain parameters so they can be overriden', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractFrom3Optionally = configurableSubtract.default({ a: 3 });
      assert.equal(subtractFrom3Optionally({ a: 5, b: 1 }), 4);
    });

    it('should allow you to default certain parameters so they arent required', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractFrom3Optionally = configurableSubtract.default({ a: 3 });
      assert.equal(subtractFrom3Optionally({ b: 1 }), 2);
    });

    it('should allow you to specify many arguments at once', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractWithAllArgsDefaulted = configurableSubtract.default({ a: 10, b: 3 });
      assert.equal(subtractWithAllArgsDefaulted(), 7);
    });

    it('should allow you to override previous defaults with new calls to default', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const subtractFrom3Optionally = configurableSubtract.default({ a: 3 });
      const subtractFrom4Optionally = subtractFrom3Optionally.default({ a: 4 });
      assert.equal(subtractFrom4Optionally({ b: 1 }), 3);
    });
  });

  describe('splat', () => {
    it('should create a new function which can be called with regular params', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const reversedSubtract = configurableSubtract.splat('a', 'b');
      assert.equal(reversedSubtract(3, 2), 1);
    });

    it('should be able to reorder the params according to the args', () => {
      const configurableSubtract = createConfigurableFunction(subtract);
      const reversedSubtract = configurableSubtract.splat('b', 'a');
      assert.equal(reversedSubtract(2, 3), 1);
    });
  });
});

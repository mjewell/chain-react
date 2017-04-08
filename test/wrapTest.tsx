import { ReactComponent, wrap } from '../src';
import * as assert from 'assert';
import 'mocha';
import * as React from 'react';
import { Component } from 'react';

describe('wrap', () => {
  const hoc = <PropsIn, PropsOut>(WrappedComponent: ReactComponent<PropsIn>) => {
    return class TestContainer extends Component<PropsOut, {}> {
      public render() {
        return <WrappedComponent />;
      }
    };
  };

  class TestComponent extends Component<{}, {}> {
    public render() {
      return <div />;
    }
  }

  describe('adding names', () => {
    it('should give an HOC a good display name', () => {
      const wrappedHoc = wrap(hoc);
      const container = wrappedHoc(TestComponent);
      assert.equal(container.displayName, 'TestContainer(TestComponent)');
    });
  });

  describe('memoization', () => {
    class OtherTestComponent extends Component<{}, {}> {
      public render() {
        return <div />;
      }
    }

    it('should return the same output for a given input', () => {
      const wrappedHoc = wrap(hoc);
      assert.equal(wrappedHoc(TestComponent), wrappedHoc(TestComponent));
      assert.notEqual(wrappedHoc(TestComponent), wrappedHoc(OtherTestComponent));
    });
  });

  describe('hoist non react statics', () => {
    it('should hoist non-react statics from the wrapped component', () => {
      class TestComponentWithStatics extends Component<{}, {}> {
        public static StaticMethod1() {
          return 1;
        }

        public static defaultProps() {
          return {
            a: 'b'
          };
        }

        public render() {
          return <div />;
        }
      }

      const wrappedHoc = wrap(hoc);
      const container = wrappedHoc(TestComponentWithStatics);
      assert.equal(typeof (container as any).StaticMethod1, 'function');
      assert.equal(typeof container.defaultProps, 'undefined');
    });
  });
});

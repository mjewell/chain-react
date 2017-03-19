import { ReactComponent, chain } from '../src';
import * as assert from 'assert';
import 'mocha';
import * as React from 'react';
import { Component } from 'react';

describe('chain', () => {
  it('should create a single hoc out of all the provided hocs', () => {
    const hoc1 = <PropsIn, PropsOut>(WrappedComponent: ReactComponent<PropsIn>) => {
      return class TestContainer1 extends Component<PropsOut, {}> {
        public render() {
          return <WrappedComponent />;
        }
      };
    };

    const hoc2 = <PropsIn, PropsOut>(WrappedComponent: ReactComponent<PropsIn>) => {
      return class TestContainer2 extends Component<PropsOut, {}> {
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

    const composedHoc = chain(hoc1, hoc2);
    const container = composedHoc(TestComponent);
    assert.equal(container.displayName, 'TestContainer1(TestContainer2(TestComponent))');
  });
});

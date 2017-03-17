import { ReactComponent, wrap } from '../src';
import * as assert from 'assert';
import 'mocha';
import * as React from 'react';
import { Component } from 'react';

describe('wrap', () => {
  it('should give an HOC a good display name', () => {
    const hoc = <PropsIn, PropsOut>(WrappedComponent: ReactComponent<PropsIn>) => {
      return class extends Component<PropsOut, {}> {
        public render() {
          return <WrappedComponent />;
        }
      };
    };

    const newHoc = wrap(hoc);
    const container = newHoc(() => <div />);
    assert.equal(container.displayName, 'ass');
  });
});

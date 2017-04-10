import { IHigherOrderComponent, ReactComponent, chain, configurableChain } from '../src';
import * as assert from 'assert';
import { mount } from 'enzyme';
import 'mocha';
import * as React from 'react';
import { Component } from 'react';

function hoc1<Props>(
  WrappedComponent: ReactComponent<Props & { x: string, y: boolean }>
): ReactComponent<Props> {
  return class TestContainer1 extends Component<Props, {}> {
    public render() {
      return <WrappedComponent {...this.props} x='original' y />;
    }
  };
}

function hoc2<Props>(
  WrappedComponent: ReactComponent<Props & { x: string, z: number }>
): ReactComponent<Props> {
  return function TestContainer2(props: Props & { children: never }) {
    return <WrappedComponent {...props} x='overridden' z={1} />;
  };
}

class TestComponent extends Component<{ x: string, y: number }, {}> {
  public render() {
    return <div {...this.props} />;
  }
}

describe('chain', () => {
  it('should create a single hoc out of all the provided hocs', () => {
    const composedHoc = chain(hoc1, hoc2);
    const Container = composedHoc(TestComponent);
    assert.equal(Container.displayName, 'TestContainer1(TestContainer2(TestComponent))');
    const component = mount(<Container />);
    const div = component.find('div');
    assert.equal(div.props().x, 'overridden');
    assert.equal(div.props().y, true);
    assert.equal(div.props().z, 1);
  });

  it('should return the same output given the same input', () => {
    assert.notEqual(chain(hoc1, hoc2), chain(hoc1, hoc2));
    assert.equal(chain(hoc1, hoc2)(TestComponent), chain(hoc1, hoc2)(TestComponent));
  });
});

describe('configurableChain', () => {
  function interlaceHoc<Props>(
    WrappedComponent: ReactComponent<Props>
  ): ReactComponent<Props> {
    return function InterlaceContainer(props: Props & { children: never }) {
      return <WrappedComponent {...props} />;
    };
  }

  it('should allow you to provide an interlace hoc', () => {
    const interlaceChain = configurableChain
      .lock({ interlaceHoc })
      .splatLast('hocs');
    const composedHoc = interlaceChain(hoc1, hoc2);
    const Container = composedHoc(TestComponent);
    assert.equal(
      Container.displayName,
      'InterlaceContainer(TestContainer1(InterlaceContainer(TestContainer2(InterlaceContainer(TestComponent)))))'
    );
  });
});

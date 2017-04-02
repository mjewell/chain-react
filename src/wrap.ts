import { setContainerDisplayName } from './displayName';
import { IHigherOrderComponent, ReactComponent } from './types';
import { memoize } from 'lodash';
const hoistNonReactStatic = require('hoist-non-react-statics');

export const wrap = memoize(
  <PropsIn, PropsOut>(hoc: IHigherOrderComponent<PropsIn, PropsOut>) => {
    const wrappedHoc: IHigherOrderComponent<PropsIn, PropsOut> = memoize(
      (WrappedComponent: ReactComponent<PropsIn>) => {
        const ContainerComponent = hoc(WrappedComponent);

        setContainerDisplayName(ContainerComponent, WrappedComponent);

        hoistNonReactStatic(ContainerComponent, WrappedComponent);

        return ContainerComponent;
      }
    );

    wrappedHoc.__isChainReactComponent = true;
    return wrappedHoc;
  }
);

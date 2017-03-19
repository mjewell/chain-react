import { setContainerDisplayName } from './displayName';
import { IHigherOrderComponent, ReactComponent } from './types';
import { withMemoization } from './withMemoization';
const hoistNonReactStatic = require('hoist-non-react-statics');

export function wrap<PropsIn, PropsOut>(
  hoc: IHigherOrderComponent<PropsIn, PropsOut>,
  useMemoization = true
) {
  const enhancedHoc = withMemoization(hoc, useMemoization);

  const wrappedHoc: IHigherOrderComponent<PropsIn, PropsOut> = (WrappedComponent: ReactComponent<PropsIn>) => {
    const ContainerComponent = enhancedHoc(WrappedComponent);

    setContainerDisplayName(ContainerComponent, WrappedComponent);

    hoistNonReactStatic(ContainerComponent, WrappedComponent);

    return ContainerComponent;
  };

  wrappedHoc.__isTwoChainzWrappedHoc = true;
  return wrappedHoc;
}

export const rap = wrap;

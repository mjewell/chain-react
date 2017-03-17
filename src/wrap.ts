import { setContainerDisplayName } from './displayName';
import { IHigherOrderComponent, ReactComponent } from './types';

// TODO: change this to import if we can get type annotation
const hoistNonReactStatic = require('hoist-non-react-statics');

export function wrap<PropsIn, PropsOut>(
  hoc: IHigherOrderComponent<PropsIn, PropsOut>,
  useCache = true
): IHigherOrderComponent<PropsIn, PropsOut> {
  const componentCache = new Map<ReactComponent<PropsIn>, ReactComponent<PropsOut>>();

  const wrappedHoc: IHigherOrderComponent<PropsIn, PropsOut> = (WrappedComponent: ReactComponent<PropsIn>) => {
    if (useCache && componentCache.has(WrappedComponent)) {
      return componentCache.get(WrappedComponent);
    }

    const ContainerComponent = hoc(WrappedComponent);

    setContainerDisplayName(ContainerComponent, WrappedComponent);

    hoistNonReactStatic(ContainerComponent, WrappedComponent);

    if (useCache) {
      componentCache.set(WrappedComponent, ContainerComponent);
    }

    return ContainerComponent;
  };

  wrappedHoc.__isTwoChainzWrappedHoc = true;
  return wrappedHoc;
}

export const rap = wrap;

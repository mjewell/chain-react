import { ReactComponent } from './types';

function getDisplayName<Props>(WrappedComponent: ReactComponent<Props>, defaultName: string) {
  return WrappedComponent.displayName || WrappedComponent.name || defaultName;
}

function getComponentDisplayName<Props>(WrappedComponent: ReactComponent<Props>) {
  return getDisplayName(WrappedComponent, 'Component');
}

function getContainerDisplayName<Props>(WrappedComponent: ReactComponent<Props>) {
  return getDisplayName(WrappedComponent, 'Container');
}

export function setContainerDisplayName<PropsIn, PropsOut>(
  ContainerComponent: ReactComponent<PropsOut>,
  WrappedComponent: ReactComponent<PropsIn>
) {
  const containerName = getContainerDisplayName(ContainerComponent);
  const componentName = getComponentDisplayName(WrappedComponent);
  ContainerComponent.displayName = `${containerName}(${componentName})`;
}

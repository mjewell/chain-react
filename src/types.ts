import { ComponentClass, StatelessComponent } from 'react';

export type ReactComponent<Props> = ComponentClass<Props> | StatelessComponent<Props>;

export interface IHigherOrderComponent<PropsIn, PropsOut> {
  (WrappedComponent: ReactComponent<PropsIn>): ReactComponent<PropsOut>;
  __isTwoChainzWrappedHoc?: boolean;
}

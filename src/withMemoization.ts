import { IHigherOrderComponent } from './types';
import { memoize } from 'lodash';

export function withMemoization<PropsIn, PropsOut>(
  hoc: IHigherOrderComponent<PropsIn, PropsOut>,
  useMemoization: boolean
) {
  if (useMemoization) {
    return memoize(hoc);
  }

  return hoc;
}

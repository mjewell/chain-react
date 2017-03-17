import { IHigherOrderComponent } from './types';
import { wrap } from './wrap';
import { flowRight } from 'lodash';

function wrapUnwrappedHocs(...hocs: IHigherOrderComponent<any, any>[]) {
  return hocs.map(hoc => {
    if (hoc.__isTwoChainzWrappedHoc) {
      return hoc;
    }

    return wrap(hoc);
  });
}

// should this only wrap unwrapped components?
export function chain<PropsIn, PropsOut>(
  ...hocs: IHigherOrderComponent<any, any>[]
) {
  const wrappedHocs = wrapUnwrappedHocs(...hocs);
  type HOC = IHigherOrderComponent<PropsIn, PropsOut>;
  return flowRight<HOC>(...wrappedHocs);
}

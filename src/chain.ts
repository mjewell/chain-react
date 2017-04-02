import { IHigherOrderComponent } from './types';
import { wrap } from './wrap';
import { flowRight } from 'lodash';

function wrapUnwrappedHocs(...hocs: IHigherOrderComponent<any, any>[]) {
  return hocs.map(hoc => {
    if (hoc.__isChainReactComponent) {
      return hoc;
    }

    return wrap(hoc);
  });
}

export function chain<PropsIn, PropsOut>(...hocs: IHigherOrderComponent<any, any>[]) {
  const wrappedHocs = wrapUnwrappedHocs(...hocs);
  return flowRight<IHigherOrderComponent<PropsIn, PropsOut>>(...wrappedHocs);
}

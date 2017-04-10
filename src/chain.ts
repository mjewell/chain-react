import { IHigherOrderComponent } from './types';
import { wrap } from './wrap';
import { IConfigurableFunction, createConfigurableFunction } from 'configurable-function';
import { flatMap, flowRight } from 'lodash';

export interface IChainParams {
  hocs: IHigherOrderComponent<any, any>[];
  interlaceHoc: IHigherOrderComponent<any, any>;
}

function interlace(interlaceEl: any, ...arr: any[]) {
  if (!interlaceEl) {
    return arr;
  }

  const newArr = flatMap(arr, el => [interlaceEl, el]);
  newArr.push(interlaceEl);
  return newArr;
}

function chainBase<PropsIn, PropsOut>({
  hocs,
  interlaceHoc
}: IChainParams) {
  const hocsToCompose = interlace(interlaceHoc, ...hocs);
  const wrappedHocs = hocsToCompose.map(wrap);
  return flowRight<IHigherOrderComponent<PropsIn, PropsOut>>(...wrappedHocs);
}

export const configurableChain = createConfigurableFunction(chainBase);
export const chain = configurableChain.splatLast('hocs');

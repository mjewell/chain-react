import { IMap } from './types';
import { assign, intersection } from 'lodash';

export interface ConfigurableFunction<T> {
  (params?: IMap<any>): T;
  lock: (params: IMap<any>) => ConfigurableFunction<T>;
  default: (params: IMap<any>) => ConfigurableFunction<T>;
  splat: (...propNames: string[]) => (...args: any[]) => T;
}

function mergeParams(params: IMap<any> | undefined, lockedParams: IMap<any>, defaultParams: IMap<any>) {
  return assign({}, defaultParams, params, lockedParams);
}

function getRepeatedKeys(newParams: IMap<any>, params: IMap<any>) {
  const newKeys = Object.keys(newParams);
  const oldKeys = Object.keys(params);
  return intersection(newKeys, oldKeys);
}

function createNamedArgs(propNames: string[], args: any[]) {
  return propNames.reduce((props, propName, i) => ({
    ...props,
    [propName]: args[i]
  }), {});
}

function createConfigurableFunctionBase<T>(
  func: (params?: IMap<any>) => T,
  lockedParams: IMap<any>,
  defaultParams: IMap<any>
) {
  const configurableFunction = <ConfigurableFunction<T>>function (params?: IMap<any>) {
    const mergedParams = mergeParams(params, lockedParams, defaultParams);
    return func(mergedParams);
  };

  configurableFunction.lock = (newLockedParams: IMap<any>) => {
    const repeats = getRepeatedKeys(newLockedParams, lockedParams);

    if (repeats.length > 0) {
      throw new Error(`These keys have already been locked: ${repeats.join(', ')}`);
    }

    const mergedLockedParams = assign({}, newLockedParams, lockedParams);
    return createConfigurableFunctionBase<T>(func, mergedLockedParams, defaultParams);
  };

  configurableFunction.default = (newDefaultParams: IMap<any>) => {
    const mergedDefaultParams = assign({}, defaultParams, newDefaultParams);
    return createConfigurableFunctionBase<T>(func, lockedParams, mergedDefaultParams);
  };

  configurableFunction.splat = (...propNames: string[]) => {
    return (...args) => {
      const newParams = createNamedArgs(propNames, args);
      const mergedParams = mergeParams(newParams, lockedParams, defaultParams);
      return func(mergedParams);
    };
  };

  return configurableFunction;
}

export function createConfigurableFunction<T>(func: (params?: IMap<any>) => T) {
  return createConfigurableFunctionBase<T>(func, {}, {});
}

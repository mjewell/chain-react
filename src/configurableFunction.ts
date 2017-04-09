import { IMap } from './types';
import { assign, intersection } from 'lodash';

export interface ConfigurableFunction<T> {
  (params?: IMap<any>): T;
  func: (params?: IMap<any>) => T;
  lockedParams: IMap<any>;
  defaultParams: IMap<any>;
  strict: boolean;
  lock: (params: IMap<any>) => ConfigurableFunction<T>;
  default: (params: IMap<any>) => ConfigurableFunction<T>;
  splat: (...propNames: string[]) => (...args: any[]) => T;
}

function mergeParams(params: IMap<any> | undefined, lockedParams: IMap<any>, defaultParams: IMap<any>) {
  return assign({}, defaultParams, params, lockedParams);
}

function getRepeatedKeys(newParams: IMap<any> | string[], params: IMap<any>) {
  const newKeys = newParams instanceof Array ? newParams : Object.keys(newParams);
  const oldKeys = Object.keys(params);
  return intersection(newKeys, oldKeys);
}

function throwIfParamsAreLocked(newParams: IMap<any> | string[], lockedParams: IMap<any>, strict: boolean) {
  if (strict) {
    const repeats = getRepeatedKeys(newParams, lockedParams);
    if (repeats.length > 0) {
      throw new Error(`These keys have already been locked: ${repeats.join(', ')}`);
    }
  }
}

function createNamedArgs(propNames: string[], args: any[]) {
  return propNames.reduce((props, propName, i) => ({
    ...props,
    [propName]: args[i]
  }), {});
}

const configurableFunctionPrototype = {
  lock<T>(newLockedParams: IMap<any>) {
    throwIfParamsAreLocked(newLockedParams, this.lockedParams, this.strict);
    const mergedLockedParams = assign({}, newLockedParams, this.lockedParams);
    return createConfigurableFunctionBase<T>(this.func, mergedLockedParams, this.defaultParams, this.strict);
  },

  default<T>(newDefaultParams: IMap<any>) {
    const mergedDefaultParams = assign({}, this.defaultParams, newDefaultParams);
    return createConfigurableFunctionBase<T>(this.func, this.lockedParams, mergedDefaultParams, this.strict);
  },

  splat(...propNames: string[]) {
    throwIfParamsAreLocked(propNames, this.lockedParams, this.strict);

    return (...args: any[]) => {
      const newParams = createNamedArgs(propNames, args);
      const mergedParams = mergeParams(newParams, this.lockedParams, this.defaultParams);
      return this.func(mergedParams);
    };
  }
};

function createConfigurableFunctionBase<T>(
  func: (params?: IMap<any>) => T,
  lockedParams: IMap<any>,
  defaultParams: IMap<any>,
  strict?: boolean
) {
  const configurableFunction: ConfigurableFunction<T> = <ConfigurableFunction<T>> function (params?: IMap<any>) {
    const mergedParams = mergeParams(params, lockedParams, defaultParams);
    return func(mergedParams);
  };

  configurableFunction.func = func;
  configurableFunction.lockedParams = lockedParams;
  configurableFunction.defaultParams = defaultParams;
  configurableFunction.strict = !!strict;

  Object.setPrototypeOf(configurableFunction, configurableFunctionPrototype);

  return configurableFunction;
}

export function createConfigurableFunction<T>(func: (params?: IMap<any>) => T, strict?: boolean) {
  return createConfigurableFunctionBase<T>(func, {}, {}, strict);
}

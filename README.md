# Chain React

A library for simplifying the use of Higher-Order Components (HOCs). Higher-Order Components have a few conventions and caveats associated with them, as listed [here](https://facebook.github.io/react/docs/higher-order-components.html). This library helps to follow these conventions and avoid these issue cases.

## Conventions

### [Wrap the Display Name for Easy Debugging](https://facebook.github.io/react/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)

The display name will be automatically generated on the container class based on the name of the provided component. This makes it easier to see what's happening in the react devtools.

## Caveats

### [Don't Use HOCs Inside the render Method](https://facebook.github.io/react/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method)

By memoizing the HOCs we can avoid this issue entirely, allowing you to safely use HOCs inside the render method. With memoization, two calls to the same HOC with the same Component will return the same instance of a class, rather than creating a new one each time.

### [Static Methods Must Be Copied Over](https://facebook.github.io/react/docs/higher-order-components.html#static-methods-must-be-copied-over)

Static methods are copied over to your containers automatically, meaning they will always be available.

## `wrap`

`wrap` takes a single higher-order component and returns a new higher order component. This higher order component adds a useful `displayName`, hoists non-react static methods from the component being wrapped, and is memoized so subsequent calls with the same argument will return the same new higher-order component.

```
const myHoc = WrappedComponent => { ... };
const wrappedHoc = wrap(myHoc);
const component = wrappedHoc(myPresenter);
```

## `chain`

`chain` takes a series of higher-order components as arguments and creates a new higher order component by composing them together. It calls `wrap` on any provided higher-order components that are not already wrapped so you still get all those benefits.

```
const myHoc1 = WrappedComponent => { ... };
const myHoc2 = WrappedComponent => { ... };
const myHoc3 = WrappedComponent => { ... };
const chainedHoc = chain(myHoc1, myHoc2, myHoc3);
const component = chainedHoc(myPresenter);

// the chain looks like this:
// myHoc1 -> myHoc2 -> myHoc3 -> myPresenter
```

## `configurableChain`

A [configurable](https://github.com/mjewell/configurable-function) version of `chain`, which can also receive an `interlaceHoc`, a higher-order component that will be inserted between all higher-order components in the chain. This is useful for example, if you wanted to make all components `observer`s when using mobx. You could use this version of chain:

```
import { observer } from 'mobx-react';
const chainWithObserver = chain.lock({ interlaceHoc: observer });
const customChain = chainWithObserver.splatLast('hocs');
```

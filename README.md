# Two Chainz

A library for simplifying the use of Higher-Order Components (HOCs). Higher-Order Components have a few conventions and caveats assocaited with them, as listed [here](https://facebook.github.io/react/docs/higher-order-components.html). This library helps to follow these conventions and avoid these issue cases.

## Conventions

### [Wrap the Display Name for Easy Debugging](https://facebook.github.io/react/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)

The display name will be automatically generated on the container class based on the name of the provided component. This makes it easier to see what's happening in the react devtools.

## Caveats

### [Don't Use HOCs Inside the render Method](https://facebook.github.io/react/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method)

By memoizing the HOCs we can avoid this issue entirely, allowing you to safely use HOCs inside the render method. With memoization, two calls to the same HOC with the same Component will return the same instance of a class, rather than creating a new one each time.

### [Static Methods Must Be Copied Over](https://facebook.github.io/react/docs/higher-order-components.html#static-methods-must-be-copied-over)

Static methods are copied over to your containers automatically, meaning they will always be available.

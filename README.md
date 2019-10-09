# paper-autocomplete

> Autocomplete component compatible with Polymer 3.x

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ellipticaljs/paper-autocomplete)

[![Build Status](https://github.com/Neovici/paper-autocomplete/workflows/Github%20CI/badge.svg)](https://github.com/Neovici/paper-autocomplete/actions?workflow=Github+CI)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

`paper-autocomplete` extends earlier efforts such as this
[https://github.com/rodo1111/paper-input-autocomplete](https://github.com/rodo1111/paper-input-autocomplete) to provide
keyboard support, remote binding and results scrolling.

# Installation

``` bash

bower install paper-autocomplete

```

# Usage

```html

<link rel="import" href="bower_components/paper-autocomplete/paper-autocomplete.html">

<paper-autocomplete id="my-id" label="Select" ></paper-autocomplete>

```

# Demo and Docs

http://ellipticaljs.github.io/paper-autocomplete/

**Important: The demos only work with browers which are ES2015/ES6 compatible.**. This component is compatible with older
browsers as well, but the code need to be transpiled to ES5. `polymer build` and `polymer serve` can do that for you.
This code from this page is not transpiled.

# Want to contribute?

Check out our [Contributing guide](./CONTRIBUTING.md)!

# For Developers

## Getting Started

Clone the repository and run:

`npm install`

## How to run the project

You just need

## How to run the project with Polymer 1.x and Polymer 2
This component runs in Polymer hybrid mode, that means it can run in a Polymer 1.x or Polymer 2.x app.
```
npm run variants
```
After running this command, it will open two different ports  in the dev browser with Polymer 1.x and Polymer 2.x

## How to run the tests

### Localy

In order to run the tests you have two option. You can either run:

```
npm run test
```

### Remote (in Saucelabs)

```
npm run test:remote
```
> You must set these two environment variables: `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` before running remote tests.


## How to *lint* the project

```
npm run lint
```

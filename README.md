# paper-autocomplete

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ellipticaljs/paper-autocomplete)

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

# Want to contribute?

Check out our [Contributing guide](./CONTRIBUTING.md)! 

# For Developers

## Getting Started

Clone the repository and run:

`npm install`

## How to run the project

You just need

## How to run the tests

In order to run the tests you have two option. You can either run:

```
npm run test
```

or you can run:

```
npm run start
```

And then open this URL: [http://localhost:8080/components/paper-autocomplete/test/](http://localhost:8080/components/paper-autocomplete/test/)

**Please note:** at this moment there is a known issues and these two tests always fail:

```
ARIA state and property values must be valid
Attributes which refer to other elements by ID should refer to elements which exist in the DOM
```

## How to *lint* the project

```
npm run lint
```

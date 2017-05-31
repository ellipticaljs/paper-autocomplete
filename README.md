# paper-autocomplete

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ellipticaljs/paper-autocomplete)

`paper-autocomplete` extends earlier efforts such as this 
[https://github.com/rodo1111/paper-input-autocomplete](https://github.com/rodo1111/paper-input-autocomplete) to provide 
keyboard support, remote binding and results scrolling.

# About Polymer 1.x and 2.x Compatibility
The latest version released (`v2.6.0`) is **not** compatible with Polymer 2.x. At this moment there is a work in 
progress version that works with Polymer 2.x in the branch **2.0-preview**. It is functional but it contains a few 
known issues:
- When using custom templates, you must implement the methods `_onTap` and `_getSuggestionId`

This should allow you to migrate to Polymer 2.x as soon as possible while we work in a fully stable and compatible
version of `paper-autocomplete`.

In addition, we are still considering what to do regarding Polymer 2.x. Due to the complexity of implementing a 
hybrid version, it might be decided to release a new version that is only compatible with Polymer 2.x. But please, 
be assured that we will continue maintaining the 1.x branch with bugfixes, but no new functionality will be added to 
the 1.x branch. The aim is to maintain 100% API backward compatibility. But if that is not the case, a MIGRATION 
guide will be provided.

Since this is not 100% decided yet, feel free to open an issue and leave feedback. Thanks!

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

/**
  `paper-autocomplete`

  **From v3.x.x, this component only works with Polymer 1.7+ or 2.0+.**

  [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ellipticaljs/paper-autocomplete)

  [![Sauce Test Status](https://saucelabs.com/browser-matrix/jhuesos.svg)](https://saucelabs.com/u/jhuesos)

  paper-autocomplete extends earlier efforts such as this (https://github.com/rodo1111/paper-input-autocomplete)
  to provide keyboard support, remote binding and results scrolling.

  It is **important to provide both `textProperty` and `valueProperty` when working with a custom search function and
  or custom templates.** They are needed to keep the component accessible and for the events (e.g. onSelect) to keep
  working.

  To integrate with `iron-input`, you must set the `name` option. The selected `value` will be exposed, **not** the
  `text` value,

  ### About Polymer 1.x and 2.x Compatibility
  From version `3.x.x`, this component work with both Polymer 1.7+ or Polymer 2.0+ Please take a look to the
  [MIGRATION.md](./MIGRATION.md) file that contains more information.

  ### Custom search
  This component has the public method `queryFn` that is called in each key stroke and it is responsible to query
  all items in the `source` and returns only those items that matches certain filtering criteria. By default, this
  component searches for items that start with the recent query (case insensitive).
  You can override this behavior providing your own query function, as long as these two requirements are fulfilled:
  - The query function is synchronous.
  - The API is respected and the method always returns an Array.
  The template used to render each suggestion depends on the structure of each object that this method returns. For the
  default template, each suggestion should follow this object structure:
  ```
    {
      text: objText,
      value: objValue
    }
  ```

  This function is only used when a local data source is used. When using a `remoteDataSource` user is responsible for
  doing the search and specify suggestions manually.

  ### Custom templates
  A template for each suggestion can be provided, but for now, there are limitations in the way you can customize
  the template. Please, read this section carefully to know them.
  In order to set your own template, you need to add a `<template>` tag with the attribute
  `autocomplete-custom-template` and the following structure:

  ```html
  <paper-autocomplete>
    <template autocomplete-custom-template>
      <paper-item on-tap="_onSelect" id$="[[_getSuggestionId(index)]]" role="option" aria-selected="false">
        <style>
          /** Styles for your custom template here **\/
        </style>

        YOUR CUSTOM TEMPLATE
        <paper-ripple></paper-ripple>
      </paper-item>
    </template>
  </paper-autocomplete>
  ```

  You need to always maintain this structure. Then you can customize the content of paper-item. These are the reasons
  why you need to maintain it:

  - `_onSelect` it is very important because it will notify the `autocomplete` component when user selects one item.
  If you don't add this option, when user clicks in one of the items, nothing will happen.
  - `id`, `role` and `aria-selected` need to be there for accessibility reasons. If you don't set them, the component
  will continue working but it will not be accessible for users with disabilities.

  It is important to clarify that methods `_onSelect` and `_getSuggestionId` do not need to be implemented. They are
  part of the logic of `paper-autocomplete`.

  When providing your own custom template, you might also need to provide your own custom search function. The reason
  for that is that the default search function only exposes text and value in the results. If each item in your data
  source contains more information, then you won't be able to access it. See the code of the `<address-autocomplete>`
  element in the demo folder for a complete example.

  Another important thing to point out is related to the height of each suggestion item in the results. The height of
  the suggestion template changes dynamically depending on the height of a suggestion item. However, the following
  assumptions were made:
  - All suggestions items have the same height
  - The height of each item is fixed and can be determined at any time. For example, if you want to use images in the
  results, make sure they have a placeholder or a fixed height.

  By default, suggestions are only displayed after the user types, even if the current input should display them. If
  you want to show suggestions on focus (when available), you should add the property `show-results-on-focus`.

  ### Styling

  `<paper-autocomplete>` provides the following custom properties and mixins
  for styling:

  Custom property | Description | Default
  ----------------|-------------|----------
  `--paper-input-container-focus-color` | sets the components input container focus color | `var(--primary-color)`
  `--paper-autocomplete-suggestions-item-min-height` | min height of each suggestion item | `36px`
  `--paper-autocomplete-suggestions-wrapper` | mixin to apply to the suggestions container | `{}`

  ### Accessibility

  This component is friendly with screen readers (tested only with VoiceOver and NVDA in Windows): current selection
  and active suggestion are announced.

  @demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import './paper-autocomplete-suggestions.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-material/paper-material.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
// This Polyfill is needed for this version to work with IE11 and Polymer 1.x
// TODO: find out why this is needed in IE11
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, argument) {
      argument = argument || window;
      for (var i = 0; i < this.length; i++) {
          callback.call(argument, this[i], i, this);
      }
  };
}

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;
        position: relative;

        --paper-input-container-focus-color: var(--primary-color);

        --paper-icon-button: {
          height: 24px;
          width: 24px;
          padding: 2px;
        }

        --paper-input-container-ms-clear: {
          display: none;
        }
      }

      .input-wrapper {
        @apply --layout-horizontal;
      }

      .input-wrapper paper-input {
        @apply --layout-flex;
      }

      #clear {
        display: none;
        line-height: 8px;
      }

      .sr-only {
        position: absolute;
        clip: rect(1px, 1px, 1px, 1px);
      }

      paper-autocomplete-suggestions {
        --suggestions-wrapper: {
          @apply --paper-autocomplete-suggestions-wrapper;
        };

        --paper-item-min-height: var(--paper-autocomplete-suggestions-item-min-height, 36px);
      }
    </style>

    <div class="input-wrapper" role="combobox" aria-haspopup="true" aria-owns="suggestionsWrapper" aria-expanded\$="[[_isSuggestionsOpened]]">
      <!-- For accessibility, it is needed to have a label or aria-label. Label is preferred -->
      <label for="autocompleteInput" class="sr-only">[[label]]</label>

      <!-- Adding a hidden input to integrate with iron-form, if required -->
      <input type="hidden" name\$="[[name]]" value\$="[[value]]">

      <paper-input id="autocompleteInput" label="[[label]]" autocapitalize="[[autocapitalize]]" no-label-float="[[noLabelFloat]]" disabled="{{disabled}}" readonly="[[readonly]]" focused="{{focused}}" auto-validate\$="[[autoValidate]]" error-message\$="[[errorMessage]]" required\$="[[required]]" value="{{text}}" allowed-pattern="[[allowedPattern]]" pattern="[[pattern]]" always-float-label="[[alwaysFloatLabel]]" char-counter\$="[[charCounter]]" maxlength\$="[[maxlength]]" placeholder="[[placeholder]]" invalid="{{invalid}}" role="textbox" aria-autocomplete="list" aria-multiline="false" aria-activedescendant\$="[[_highlightedSuggestion.elementId]]" aria-disabled\$="[[disabled]]" aria-controls="autocompleteStatus suggestionsWrapper">

        <slot name="prefix" slot="prefix"></slot>
        <!-- TODO: remove tabindex workaround when  is fixed https://github.com/PolymerElements/paper-input/issues/324 -->
        <paper-icon-button slot="suffix" suffix="" id="clear" icon="clear" on-click="_clear" tabindex="-1"></paper-icon-button>
        <slot name="suffix" slot="suffix"></slot>
      </paper-input>
      <!-- to announce current selection to screen reader -->
      <span id="autocompleteStatus" role="status" class="sr-only">[[_highlightedSuggestion.textValue]]</span>
    </div>

    <paper-autocomplete-suggestions for="autocompleteInput" id="paperAutocompleteSuggestions" min-length="[[minLength]]" text-property="[[textProperty]]" value-property="[[valueProperty]]" selected-option="{{selectedOption}}" source="[[source]]" remote-source="[[remoteSource]]" query-fn="[[queryFn]]" event-namespace="[[eventNamespace]]" highlighted-suggestion="{{_highlightedSuggestion}}" is-open="{{_isSuggestionsOpened}}" highlight-first="[[highlightFirst]]" show-results-on-focus="[[showResultsOnFocus]]">

      <slot id="templates" name="autocomplete-custom-template"></slot>

    </paper-autocomplete-suggestions>
`,

  is: 'paper-autocomplete',

  properties: {
    /**
     * `autoValidate` Set to true to auto-validate the input value.
     */
    autoValidate: {
      type: Boolean,
      value: false
    },
    /**
     * Setter/getter manually invalid input
     */
    invalid : {
      type: Boolean,
      notify: true,
      value: false
    },
    /**
     * `autocapitalize` Sets auto-capitalization for the input element.
     */
    autocapitalize: String,

    /**
     * `errorMessage` The error message to display when the input is invalid.
     */
    errorMessage: {
      type: String
    },

    /**
     * `label` Text to display as the input label
     */
    label: String,

    /**
     * `noLabelFloat` Set to true to disable the floating label.
     */
    noLabelFloat: {
      type: Boolean,
      value: false
    },

    /**
     * `alwaysFloatLabel` Set to true to always float label
     */
    alwaysFloatLabel: {
      type: Boolean,
      value: false
    },

    /**
     * The placeholder text
     */
    placeholder: String,

    /**
     * `required` Set to true to mark the input as required.
     */
    required: {
      type: Boolean,
      value: false
    },

    /**
     * `readonly` Set to true to mark the input as readonly.
     */
    readonly: {
      type: Boolean,
      value: false
    },

    /**
     * `focused` If true, the element currently has focus.
     */
    focused: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * `disabled` Set to true to mark the input as disabled.
     */
    disabled: {
      type: Boolean,
      value: false
    },

    /**
     * `source` Array of objects with the options to execute the autocomplete feature
     */
    source: {
      type: Array,
      observer: '_sourceChanged'
    },

    /**
     * Property of local datasource to as the text property
     */
    textProperty: {
      type: String,
      value: 'text'
    },

    /**
     * Property of local datasource to as the value property
     */
    valueProperty: {
      type: String,
      value: 'value'
    },

    /**
     * `value` Selected object from the suggestions
     */
    value: {
      type: Object,
      notify: true
    },

    /**
     * The current/selected text of the input
     */
    text: {
      type: String,
      notify: true,
      value: ''
    },

    /**
     * Disable showing the clear X button
     */
    disableShowClear: {
      type: Boolean,
      value: false
    },

    /**
     * Binds to a remote data source
     */
    remoteSource: {
      type: Boolean,
      value: false
    },

    /**
     * Event type separator
     */
    eventNamespace: {
      type: String,
      value: '-'
    },

    /**
     * Minimum length to trigger suggestions
     */
    minLength: {
      type: Number,
      value: 1
    },

    /**
     * `pattern` Pattern to validate input field
     */
    pattern: String,

    /**
     * allowedPattern` allowedPattern to validate input field
     */
    allowedPattern: String,

    /**
     * Set to `true` to show a character counter.
     */
    charCounter: {
      type: Boolean,
      value: false
    },

    /**
     * The maximum length of the input value.
     */
    maxlength: {
      type: Number
    },

    /**
     * Name to be used by the autocomplete input. This is necessary if wanted to be integrated with iron-form.
     */
    name: String,

    /**
     * Function used to filter available items. This function is actually used by paper-autocomplete-suggestions,
     * it is also exposed here so it is possible to provide a custom queryFn.
     */
    queryFn: {
      type: Function
    },

    /**
     * If `true`, it will always highlight the first result each time new suggestions are presented.
     */
     highlightFirst: {
      type: Boolean,
      value: false
    },

    /**
     * Set to `true` to show available suggestions on focus. This overrides the default behavior that only shows
     * notifications after user types
     */
    showResultsOnFocus: {
      type: Boolean,
      value: false
    },

    /*************
    * PRIVATE
    *************/
    // TODO: check if we need _value and _text properties. It seems they can be removed
    _value: {
      value: undefined
    },

    _text: {
      value: undefined
    },

    /**
     * Indicates whether the clear button is visible or not
     */
    _isClearButtonVisible: {
      type: Boolean,
      value: false
    },

    /**
     * Indicates whether the suggestion popup is visible or not.
     */
    _isSuggestionsOpened: {
      type: Boolean,
      value: false
    },

    /**
     * Object containing the information of the currently selected option
     */
    selectedOption: {
      type: Object,
      notify: true
    }
  },

  observers: [
    '_textObserver(text)'
  ],

  _sourceChanged: function (newSource) {
    var text = this.text;
    if (!Array.isArray(newSource) || newSource.length === 0 || text == null || text.length < this.minLength) {
      return;
    }
    if (!this.$.autocompleteInput.focused) {
      return;
    }
    this.$.paperAutocompleteSuggestions._handleSuggestions({
      target: {
        value: text
      }
    });
  },

  // Element Lifecycle
  ready: function () {
    this._value = this.value;

    this.addEventListener(
      'autocomplete' + this.eventNamespace + 'selected',
      this._onAutocompleteSelected.bind(this)
    );
  },

  /**
   * Clears the input text
   */
  _clear: function () {
    var option = {
      text: this.text,
      value: this.value
    };

    this.value = null;
    this._value = null;
    this.text = '';
    this._text = '';

    this._fireEvent(option, 'reset-blur');

    this._hideClearButton();

    // Fix: https://github.com/PolymerElements/paper-input/issues/493
    if (!this.$.autocompleteInput.focused) {
      this.$.autocompleteInput.focus();
    }
  },

  /**
   * Dispatches autocomplete events
   */
  _fireEvent: function (option, evt) {
    var id = this._getId();
    var event = 'autocomplete' + this.eventNamespace + evt;

    this.fire(event, {
      id: id,
      value: option[this.valueProperty] || option.value,
      text: option[this.textProperty] || option.text,
      target: this,
      option: option
    });
  },

  /**
   * On text event handler
   */
  _textObserver: function (text) {
    if (text && text.trim()) {
      this._showClearButton();
    } else {
      this._hideClearButton();
    }
  },

  /**
   * On autocomplete selection
   */
  _onAutocompleteSelected: function (event) {
    var selection = event.detail;

    this.value = selection.value;
    this.text = selection.text;
  },

  /**
   * Show the clear button (X)
   */
  _showClearButton: function () {
    if (this.disableShowClear) {
      return;
    }

    if (this._isClearButtonVisible) {
      return;
    }

    this.$.clear.style.display = 'inline-block';
    this._isClearButtonVisible = true;
  },

  /**
   * Hide the clear button (X)
   */
  _hideClearButton: function () {
    if (!this._isClearButtonVisible) {
      return;
    }

    this.$.clear.style.display = 'none';
    this._isClearButtonVisible = false;
  },

  _getId: function () {
    var id = this.getAttribute('id');
    if (!id) id = this.dataset.id;
    return id;
  },

  /****************************
   * PUBLIC
   ****************************/

  /**
   * Gets the current text/value option of the input
   * @returns {Object}
   */
  getOption: function () {
    return {
      text: this.text,
      value: this.value
    };
  },

  /**
   * Sets the current text/value option of the input
   * @param {Object} option
   */
  setOption: function (option) {
    this.text = option[this.textProperty] || option.text;
    this.value = option[this.valueProperty] || option.value;
    this._showClearButton();
  },

  /**
   * Disables the input
   */
  disable: function () {
    this.disabled = true;
  },

  /**
   * Enables the input
   */
  enable: function () {
    this.disabled = false;
  },

  /**
   * Sets the component's current suggestions
   * @param {Array} arr
   */
  suggestions: function (arr) {
    this.$.paperAutocompleteSuggestions.suggestions(arr);
  },

  /**
   * Validates the input
   * @returns {Boolean}
   */
  validate: function () {
    return this.$.autocompleteInput.validate();
  },

  /**
   * Clears the current input
   */
  clear: function () {
    this._value = '';
    this._text = '';
    this._clear();
  },

  /**
   * Resets the current input (DEPRECATED: please use clear)
   */
  reset: function () {
    this._clear();
  },

  /**
   * Hides the suggestions popup
   */
  hideSuggestions: function () {
    this._hideClearButton();
    this.$.paperAutocompleteSuggestions.hideSuggestions();
  },

  /**
   * Allows calling the onSelect function from outside
   * This in time triggers the autocomplete-selected event
   * with all the data required
   */
  onSelectHandler: function (event) {
    this.$.paperAutocompleteSuggestions._onSelect(event);
  }

  /**
   * Fired when a selection is made
   *
   * @event autocomplete-selected
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input change
   *
   * @event autocomplete-change
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input focus
   *
   * @event autocomplete-focus
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input blur
   *
   * @event autocomplete-blur
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input reset/clear
   *
   * @event autocomplete-reset-blur
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */
});

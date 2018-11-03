/**
  `paper-autocomplete-suggestions`

  **From v3.x.x, this component only works with Polymer 1.7+ or 2.0+.**

  [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ellipticaljs/paper-autocomplete)

  [![Sauce Test Status](https://saucelabs.com/browser-matrix/jhuesos.svg)](https://saucelabs.com/u/jhuesos)

  Allows to add autocomplete capabilities to any input field. This is desirable when you have an input field with custom
  logic and you just want to add the feature to help users with the selection. If you want to use it in combination with
  a regular `<paper-input>`, you can use `<paper-autocomplete>`.

  Example:
  ```
  <div class="autocomplete-wrapper">
    <paper-input id="myInput" label="Select State"></paper-input>

    <paper-autocomplete-suggestions
      for="myInput"
      source="[[accounts]]"></paper-autocomplete-suggestions>
  </div>
  ```

  It is **important to provide both `textProperty` and `valueProperty` when working with a custom search function and
  or custom templates.** They are needed to keep the component accessible and for the events (e.g. onSelect) to keep
  working.

  ### About Polymer 1.x and 2.x Compatibility
  From version `3.x.x`, this component work with both Polymer 1.7+ or Polymer 2.0+ Please take a look to the
  [MIGRATION.md](./MIGRATION.md) file that contains more information.

  ### Custom search
  This component has the public method `queryFn` that is called in each key stroke and it is responsible to query
  all items in the `source` and returns only those items that matches certain filtering criteria. By default, this
  component search for items that start with the recent query (case insensitive).
  You can override this behavior providing your own query function, as long as these two requirements are fulfill:

  - The query function is synchronous.
  - The API is respected and the method always return an Array.


  The template use to render each suggestion depends on the structure of each object that this method returns. For the
  default template, each suggestion should follow this object structure:

  ```
    {
      text: objText,
      value: objValue
    }
  ```

  This function is only used when a local data source is used. When using a `remoteDataSource` user is responsible of
  doing the search and specify suggestions manually.

  ### Custom templates
  A template for each suggestion can be provided, but for now, there are limitations in the way you can customize
  the template. Please read the the following sections carefully.
  In order to set your own template, you need to add a `<template>` tag with the slot name
  `autocomplete-custom-template` and a structure equivalent to the one shown in the `<account-autocomplete>` component in
  the demo.

  You need to always maintain this structure. Then you can customize the content of paper-item. These are the reasons
  why you need to maintain it:

  - `onSelectHandler` it is very important because it will notify the `autocomplete` component when user selects one item.
  If you don't add this option, when user clicks in one of the items, nothing will happen.
  - `id`, `role` and `aria-selected` need to be there for accessibility reasons. If you don't set them, the component
  will continue working but it will not be accessible for user with disabilities.


  It is important to clarify that methods `_onSelect` and `_getSuggestionId` do not need to be implemented. They are
  part of the logic of `paper-autocomplete-suggestions`.

  When providing your own custom template, you might also need to provide your own custom search function. The reason
  for that is that the default search function only exposes text and value in the results. If each item in your data
  source contains more information, then you won't be able to access it. See the code of `<address-autocomplete>`
  element in the demo folder for a complete example.

  Another important thing to point out is related to the height of each suggestion item in the results. The height of
  the suggestion template changes dynamically depending on the height of a suggestion item. However, the following
  assumptions were made:
  - All suggestions items have the same height
  - The height of each item is fixed and can be determined at any time. For example, if you want to use images in the
  results, make sure they have a placeholder or a fixed height.


  ### Styling

  `<paper-autocomplete-suggestions>` provides the following custom properties and mixins
  for styling:

  Custom property | Description | Default
  ----------------|-------------|----------
  `--paper-item-min-height` | paper item min height | `36px`
  `--suggestions-wrapper` | mixin to apply to the suggestions container | `{}`
  `--suggestions-item` | mixin to apply to the suggestions items | `{}`

  ### Accessibility
  This component exposes certain necessary values in order to make your component accessible. When checking the ARIA
  specs, it is said that you need to inform users of the following changes:
  - Whether the popup with suggestions is open or not.
  - Id of the currently highlighted element

 You can access these values using the following properties: `isOpen` and `highlightedSuggestion`. The id of each
 element in highlightedSuggestion a random and unique id.

 In addition, as long as developers follow the general structure of each suggestion template, the following A11Y
 features are set in each suggestion:
 - `role="option"`
 - `aria-selected="true|false"`. This value will be false for all suggestion except in the one which is currently
 highlighted.

 By default, suggestions are only displayed after the user types, even if the current input should display them. If
  you want to show suggestions on focus (when available), you should add the property `show-results-on-focus`.

  @demo demo/paper-autocomplete-suggestions-demo.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-material/paper-material.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import { dom, flush } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

var DIRECTION = {
  UP: 'up',
  DOWN: 'down'
};

var KEY_CODES = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ENTER: 13,
  ESCAPE: 27
};

Polymer({
  _template: html`
    <style>
      paper-material {
        display: none;
        position: absolute;
        width: 100%;
        z-index: 1000;
        background-color: white;
        max-height: 252px;
        overflow-y: auto;

        @apply --suggestions-wrapper;
      }

      paper-item,
      :host ::slotted(paper-item) {
        min-height: var(--paper-item-min-height, 36px);
        padding: 0 16px;
        position: relative;
        line-height: 18px;

        @apply --suggestions-item;
      }

      paper-item:hover,
      :host ::slotted(paper-item:hover) {
        background: #eee;
        color: #333;
        cursor: pointer;
      }

      paper-item.active,
      :host ::slotted(paper-item.active) {
        background: #eee;
        color: #333;
      }

      /**
       * IE11 paper-item min-height bug: https://github.com/PolymerElements/paper-item/issues/35
       */
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        paper-item {
          height: var(--paper-item-min-height, 36px);
        }
      }
    </style>
    <div>
      <!-- unselectable is needed to fix an issue related to the focus being taken away when clicking in the
       results scrollbar -->
      <paper-material elevation="1" id="suggestionsWrapper" unselectable="on"></paper-material>

      <!-- Default suggestion template -->
      <template id="defaultTemplate">
        <paper-item id\$="[[_getSuggestionId(index)]]" role="option" aria-selected="false" on-tap="_onSelect">
          <div>[[_getItemText(item)]]</div>
          <paper-ripple></paper-ripple>
        </paper-item>
      </template>

  <!-- Custom template -->
  <slot id="templates" name="autocomplete-custom-template"></slot>
  </div>
`,

  is: 'paper-autocomplete-suggestions',

  behaviors: [
    Templatizer
  ],

  properties: {
    /**
     * Id of input
     */
    'for': {
      type: String
    },

    /**
     * `true` if the suggestions list is open, `false otherwise`
     */
    isOpen: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * Minimum length to trigger suggestions
     */
    minLength: {
      type: Number,
      value: 1
    },

    /**
     * Max number of suggestions to be displayed without scrolling
     */
    maxViewableItems: {
      type: Number,
      value: 7
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
     * `source` Array of objects with the options to execute the autocomplete feature
     */
    source: {
      type: Array
    },

    /**
     *  Object containing information about the current selected option. The structure of the object depends on the
     *  structure of each element in the data source.
     */
    selectedOption: {
      type: Object,
      notify: true
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
     * Current highlighted suggestion. The structure of the object is:
     * ```
     * {
     *    elementId: ID // id of the highlighted DOM element
     *    option: // highlighted option data
     * }
     * ```
     */
    highlightedSuggestion: {
      type: Object,
      value: {},
      notify: true
    },

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

    /**
     * `_suggestions` Array with the actual suggestions to display
     */
    _suggestions: {
      type: Array,
      observer: '_onSuggestionsChanged'
    },

    /**
     * Indicates the position in the suggestions popup of the currently highlighted element, being `0` the first one,
     * and `this._suggestions.length - 1` the position of the last one.
     */
    _currentIndex: {
      type: Number,
      value: -1
    },

    /**
     * Indicates the current position of the scroll. Then the `scrollTop` position is calculated multiplying the
     * `_itemHeight` with the current index.
     */
    _scrollIndex: {
      type: Number,
      value: 0
    },

    /**
     * Height of each suggestion element in pixels
     */
    _itemHeight: {
      type: Number,
      value: 36,
      observer: '_itemHeightChanged'
    },

    _value: {
      value: undefined
    },

    _text: {
      value: undefined
    },

    /**
     * This value is used as a base to generate unique individual ids that need to be added to each suggestion for
     * accessibility reasons.
     */
    _idItemSeed: {
      type: String,
      value: 'aria-' + new Date().getTime() + '-' + (Math.floor(Math.random() * 1000)),
      readOnly: true
    },

    /**
     * Reference to binded functions so we can call removeEventListener on element detached
     */
    _bindedFunctions: {
      type: Object,
      value: function () {
        return {
          _onKeypress: null,
          _onFocus: null,
          _onBlur: null
        };
      }
    },

    /**
     * Indicates if the the height of each suggestion item has been already calculated.
     * The assumption is that item height is fixed and it will not change.
     */
    _hasItemHighBeenCalculated: {
      type: Boolean,
      value: false
    },

    /**
     * To avoid unnecessary access to the DOM, we keep a reference to the current template being used
     */
    __customTplRef: Object
  },

  // Element Lifecycle

  ready: function () {
    this._value = this.value;

    // This is important to be able to access component methods inside the templates used with Templatizer
    this.dataHost = this;

    // Need to capture mousedown to prevent the focus to switch from input field when user clicks in the scrollbar
    // and the autosuggest is a child of an element with tabindex.
    this.$.suggestionsWrapper.addEventListener('mousedown', function (event) {
      event.preventDefault();
    });

    // We need to enforce that dataHost is the suggestions and not the custom polymer element where the template
    // is defined. If we do not do this, it won't be possible to access paperSuggestions from the custom template
    // TODO: find a way to achieve this without modifying Polymer internal properties
    this._suggestionTemplate.__dataHost = this;
    this.templatize(this._suggestionTemplate);
  },

  attached: function () {
    this._input = this.parentNode.querySelector('#' + this.for);

    if (this._input === null) {
      throw new Error('Cannot find input field with id: ' + this.for);
    }

    this._bindedFunctions._onKeypress = this._onKeypress.bind(this);
    this._bindedFunctions._onFocus = this._onFocus.bind(this);
    this._bindedFunctions._onBlur = this._onBlur.bind(this);

    this._input.addEventListener('keyup', this._bindedFunctions._onKeypress);
    this._input.addEventListener('focus', this._bindedFunctions._onFocus);
    this._input.addEventListener('blur', this._bindedFunctions._onBlur);
  },

  detached: function () {
    this.cancelDebouncer('_onSuggestionChanged');

    this._input.removeEventListener('keyup', this._bindedFunctions._onKeypress);
    this._input.removeEventListener('focus', this._bindedFunctions._onFocus);
    this._input.removeEventListener('blur', this._bindedFunctions._onBlur);

    this._input = null;
    this.__customTplRef = null;
  },

  // Element Behavior

  /**
   * Get the text property from the suggestion
   * @param {Object} suggestion The suggestion item
   * @return {String}
   */
  _getItemText: function (suggestion) {
    return suggestion[this.textProperty];
  },

  /**
   * Show the suggestions wrapper
   */
  _showSuggestionsWrapper: function () {
    var suggestionsWrapper = this.$.suggestionsWrapper;

    suggestionsWrapper.style.display = 'block';
    suggestionsWrapper.setAttribute('role', 'listbox');

    this.isOpen = true;
  },

  /**
   * Hide the suggestions wrapper
   */
  _hideSuggestionsWrapper: function () {
    var suggestionsWrapper = this.$.suggestionsWrapper;

    suggestionsWrapper.style.display = 'none';
    suggestionsWrapper.removeAttribute('role');

    this.isOpen = false;
    this.highlightedSuggestion = {};

    this._clearSuggestions();
  },

  _handleSuggestions: function (event) {
    if (!this.remoteSource) this._createSuggestions(event);
    else this._remoteSuggestions();
  },

  _remoteSuggestions: function () {
    var value = this._input.value;

    var option = {
      text: value,
      value: value
    };

    if (value && value.length >= this.minLength) {
      this._fireEvent(option, 'change');
    } else {
      this._suggestions = [];
    }
  },

  _bindSuggestions: function (arr) {
    if (arr.length && arr.length > 0) {
      this._suggestions = arr;
      this._currentIndex = -1;
      this._scrollIndex = 0;
    } else {
      this._suggestions = [];
    }
  },

  _createSuggestions: function (event) {
    this._currentIndex = -1;
    this._scrollIndex = 0;

    var value = event.target.value;

    if (value != null && value.length >= this.minLength) {
      value = value.toLowerCase();

      // Search for the word in the source properties.
      if (this.source && this.source.length > 0) {
        // Call queryFn. User can override queryFn() to provide custom search functionality
        this._suggestions = this.queryFn(this.source, value);
      }
    } else {
      this._suggestions = [];
    }
  },

  get _suggestionTemplate() {
    if (this.__customTplRef) {
      return this.__customTplRef;
    }
    var customTemplate = this.getEffectiveChildren();
    this.__customTplRef = customTemplate.length > 0 ? customTemplate[0] : this.$.defaultTemplate;

    return this.__customTplRef;
  },

  /**
   * Render suggestions in the suggestionsWrapper container
   * @param {Array} suggestions An array containing the suggestions to be rendered. This value is not optional, so
   *    in case no suggestions need to be rendered, you should either not call this method or provide an empty array.
   */
  _renderSuggestions: function (suggestions) {
    var suggestionsContainer = dom(this.$.suggestionsWrapper);
    var isPolymer1 = !PolymerElement;

    this._clearSuggestions();

    [].slice.call(suggestions).forEach(function (result, index) {
      // clone the template and bind with the model
      var clone = this.stamp();
      clone.item = result;
      clone.index = index;

      // Different stamping mode based on Polymer version
      if (isPolymer1) {
        suggestionsContainer.appendChild(clone.root.querySelector('*'));
      } else {
        suggestionsContainer.appendChild(clone.root);
      }

    }.bind(this));
  },

  _clearSuggestions: function () {
    var suggestionsContainer = dom(this.$.suggestionsWrapper),
      last;
    while (last = suggestionsContainer.lastChild) suggestionsContainer.removeChild(last);
  },

  /**
   * Listener to changes to _suggestions state
   */
  _onSuggestionsChanged: function () {
    this.debounce('_onSuggestionChanged', function () {
      this._renderSuggestions(this._suggestions);

      if (this._suggestions.length > 0) {
        this._showSuggestionsWrapper();
      } else {
        this._hideSuggestionsWrapper();
      }

      flush();

      this._resetScroll();

      if (!this._hasItemHighBeenCalculated) {
        var firstSuggestionElement = this.$.suggestionsWrapper.querySelector('paper-item');

        if (firstSuggestionElement !== null) {
          // Update maxHeight of suggestions wrapper depending on the height of each item result
          this._itemHeight = firstSuggestionElement.offsetHeight;

          this._hasItemHighBeenCalculated = true;
        }
      }

      if (this.highlightFirst) {
        this._moveHighlighted(DIRECTION.DOWN);
      }
    }, 100);
  },

  _selection: function (index) {
    var selectedOption = this._suggestions[index];

    this._input.value = selectedOption[this.textProperty];
    this.selectedOption = selectedOption;

    this._value = this.value;
    this._text = this.text;
    this._emptyItems();

    this._fireEvent(selectedOption, 'selected');

    this.hideSuggestions();
  },

  /**
   * Get all suggestion elements
   * @return {Array} a list of all suggestion elements
   */
  _getItems: function () {
    return this.$.suggestionsWrapper.querySelectorAll('paper-item');
  },

  /**
   * Empty the list of current suggestions being displayed
   */
  _emptyItems: function () {
    this._suggestions = [];
  },

  _getId: function () {
    var id = this.getAttribute('id');
    if (!id) id = this.dataset.id;
    return id;
  },

  /**
   * Remove the the active state from all suggestion items
   */
  _removeActive: function (items) {
    [].slice.call(items).forEach(function (item) {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
  },

  /**
   * Key press event handler
   */
  _onKeypress: function (event) {
    var keyCode = event.which || event.keyCode;

    switch (keyCode) {
    case KEY_CODES.DOWN_ARROW:
      this._moveHighlighted(DIRECTION.DOWN);
      break;
    case KEY_CODES.UP_ARROW:
      this._moveHighlighted(DIRECTION.UP);
      break;
    case KEY_CODES.ENTER:
      this._keyenter();
      break;
    case KEY_CODES.ESCAPE:
      this._hideSuggestionsWrapper();
      break;
      // For left and right arrow, component should do nothing
    case KEY_CODES.LEFT_ARROW:
      // fall through
    case KEY_CODES.RIGHT_ARROW:
      break;
    default:
      this._handleSuggestions(event);
    }
  },

  /**
   * Event handler for the key ENTER press event
   */
  _keyenter: function () {
    if (this.$.suggestionsWrapper.style.display === 'block' && this._currentIndex > -1) {
      var index = this._currentIndex;
      this._selection(index);
    }
  },

  /**
   *  Move the current highlighted suggestion up or down
   *  @param {string} direction Possible values are DIRECTION.UP or DIRECTION.DOWN
   */
  _moveHighlighted: function (direction) {
    var items = this._getItems();

    if (items.length === 0) {
      return;
    }

    var numberOfItems = items.length - 1;

    var isFirstItem = this._currentIndex === 0;
    var isLastItem = this._currentIndex === numberOfItems;
    var isNoItemHighlighted = this._currentIndex === -1;

    if ((isNoItemHighlighted || isFirstItem) && direction === DIRECTION.UP) {
      this._currentIndex = numberOfItems;
    } else if (isLastItem && direction === DIRECTION.DOWN) {
      this._currentIndex = 0;
    } else {
      var modifier = direction === DIRECTION.DOWN ? 1 : -1;
      this._currentIndex = this._currentIndex + modifier;
    }

    var highlightedOption = this._suggestions[this._currentIndex];
    var highlightedItem = items[this._currentIndex];

    this._removeActive(items);

    highlightedItem.classList.add('active');
    highlightedItem.setAttribute('aria-selected', 'true');

    this._setHighlightedSuggestion(highlightedOption, highlightedItem.id);

    this._scroll(direction);
  },

  /**
   * Move scroll (if needed) to display the active element in the suggestions list.
   * @param {string} direction Direction to scroll. Possible values are `DIRECTION.UP` and `DIRECTION.DOWN`.
   */
  _scroll: function (direction) {
    var newScrollValue, isSelectedOutOfView;

    var viewIndex = this._currentIndex - this._scrollIndex;

    // This happens only when user switch from last item to first one
    var isFirstItemAndOutOfView = this._currentIndex === 0 && viewIndex < 0;

    // This happens only when user switch from first or no item to last one
    var isLastItemAndOutOfView =
      this._currentIndex === this._suggestions.length - 1 && viewIndex >= this.maxViewableItems;

    if (isFirstItemAndOutOfView && direction === DIRECTION.DOWN) {
      newScrollValue = 0;
      isSelectedOutOfView = true;
    } else if (isLastItemAndOutOfView && direction === DIRECTION.UP) {
      newScrollValue = this._suggestions.length - this.maxViewableItems;
      isSelectedOutOfView = true;
    } else if (direction === DIRECTION.UP) {
      newScrollValue = this._scrollIndex - 1;
      isSelectedOutOfView = viewIndex < 0;
    } else {
      newScrollValue = this._scrollIndex + 1;
      isSelectedOutOfView = viewIndex >= this.maxViewableItems;
    }

    // Only when the current active element is out of view, we need to move the position of the scroll
    if (isSelectedOutOfView) {
      this._scrollIndex = newScrollValue;
      this.$.suggestionsWrapper.scrollTop = this._scrollIndex * this._itemHeight;
    }
  },

  /**
   * Reset scroll back to zero
   */
  _resetScroll: function () {
    this.$.suggestionsWrapper.scrollTop = 0;
  },

  /**
   * Set the current highlighted suggestion
   * @param {Object} option Data of the highlighted option
   * @param {string} elementId id of the highlighted dom element.
   */
  _setHighlightedSuggestion: function (option, elementId) {
    this.highlightedSuggestion = {
      option: option,
      elementId: elementId,
      textValue: option[this.textProperty],
      value: option[this.valueProperty]
    };
  },

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

  _onSelect: function (event) {
    var index = this.modelForElement(event.currentTarget).index;
    this._selection(index);
  },

  /**
   * Event handler for the onBlur event
   */
  _onBlur: function () {
    var option = {
      text: this.text,
      value: this.value
    };

    this._fireEvent(option, 'blur');

    this.hideSuggestions();
  },

  /**
   * Event handler for the onFocus event
   */
  _onFocus: function (event) {
    var option = {
      text: this.text,
      value: this.value
    };

    if (this.showResultsOnFocus) {
      this._handleSuggestions(event);
    }

    this._fireEvent(option, 'focus');
  },

  /**
   * Generate a suggestion id for a certain index
   * @param {number} index Position of the element in the suggestions list
   * @returns {string} a unique id based on the _idItemSeed and the position of that element in the suggestions popup
   * @private
   */
  _getSuggestionId: function (index) {
    return this._idItemSeed + '-' + index;
  },

  /**
   * When item height is changed, the maxHeight of the suggestionWrapper need to be updated
   */
  _itemHeightChanged: function () {
    this.$.suggestionsWrapper.style.maxHeight = this._itemHeight * this.maxViewableItems + 'px';
  },

  /****************************
   * PUBLIC
   ****************************/

  /**
   * Sets the component's current suggestions
   * @param {Array} arr
   */
  suggestions: function (arr) {
    this._bindSuggestions(arr);
  },

  /**
   * Hides the suggestions popup
   */
  hideSuggestions: function () {
    setTimeout(function () {
      this._hideSuggestionsWrapper();
    }.bind(this), 0);
  },

  /**
   * Query function is called on each keystroke to query the data source and returns the suggestions that matches
   * with the filtering logic included.
   * @param {Array} datasource An array containing all items before filtering
   * @param {string} query Current value in the input field
   * @returns {Array} an array containing only those items in the data source that matches the filtering logic.
   */
  queryFn: function (datasource, query) {
    var queryResult = [];

    datasource.forEach(function (item) {
      var objText, objValue;

      if (typeof item === 'object') {
        objText = item[this.textProperty];
        objValue = item[this.valueProperty];
      } else {
        objText = item.toString();
        objValue = objText;
      }

      if (objText.toLowerCase().indexOf(query) === 0) {
        // NOTE: the structure of the result object matches with the current template. For custom templates, you
        // might need to return more data
        var resultItem = {};
        resultItem[this.textProperty] = objText;
        resultItem[this.valueProperty] = objValue;
        queryResult.push(resultItem);
      }
    }.bind(this));

    return queryResult;
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

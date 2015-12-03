//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical=root.elliptical || {};
        root.elliptical.cssElements=factory();
        root.returnExports = root.elliptical.cssElements;
    }
}(this, function () {

    return {
        registered:false,
        elements:['ui-container',
            'ui-overlay',
            'ui-modal',
            'ui-menu',
            'menu-item',
            'ui-brand',
            'ui-toggle',
            'menu-item-dropdown',
            'menu-item-search',
            'menu-divider',
            'grid-row',
            'grid-columns',
            'ui-select',
            'ui-input-icon',
            'flex-table',
            'ui-dropdown',
            'ui-mega-dropdown',
            'ui-media-object',
            'ui-box',
            'ui-breadcrumb',
            'breadcrumb-item',
            'ui-radio-list',
            'ui-checkbox-list',
            'flex-box',
            'flex-list',
            'flex-label',
            'ui-badge',
            'ui-tip',
            'ui-columns',
            'column-item',
            'ui-social',
            'social-icon',
            'touch-ui-drawer',
            'touch-ui-menu',
            'touch-ui-dropdown',
            'touch-ui-toggle',
            'touch-ui-brand',
            'touch-icons',
            'touch-icon',
            'ui-icons',
            'screen-icon'
        ],

        register:function(){
            if(this.registered) return;
            if(!document.registerElement) return;
            this.registered=true;
            var elements=this.elements;
            elements.forEach(function(element){
                document.registerElement(element);
            });
        }
    };

}));


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./css-elements'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./css-elements'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.elliptical.cssElements);
    }
}(this, function (css) {

    document.addEventListener('WebComponentsReady', function () {
       css.register();
    });

}));
// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;


RequestManager = {};

(function ($, window, document, undefined) {

    RequestManager.Ajax = function () {

        /**
         * Jquery Ajax Object
         * @access private
         */
        var $reqObj;

        /**
         * Default Options
         * @type {{type: string, dataType: string}}
         */
        var $options = {
            type: 'GET',
            dataType: 'json'
        };


        /**
         * Default Actions
         * @type {{done: Function, error: Function}}
         */
        var $actions = {
            done: function (data, textStatus, jqXHR) {
                console.log(data)
            },
            fail: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown)
            }
        };

        /**
         * Publicly available functions
         */

        this.init = function (options, actions) {
            $.extend($options, options);
            $.extend($actions, actions);
            //console.log($opotions);
            return this;
        };


        this.send = function (returnObj) {
            $reqObj = $.ajax($options);
            if (returnObj == true) {
                $reqObj.done($actions.done).fail($actions.fail);
                return this;

            }

            return $reqObj;

        };

        this.sendTo = function (url, returnObj) {
            /*console.log(url);*/
            if (typeof url !== 'undefined' && url !== false) {
                /*console.log('the url is overridden');*/
                $options.url = url;
            }
            /*console.log($options);*/
            $reqObj = $.ajax($options);

            if (returnObj == true) {
                $reqObj.done($actions.done).fail($actions.fail);
                return this;
            }

            return $reqObj;


        };
        this.getRequestObject = function () {
            return $reqObj;
        };
        this.Html = function (options) {
            /**
             * RequestManager Helper FUnction for quick ajax calls.
             * @param options
             * @param actions
             * @returns {*}
             * @constructor
             */

            options.dataType = 'html';
            $reqObj = this.init(options).send();
            //here we will do something gegarding the actions
            return $reqObj;
        };

        this.post = function (options) {
            options.type = 'post';
            options.dataType = 'json';
            $reqObj = this.init(options).send();

            return $reqObj;
        }


    };

})(jQuery, window, document);





var Loader = {

};
(function ($, window, document, undefined) {
    Loader.init = function(){

        if($("#loadingbar").length == 0){
            $('body').append('<div id="loadingbar" />');
        }
        Loader.$loaderElem = $("#loadingbar");
        Loader.$loaderElem.addClass("waiting").append($("<dt/><dd/>"));
        return this;
    };
    Loader.set = function(percent){
        Loader.$loaderElem.width((percent + Math.random() * (100 - percent)) + "%");
        return this;
    };
    Loader.finish = function(){
        Loader.$loaderElem.width("101%").delay(200).fadeOut(400, function() {
            $(this).remove();
        });
    }
})(jQuery, window, document);


(function ($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "ajaxtable",
        defaults = {
            requestUrl: '/',
            sortClass: '.sortableHeading',
            caretUp: '<span class="ajaxCaret glyphicon glyphicon-chevron-up"></span>',
            caretDown: '<span class="ajaxCaret glyphicon glyphicon-chevron-down"></span>',
            ascendingClass: 'ascending',
            descendingClass: 'descending',
            dataAttr: {
                orderBy: 'data-orderBy'
                /*orderType: 'data-orderType'*/
            },
            /*loader: 'loading',
            loaderContent: 'Loading',*/
            urlVariables: {
                pageNo: 'page',
                orderBy: 'orderBy',
                orderType: 'orderType',
                quickSearch: 'quickSearch'
            },
            pagination: {
                link: '.pagination a',
                wrapper : '#paginationWrapper'
            }
        };


    var $reqParam = {
        /*page: 1,*/
        /*orderBy : '',
         orderType : ''*/
    };


    var $request = new RequestManager.Ajax();

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;


        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).

            this.wrapTable(this.element, this.settings);

            this.registerEvents(this.element, this.settings);


        },
        wrapTable: function ($element, $settings) {
            $($element).wrap('<div class="ajaxtable" />');
        },

        registerEvents: function ($element, $settings) {

            /*console.log('hello');*/
            console.log($element);
            $($element).on('click', $settings.sortClass, function (e) {

                console.log('I clicked something');
                var $newClass = $settings.ascendingClass;
                var caret = $settings.caretUp;
                var $orderType = $settings.urlVariables.orderType;

                $reqParam[$settings.urlVariables.orderBy] = $(this).attr($settings.dataAttr.orderBy);
                $reqParam[$orderType] = 'ASC';

                if ($(this).hasClass($settings.ascendingClass)) {
                    $(this).removeClass($settings.ascendingClass);
                    $newClass = $settings.descendingClass;
                    caret = $settings.caretDown;
                    $reqParam[$orderType] = 'DESC';
                }
                else {
                    $(this).removeClass($settings.descendingClass);
                }

                $($element).find('th').removeClass($settings.ascendingClass).removeClass($settings.descendingClass).find('span').remove();

                $(this).addClass($newClass).find('span').remove();
                $(this).append(caret);

                fetchResults($element, $settings);


            });

            $(document).on('click', $settings.pagination.link, function(e){
                if($(this).parent('li').hasClass('active')){
                    return false;
                }
                $reqParam[$settings.urlVariables.pageNo] = getParameterByName($settings.urlVariables.pageNo, $(this).attr('href'));
                /*console.log($reqParam);*/
                getActivePage($reqParam[$settings.urlVariables.pageNo], $settings.pagination.link);
                fetchResults($element, $settings);
                e.preventDefault();
                return false;
            });


        }


    });


    function fetchResults($element, $settings) {
        var tbody = $($element).find('tbody');
        var pagWrapper = $($settings.pagination.wrapper);
        tbody.empty();
        pagWrapper.empty();
        Loader.init();
        console.log($reqParam);
        $request.Html({
            url: $settings.requestUrl,
            data: $reqParam
        }).done(function (response) {
            Loader.set(20);
            /*tbody.find('.' + $settings.loader).remove();*/
            tbody.append(response.data);
            pagWrapper.append(response.pagination);
            //Loader.finish();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown)
        });
    }


    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {

            new Plugin(this, options);
            /*if ( !$.data( this, "plugin_" + pluginName ) ) {
             $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
             }*/


        });
    };

})(jQuery, window, document);

function getParameterByName(name, $url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec($url);
    /*console.log(results);*/
    /*console.log(location.search);*/
    return results === null ? "" : results[1].replace(/\+/g, " ");
}

function getActivePage($pageNo, $element){
    $($element).parent('li').removeClass('active');
    $($element).each(function(i, v){
        if($(this).text() == $pageNo){
            $(this).parent('li').addClass('active');
            return true;
        }
    });
}
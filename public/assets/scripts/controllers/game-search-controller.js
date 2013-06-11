define([
        'controllers/controller',
        'api',
        'lib/template-helper',
        'lib/util'
    ],
    function(
        Controller,
        API,
        TemplateHelper,
        Util
    ) {
        "use strict";

        /**
         * We want new searches when the user is typing in the search bar but not on every keyframe
         * Use this to throttle the time between searches
         * @type {int}
         */
        var MIN_MS_BETWEEN_SEARCHES = 500;

        /**
         * After x amount of milliseconds, we'll consider the user to be 'not typing' anymore
         * @type {int}
         */
        var IS_TYPING_TEST_MS = 1000;

        /**
         * Use this to test if the value the user input in the search bar is different
         * @type {string}
         */
        var _previousQuery = '';

        var _events = {

            onToggleView: function() {
                if (!this.active) {
                    this.active = true;
                    this.$element.addClass('active');
                    this.$input.focus();
                } else {
                    this.active = false;
                    this.$element.removeClass('active');
                }
            },

            onKeyUp: function(e) {
                var self = this;

                // Up arrow
                if (e.keyCode === 38) {
                    this.setActiveSearchResult(-1);

                // Down arrow
                } else if (e.keyCode === 40) {
                    this.setActiveSearchResult(1);

                // Enter
                } else if (e.keyCode === 13) {
                    this.selectActiveSearchResult();
                }

                // Don't do anything if the user hit like ctrl, alt, left arrow, etc, but still listen for backspace/del
                if (Util.isControlKey(e.keyCode) && e.keyCode !== 8 && e.keyCode !== 46) {
                    return;
                }

                // User is continuing to type, postpone the isTyping check
                if (this.isTyping) {
                    clearTimeout(this.isTypingTimeoutId);

                // User wasn't typing, start making server calls
                } else {
                    this.isTyping = true;
                    this.search();
                    this.searchIntervalId = setInterval(function() {
                        self.search();
                    }, MIN_MS_BETWEEN_SEARCHES);
                }

                // Set the isTyping check for the future
                this.isTypingTimeoutId = setTimeout(function() {
                    self.isTyping = false;
                    clearInterval(self.searchIntervalId);
                }, IS_TYPING_TEST_MS);
            },

            onSubmit: function(e) {
                e.preventDefault();
            },

            onClick: function(e) {
                this.setActiveSearchResult(e.currentTarget);
                this.selectActiveSearchResult();
            },

            onResultEnter: function(e) {
                clearInterval(this.searchIntervalId);
                this.setActiveSearchResult(e.currentTarget);
            }

        };

        var GameSearchController = function GameSearchController() {
            this.active = false;
            this.isTyping = false;
            this.isTypingTimeoutId = 0;
            this.searchIntervalId = 0;
            this.$input = null;
            this.$activeSearchResult = null;
        };

        GameSearchController.prototype = new Controller();
        GameSearchController.prototype.constructor = GameSearchController;

        GameSearchController.prototype.init = function() {
            this.$input = this.$('.game-search-input');
            this.bindEventHandlers(_events);
            this.bindEvents();
            return this;
        };

        GameSearchController.prototype.bindEvents = function() {
            this.$('.add-game-tab').on('click', _events.onToggleView);
            this.$input.on('keyup', _events.onKeyUp);
            this.$('.game-search-form').on('submit', _events.onSubmit);
            this.$('.game-search-list').on('mouseenter', '.game-search-result', _events.onResultEnter);
            this.$('.game-search-list').on('click', '.game-search-result', _events.onClick);
        };

        GameSearchController.prototype.search = function() {
            var self = this;
            var query = this.$input.val();

            if (!query) {
                self.$('.game-search-list').empty();
            } else if (query != _previousQuery) {
                API.search(query).done(function(res, textStatus) {
                    var context = {};
                    context.defaultThumbnailUrl = 'http://placehold.it/350x150';
                    context.results = res.data.results;
                    TemplateHelper.render('search-result-template.html', context).done(function(html) {
                        self.$('.game-search-list').html(html);
                    });
                });
            }

            _previousQuery = query;

        };

        /**
         * @param {int | jquery}  searchResultElement   If DOM element, set this.$activeSearchResult to $(searchResultElement).
                                                        If int, navigate relatively from current active element.
                                                        E.g. if -1, we set the element right before the current selected element to this.$activeSearchResult
         */
        GameSearchController.prototype.setActiveSearchResult = function(searchResultElement) {
            if (typeof searchResultElement === 'number') {
                var relativeIndex = searchResultElement;
                var currentActiveIndex = this.$activeSearchResult? this.$activeSearchResult.index() : -1;
                var nextActiveIndex = currentActiveIndex + relativeIndex;
                if (nextActiveIndex > this.$('.game-search-result').length - 1) {
                    nextActiveIndex = 0;
                }
                this.$activeSearchResult = this.$('.game-search-result')
                    .removeClass('active')
                    .eq(nextActiveIndex)
                ;
            } else {
                this.$activeSearchResult = $(searchResultElement);
            }
            
            this.$('.game-search-result').removeClass('active');
            this.$activeSearchResult.addClass('active');
            var gameTitle = this.$activeSearchResult.data('game-title');

            this.$input.val(gameTitle);
        };

        GameSearchController.prototype.selectActiveSearchResult = function() {
            //console.log('select', this.$activeSearchResult);
        };

        return GameSearchController;
    }
);
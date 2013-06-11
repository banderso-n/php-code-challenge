define(function() {
    "use strict";

    var NEXT_BUTTON_CLASS = 'next';
    var PREV_BUTTON_CLASS = 'prev';

    var CoverFlow = function CoverFlow() {

        this.$element = null;
        this.$carousel = null;
        this.$covers = null;
        this.coverWidth = 0;
        this.numCovers = 0;
        this.numCoversVisible = 0;

        this.onKeyDownHandler = this.onKeyDown.bind(this);
        this.onNextHandler = this.onNext.bind(this);
        this.onPrevHandler = this.onPrev.bind(this);
    };

    /**
     * @param   {jquery}    $element    The element holding the coverflow
     * @returns {CoverFlow}
     */
    CoverFlow.prototype.init = function($element) {
        this.$element = $element;
        this.$carousel = $element.find('.cover-flow-carousel');
        this.$covers = $element.find('.cover-flow-item');
        this.coverWidth = this.$covers.outerWidth(true);
        this.numCovers = this.$covers.length;
        this.numCoversVisible = Math.floor(this.$element.width() / this.coverWidth);

        this.currentCoverIndex = 1;
        this.bindEvents();
        return this;
    };

    CoverFlow.prototype.destroy = function() {
        this.unbindEvents();
    };

    CoverFlow.prototype.bindEvents = function() {
        this.$element.find('.' + NEXT_BUTTON_CLASS).on('click', this.onNextHandler);
        this.$element.find('.' + PREV_BUTTON_CLASS).on('click', this.onPrevHandler);
        document.addEventListener('keydown', this.onKeyDownHandler);
    };

    CoverFlow.prototype.unbindEvents = function() {
        this.$element.find('.' + NEXT_BUTTON_CLASS).off('click', this.onNextHandler);
        this.$element.find('.' + PREV_BUTTON_CLASS).off('click', this.onPrevHandler);
        document.removeEventListener('keydown', this.onKeyDownHandler);
    };

    CoverFlow.prototype.onNext = function() {
        this.advance(1);
    };

    CoverFlow.prototype.onPrev = function() {
        this.advance(-1);
    };

    CoverFlow.prototype.onKeyDown = function(e) {
        if (e.keyCode === 37) {
            this.advance(-1);
        } else if (e.keyCode === 39) {
            this.advance(1);
        }
    };

    CoverFlow.prototype.advance = function(howMany) {

        // Figure out what our next cover is
        var oldCoverIndex = this.currentCoverIndex;
        var nextCoverIndex = this.currentCoverIndex + howMany;
        if (nextCoverIndex > this.numCovers - this.numCoversVisible + 2) {
            nextCoverIndex = this.numCovers - this.numCoversVisible + 2;
        } else if (nextCoverIndex < 0) {
            nextCoverIndex = 0;
        }
        if (nextCoverIndex === this.currentCoverIndex) {
            return;
        }
        this.currentCoverIndex = nextCoverIndex;

        // Move the carousel
        var left = (this.currentCoverIndex - 1) * this.coverWidth * -1;
        this.$carousel.css('margin-left', left);

        // Add/remove the proper classes
        var unrotatedStart = null;
        var unhideStart = this.currentCoverIndex - 1;
        if (unhideStart < 0) {
            unhideStart = 0;
            unrotatedStart = 0;
        }
        var $unhidden = this.$covers.slice(unhideStart, this.currentCoverIndex - 1 + this.numCoversVisible);
        $unhidden.removeClass('hidden');

        var $hidden = this.$covers.not($unhidden);
        $hidden.addClass('hidden');

        unrotatedStart = unrotatedStart === null? 1 : unrotatedStart;
        var $unrotated = $unhidden.slice(unrotatedStart, this.numCoversVisible - 1);
        $unrotated.removeClass('leftest rightest');

        var $left = this.$covers.slice(0, unrotatedStart + unhideStart).addClass('leftest');
        var $right = this.$covers.slice(this.currentCoverIndex + this.numCoversVisible - 2).addClass('rightest');
    };

    return CoverFlow;

});
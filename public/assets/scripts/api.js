define(function() {
    "use strict";

    var API_PATH = 'api';

    /**
     * @class abstract
     * @example

            API.search('resident ev')
                .done(function(res, textStatus) {
                    console.log('done', this, res, textStatus);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log('fail', this, jqXHR, textStatus, errorThrown);
                })
            ;

    */

     
    var API = {};

    API.call = function(data) {
        var dfd = new $.Deferred();
        $.get(API_PATH, data)
            .done(function(res, textStatus, jqXHR) {
                console.log('res', res);
                if (!res.success) {
                    dfd.reject.call(this, jqXHR, textStatus, res.errorMessage);
                } else {
                    dfd.resolve.apply(this, arguments);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                dfd.reject.apply(this, arguments);
            })
        ;
        return dfd;
    };

    /////////////////////////////////////////
    // Core API
    /////////////////////////////////////////
    API.getGames = function() {
        var data = {
            method: 'getGames'
        };
        return this.call(data);
    };

    API.addVote = function(gameId) {
        var data = {
            method: 'addVote',
            gameId: gameId
        };
        return this.call(data);
    };

    API.addGame = function(gameTitle) {
        var data = {
            method: 'addGame',
            gameTitle: gameTitle
        };
        return this.call(data);
    };

    API.setGotIt = function(gameId) {
        var data = {
            method: 'setGotIt',
            gameId: gameId
        };
        return this.call(data);
    };

    /////////////////////////////////////////
    // Custom API methods
    /////////////////////////////////////////
    API.search = function(gameTitle) {
        var data = {
            method: 'search',
            gameTitle: gameTitle
        };
        return this.call(data);
    };

    return API;

});
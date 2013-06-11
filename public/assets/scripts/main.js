require(
    [
        'components/cover-flow',
        'api',
        'controllers/game-search-controller'
    ],
    function(
        CoverFlow,
        API,
        GameSearchController
    ) {
        "use strict";

        var _preventDefault = function(e) {
            e.preventDefault();
        };

        var PREVENT_DEFAULT_CLASS = 'js-prevent-default';

        var Main = {};

        Main.init = function() {
            this.bindEvents();
            this.createCoverFlows();
            this.gamesWantedCoverFlow = new CoverFlow().init($('#games-wanted'));
            this.gameSearchController = new GameSearchController().setElement('#game-search').init();
        };

        Main.bindEvents = function() {
            $('.' + PREVENT_DEFAULT_CLASS).on('click', _preventDefault);
        };

        Main.createCoverFlows = function() {
            // API.getGames().done(function(res) {
            //     console.log(res);
            // });
        };


        $(document).ready(function() {
            Main.init();
        });
        
    }
);
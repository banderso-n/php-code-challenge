define(
    [
        'handlebars-1.0.rc.1'
    ], function (
    ) {

        var TEMPLATE_PATH = 'templates/';
        var _templates = [];

        var TemplateHelper = {};

        TemplateHelper.render = function(templateSrc, context) {
            var self = this;
            var dfd = new $.Deferred();
            var template = this.getTemplateById(templateSrc);
            if (!template) {
                var path = TEMPLATE_PATH + templateSrc;
                $.ajax({
                    url: path,
                    success: function(data) {
                        var template = Handlebars.compile(data);
                        self.addTemplate(templateSrc, template);

                        var rendered = template(context);
                        dfd.resolve(rendered);
                    },
                    fail: function() {
                        dfd.reject();
                    }
                });
            } else {
                var rendered = template(context);
                dfd.resolve(rendered);
            }
            return dfd;
        };

        TemplateHelper.getTemplateById = function(templateSrc) {
            var l = _templates.length;
            for (var i = 0; i < l; i++) {
                if (_templates[i].templateSrc == templateSrc) {
                    return _templates[i].template;
                }
            }
            return null;
        };

        TemplateHelper.addTemplate = function(templateSrc, template) {
            var templateObj = {
                templateSrc: templateSrc,
                template: template
            };
            _templates.push(templateObj);
            return this;
        };

        return TemplateHelper;
    }
);
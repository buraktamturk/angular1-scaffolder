
function css(rule) {
    if (rule.join) rule = rule.join('\r\n');
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) css.styleSheet.cssText = rule;
    else css.appendChild(document.createTextNode(rule));
    document.getElementsByTagName("head")[0].appendChild(css);
    return css;
}

module.exports = require('angular')
    .module('angular1.scaffholder', [])
    .directive('aspectRatio', [function () {
        return {
            restrict: 'A',
            scope: {
                aspectRatio: '='
            },
            transclude: true,
            template: '<div style="display:block;position:relative;"><div class="aspect-ratio-inner" style="position:relative;"><div style="display:block;position:absolute;left:0;right:0;top:0;bottom:0;" ng-transclude></div></div></div>',
            link(scope, element) {
                scope.$watch('aspectRatio', function (data) {
                    element.find('.aspect-ratio-inner').css({
                        paddingTop: (data * 100) + '%'
                    });
                });
            }
        };
    }])
    .directive('disabler', [function () {
        return {
            restrict: 'A',
            scope: true,
            link(scope, element, attrs) {
                var i = 0;

                scope[attrs.disabler ||  'disable'] = function (promise) {
                    if (i++ == 0) {
                        element.css({ pointerEvents: 'none', opacity: .6 });
                    }
                    
                    return promise
                        .finally(function (e) {
                            if (--i == 0) {
                                element.css({ pointerEvents: '', opacity: '' });
                            }
                        });
                };
            }
        };
    }])
    .directive('loadingContainer', ['$parse', function ($parse) {
        var style;

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var i = 0, static = false;

                if (!style) {
                    style = css([
                        '@keyframes rotate { 0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { transform: perspective(120px) rotateX(-180deg) rotateY(0deg); } 100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); } }',
                        '@keyframes background { 0% { background-color: #27ae60; } 50% { background-color: #9b59b6; } 100% { background-color: #c0392b; } }',
                        '.loading-container { position: relative; }',
                        '.loading-container.loading::before { pointer-events: none; position: absolute; display: block; content: " "; left: 0; top: 0; width: 100%; height: 100%; background: #FFF; opacity: .8; z-index: 10; }',
                        '.loading-container.loading::after { position: absolute; display: block; pointer-events: none; content: " "; left: 50%; top: 50%; width: 60px; height: 60px; margin: -30px; z-index: 11; animation: rotate 1.4s infinite ease-in-out, background 1.4s infinite ease-in-out alternate; }'
                    ]);
                }

                element.addClass('loading-container');

                scope[attrs.loadingContainer || 'load'] = function (promise) {
                    if (i++ == 0) {
                        element.addClass('loading');
                    }

                    return promise
                        .finally(function () {
                            if (--i == 0) {
                                element.removeClass('loading');
                            }
                        });
                };

                scope.$watch(function () { return $parse(attrs.loadingContainerStatic)(scope); }, function (data) {
                    if (!!data != static) {
                        static = !!data;

                        if (data) {
                            if (i++ == 0) {
                                element.addClass('loading');
                            }
                        } else {
                            if (--i == 0) {
                                element.removeClass('loading');
                            }
                        }
                    }
                });
            }
        };
    }])
    .name;

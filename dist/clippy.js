(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    var Clippy = (function () {
        function Clippy() {
            var _this = this;
            this.options = null;
            if (!Clippy.container) {
                var container = document.createElement('div');
                container.setAttribute("id", "clipboard_hidden_text");
                container.style.position = "fixed";
                container.style.width = "1px";
                container.style.height = "1px";
                container.style.top = "-10px";
                container.style.left = "-10px";
                container.style.overflow = "hidden";
                Clippy.container = document.body.appendChild(container);
                var _a = this.options.beforeCopy(), text_1 = _a.text, html_1 = _a.html;
                Clippy.container.addEventListener('copy', function (e) {
                    if (!!text_1) {
                        e.clipboardData.setData("text/plain", text_1);
                    }
                    if (!!html_1) {
                        e.clipboardData.setData("text/html", html_1);
                    }
                    if (!!_this.options.afterCopy) {
                        _this.options.afterCopy();
                    }
                    e.preventDefault();
                });
            }
        }
        Clippy.prototype.copyHandler = function (options) {
            if (options.onError != undefined && !document.queryCommandSupported("copy")) {
                options.onError("Copy command not supported");
            }
            this.options = options;
            var text = options.beforeCopy().text;
            Clippy.container.innerHTML = text;
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNode(Clippy.container);
            selection.addRange(range);
            try {
                var success = document.execCommand('copy');
                if (!!success && !!options.onError) {
                    options.onError("Copy command not enabled");
                }
            }
            catch (e) {
                if (!!options.onError) {
                    options.onError(e);
                }
            }
            selection.removeAllRanges();
        };
        Clippy.prototype.makeCopyHandler = function (options) {
            return this.copyHandler.bind(this, options);
        };
        return Clippy;
    }());
    Clippy.container = null;
    exports.Clippy = Clippy;
});

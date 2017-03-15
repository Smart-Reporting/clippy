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
            }
        }
        Clippy.prototype.copyHandler = function (options) {
            if (options.onError != undefined && !document.queryCommandSupported("copy")) {
                options.onError("Copy command not supported");
            }
            var _a = options.beforeCopy(), text = _a.text, html = _a.html;
            var copyEventHandler = function (e) {
                var _a = options.beforeCopy(), text = _a.text, html = _a.html;
                if (!!text) {
                    e.clipboardData.setData("text/plain", text);
                }
                if (!!html) {
                    e.clipboardData.setData("text/html", html);
                }
                if (!!options.afterCopy) {
                    options.afterCopy();
                }
                e.preventDefault();
            };
            Clippy.container.addEventListener('copy', copyEventHandler);
            Clippy.container.innerHTML = text;
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNode(Clippy.container);
            selection.addRange(range);
            try {
                var success = document.execCommand('copy');
                if (!success && !!options.onError) {
                    options.onError("Copy command not enabled");
                }
            }
            catch (e) {
                if (!!options.onError) {
                    options.onError(e);
                }
            }
            Clippy.container.removeEventListener('copy', copyEventHandler);
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

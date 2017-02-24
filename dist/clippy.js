(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    var Clipboard = (function () {
        function Clipboard() {
            if (!Clipboard.container) {
                var container = document.createElement('div');
                container.setAttribute("id", "clipboard_hidden_text");
                container.style.position = "fixed";
                container.style.width = "1px";
                container.style.height = "1px";
                container.style.top = "-10px";
                container.style.left = "-10px";
                container.style.overflow = "hidden";
                Clipboard.container = document.body.appendChild(container);
            }
        }
        Clipboard.prototype.copyHandler = function (options) {
            if (options.onError != undefined && !document.queryCommandEnabled("copy")) {
                options.onError("copy command not supported or enabled");
            }
            var _a = options.beforeCopy(), text = _a.text, html = _a.html;
            document.addEventListener('copy', function (e) {
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
            });
            Clipboard.container.innerHTML = text;
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNode(Clipboard.container);
            selection.addRange(range);
            try {
                document.execCommand('copy');
            }
            catch (e) {
                if (!!options.onError) {
                    options.onError(e);
                }
            }
            selection.removeAllRanges();
        };
        Clipboard.prototype.makeCopyHandler = function (options) {
            return this.copyHandler.bind(this, options);
        };
        return Clipboard;
    }());
    Clipboard.container = null;
    exports.Clipboard = Clipboard;
});

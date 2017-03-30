define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                e.preventDefault();
                if (!!text) {
                    e.clipboardData.setData("text/plain", text);
                }
                if (!!html) {
                    e.clipboardData.setData("text/html", html);
                }
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
                if (success && typeof options.afterCopy === 'function') {
                    options.afterCopy();
                }
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

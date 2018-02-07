export type options = {beforeCopy: () => {text?: string, html?: string}, onError?: (message: string | Error) => void, afterCopy?: () => void};

export class Clippy {
    private static container: Element = null;

    constructor() {
        if (!Clippy.container) {
            const container = document.createElement('div');
            container.setAttribute("id", "clipboard_hidden_text");
            container.style.position = "fixed";
            container.style.width = "1px";
            container.style.height = "1px";
            container.style.top = "-10px";
            container.style.left = "-10px";
            container.style.overflow = "hidden";
            Clippy.container = <Element>document.body.appendChild(container);
        }
    }

    private copyHandler(options: options) {

        if (options.onError != undefined && !document.queryCommandSupported("copy")) {
            options.onError("Copy command not supported");
        }

        let {text, html} = options.beforeCopy();

        const copyEventHandler = (e: ClipboardEvent) => {
            e.preventDefault();

            if (!!text) {
                e.clipboardData.setData("text/plain", text);
            }

            if (!!html) {
                e.clipboardData.setData("text/html", html);
            }
        };

        Clippy.container.addEventListener('copy', copyEventHandler);

        Clippy.container.innerHTML = html;
        const selection = window.getSelection();
        selection.removeAllRanges();

        const range = document.createRange();
        range.selectNode(Clippy.container);
        selection.addRange(range);

        try {
            const success = document.execCommand('copy');
            if (success && typeof options.afterCopy === 'function') {
                options.afterCopy();
            }
            if (!success && !!options.onError) {
                options.onError("Copy command not enabled");
            }
        } catch(e) {
            if (!!options.onError) {
                options.onError(e)
            }
        }

        Clippy.container.removeEventListener('copy', copyEventHandler);

        selection.removeAllRanges();
    }

    public makeCopyHandler(options: options) {
        return this.copyHandler.bind(this, options);
    }
}

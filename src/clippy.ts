class Clipboard {
    private static container: Element = null;

    constructor() {
        if (!Clipboard.container) {
            const container = document.createElement('div');
            container.setAttribute("id", "clipboard_hidden_text");
            container.style.position = "fixed";
            container.style.width = "1px";
            container.style.height = "1px";
            container.style.top = "-10px";
            container.style.left = "-10px";
            container.style.overflow = "hidden";
            Clipboard.container = <Element>document.body.appendChild(container);
        }
    }

    private copyHandler(options: {
        beforeCopy: () => {text?: string, html?: string},
        onError?: (message: string | Error) => void, afterCopy?: () => void}) {

        if (options.onError != undefined && !document.queryCommandEnabled("copy")) {
            options.onError("copy command not supported or enabled");
        }

        let {text, html} = options.beforeCopy();

        document.addEventListener('copy', (e: ClipboardEvent) => {
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
        const selection = window.getSelection();
        selection.removeAllRanges();

        const range = document.createRange();
        range.selectNode(Clipboard.container);
        selection.addRange(range);

        try {
            document.execCommand('copy');
        } catch(e) {
            if (!!options.onError) {
                options.onError(e)
            }
        }

        selection.removeAllRanges();
    }

    public makeCopyHandler(options: {beforeCopy: () => {text?: string, html?: string}, onError?: (message: string | Error) => void, afterCopy?: () => void}) {
        return this.copyHandler.bind(this, options);
    }
}

//export const c = Clipboard.instance;
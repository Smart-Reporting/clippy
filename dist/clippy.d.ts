export declare type options = {
    beforeCopy: () => {
        text?: string;
        html?: string;
    };
    onError?: (message: string | Error) => void;
    afterCopy?: () => void;
};
export declare class Clippy {
    private static container;
    constructor();
    private copyHandler(options);
    makeCopyHandler(options: options): any;
}

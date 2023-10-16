export declare function resolvePath(relative: string, base: string, append?: boolean): string;
export declare function parsePath(path: string): {
    path: string;
    query: string;
    hash: string;
};
export declare function cleanPath(path: string): string;

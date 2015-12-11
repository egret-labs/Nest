export interface NestData {
    module: string;
    action: string;
    param?: any;
}
export declare function callRuntime(data: NestData, callback: any, parallel?: boolean): void;
export declare function _getData(): void;

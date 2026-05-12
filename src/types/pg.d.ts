declare module 'pg' {
    export class Client {
        constructor(config?: any);
        connect(): Promise<void>;
        on(event: string, listener: (...args: any[]) => void): this;
        query(queryText: string, values?: any[]): Promise<any>;
        end(): Promise<void>;
    }
}

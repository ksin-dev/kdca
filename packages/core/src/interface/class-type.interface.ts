

export interface ClassType<T = any> extends Function {
    new (...args: any[]): T;
}
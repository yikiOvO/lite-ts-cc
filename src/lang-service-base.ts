export abstract class LangServiceBase {
    public static ctor = 'LangServiceBase';

    public abstract get(...keys: string[]): Promise<string>;
}

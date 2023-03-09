export abstract class AssetServiceBase<T> {
    public static ctor = 'AssetServiceBase';

    public abstract load<TAsset extends T>(typer: new () => TAsset, path: string): Promise<TAsset>;
}
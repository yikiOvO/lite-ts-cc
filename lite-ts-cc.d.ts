declare abstract class AssetServiceBase<T> {
    static ctor: string;
    abstract load<TAsset extends T>(typer: new () => TAsset, path: string): Promise<TAsset>;
}
declare class CcAssetService<T> extends AssetServiceBase<T> {
    private m_LoadedAsset;
    private m_Cc;
    constructor(m_LoadedAsset: {
        [path: string]: T;
    }, m_Cc: any);
    load<TAsset extends T>(typer: new () => TAsset, pathString: string): Promise<TAsset>;
}
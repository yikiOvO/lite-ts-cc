import { AssetServiceBase } from './asset-loader-base';

export class CcAssetService<T> extends AssetServiceBase<T> {
    public constructor(
        private m_LoadedAsset: { [path: string]: T; },
        private m_Cc: any,
    ) {
        super();
    }

    public async load<TAsset extends T>(typer: new () => TAsset, pathString: string) {
        if (this.m_LoadedAsset[pathString])
            return this.m_LoadedAsset[pathString] as TAsset;

        const ext = this.m_Cc['path'].extname(pathString);
        pathString = pathString.replace(ext, '');
        if (typer == this.m_Cc['SpriteFrame'] as any)
            pathString += '/spriteFrame';

        return new Promise<TAsset>((s, f) => {
            const parts = pathString.split(':');
            if (parts.length == 1) {
                this.m_Cc['resources'].load(pathString, typer, (err: Error, res: TAsset) => {
                    if (err)
                        return f(err);

                    s(res);
                });
            } else {
                this.m_Cc['assetManager'].loadBundle(parts[0], (err: Error, res: any) => {
                    if (err)
                        return f(err);

                    res.load(parts[1], typer, (cErr: Error, cRes: TAsset) => {
                        if (cErr)
                            return f(cErr);

                        s(cRes);
                    });
                });
            }
        });
    }
}
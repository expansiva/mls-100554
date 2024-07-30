/// <mls shortName="configDsDefaultAssets" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common } from './_100554_configDsDefaultCommon';

export class Asset extends mls.l3.Asset {

    constructor(dsIO: mls.l3.DesignSystemIO, ds: IDS) {
        super(dsIO);
        this.ds = ds;
        this.methods = new Common(ds, dsIO);
        this.prepareAssets();
    }

    private ds: IDS;
    private methods: Common;

    public add = (opt: { path: string, shortname: string, tags: string[], description: string, assetType: mls.l3.AssetsGroupType, content: File, reference?: any }) => this._addAssets(opt.path, opt.shortname, opt.tags, opt.description, opt.assetType, opt.content, opt.reference);


    public update = (path: string, shortname: string, tags: string[], description: string, assetType: mls.l3.AssetsGroupType) => this._updateAsset(path, shortname, tags, description, assetType);
    public remove = (path: string, shortname: string) => this._removeAssets(path, shortname);
    public find = (path: string, shortname: string) => this._find(path, shortname);
    public list: mls.l3.IAssetInfos = {};

    private prepareAssets() {
        this.list = {};
        this.ds.assets.items.forEach((asset) => {
            const key = this.getKeyAsset(asset.path, asset.shortname);
            this.list[key] = asset;
        });
    }

    private _find(path: string, shortname: string): mls.l3.IAssetsInfo | null {
        const key = this.getKeyAsset(path, shortname);
        return this.list[key];
    }

    private getKeyAsset(path: string, shortname: string) {
        return `${path}_${shortname}`;
    }

    private async _addAssets(path: string, shortname: string, tags: string[], description: string, assetType: mls.l3.AssetsGroupType, content: File, reference: mls.l3.IDSRef): Promise<void> {

        const newShortName = shortname.replace(/_/g, '-');
        const assetsByName = this.find(path, shortname);
        if (assetsByName) throw new Error(`assets: ${path}/${shortname} already exists`);
        const ext = newShortName.split('.').pop();
        const extensionIndex = newShortName.lastIndexOf('.');
        const fileNameWithoutExtension = newShortName.slice(0, extensionIndex);
        const fullpath = path;

        const asset: mls.l3.IAssetsInfo = {
            description,
            reference,
            content: '',
            path,
            shortname: newShortName,
            src: '',
            tags,
            type: assetType,
            last_updated_by: this.methods.getUser(),
            last_updated: this.methods.getDateNow(),
        } as mls.l3.IAssetsInfo;

        const key = this.getKeyAsset(path, shortname);
        this.list[key] = asset;

        try {
            if (!reference) await this.methods.createNewFile(fileNameWithoutExtension, fullpath, ext || '', content);
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on upload assets:' + err.message));
        }

    }

    private async _updateAsset(path: string, shortname: string, tags: string[], description: string, assetType: mls.l3.AssetsGroupType): Promise<void> {

        const assetsByName = this.find(path, shortname);
        if (!assetsByName) throw new Error(`assets: ${path}/${shortname} dont exists`);

        assetsByName.tags = tags;
        assetsByName.description = description;
        assetsByName.type = assetType;

        const key = this.getKeyAsset(path, shortname);
        this.list[key] = assetsByName;

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove assets:' + err.message));
        }
    }

    private async _removeAssets(path: string, shortname: string): Promise<void> {

        const assetsByName = this.find(path, shortname);
        if (!assetsByName) throw new Error(`assets: ${path}/${shortname} dont exists`);
        const ext = shortname.split('.').pop();
        const extensionIndex = shortname.lastIndexOf('.');
        const fileNameWithoutExtension = shortname.slice(0, extensionIndex);
        const fullpath = path;
        const key = this.getKeyAsset(path, shortname);

        try {
            if (!assetsByName.reference) await this.methods.setContentFile(fileNameWithoutExtension, ext || '', fullpath, null);
            delete this.list[key];
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove assets:' + err.message));
        }
    }

}
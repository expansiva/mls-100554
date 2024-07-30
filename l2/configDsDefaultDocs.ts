/// <mls shortName="configDsDefaultDocs" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common } from './_100554_configDsDefaultCommon';
import {
    DesignSystemIO,
    DocIO,
    IDocInfos,
    IDocInfo
} from './_100554_libDesignSystem';
export class Doc extends DocIO {

    constructor(dsIO: DesignSystemIO, ds: IDS) {
        super(dsIO);
        this.ds = ds;
        this.methods = new Common(ds, dsIO);
        this.prepareDocs();
    }

    private ds: IDS;
    private methods: Common;

    public add = (parentId: number, title: string, content: string) => this._addDoc(parentId, title, content);
    public update = (id: number, parentId: number, title: string, content: string) => this._updateDoc(id, parentId, title, content);
    public remove = (id: number) => this._removeDoc(id);
    public find = (id: number) => this._find(id);
    public list: IDocInfos = {};

    private prepareDocs() {
        this.list = {};
        this.ds.docs.items.forEach((doc) => {
            this._addDoc2(doc);
        });
    }

    private _find(id: number): IDocInfo | null {
        return this.list[id];
    }

    private getLastDocIndex(): number {
        let lastID = 1;
        for (let i = 0; i < this.ds.docs.items.length; i++) {
            if (this.ds.docs.items[i].id > lastID) {
                lastID = this.ds.docs.items[i].id;
            }
        }
        return lastID;
    }

    private async _addDoc(parentID: number, title: string, content: string = 'new document'): Promise<number> {

        const fullpath = this.methods.getDocsMlsFilePath();
        const index = this.getLastDocIndex() + 1;
        const doc: IDocInfo = {
            id: index,
            parentID,
            title,
            getContent: (): Promise<string> => { return Promise.resolve('') },
            setContent: (): Promise<boolean> => { return Promise.resolve(true) }
        };
        try {
            await this.methods.createNewFile(index.toString(), fullpath, 'txt', content);
            this._addDoc2(doc);
            await this.methods.setContentFileDsMain();
            return Promise.resolve(index);
        } catch (err: any) {
            return Promise.reject(new Error('Error on create new document:' + err.message));
        }
    }

    private _addDoc2(doc: IDocInfo) {
        doc.getContent = () => this.getDocContent(doc);
        doc.setContent = (newcontent: string | null) => this.setDocContent(doc, newcontent);
        this.list[doc.id] = doc;
    }

    private async _removeDoc(id: number): Promise<void> {
        const doc = this.find(id);
        if (!doc) throw new Error(`document: ${id} dont exists`);
        const fullpath = this.methods.getDocsMlsFilePath();

        try {
            await this.methods.setContentFile(id.toString(), 'txt', fullpath, null);
            delete this.list[id];
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove document:' + err.message));
        }
    }

    private async _updateDoc(id: number, parentId: number, title: string, content: string): Promise<void> {

        const doc = this.find(id);
        if (!doc) throw new Error(`document: ${id} dont exists`);
        const fullpath = this.methods.getDocsMlsFilePath();

        try {
            if (content) await this.methods.setContentFile(id.toString(), 'txt', fullpath, content);
            doc.title = title;
            doc.parentID = parentId;
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on update document:' + err.message));
        }
    }

    private async getDocContent(doc: IDocInfo): Promise<string> {
        const fullpath = this.methods.getDocsMlsFilePath();
        const content = await this.methods.getContentFile(doc.id.toString(), 'txt', fullpath);
        return content as string;
    }

    private async setDocContent(doc: IDocInfo, content: string | null): Promise<boolean> {

        const fullpath = this.methods.getDocsMlsFilePath();
        if (content === null) {
            await this._removeDoc(doc.id);
            return true;
        }
        await this.methods.setContentFile(doc.id.toString(), 'txt', fullpath, content);
        return true;
    }

}
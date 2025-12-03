/// <mls shortName="icaOrganismWireframeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { convertTagToFileName } from '/_100554_/l2/utilsLit.js'

export abstract class IcaOrganismWireframeBase extends StateLitElement {

    abstract generalDescription: string | undefined;
    abstract goal: string | undefined;


    render() {

        this.style.display = 'block';
        this.style.border = '1px dashed';
        this.style.padding = '.4rem'

        return html`
            <div>
                <div style="display:flex; gap:1rem;">
                    <h4 style="margin:0">${this.generalDescription}</h4>
                    <a style="cursor:ponter" href="#" @click=${this.onEditClick}>Edit</a>
                </div>

                <small>${this.goal}</small>
            </div>
        `
    }


    private onEditClick(ev: MouseEvent) {
        ev.preventDefault();

        const info = convertTagToFileName(this.tagName.toLowerCase());
        if (!info) return;
        const { shortName, project } = info;
        const keyStor = mls.stor.getKeyToFiles(project, 2, shortName, '', '.ts');
        const storFile = mls.stor.files[keyStor];
        this.fireEvents('open', storFile);
        
    }

    private fireEvents(action: string, file: mls.stor.IFileInfo,  timeout: number = 0): void {

        const params = {} as mls.events.IFileAction;

        (params.action as any) = action;
        params.level = file.level;
        params.project = file.project;
        params.shortName = file.shortName;
        params.extension = file.extension;
        params.folder = file.folder;
        params.position = 'left';

        if (['open'].includes(action)) {


            mls.actual[2].setFullName(`_${file.project}_${file.shortName}`);
            (mls.actual[2] as any).left = {
                project: file.project,
                shortName: file.shortName,
                extension: file.extension,
                folder: file.folder,
            } as any;

        }

        mls.events.fire([2], ['FileAction'], JSON.stringify(params), timeout);

    }




}
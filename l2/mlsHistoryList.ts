/// <mls shortName="mlsHistoryList" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mls-history-list-100554')
export class SimpleGreeting extends LitElement {

    @property({ type: Number }) project: number = 100554;
    @property({ type: String }) shortName: string = 'mlsStartL2';
    @property({ type: String }) position: 'left' | 'right' = 'left';
    @property({ type: String }) folder: string = '';
    @property({ type: Number }) level: number = 2;
    @property({ type: String, }) extension: string = '.ts';
    @property({ type: Boolean, }) loading: boolean = true;

    private error = '';

    private data: IHistory[] = [];

    async connectedCallback() {
        super.connectedCallback();
        await this.getListHistory();
        this.loading = false;
    }

    async getListHistory() {
        try {
            const key = mls.stor.getKeyToFiles(this.project, this.level, this.shortName, this.folder, this.extension);
            const storFile = mls.stor.files[key];
            const historie = await storFile.getHistory();
            const data = this.createJson(historie as IHistoryRet[]);
            this.data = data;
        } catch (e:any) {
            this.error = `
            <div style="width:80%; padding:20px; border:1px solid #eee; border-left-width:5px; border-radius: 3px; margin:10px auto; border-left-color: #d9534f; background-color: rgba(217, 83, 79, 0.1); ">
                <strong style="color:#d9534f;">Error</strong>- 
                ${e}
            </div>`;
        }

    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);
        if (name === 'msize') {
            const [width, height] = newVal.split(',');
            this.style.height = height + 'px';
        }
    }

    private createJson(gitObj: IHistoryRet[] | null): IHistory[] {
        if (!gitObj) return []
        const today: Date = new Date();
        gitObj.forEach((item: IHistoryRet, index: number) => {
            const itemDate: Date = new Date(item.data);
            const yesterday = new Date(new Date().setDate((today.getDate() - 1)));
            if (today.toDateString() === itemDate.toDateString()) item.offsetDay = 0;
            if (yesterday.toDateString() === itemDate.toDateString()) item.offsetDay = 1;
            if (index === 0) item.firstItem = true;
            item.offsetWeek = this.getWeekOffet(itemDate, today);
            item.offsetMonth = today.getMonth() - itemDate.getMonth();
            item.offsetYear = today.getFullYear() - itemDate.getFullYear();
            item.index = this.findFirstInFilters(item);
            const filterTitle = this.filters[item.index].title;
            item.title = filterTitle.replace('{year}', itemDate.getFullYear().toString()).replace('{month}', `${itemDate.getFullYear()}-${('00' + (itemDate.getMonth() + 1)).slice(-2)}`);
        });
        return this.createJson2(gitObj);
    }

    private createJson2(gitObj: IHistoryRet[]): IHistory[] {

        const ret: IHistory[] = [];
        const ret2 = {} as any;

        const objLocal: IHistory = {} as { title: string, open: boolean, itens: [], type: 'item' | 'title' };
        objLocal.title = 'Local Changes'
        const localAuthor = localStorage.getItem('loginUser') || 'unknow';
        const localItem: IHistoryItem = {
            author: localAuthor,
            authorUrl: '',
            dateAm: '',
            hash: 'local',
            time: '',
            type: 'item',
            linesDeleted: undefined,
            linesInserted: undefined
        }
        objLocal.type = 'title';
        objLocal.itens = [];
        objLocal.itens.push(localItem);
        ret.push(objLocal);

        gitObj.forEach((item) => {
            if (ret2[item.title]) ret2[item.title].push(item);
            else ret2[item.title] = [item];
        });

        Object.keys(ret2).forEach((keys) => {
            const obj: IHistory = {} as { title: string, open: boolean, itens: [], type: 'item' | 'title' };
            ret.push(obj);

            ret2[keys].forEach((item: IHistoryRet, index: number) => {
                if (index === 0) {
                    obj.title = item.title;
                    obj.itens = [];
                    obj.type = 'title'
                }
                const dataItem = new Date(item.data);
                const dataFormat = this.formatDate(dataItem);
                const objItem: IHistoryItem = {
                    author: item.authorName,
                    time: dataFormat,
                    dateAm: '',
                    hash: item.ref,
                    authorUrl: item.authorUrl,
                    type: 'item',
                    linesDeleted: item.deletions,
                    linesInserted: item.additions
                };
                obj.itens.push(objItem);
                obj.open = false;
            });

        });

        return ret;
    }

    private filters = [
        {
            title: 'Today',
            maxOffsetDays: 1
        },
        {
            title: 'Yesterday',
            maxOffsetDays: 2
        },
        {
            title: 'This week',
            maxOffsetWeek: 1
        },
        {
            title: 'Last week',
            maxOffsetWeek: 2
        },
        {
            title: 'This month',
            maxOffsetMonth: 1
        },
        {
            title: 'In {month}',
            maxOffsetMonth: 11
        },
        {
            title: 'In {year}'
        }
    ];

    private findFirstInFilters(item: IHistoryRet): number {
        // return first index in array Filter
        for (let i = 0; i < this.filters.length; i++) {
            const it = this.filters[i];
            if (((it.maxOffsetDays) && (item.offsetDay < it.maxOffsetDays))
                || ((it.maxOffsetWeek) && (item.offsetWeek < it.maxOffsetWeek))
                || ((it.maxOffsetMonth) && (item.offsetMonth < it.maxOffsetMonth) && (item.offsetYear === 0))) {
                return i;
            }
        }
        return (this.filters.length - 1); // return last item
    }

    private getWeekOffet(dateStr: Date | any, dateEnd: Date | any): number {
        const date1a = dateStr;
        const date2a = dateEnd;
        const dt: any = new Date(date1a.getFullYear(), 0, 1);
        const w1 = Math.ceil((((date1a - dt) / 86400000) + dt.getDay() + 1) / 7);
        const w2 = Math.ceil((((date2a - dt) / 86400000) + dt.getDay() + 1) / 7);
        return w2 - w1;
    }


    private formatDate(dateValue: Date): string {
        const dataFormat = dateValue.getFullYear() + '-'
            + ('00' + (dateValue.getMonth() + 1)).slice(-2) + '-'
            + ('00' + dateValue.getDate()).slice(-2) + '  '
            + ('00' + dateValue.getHours()).slice(-2) + ':'
            + ('00' + dateValue.getMinutes()).slice(-2) + ':'
            + ('00' + dateValue.getSeconds()).slice(-2);
        return dataFormat;
    }

    createRenderRoot() {
        return this;
    }

    handleClick(a: PointerEvent) {
        const target = a.target;
        const li = (target as HTMLElement).closest('li');
        if (!li) return;

        this.querySelectorAll('li').forEach((l) => l.classList.remove('active'));
        li.classList.add('active');

        const hashModified = li.getAttribute('hash') || '';
        let nextLi = li.nextElementSibling as HTMLElement;
        if (!nextLi) {
            const actualUl = li.closest('ul');
            const nextParentUl = actualUl?.closest('li');
            const nextUlLi = nextParentUl?.nextElementSibling;
            const nextUl = nextUlLi?.querySelector('ul');
            if (nextUl) nextLi = nextUl.children[0] as HTMLElement;
        }


        let hashOriginal = '';
        if (nextLi) hashOriginal = nextLi.getAttribute('hash') || '';

        const obj: IEventParams = {
            project: this.project,
            shortName: this.shortName,
            extension: this.extension,
            position: this.position,
            level: this.level,
            folder: this.folder,
            hashOriginal,
            hashModified,
        }
        mls.events.fire([2], 'HistoriesSelected' as any, JSON.stringify(obj), 0);
    }

    render() {
        if (this.error !== '') {
            const obj = unsafeHTML(this.error);
            this.error = '';
            return obj;
        }
        return html`
      <div>
        ${this.loading
                ? html`<p>Loading...</p>`
                : html`
        <div>
          <ul>
                ${this.data.map(itemT => html`
                    <li class="historie-title">
                        <details>
                            <summary>${itemT.title}</summary>
                            <div>
                                <ul>
                                    ${itemT.itens.map(itemH => html`
                                        <li class="historie-item" hash="${itemH.hash}" @click="${this.handleClick}">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg>
                                            <span>${itemH.time}</span>
                                            <div class="historie-lines" style="${itemH.linesInserted === undefined ? 'display:none' : 'display:inline-flex'}">
                                                <span class='historie-additions'>+${itemH.linesInserted}</span>
                                                <span class='historie-deletions'>-${itemH.linesDeleted}</span>
                                            </div>
                                            ${itemH.authorUrl
                        ? html`<img src="${itemH.authorUrl}" alt="${itemH.author}"></img>`
                        : html`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"/></svg>`
                    } 
                                            <span>${itemH.author}</span>
                                        </li>
                                    `)}
                                </ul>
                            </div>
                        </details>
                    </li>
                `)}
          </ul>
          
        </div>
        `}
      </div>
    `;
    }

}

interface IEventParams {
    project: number,
    shortName: string,
    extension: string,
    level: number,
    position: 'left' | 'right',
    folder: string,
    hashOriginal: string,
    hashModified: string,
}
interface IHistoryRet extends mls.stor.IHistory {
    offsetDay: number,
    offsetWeek: number,
    offsetMonth: number,
    offsetYear: number,
    firstItem: boolean,
    index: number,
    title: string
}


interface IHistory {
    title: string,
    open: boolean,
    type: 'item' | 'title',
    itens: IHistoryItem[]
}

export interface IHistoryItem {
    author: string,
    time: string,
    dateAm: string,
    hash: string,
    subject?: string,
    linesInserted: number | undefined,
    linesDeleted: number | undefined,
    authorUrl: string,
    type: 'item' | 'title',
}


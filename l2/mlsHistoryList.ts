/// <mls shortName="mlsHistoryList" project="100554" enhancement="_100541_enhancementLit" groupName="internal" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mls-history-list-100554')
export class SimpleGreeting extends LitElement {

    @property({ type: Number }) project: number = 100554;
    @property({ type: String }) shortName: string = 'mlsStartL2';
    @property({ type: String }) position: 'left' | 'right' = 'left';
    @property({ type: String }) folder: string = '';
    @property({ type: Number }) level: number = 2;
    @property({ type: String }) extension: string = '.ts';
    @property({ type: Boolean }) loading: boolean = true;

    private data: IHistory[] = [];

    async connectedCallback() {
        super.connectedCallback();
        await this.getListHistory();
        this.loading = false;
        this.requestUpdate(); // Trigger a re-render
    }

    async getListHistory() {
        const key = mls.stor.getKeyToFiles(this.project, this.level, this.shortName, this.folder, this.extension);
        const storFile = mls.stor.files[key];
        const driver: any = mls.stor.others.getDriver(100529, "github");
        const historie: IHistoryRet[] = await driver.getHistory(storFile);
        const data = this.createJson(historie);
        // const data2 = data.map((item) => [item, ...item.itens])
        // const arrayOfArrays = Object.values(data2);
        // const data3: (IHistoryItem | IHistory)[] = [].concat(...arrayOfArrays as any);
        this.data = data;
        console.info(data)
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);
        if (name === 'msize') {
            const [width, height] = newVal.split(',');
            this.style.height = height + 'px';
        }
    }

    private createJson(gitObj: IHistoryRet[]): IHistory[] {

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

        const hashOriginal = li.getAttribute('hash') || '';
        let nextLi = li.nextElementSibling as HTMLElement;
        if (!nextLi) {
            const actualUl = li.closest('ul');
            const nextUl = actualUl?.nextElementSibling;
            if (nextUl) nextLi = nextUl.childNodes[0] as HTMLElement;
        }

        let hashModified = '';
        if (nextLi) hashModified = nextLi.getAttribute('hash') || '';

        const obj:IEventParams = {
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
                                            <img src="${itemH.authorUrl}" alt="${itemH.author}"></img>
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
    hashOriginal:string,
    hashModified:string,
}
interface IHistoryRet {
    authorName: string,
    authorUrl: string,
    data: Date,
    ref: string,
    message: string,
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
    linesInserted?: string,
    linesDeleted?: string,
    authorUrl: string,
    type: 'item' | 'title',
}


/// <mls shortName="wcdToolboxItemActionEvents" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { unsafeHTML } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { WCDToolbox } from './_100554_wcdToolbox';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { initCollabSelectOneWithDescription, CollabSelectOneWithDescription100554 } from './_100554_collabSelectOneWithDescription'

//version 4

@customElement('wcd-toolbox-item-action-events-100554')
export class WcdToolboxItemActionEvents extends WcdToolboxItemBase {

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    public elICA: IcaLitElementBase | undefined;
    public args: string | undefined;

    @query('collab-select-one-with-description-100554') elEvents: CollabSelectOneWithDescription100554 | undefined;

    @property({ reflect: true })
    private options: any[] | undefined;

    constructor() {
        super();
        const a = initCollabSelectOneWithDescription;
    }


    //-----------COMPONENT-------------

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.getEvents();
    }

    render() {

        return unsafeHTML(`<collab-select-one-with-description-100554></collab-select-one-with-description-100554>`)
    }

    //--------IMPLEMENTATION-------------

    private getEvents(): void {


        if (this.elICA && this.elICA.id && this.elICA.getMyEvents && this.elICA.getDefinitionFromEvent) {

            const events = this.elICA.getMyEvents() as string;
            const opt: any[] = [];
            events.split(',').forEach((ev: string) => {
                const info = {
                    key: ev.trim(),
                    value: ev.trim(),
                    description: this.elICA?.getDefinitionFromEvent(ev.trim()) || ''
                }
                opt.push(info);
            });

            this.options = opt;


        } else if (this.elICA && !this.elICA.id) {
            const opt: any[] = [];
            opt.push({
                key: 'id',
                value: 'id',
                description: 'Please set id in element for create events'
            });

            this.options = opt;
        }

        if (this.elEvents) {
            this.elEvents.options = this.options;

            this.elEvents.addEventListener('select-change', (e: any) => {

                this.selectItem(e.detail);

            });
        }

    }

    private selectItem(event: string) {
        
        if (!this.elICA || (this.elICA && this.elICA.level !== '2')) return;

        mls.events.fire(2, 'WidgetAction' as any, `{"op":"OpenScenario", "widget":"_100554_scenarioInsertEventOrChange", "value":"${event}", "id":"${this.elICA.id}"}`);
    }

}

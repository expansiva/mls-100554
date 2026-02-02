/// <mls fileReference="_100554_/l2/coachMarks.ts" enhancement="_100554_enhancementLit" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

export function addCoachMark(json: ICoachMarks) {
    let coachMark = document.querySelector('coach-marks-100554') as CoachMarks100554;
    if (!coachMark) {
        coachMark = document.createElement('coach-marks-100554') as CoachMarks100554;
        document.body.appendChild(coachMark);
    }

    coachMark.info = json;
}

@customElement('coach-marks-100554')
export class CoachMarks100554 extends CollabLitElement {

    @property() info: ICoachMarks | undefined;
    @property() error: string = '';

    firstUpdated() {
        this.setInfo();
    }

    render() {
        if (!this.info) return html``;
        if (this.error) return this.renderError();
        setTimeout(() => { this.setCoachMarks() }, 500);
        return html``;

    }

    renderError() {
        return html`<h3 style="text-align:center">${this.error}</h3>`
    }

    //--------IMPLEMENTS-------

    private setInfo() {

        try {

            const t = this.querySelector('templatecoach') as HTMLElement;
            if (!t) return;
            let v = t.innerText;
            let j: ICoachMarks | undefined;
            if (v) j = JSON.parse(v);

            this.info = j;


        } catch (e: any) {
            this.error = e.message;
        }
    }

    private setCoachMarks(force: boolean = false) {

        if (!this.info) return;

        const l = this.inLocalStorage();

        if (l && !force) {
            this.classList.add('close');
            this.info = undefined;
            return;
        }

        this.classList.remove('close');
        this.clearMe();
        this.setGlobalDefinitions()
        this.createSteps(0);

    }

    private clearMe() {
        const all = this.querySelectorAll('coachimarktem');
        Array.from(all).forEach((i) => i.remove());
    }

    private close() {
        this.clearMe();
        this.setKey();
        this.classList.add('close');
        this.info = undefined;
    }

    private setKey() {

        try {

            if (!this.info || !this.info.key) return;
            let t = localStorage.getItem(this.tagName.toLocaleLowerCase()) as string;
            t = t ? t : "[]";
            const v = JSON.parse(t);
            if (v.includes(this.info.key)) return;
            v.push(this.info.key);
            localStorage.setItem(this.tagName.toLocaleLowerCase(), JSON.stringify(v));
        } catch (e) {
            console.info('setKey', e);
        }

    }

    private inLocalStorage(): boolean {

        try {

            if (!this.info || !this.info.key) return false;
            let t = localStorage.getItem(this.tagName.toLocaleLowerCase()) as string;
            t = t ? t : "[]";
            const v = JSON.parse(t);
            if (v.includes(this.info.key)) return true;
            return false;

        } catch (e) {
            console.info('setKey', e);
            return false
        }

    }

    private timeInterval = 0;
    private setGlobalDefinitions() {

        if (!this.info) return;

        if (this.info.fontSize) {
            this.style.fontSize = this.info.fontSize;
        }

        if (this.info.transparency && this.transparency[this.info.transparency]) {
            this.style.background = this.transparency[this.info.transparency]
        } else {
            this.style.background = this.transparency.normal
        }

        if (this.info.timeClose && this.info.timeClose > 0) {
            clearInterval(this.timeInterval);

            const btn = document.createElement('button');
            this.appendChild(btn);
            btn.onclick = () => this.close();

            let turn = this.info.timeClose + 1;
            this.timeInterval = setInterval(() => {

                if (turn <= 0) {
                    clearInterval(this.timeInterval);
                    this.close();
                    return;
                }

                turn--;
                btn.innerText = `Close(${turn})`;
            }, 1000)
        }

    }

    private createSteps(index: number) {

        if (!this.info || this.info.steps.length === 0 || !this.info.steps[index]) return;

        const step = this.info.steps[index];

        let ref = step.elementRef ? document.querySelector(step.elementRef) as HTMLElement : undefined;

        if (!ref && !step.positionNoRef) {
            console.info('Not found ref for item' + index);
            this.createSteps(index + 1);
            return;
        }

        const item = document.createElement('coachimarktem');
        this.appendChild(item);

        this.addTextWithArrow(step, item);
        this.positionStep(step, item, ref);
        this.addAnimation(step, item);

        if (!step.duration) step.duration = 0;

        setTimeout(() => {
            if (step.autoClose) item.remove();
            this.createSteps(index + 1);
        }, step.duration * 1000);


    }

    private addAnimation(step: ICoachMarkStep, item: HTMLElement) {

        if (!step.animation) return;
        if (!step.timeAnimation) step.timeAnimation = 500;
        const loop = step.loopAni ? 'infinite' : '';

        item.style.animation = `${step.animation} ${step.timeAnimation}ms ${loop}`

        switch (step.animation) {
            case "shake":

                break;

            default:
                return;
        }

    }

    private addTextWithArrow(step: ICoachMarkStep, item: HTMLElement) {

        const text = document.createElement('span');
        text.innerHTML = step.text;

        let svg: HTMLElement | undefined = undefined;

        if (step.arrow && this.arrow[step.arrow]) {
            const el = document.createElement('div');
            el.innerHTML = this.arrow[step.arrow];
            svg = el.children[0] as HTMLElement;
        }

        if (!step.arrow || !svg) step.arrow = '';

        if (svg && ['down', 'right'].includes(step.arrow)) {
            item.appendChild(text);
            item.appendChild(svg);

        } else if (svg && ['up', 'left'].includes(step.arrow)) {
            item.appendChild(svg);
            item.appendChild(text);

        } else {
            item.appendChild(text);
        }

        if (svg && ['right', 'left'].includes(step.arrow)) {
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.gap = '.5rem';
        }

    }

    private positionStep(step: ICoachMarkStep, item: HTMLElement, ref: HTMLElement | undefined) {

        let top = 0;
        let left = 0;

        if (ref) {

            const buttonRect = ref.getBoundingClientRect();

            switch (step.position) {
                case "bottom":
                    top = buttonRect.bottom + window.scrollY;
                    left = buttonRect.left + window.scrollX;
                    break;
                case "top":
                    top = buttonRect.top - item.offsetHeight + window.scrollY;
                    left = buttonRect.left + window.scrollX;
                    break;
                case "left":
                    top = buttonRect.top + window.scrollY;
                    left = buttonRect.left - item.offsetWidth + window.scrollX;
                    break;
                case "right":
                    top = buttonRect.top + window.scrollY;
                    left = buttonRect.right + window.scrollX;
                    break;
                default:
                    console.warn("Invalid pos");
                    return;
            }

        } else if (step.positionNoRef) {

            const containerRect = window.document.body.getBoundingClientRect();
            const elementRect = item.getBoundingClientRect();

            switch (step.positionNoRef) {
                case "top-start":
                    top = 0;
                    left = 0;
                    break;
                case "top-center":
                    top = 0;
                    left = (containerRect.width - elementRect.width) / 2;
                    break;
                case "top-end":
                    top = 0;
                    left = containerRect.width - elementRect.width;
                    break;
                case "center-start":
                    top = (containerRect.height - elementRect.height) / 2;
                    left = 0;
                    break;
                case "center-center":
                    top = (containerRect.height - elementRect.height) / 2;
                    left = (containerRect.width - elementRect.width) / 2;
                    break;
                case "center-end":
                    top = (containerRect.height - elementRect.height) / 2;
                    left = containerRect.width - elementRect.width;
                    break;
                case "bottom-start":
                    top = containerRect.height - elementRect.height;
                    left = 0;
                    break;
                case "bottom-center":
                    top = containerRect.height - elementRect.height;
                    left = (containerRect.width - elementRect.width) / 2;
                    break;
                case "bottom-end":
                    top = containerRect.height - elementRect.height;
                    left = containerRect.width - elementRect.width;
                    break;
                default:
                    console.warn("Invalid pos");
                    return;
            }

            
        }


        if (!step.marginV) step.marginV = 0;
        if (!step.marginH) step.marginH = 0;


        item.style.top = `${top + step.marginV}px`;
        item.style.left = `${left + step.marginH}px`;

    }

    private transparency = {
        light: '#00000054',
        normal: '#0000009e',
        strong: '#000000d4'
    }

    private arrow: any = {
        up: `<?xml version="1.0" encoding="iso-8859-1"?>
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                <svg style=" fill: #fff; width: 30px; height: 30px; transform: rotate(127deg) rotateY(180deg);position: absolute; top: -22px; left: -22px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 415.262 415.261"
                    xml:space="preserve"> 
                <g>
                    <path d="M414.937,374.984c-7.956-24.479-20.196-47.736-30.601-70.992c-1.224-3.06-6.12-3.06-7.956-1.224
                        c-10.403,11.016-22.031,22.032-28.764,35.496h-0.612c-74.664,5.508-146.88-58.141-198.288-104.652
                        c-59.364-53.244-113.22-118.116-134.64-195.84c-1.224-9.792-2.448-20.196-2.448-30.6c0-4.896-6.732-4.896-7.344,0
                        c0,1.836,0,3.672,0,5.508C1.836,12.68,0,14.516,0,17.576c0.612,6.732,2.448,13.464,3.672,20.196
                        C8.568,203.624,173.808,363.356,335.376,373.76c-5.508,9.792-10.403,20.195-16.523,29.988c-3.061,4.283,1.836,8.567,6.12,7.955
                        c30.6-4.283,58.14-18.972,86.292-29.987C413.712,381.104,416.16,378.656,414.937,374.984z M332.928,399.464
                        c3.673-7.956,6.12-15.912,10.404-23.868c1.225-3.061-0.612-5.508-2.448-6.12c0-1.836-1.224-3.061-3.06-3.672
                        c-146.268-24.48-264.996-124.236-309.06-259.489c28.764,53.244,72.828,99.756,116.28,138.924
                        c31.824,28.765,65.484,54.468,102.204,75.888c28.764,16.524,64.872,31.824,97.92,21.421l0,0c-1.836,4.896,5.508,7.344,7.956,3.672
                        c7.956-10.404,15.912-20.196,24.48-29.376c8.567,18.972,17.748,37.943,24.479,57.527
                        C379.44,382.94,356.796,393.956,332.928,399.464z"/>
                </g>
                </svg>`
        ,
        down: `<?xml version="1.0" encoding="iso-8859-1"?>
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                <svg style=" fill: #fff; width: 30px; height: 30px; transform: rotate(290deg) rotateY(180deg);position: absolute; bottom: -22px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 415.262 415.261"
                    xml:space="preserve">
                <g>
                    <path d="M414.937,374.984c-7.956-24.479-20.196-47.736-30.601-70.992c-1.224-3.06-6.12-3.06-7.956-1.224
                        c-10.403,11.016-22.031,22.032-28.764,35.496h-0.612c-74.664,5.508-146.88-58.141-198.288-104.652
                        c-59.364-53.244-113.22-118.116-134.64-195.84c-1.224-9.792-2.448-20.196-2.448-30.6c0-4.896-6.732-4.896-7.344,0
                        c0,1.836,0,3.672,0,5.508C1.836,12.68,0,14.516,0,17.576c0.612,6.732,2.448,13.464,3.672,20.196
                        C8.568,203.624,173.808,363.356,335.376,373.76c-5.508,9.792-10.403,20.195-16.523,29.988c-3.061,4.283,1.836,8.567,6.12,7.955
                        c30.6-4.283,58.14-18.972,86.292-29.987C413.712,381.104,416.16,378.656,414.937,374.984z M332.928,399.464
                        c3.673-7.956,6.12-15.912,10.404-23.868c1.225-3.061-0.612-5.508-2.448-6.12c0-1.836-1.224-3.061-3.06-3.672
                        c-146.268-24.48-264.996-124.236-309.06-259.489c28.764,53.244,72.828,99.756,116.28,138.924
                        c31.824,28.765,65.484,54.468,102.204,75.888c28.764,16.524,64.872,31.824,97.92,21.421l0,0c-1.836,4.896,5.508,7.344,7.956,3.672
                        c7.956-10.404,15.912-20.196,24.48-29.376c8.567,18.972,17.748,37.943,24.479,57.527
                        C379.44,382.94,356.796,393.956,332.928,399.464z"/>
                </g>
                </svg>`
        ,
        right: `<?xml version="1.0" encoding="iso-8859-1"?>
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                <svg  style=" fill: #fff; width: 30px; height: 30px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 403.963 403.963"
                    xml:space="preserve">
                <g>
                    <path d="M399.908,160.269c-31.824-15.3-64.26-28.152-89.964-52.632c-5.508-4.896-12.24-1.224-12.853,5.508
                        c-1.836,15.3-2.448,29.988-2.448,44.676c-29.375-9.18-69.155-3.06-97.308-5.508c-59.976-4.284-119.952-17.748-179.928-15.912
                        c-5.508,0-9.792,6.732-6.732,11.628c15.912,23.868,36.108,43.452,55.08,64.26c-20.196,25.093-44.064,45.9-63.648,71.604
                        c-4.284,5.508-1.836,13.464,5.508,14.076c103.428,7.956,194.616-64.872,293.76-82.009c-1.836,18.36-1.224,36.721-0.612,55.08
                        c0,6.12,7.956,9.792,12.853,5.509c33.048-33.049,63.647-67.32,89.964-105.876C404.804,167.001,402.968,162.105,399.908,160.269z
                        M23.528,282.668c17.136-20.195,35.496-40.392,48.96-63.035c3.672,0.611,7.956-3.673,5.508-7.956
                        c-14.076-20.809-31.212-39.168-46.512-59.364c47.736,0.612,94.86,9.18,142.596,14.076c43.452,4.896,89.352,7.344,133.416,8.568
                        c5.508,0,7.344-7.344,3.06-10.404c-0.611-0.612-1.224-0.612-1.836-1.224c0-12.24,0.612-24.48,1.836-36.108
                        c22.645,17.748,48.349,29.376,74.664,41.616c-21.42,29.988-45.288,57.528-70.38,83.844c-0.612-15.301-1.836-30.601-1.224-45.9
                        c0-3.672-3.061-5.508-6.12-5.508c-1.224-1.836-3.06-3.06-6.12-2.448C204.68,209.841,120.836,281.445,23.528,282.668z"/>
                </g>
                </svg>`
        ,
        left: `<?xml version="1.0" encoding="iso-8859-1"?>
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                <svg  style=" fill: #fff; width: 30px; height: 30px;transform: rotateY(180deg)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 403.963 403.963"
                    xml:space="preserve">
                <g>
                    <path d="M399.908,160.269c-31.824-15.3-64.26-28.152-89.964-52.632c-5.508-4.896-12.24-1.224-12.853,5.508
                        c-1.836,15.3-2.448,29.988-2.448,44.676c-29.375-9.18-69.155-3.06-97.308-5.508c-59.976-4.284-119.952-17.748-179.928-15.912
                        c-5.508,0-9.792,6.732-6.732,11.628c15.912,23.868,36.108,43.452,55.08,64.26c-20.196,25.093-44.064,45.9-63.648,71.604
                        c-4.284,5.508-1.836,13.464,5.508,14.076c103.428,7.956,194.616-64.872,293.76-82.009c-1.836,18.36-1.224,36.721-0.612,55.08
                        c0,6.12,7.956,9.792,12.853,5.509c33.048-33.049,63.647-67.32,89.964-105.876C404.804,167.001,402.968,162.105,399.908,160.269z
                        M23.528,282.668c17.136-20.195,35.496-40.392,48.96-63.035c3.672,0.611,7.956-3.673,5.508-7.956
                        c-14.076-20.809-31.212-39.168-46.512-59.364c47.736,0.612,94.86,9.18,142.596,14.076c43.452,4.896,89.352,7.344,133.416,8.568
                        c5.508,0,7.344-7.344,3.06-10.404c-0.611-0.612-1.224-0.612-1.836-1.224c0-12.24,0.612-24.48,1.836-36.108
                        c22.645,17.748,48.349,29.376,74.664,41.616c-21.42,29.988-45.288,57.528-70.38,83.844c-0.612-15.301-1.836-30.601-1.224-45.9
                        c0-3.672-3.061-5.508-6.12-5.508c-1.224-1.836-3.06-3.06-6.12-2.448C204.68,209.841,120.836,281.445,23.528,282.668z"/>
                </g>
                </svg>`
    }

}

export interface ICoachMarks {
    key: string,
    transparency: ITransparency,
    fontSize: string,
    timeClose: number,
    steps: ICoachMarkStep[]
}

interface ICoachMarkStep {
    elementRef?: string,
    text: string,
    position?: IPosition,
    positionNoRef?: IPositionNoRef,
    marginH?: number,
    marginV?: number,
    arrow?: IArrown,
    duration?: number,
    animation?: IAnimation,
    timeAnimation?: number,
    loopAni?: boolean,
    autoClose: boolean,
}

type ITransparency = 'light' | 'normal' | 'strong';
type IPosition = 'bottom' | 'top' | 'left' | 'right';
type IPositionNoRef = 'top-start' | 'top-center' | 'top-end' | 'center-start' | 'center-center' | 'center-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
type IArrown = 'down' | 'up' | 'left' | 'right' | '';
type IAnimation = 'flip' | 'pulse' | 'shake';

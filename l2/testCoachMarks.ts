/// <mls shortName="testCoachMarks" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState } from './_100554_icaState';
import {addCoachMark, ICoachMarks} from './_100554_coachMarks';
@customElement('test-coach-marks-100554') 
export class TestCoachMarks100554 extends CollabPageElement {
 
    initPage(): void {
        this.setCoach();
        
    }

    private setCoach() {
        const btn = document.querySelector('#setCoachMark') as HTMLElement;
        if (!btn) return
        btn.onclick = () => {
            const json = {
                key: "venda3",
                transparency: "normal",
                fontSize: "1.3em",
                timeClose: 10,
                steps: [
                    {
                        elementRef: "#promo-code",
                        text: "Insira aqui seu codigo promocional 2",
                        position: "top",
                        marginV: -25,
                        arrow: "down",
                        duration: 1,
                        autoClose: true
                    },
                    {
                        elementRef: "#lastProduct",
                        text: "Aqui esta a listagem dos seus itens 2",
                        position: "bottom",
                        marginV: 33,
                        marginH: 80,
                        arrow: "up",
                        duration: 2,
                        animation: "pulse",
                        timeAnimation: 2000,
                        loopAni: true
                    },
                    {
                        elementRef: ".checkout-cta",
                        text: "Clique aqui para fechar a compra 2",
                        position: "left",
                        marginH: -20,
                        arrow: "right",
                        animation: "shake",
                        timeAnimation: 1000,
                        loopAni: true
                    },
                    {
                        elementRef: "#showqtd",
                        text: "Quantidade do item 2",
                        position: "right",
                        marginH: 5,
                        marginV: -5,
                        arrow: "left"
                    }
                ]
            };
            addCoachMark(json as ICoachMarks );
        }
    }

}

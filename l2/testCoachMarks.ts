/// <mls shortName="testCoachMarks" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from '/_100554_/l2/collabPageElement.js';
import { customElement } from 'lit/decorators.js';
import {addCoachMark, ICoachMarks} from '/_100554_/l2/coachMarks.js';
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
                key: "venda10",
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
                        
                        text: `<iframe width="560" height="315" src="https://www.youtube.com/embed/4zyORrpBDFc?si=JHVZAfJ-Uj6ebM9r" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
                        positionNoRef:'bottom-centerr',
                        
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

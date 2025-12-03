/// <mls shortName="msgTestApi" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

@customElement('msg-test-api-100554')
export class MsgTestAPI extends StateLitElement {

    @property() result = '';

    render() {
        return html`
        <button @click=${this.exegGetTaskUpdate}>getTaskUpdate</button>
        <button @click=${this.execAddTaskAIInteraction}>addTaskAIInteraction</button>

         <pre style="white-space: break-spaces;">${this.result}</pre>
         `;
    }


    async exegGetTaskUpdate() {
        const ret = await fetch('https://collab.codes/msg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "getTaskUpdate",
                userId: "20250306212720.1000",
                messageId: "20250304200000.1000/20250410015610.1000",
                taskId: "task#1744250170012"
            })
        });

        const text = await ret.json();
        console.info(text);
        this.result = JSON.stringify(text)
    }


    async execAddTaskAIInteraction() {
        const ret = await fetch('https://collab.codes/msg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "addTaskAIInteraction",
                userId: "20250306212720.1000",
                messageId: "20250304200000.1000/20250410015610.1000",
                taskId: "task#1744250170012",
                parentStepId: 7,
                inputAI: [{ "type": "human", "content": "Qual a capital do Japão ? Responda em formato json" }]

            })
        });

        const text = await ret.json();
        this.result = JSON.stringify(text)
    }


    async execAddTask() {
        
    }


}

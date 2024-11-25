/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getOrCreateDSInstanceIO } from './_100554_libDesignSystem'
import { CollabLitElement } from './_100554_collabLitElement'
import { IcaLitElement } from './_100554_icaLitElement'

// teste 5 
const message_ru = { installPlugin: 'Установить плагин', createNewPlugin: 'Создать новый плагин', backList: 'Вернуться к списку', noPluginsInstalled: 'Плагины не установлены', desactivate: 'Деактивировать', activate: 'Активировать', delete: 'Удалить', reference: 'Справка', noPluginsAvaliables: 'Нет доступных плагинов', install: 'Установить', p1: 'Что такое плагины?', p2: 'Плагины - это фрагменты кода, которые добавляют дополнительные функции в ваш проект. Они разработаны для расширения и улучшения возможностей вашего проекта.', p3: 'Как работают плагины?', p4: 'Когда вы устанавливаете и активируете плагин, он добавляет новые функции или возможности в ваш проект. Плагины могут изменять способ работы вашего проекта, добавляя новые параметры конфигурации, искусственный интеллект, виджеты, короткие коды и другие функции.', p5: 'Где найти плагины?', p6: 'Вы можете найти плагины непосредственно в (L5) вашего проекта, в разделе Сервисы (Services), называемом "Плагины". Здесь вы можете управлять и добавлять новые плагины в свой проект.', p7: 'Как создать плагин?', p8: 'Для создания плагина...', }

@customElement('ateste-100554')
export class SimpleGreeting extends CollabLitElement {
    
    createRenderRoot() {
        return this;
    }

        
    @property() name: string = new Date(Date.now()).toString();
    
    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }

    render() {

        return html`<div class="cls1"><h1>Hello world santiago 5</h1></div>`;
    }


}

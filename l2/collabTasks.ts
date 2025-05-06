/// <mls shortName="collabTasks" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_plus, collab_message } from './_100554_collabIcons';

@customElement('collab-tasks-100554')
export class CollabTasks100554 extends StateLitElement {

    render() {
        return html`<div class="task-container">

         <ol class="task-columns">
            <li class="task-column">
                <div class="task-column-container"> 
                <div class="task-column-title">Pending</div>
                    <ul class="task-items">
                        <li class="task-item">  
                            <div class="task-item-title"> Task 1</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                            <div class="task-item-actions-info">
                                <div class="info-messages"> ${collab_message} <span>10</span></div>
                                </div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://lh3.googleusercontent.com/a-/AOh14GjhEPN7UazL97l6qFIRIYUoLY-PNNPC93Zw4EVT=s96-c" alt="user avatar">
                                </div>
                            </div>
                        </li>
                        <li class="task-item">  
                            <div class="task-item-title"> Task 2</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info"></div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://avatars.githubusercontent.com/u/57486730?v=4" alt="user avatar">
                                </div>
                            </div>
                        </li>
                        <li class="task-item">  
                            <div class="task-item-title"> Task 3</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info"></div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://avatars.githubusercontent.com/u/57486730?v=4" alt="user avatar">
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="task-items-add">
                        ${collab_plus}
                        <span>Add new task</span>
                    </div>
                </div>
            
            </li>

            <li class="task-column">
                <div class="task-column-container"> 
                <div class="task-column-title">In progress</div>
                    <ul class="task-items">
                        <li class="task-item">  
                            <div class="task-item-title"> Task 4</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info">
                                    <div class="info-messages"> ${collab_message} <span>1</span></div>
                                </div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://avatars.githubusercontent.com/u/36516904?v=4" alt="user avatar">
                                </div>
                            </div>
                        </li>
                        <li class="task-item">  
                            <div class="task-item-title"> Task 5</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info"></div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://lh3.googleusercontent.com/a-/AOh14GjhEPN7UazL97l6qFIRIYUoLY-PNNPC93Zw4EVT=s96-c" alt="user avatar">
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="task-items-add">
                        ${collab_plus}
                        <span>Add new task</span>
                    </div>
                </div>
            </li>

            <li class="task-column">
                <div class="task-column-container"> 
                <div class="task-column-title">Completed</div>
                    <ul class="task-items">
                        <li class="task-item">  
                            <div class="task-item-title"> Task 6</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info">
                                    <div class="info-messages"> ${collab_message} <span>1</span></div>
                                </div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://avatars.githubusercontent.com/u/36516904?v=4" alt="user avatar">
                                </div>
                            </div>
                        </li>
                        <li class="task-item">  
                            <div class="task-item-title"> Task 7</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info">
                                    <div class="info-messages"> ${collab_message} <span>3</span></div>
                                </div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://lh3.googleusercontent.com/a-/AOh14GjhEPN7UazL97l6qFIRIYUoLY-PNNPC93Zw4EVT=s96-c" alt="user avatar">
                                </div>
                            </div>
                        </li>
                        <li class="task-item">  
                            <div class="task-item-title"> Task 8</div>
                            <div class="task-item-body"></div>
                            <div class="task-item-actions">
                                <div class="task-item-actions-info">
                                    <div class="info-messages"> ${collab_message} <span>1</span></div>
                                </div>
                                <div class="task-item-actions-user">
                                    <img class="avatar" src="https://lh3.googleusercontent.com/a-/AOh14GjhEPN7UazL97l6qFIRIYUoLY-PNNPC93Zw4EVT=s96-c" alt="user avatar">
                                </div>

                            </div>
                        </li>
                    </ul>
                    <div class="task-items-add">
                        ${collab_plus}
                        <span>Add new task</span>
                    </div>
                </div>
            </li>
        

         </ol>

         </div>`;
    }
}

/// <mls fileReference="_100554_/l2/agents/agentToBeOrganismTemplate.ts" enhancement="_100554_enhancementLit" />

// LLM must replace fileReference to new page name
// LLM must add clear and concise comments to improve code readability for humans.

import { html, HTMLTemplateResult, when, repeat, classMap, styleMap, ifDefined } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { beInvoke, BeInvoke, readLocal, savelocal, generateId, pluginInvoke } from '/_100554_/l2/agents/collabAuraPageCommon.js';

import { getState, setState, subscribe, unsubscribe, initState } from '/_100554_/l2/collabState.js';
// todo:
/// <mls fileReference="_100554_/l2/agentDesignRef2Image.ts" enhancement="_100554_/l2/enhancementLit" />

import { IAgentAsync, IAgentMeta, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getAgentStepByAgentName } from "/_100554_/l2/aiAgentHelper.js";

const nextAgentName = "agentDesignRef2Image2";

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentDesignRef2Image",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "DesignRef 2 Hero Image",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const system = await prepareSystemPrompt()

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system,
            }, {
                type: "human",
                content: context.message.content
            }],
            taskTitle: `Creating`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
        }
    };
    return [addMessageAI];

}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {

    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    const payload: mls.msg.AIFlexibleResultStep | undefined = (step.interaction?.payload?.[0]) as mls.msg.AIFlexibleResultStep;
    if (!payload || !payload.type || !payload.result) throw new Error(`Payload invalid`);
    if (!['flexible'].includes(payload?.type)) throw new Error(`Payload type invalid: ${payload?.type}`);

    let status: mls.msg.AIStepStatus = 'completed';

    let intents: mls.msg.AgentIntent[] = [];
    const newStep: mls.msg.AgentIntentAddStep = {
        type: "add-step",
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        step:
        {
            type: 'agent',
            stepId: 0,
            interaction: null,
            status: 'waiting_human_input',
            nextSteps: [],
            agentName: nextAgentName,
            prompt: payload.result,
            rags: [],
        }
    };

    intents.push(newStep);

    return intents;

}

export function getPayload1(context: mls.msg.ExecutionContext): PayLoad1 {
    if (!context || !context.task) throw new Error(`[getPayload] Invalid context`);
    const agentStep = getAgentStepByAgentName(context.task, 'agentDesignRef2Image'); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[getPayload] no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[0];
    if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[getPayload] No step flexible found for this agent.`);
    return { prompt: resultStep.result || "" };
}


async function prepareSystemPrompt(): Promise<string> {

    let system: string = system1;
    return system;

}

const system1 = `
<!-- modelType: code -->

You are an expert agent specialized in transforming raw user descriptions into precise, image-generation-ready prompts for use in website design.

## GOAL:
Generate a short, clear and visually descriptive English prompt optimized for AI image generators (such as DALL·E, Midjourney, SDXL).  
It must **match the style** of the site based on tokens from the section 'Design Ref'.

---

## INSTRUCTIONS:

1. Start from the user input in section 'User Prompt'.
2. Read the section 'Design Ref' and extract:
   - Color palette (primary, background)
   - Style adjectives (ex: minimal, elegant)
   - Any visual themes (ex: soft shadows, rounded corners)

3. Rewrite the prompt using **simple, vivid English** with visual descriptions.
   - Avoid programming terms or UI-specific terms.
   - Emphasize **atmosphere**, **subject**, and **composition**.

4. Make the image **suitable for web**:
   - Match the style of the site.
   - No text inside the image.
   - Horizontal orientation.
   - Safe for commercial use.

### Design Ref
\`\`\`json
{
  "palette": [
    "#FFFFFF",
    "#4A90E2",
    "#7ED321",
    "#F5A623",
    "#D0021B"
  ],
  "typography": {
    "heading": "Poppins Bold",
    "body": "Roboto Regular",
    "accents": "Poppins Light"
  },
  "shapes": [
    "circle",
    "rounded-rect",
    "blob"
  ],
  "layout": {
    "hero": "Centered hero with large heading, subtitle, CTA button, and background image of pets",
    "services": "Grid layout of 3-4 service cards with icons and descriptions",
    "testimonials": "Carousel of user testimonials with photos",
    "footer": "Multi-column footer with links, social icons, and contact info"
  },
  "style": {
    "shadows": "Soft drop shadows on cards",
    "spacing": "16px base grid",
    "borders": "Rounded corners on buttons",
    "gradients": "Linear gradients from blue to green"
  },
  "components": [
    "navbar",
    "hero",
    "service-cards",
    "testimonials-carousel",
    "footer"
  ],
  "inspiration_notes": "Modern pet care landing page with playful, friendly design using pet illustrations, vibrant colors, and clean typography to evoke trust and approachability.",
  "grid": {
    "columns": 12,
    "gutter": 16,
    "maxWidth": 1200
  },
  "spacingScale": [
    4,
    8,
    16,
    24,
    32,
    48,
    64
  ],
  "radii": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "full": "50%"
  },
  "shadowsTokens": [
    "0 2px 4px rgba(0,0,0,0.1)",
    "0 4px 8px rgba(0,0,0,0.15)"
  ],
  "blendsUsed": [
    "normal",
    "multiply"
  ],
  "composition": {
    "hero": {
      "layers": [
        {
          "kind": "image",
          "ref": "hero-pet-image",
          "fit": "cover",
          "x": "0%",
          "y": "0%",
          "width": "100%",
          "height": "100%",
          "mask": "none",
          "opacity": 0.8,
          "blend": "normal",
          "z": 1
        },
        {
          "kind": "shape",
          "shape": "rounded-rect",
          "x": "50%",
          "y": "50%",
          "width": "400px",
          "height": "200px",
          "color": "#FFFFFF",
          "opacity": 0.9,
          "radius": "16px",
          "blur": 0,
          "blend": "normal",
          "z": 2
        },
        {
          "kind": "gradient",
          "type": "linear",
          "from": "#4A90E2",
          "to": "#7ED321",
          "angle": 45,
          "x": "0%",
          "y": "0%",
          "width": "100%",
          "height": "100%",
          "opacity": 1,
          "z": 0
        }
      ]
    },
    "services": {
      "layers": [
        {
          "kind": "shape",
          "shape": "rounded-rect",
          "x": "20%",
          "y": "10%",
          "width": "200px",
          "height": "150px",
          "color": "#FFFFFF",
          "opacity": 1,
          "radius": "12px",
          "blur": 0,
          "blend": "normal",
          "z": 1
        },
        {
          "kind": "shape",
          "shape": "circle",
          "x": "25%",
          "y": "15%",
          "width": "50px",
          "height": "50px",
          "color": "#F5A623",
          "opacity": 1,
          "radius": "50%",
          "blur": 0,
          "blend": "normal",
          "z": 2
        },
        {
          "kind": "image",
          "ref": "service-icon-1",
          "fit": "contain",
          "x": "25%",
          "y": "15%",
          "width": "50px",
          "height": "50px",
          "mask": "circle",
          "opacity": 1,
          "blend": "normal",
          "z": 3
        }
      ]
    }
  }
}
\`\`\`


## Output format
Return only valid JSON in the following structure:

[[OutputSection1]]

`

//#region OutputSection1
export type Output1 =
    {
        type: "flexible";
        result: string // final prompt
    }

//#endregion


export interface PayLoad1 {
    prompt: string;
}

/// <mls shortName="widgetMindMapL4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from '/_100554_/l2/collabDecorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';


@customElement('widget-mind-map-l4-100554')
export class WidgetMindMapL4100554 extends StateLitElement {

    @property({ type: String }) activeDescription: string | undefined;

    @propertyDataSource({ type: Object }) mindMapSelected: MindMapSelected | undefined;

    @property() mapState: MindMapData | undefined;

    // Allow node size configuration
    @property({ type: Number }) nodeRadius = 30;

    @property({ type: Object }) nodeStyles: MindMapNodeStyles = {
        level1: { fill: '#F1C40F', stroke: '#B7950B', text: '#222' },
        level2: { fill: '#3498DB', stroke: '#21618C', text: '#ddd' },
        level3: { fill: '#2ECC40', stroke: '#196F3D', text: '#333' },
        level4: { fill: '#A569BD', stroke: '#512E5F', text: '#ddd' },
        level5: { fill: '#EB984E', stroke: '#CA6F1E', text: '#444' },
        level6: { fill: '#95A5A6', stroke: '#566573', text: '#fff' },
        level7: { fill: '#E74C3C', stroke: '#922B21', text: '#444' },
        default: { fill: '#34495E', stroke: '#283747', text: '#444' }
    };

    @property({ type: Array }) breadcrumb: MindMapNode[] = [];

    // Store node positions for hit detection
    // Store for each node: node, x, y, rect (label rectangle), isCenter
    private _nodePositions: {
        node: MindMapNode;
        rect?: { x: number, y: number, w: number, h: number };
        circle?: { x: number, y: number, r: number }; // Only for center node, optional for others
        isCenter: boolean;
    }[] = [];

    private _animationDelay = 500;

    render() {
        return html`
        <div class="breadcrumb">
            ${this.breadcrumb.map((node, index) => html`
            <span
                class="crumb ${index === this.breadcrumb.length - 1 ? 'active' : ''}"
                @click=${() => this._popToBreadcrumb(index)}
            >
                ${node.label}
            </span>
            ${index < this.breadcrumb.length - 1 ? html`<span class="sep">›</span>` : null}
            `)}
        </div>
        <div class="canvas-container" style="width:100%;height:calc(100% - 400px);">
            <canvas id="mindmap-canvas" style="width:100%;height:100%;display:block;cursor:pointer;"></canvas>
        </div>
        ${this.activeDescription ? html` <div class="node-description"> ${unsafeHTML(this.activeDescription)} </div> ` : null}
        `;
    }

    firstUpdated() {
        this._addCanvasListeners();
        if (this.mapState) {
            const center = this.mapState.nodes.find(n => n.id === this.mapState!.current);
            if (center) {
                this.breadcrumb = [center];
            }
        }

        this.drawMindMap();
    }

    connectedCallback() {
        super.connectedCallback?.();
        window.addEventListener('resize', this._redrawCanvas);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._redrawCanvas);
        super.disconnectedCallback?.();
        this._removeCanvasListeners();
    }

    updated() {
        // If animating, use animated positions
        if (this._animating && this._animatedPositions) {
            this.drawMindMap(this._animatedPositions);
        } else {
            this.drawMindMap();
        }
    }

    //------IMPLEMENTATION---------

    private _redrawCanvas = () => {
        this.requestUpdate();
    };

    private _addCanvasListeners() {
        const canvas = this.renderRoot.querySelector('#mindmap-canvas') as HTMLCanvasElement;
        if (canvas) {
            canvas.addEventListener('click', this._onCanvasClick);
            canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
        }
    }

    private _removeCanvasListeners() {
        const canvas = this.renderRoot.querySelector('#mindmap-canvas') as HTMLCanvasElement;
        if (canvas) {
            canvas.removeEventListener('click', this._onCanvasClick);
            canvas.removeEventListener('mousemove', this.handleCanvasMouseMove);
        }
    }

    private _animating: boolean = false;
    private _animatedPositions?: Record<string, { x: number, y: number, alpha: number }>;

    private _onCanvasClick = (e: MouseEvent) => {
    
        if (!this.mapState) return;

        const canvas = this.renderRoot.querySelector('#mindmap-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top ;

        const clickedId = this.getNodeIdAtPosition(mx, my);
        const item = this._nodePositions.find(p => p.node.id === clickedId);

        if (item && item.node.related.length < 1) {
            this.activeDescription = item.node.description;
            return;
        }
        if (item && !item.isCenter) {
            // Prepare animation
            const width = canvas.width;
            const height = canvas.height;
            const animationMap = this.prepareAnimationMap(this.mapState.current, item.node.id, width, height);


            this._pushBreadcrumb(item.node);


            // Start animation
            this._animating = true;
            this.animateTransition(
                animationMap, this._animationDelay,
                (positions) => {
                    this._animatedPositions = positions;
                    this.requestUpdate();
                },
                () => {
                    if (!this.mapState) return;
                    this._animating = false;
                    this._animatedPositions = undefined;
                    this.mapState.current = item.node.id;
                    this.activeDescription = item.node.description;
                    this._syncBreadcrumbWithCurrent();
                    this.requestUpdate();
                }
            );
            this.onSelected?.(item.node);
        }
    };

    private getNodeStyle(type: string): MindMapNodeStyle {
        return this.nodeStyles[type] || this.nodeStyles.default;
    }

    /**
     * Returns the node id under the given mouse position, or undefined if none.
     */
    private getNodeIdAtPosition(mx: number, my: number): string | undefined {
        for (const item of this._nodePositions) {
            // First test label rectangle
            if (item.rect) {
                const { x, y, w, h } = item.rect;
                if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
                    return item.node.id;
                }
            }
            // If is center node, also test the circle
            if (item.isCenter && item.circle) {
                const dx = mx - item.circle.x;
                const dy = my - item.circle.y;
                if (dx * dx + dy * dy <= item.circle.r * item.circle.r) {
                    return item.node.id;
                }
            }
        } return undefined;
    }

    // Use this function for automatic relationship (two-sided)
    private getRelatedNodes(node: MindMapNode, allNodes: MindMapNode[]): MindMapNode[] {
        const direct = node.related ?? [];
        const reverse = allNodes.filter(n =>
            n.related?.includes(node.id) && n.id !== node.id
        ).map(n => n.id);
        const allIds = Array.from(new Set([...direct, ...reverse])).filter(id => id !== node.id);
        return allIds.map(id => allNodes.find(n => n.id === id)).filter(Boolean) as MindMapNode[];
    }

    private _hoveredNodeId?: string;
    private handleCanvasMouseMove = (e: MouseEvent) => {
        const canvas = this.renderRoot.querySelector('#mindmap-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Use the centralized function
        const hoveredId = this.getNodeIdAtPosition(mx, my);

        if (this._hoveredNodeId !== hoveredId) {
            this._hoveredNodeId = hoveredId;
            this.requestUpdate();
        }
    };

    private drawMindMap(positions?: Record<string, { x: number, y: number, alpha: number }>) {
        requestAnimationFrame(() => {

            if (!this.mapState) return;
            const container = this.renderRoot.querySelector('.canvas-container') as HTMLElement;
            const canvas = this.renderRoot.querySelector('#mindmap-canvas') as HTMLCanvasElement;
            if (!canvas || !container) return;

            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { current, nodes } = this.mapState;
            let centerNode = nodes.find(n => n.id === current)!;
            let relatedNodes = this.getRelatedNodes(centerNode, nodes);

            this._nodePositions = [];

            if (positions) { // animations
                for (const id in positions) {
                    const node = nodes.find(n => n.id === id);
                    if (!node) continue;
                    const style = this.getNodeStyle(node.type);
                    const isCenter = id === current;
                    const isHovered = this._hoveredNodeId === node.id;
                    const { x, y, alpha } = positions[id];
                    ctx.globalAlpha = alpha
                    // draw as label
                    this.drawLabel(ctx, node, node.label, x, y, style.fill, style.text, style.stroke, isCenter ? 'bold 15px sans-serif' : 'bold 13px sans-serif', isHovered, isCenter);

                    // center node gets circle too
                    if (isCenter) {
                        ctx.beginPath();
                        ctx.arc(x, y, this.nodeRadius, 0, 2 * Math.PI);
                        ctx.fillStyle = style.fill;
                        ctx.fill();
                        ctx.strokeStyle = style.stroke;
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }
                }
                return;
            }

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.33;
            const nodeRadius = this.nodeRadius;

            relatedNodes.forEach((node, i) => {
                const angle = (2 * Math.PI / relatedNodes.length) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                const style = this.getNodeStyle(node.type);
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = style.stroke;
                ctx.lineWidth = 3;
                ctx.stroke();

                const isHovered = this._hoveredNodeId === node.id;
                this.drawLabel(ctx, node, node.label, x, y, style.fill, style.text, style.stroke, 'bold 13px sans-serif', isHovered, false);
            });

            // Center node
            const centerStyle = this.getNodeStyle(centerNode.type);

            ctx.beginPath();
            ctx.arc(centerX, centerY, nodeRadius, 0, 2 * Math.PI);
            ctx.fillStyle = centerStyle.fill;
            ctx.fill();
            ctx.strokeStyle = centerStyle.stroke;
            ctx.lineWidth = 3;
            ctx.stroke();

            const isCenterHovered = this._hoveredNodeId === centerNode.id;
            this.drawLabel(ctx, centerNode, centerNode.label, centerX, centerY, centerStyle.fill, centerStyle.text, centerStyle.stroke, 'bold 15px sans-serif', isCenterHovered, true);
        });
    }

    private drawLabel(
        ctx: CanvasRenderingContext2D,
        node: MindMapNode,
        text: string,
        x: number,
        y: number,
        bgColor: string,
        textColor: string,
        strokeColor: string,
        font: string,
        isHovered: boolean,
        center: boolean
    ) {
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const paddingX = 15;
        const paddingY = 8;
        const rectRadius = 12;

        const metrics = ctx.measureText(text);
        const textHeight = 13 + paddingY * 2;
        const textWidth = metrics.width + paddingX * 2;

        const rectX = x - textWidth / 2;
        const rectY = y - textHeight / 2;

        // Shadow effect
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.19)';
        ctx.shadowBlur = isHovered ? 16 : 8;
        ctx.shadowOffsetX = isHovered ? 1 : 0;
        ctx.shadowOffsetY = isHovered ? 3 : 2;

        // Gradient texture for background
        const grad = ctx.createRadialGradient(x, y, rectRadius, x, y, textWidth);
        grad.addColorStop(0, bgColor);
        grad.addColorStop(1, isHovered
            ? this._brightenColor(bgColor, 0.15)
            : this._brightenColor(bgColor, 0.75));

        // Draw rounded rectangle (background)
        ctx.beginPath();
        ctx.moveTo(rectX + rectRadius, rectY);
        ctx.lineTo(rectX + textWidth - rectRadius, rectY);
        ctx.quadraticCurveTo(rectX + textWidth, rectY, rectX + textWidth, rectY + rectRadius);
        ctx.lineTo(rectX + textWidth, rectY + textHeight - rectRadius);
        ctx.quadraticCurveTo(rectX + textWidth, rectY + textHeight, rectX + textWidth - rectRadius, rectY + textHeight);
        ctx.lineTo(rectX + rectRadius, rectY + textHeight);
        ctx.quadraticCurveTo(rectX, rectY + textHeight, rectX, rectY + textHeight - rectRadius);
        ctx.lineTo(rectX, rectY + rectRadius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + rectRadius, rectY);
        ctx.closePath();

        //ctx.globalAlpha = isHovered ? 1.0 : 0.92;
        ctx.fillStyle = grad;
        ctx.fill();

        //ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        // Draw border (stroke)
        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.restore();
        this._nodePositions.push({
            node,
            rect: { x: rectX, y: rectY, w: textWidth, h: textHeight },
            isCenter: center
        });
        // Draw label text
        ctx.fillStyle = textColor;
        if (isHovered) {
            ctx.fillText(text, x - 2, y - 2);
        } else {
            ctx.fillText(text, x, y);
        }
    }

    // Utility for gradient color lighten
    private _brightenColor(hex: string, amt = 0.08) {
        // Simple hex lighten, supports #RRGGBB
        let num = parseInt(hex.replace("#", ""), 16);
        let r = Math.min(255, ((num >> 16) + 255 * amt) | 0);
        let g = Math.min(255, (((num >> 8) & 0x00FF) + 255 * amt) | 0);
        let b = Math.min(255, ((num & 0x0000FF) + 255 * amt) | 0);
        return `rgb(${r},${g},${b})`;
    }

    /**
 * Returns a map { nodeId: {x, y} } for each node,
 * given a center nodeId and its related nodes.
 */
    private getNodePositions(centerId: string, width: number, height: number): Record<string, { x: number, y: number }> | undefined {
        if (!this.mapState) return undefined;
        const { nodes } = this.mapState;
        const centerNode = nodes.find(n => n.id === centerId)!;
        const relatedNodes = this.getRelatedNodes(centerNode, nodes);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.33;

        const result: Record<string, { x: number, y: number }> = {};
        // Center
        result[centerId] = { x: centerX, y: centerY };

        // Related nodes around
        relatedNodes.forEach((node, i) => {
            const angle = (2 * Math.PI / relatedNodes.length) * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            result[node.id] = { x, y };
        });
        return result;
    }

    /**
     * Returns an array of { id, from, to } for all nodes appearing in either state.
     * - from: start position (or undefined if node is new)
     * - to:   end position (or undefined if node disappears)
     */
    private prepareAnimationMap(
        fromCenterId: string, toCenterId: string,
        width: number, height: number
    ): { id: string, from?: { x: number, y: number }, to?: { x: number, y: number } }[] {
        const fromPos = this.getNodePositions(fromCenterId, width, height);
        const toPos = this.getNodePositions(toCenterId, width, height);

        if (!fromPos || !toPos) return [];
        // All involved node ids (union)
        const ids = Array.from(new Set([...Object.keys(fromPos), ...Object.keys(toPos)]));

        return ids.map(id => ({
            id,
            from: fromPos[id],
            to: toPos[id]
        }));
    }

    /**
     * Animates all nodes from their 'from' position to 'to' in 500ms.
     * Calls a callback on each frame with current positions.
     */
    private animateTransition(
        animationMap: { id: string, from?: { x: number, y: number }, to?: { x: number, y: number } }[],
        duration: number,
        drawFrame: (positions: Record<string, { x: number, y: number, alpha: number }>) => void,
        onDone: () => void
    ) {
        const start = performance.now();

        const animate = (now: number) => {
            let t = (now - start) / duration;
            if (t > 1) t = 1;

            const positions: Record<string, { x: number, y: number, alpha: number }> = {};

            const easeIn = (t: number, exp = 2) => Math.pow(t, exp);
            const easeOut = (t: number, exp = 2) => 1 - Math.pow(1 - t, exp);
            for (const { id, from, to } of animationMap) {
                if (!from && to) {
                    positions[id] = { ...to, alpha: easeIn(t, 5) }; // fade-in                
                } else if (from && !to) {
                    positions[id] = { ...from, alpha: 1 - easeOut(t, 5) }; // fade-out
                } else if (from && to) {
                    positions[id] = {
                        x: from.x + (to.x - from.x) * t,
                        y: from.y + (to.y - from.y) * t,
                        alpha: 1
                    };
                }
            }

            drawFrame(positions);

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                onDone();
            }
        };
        requestAnimationFrame(animate);
    }

    private onSelected?(node: MindMapNode): void;




    private _pushBreadcrumb(node: MindMapNode) {
        const index = this.breadcrumb.findIndex(n => n.id === node.id);

        if (index !== -1) {
            // Já existe no breadcrumb → corta tudo depois dele
            this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        } else {
            // Não existe → adiciona normalmente
            this.breadcrumb = [...this.breadcrumb, node];
        }
    }

    private _syncBreadcrumbWithCurrent() {
        if (!this.mapState) return;

        const currentId = this.mapState.current;
        const node = this.mapState.nodes.find(n => n.id === currentId);
        if (!node) return;

        const index = this.breadcrumb.findIndex(n => n.id === currentId);

        if (index !== -1) {
            // Usuário "voltou" para um nó já existente
            this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        } else {
            // Usuário foi para um nó fora do caminho atual
            this.breadcrumb = [...this.breadcrumb, node];
        }
    }

    private _popToBreadcrumb(index: number) {
        const target = this.breadcrumb[index];
        if (!target || !this.mapState) return;

        const canvas = this.renderRoot.querySelector('#mindmap-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const animationMap = this.prepareAnimationMap(
            this.mapState.current,
            target.id,
            canvas.width,
            canvas.height
        );

        this._animating = true;
        this.animateTransition(
            animationMap,
            this._animationDelay,
            (positions) => {
                this._animatedPositions = positions;
                this.requestUpdate();
            },
            () => {
                this._animating = false;
                this._animatedPositions = undefined;
                this.mapState!.current = target.id;
                this.activeDescription = target.description;
                this.breadcrumb = this.breadcrumb.slice(0, index + 1);
                this.requestUpdate();
            }
        );
    }
}

type MindMapSelected = MindMapSelectedFile | MindMapSelectedPlugin;

interface MindMapSelectedBase {
    plugin: Function; // function to get informations
    args: string;
}

interface MindMapSelectedFile extends MindMapSelectedBase {
    type: "file",
    file: mls.stor.IFileInfo; // file selected , level, project, shortName, folder, extension
    organism?: string;
    widget?: string;
    modelType?: mls.editor.ModelType; // .ts , .html, .less, .test.ts, .defs.ts
}

interface MindMapSelectedPlugin extends MindMapSelectedBase {
    type: "plugin",
    file: mls.stor.IFileInfo; // file selected , level, project, shortName, folder, extension    
}

interface MindMapSelectedGroup extends MindMapSelectedBase {
    type: "group",
}

export interface MindMapNode {
    id: string;             // unique identifier
    label: string;          // label shown on the node
    type: 'page' | 'widget' | 'table' | 'group' | 'state' | 'state-group' | 'project' | 'level1' | 'level2'| 'level3'| 'level4'| 'level5'| 'level6'| 'level7';
    related: string[];      // ids of related nodes
    meta?: Record<string, any>; // optional metadata;
    description?: string
}

export interface MindMapData {
    current: string;
    nodes: MindMapNode[];
}

export interface MindMapNodeStyle {
    fill: string;    // Circle background color
    stroke: string;  // Circle border color
    text: string;    // Text color
}

export type MindMapNodeStyles = Record<string, MindMapNodeStyle>;
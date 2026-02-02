/// <mls shortName="widgetMindMapL4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from '/_100554_/l2/collabDecorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { convertTagToFileName } from '/_100554_/l2/utilsLit';
import { MindMapSelected, MindMapData, MindMapNodeStyles, MindMapNodeStyle, MindMapNode, setMindMapVariable, getMindMapVariable, getMindMapByStorFile, getMindMapByName } from '/_100554_/l2/libMindMap.js'

@customElement('widget-mind-map-l4-100554')
export class WidgetMindMapL4100554 extends StateLitElement {

    @property({ type: String }) activeDescription: string | undefined;
    @property({ type: String }) currentpage: string | undefined;

    @propertyDataSource({ type: Object }) mindMapSelected: MindMapSelected | undefined;

    @property() mapState: MindMapData | undefined;

    // Allow node size configuration
    @property({ type: Number }) nodeRadius = 30;

    @property({ type: Object }) nodeStyles: MindMapNodeStyles = {
        main: { fill: '#F1C40F', stroke: '#B7950B', text: '#222' },
        asIs: { fill: '#3498DB', stroke: '#1F618D', text: '#ECF0F1' },
        codeInsights: { fill: '#2ECC71', stroke: '#1D8348', text: '#1B4F72' },
        webcomponent: { fill: '#A569BD', stroke: '#512E5F', text: '#FDFEFE' },
        imports: { fill: '#95A5A6', stroke: '#566573', text: '#222' },
        language: { fill: '#EB984E', stroke: '#CA6F1E', text: '#4A2C0A' },
        attributes: { fill: '#48C9B0', stroke: '#117864', text: '#083A33' },
        file: { fill: '#CFE9F6', stroke: '#8CBFD9', text: '#1F3B4D' },
        text: { fill: '#D8CFC4', stroke: '#BFAF9F', text: '#4A3F35' },
        default: { fill: '#2C3E50', stroke: '#1B2631', text: '#ECF0F1' }
    };

    @property({ type: String }) initialNode: string | undefined;
    @property({ type: Array }) breadcrumb: MindMapNode[] = [];

    // Store node positions for hit detection
    // Store for each node: node, x, y, rect (label rectangle), isCenter
    private _nodePositions: {
        node: MindMapNode;
        rect?: { x: number, y: number, w: number, h: number };
        circle?: { x: number, y: number, r: number }; // Only for center node, optional for others
        isCenter: boolean;
        buttons?: {
            navigate: { x: number, y: number, w: number, h: number };
        };
    }[] = [];

    private _animationDelay = 500;

    private get visibleBreadcrumb(): {
        nodes: MindMapNode[];
        hasHidden: boolean;
    } {
        const MAX = 5;

        if (this.breadcrumb.length <= MAX) {
            return {
                nodes: this.breadcrumb,
                hasHidden: false
            };
        }

        return {
            nodes: this.breadcrumb.slice(-MAX),
            hasHidden: true
        };
    }

    render() {
        return html`
        <div class="breadcrumb">
            ${(() => {
                const { nodes, hasHidden } = this.visibleBreadcrumb;

                return html`
                    ${hasHidden
                        ? html`<span class="crumb ellipsis">... <span class="sep">›</span></span>`
                        : null
                    }

                    ${nodes.map((node, index) => html`
                        <span
                            class="crumb ${index === nodes.length - 1 ? 'active' : ''}"
                            @click=${() =>
                            this._popToBreadcrumb(
                                this.breadcrumb.indexOf(node)
                            )
                        }
                        >
                            ${node.label}
                        </span>

                        ${index < nodes.length - 1
                            ? html`<span class="sep">›</span>`
                            : null}
                    `)}
                `;
            })()}
        </div>
        <div class="mindmap-layout ${this.activeDescription ? 'has-description' : ''}">
            
            <div class="canvas-container">
                <canvas id="mindmap-canvas" style="width:100%;height:100% ;display:block;cursor:pointer;"></canvas>
            </div>

            <div class="node-description">
                <button class="back-btn" @click=${this._closeDescription}>
                    ← Back
                </button>
                <div class="content">
                    ${this.activeDescription ? unsafeHTML(this.activeDescription) : html`<p>Selecione um nó para ver detalhes.</p>`}
                </div>
            </div>
            
        </div>
        `;
    }

    firstUpdated() {
        this._addCanvasListeners();
        this.configureMindMap();
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

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        // If animating, use animated positions

        const mapState = changedProperties.get('mapState');
        const currentpage = changedProperties.get('currentpage');

        if (mapState) {
            const center = this.mapState?.nodes.find(n => n.id === this.mapState!.current);
            if (center) {

                const saved = getMindMapVariable();
                const keepBreadcrumb = !currentpage || this.currentpage === currentpage;
                console.info(keepBreadcrumb);
                if (keepBreadcrumb && saved.length) {
                    this.breadcrumb = saved;
                    const index = this.breadcrumb.findIndex((i) => i.id === center.id && i.meta.fileKey === center.meta.fileKey);
                    if (index < 0) this.breadcrumb.push(center);

                    if (this.initialNode) {
                        const indexNode = this.breadcrumb.findIndex((i) => i.id === this.initialNode);
                        if (indexNode >= 0) this._popToBreadcrumb(indexNode)
                    }

                } else if (center) {
                    this.activeDescription = undefined;
                    this.breadcrumb = [center];

                }
                setMindMapVariable(this.breadcrumb);

            }
        }

        if (this._animating && this._animatedPositions) {
            this.drawMindMap(this._animatedPositions);
        } else {
            this.drawMindMap();
        }
    }

    //------IMPLEMENTATION--------- 

    private configureMindMap() {

        if (this.mapState) {
            const center = this.mapState.nodes.find(n => n.id === this.mapState!.current);
            if (center) {

                const saved = getMindMapVariable();

                if (saved.length) {
                    this.breadcrumb = saved;
                    const index = this.breadcrumb.findIndex((i) => i.id === center.id && i.meta.fileKey === center.meta.fileKey);
                    if (index < 0) this.breadcrumb.push(center);

                    if (this.initialNode) {
                        const indexNode = this.breadcrumb.findIndex((i) => i.id === this.initialNode);
                        if (indexNode >= 0) this._popToBreadcrumb(indexNode)
                    }

                } else if (center) {
                    this.breadcrumb = [center];

                }
                setMindMapVariable(this.breadcrumb);

            }
        }

        this.drawMindMap();
    }

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
        const my = e.clientY - rect.top;

        // 🔥 CONVERSÃO ÚNICA E CORRETA
        const { x, y } = this.toWorldCoords(mx, my, canvas);

        const clickedId = this.getNodeIdAtPosition(x, y);
        const item = this._nodePositions.find(p => p.node.id === clickedId);

        if (!item) return;

        /* ---------- BUTTON HIT TEST (CORRIGIDO) ---------- */
        const hit = (item.buttons
            ? Object.entries(item.buttons).find(([key, r]) =>
                x >= r.x && x <= r.x + r.w &&
                y >= r.y && y <= r.y + r.h
            )
            : undefined
        );

        if (hit) {
            const [key] = hit;
            if (key === 'navigate') {
                this.openDefs(item.node);
            }
            return;
        }

        if (item.node.type === 'file_wc') {
            this.openDefs(item.node);
            return;
        }

        /* ---------- NODE CLICK ---------- */
        if (item.node.related.length < 1) {
            this._pushBreadcrumb(item.node);
            this.activeDescription = item.node.description ? item.node.description : undefined;
            return;
        }

        if (!item.isCenter) {
            const width = canvas.width;
            const height = canvas.height;

            const animationMap = this.prepareAnimationMap(
                this.mapState.current,
                item.node.id,
                width,
                height
            );

            this._pushBreadcrumb(item.node);

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
                    this.mapState!.current = item.node.id;
                    this.activeDescription = item.node.description ? item.node.description : undefined;
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
        const { x, y } = this.toWorldCoords(mx, my, canvas);
        const hoveredId = this.getNodeIdAtPosition(x, y);

        if (this._hoveredNodeId !== hoveredId) {
            this._hoveredNodeId = hoveredId;
            this.requestUpdate();
        }
    };

    private toWorldCoords(mx: number, my: number, canvas: HTMLCanvasElement) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        return {
            x: (mx - cx) / this.zoom + cx,
            y: (my - cy) / this.zoom + cy
        };
    }


    private computeAutoZoom(
        bounds: { minX: number; minY: number; maxX: number; maxY: number },
        canvasWidth: number,
        canvasHeight: number,
        padding = 40
    ) {
        const contentWidth = bounds.maxX - bounds.minX + padding * 2;
        const contentHeight = bounds.maxY - bounds.minY + padding * 2;

        const scaleX = canvasWidth / contentWidth;
        const scaleY = canvasHeight / contentHeight;

        let zoom = Math.min(scaleX, scaleY);

        zoom = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, zoom));

        return zoom;
    }

    private zoom = .8;
    private MIN_ZOOM = 0.6; private MAX_ZOOM = .95;
    private drawMindMap(
        positions?: Record<string, { x: number; y: number; alpha: number }>
    ) {
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

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { current, nodes } = this.mapState;
            const centerNode = nodes.find(n => n.id === current)!;
            const relatedNodes = this.getRelatedNodes(centerNode, nodes);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const baseRadius = Math.min(canvas.width, canvas.height) * 0.33;
            const densityFactor = Math.max(1, relatedNodes.length / 6);
            const radius = baseRadius * densityFactor;

            /* ------------------ BOUNDS (AUTO ZOOM) ------------------ */
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            const updateBounds = (x: number, y: number, w: number, h: number) => {
                minX = Math.min(minX, x - w / 2);
                minY = Math.min(minY, y - h / 2);
                maxX = Math.max(maxX, x + w / 2);
                maxY = Math.max(maxY, y + h / 2);
            };

            ctx.font = 'bold 13px sans-serif';

            // Center node bounds
            updateBounds(
                centerX,
                centerY,
                this.nodeRadius * 2 + 40,
                this.nodeRadius * 2 + 40
            );

            // Related nodes bounds
            relatedNodes.forEach((node, i) => {
                const angle = (2 * Math.PI / relatedNodes.length) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                const labelWidth = ctx.measureText(node.label).width + 40;
                const labelHeight = node.type === 'file' ? 56 : 32;

                updateBounds(x, y, labelWidth, labelHeight);
            });

            // Compute zoom
            this.zoom = this.computeAutoZoom(
                { minX, minY, maxX, maxY },
                canvas.width,
                canvas.height
            );

            /* ------------------ APPLY TRANSFORM ------------------ */
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(this.zoom, this.zoom);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this._nodePositions = [];

            /* ------------------ ANIMATION MODE ------------------ */
            if (positions) {
                for (const id in positions) {
                    const node = nodes.find(n => n.id === id);
                    if (!node) continue;

                    const { x, y, alpha } = positions[id];
                    const style = this.getNodeStyle(node.type);
                    const isCenter = id === current;
                    const isHovered = this._hoveredNodeId === node.id;

                    ctx.globalAlpha = alpha;

                    this.drawLabel(
                        ctx,
                        node,
                        node.label,
                        x,
                        y,
                        style.fill,
                        style.text,
                        style.stroke,
                        isCenter ? 'bold 15px sans-serif' : 'bold 13px sans-serif',
                        isHovered,
                        isCenter
                    );

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
                ctx.globalAlpha = 1;
                return;
            }

            /* ------------------ LINKS + RELATED NODES ------------------ */
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
                this.drawLabel(
                    ctx,
                    node,
                    node.label,
                    x,
                    y,
                    style.fill,
                    style.text,
                    style.stroke,
                    'bold 13px sans-serif',
                    isHovered,
                    false
                );
            });

            /* ------------------ CENTER NODE ------------------ */
            const centerStyle = this.getNodeStyle(centerNode.type);

            ctx.beginPath();
            ctx.arc(centerX, centerY, this.nodeRadius, 0, 2 * Math.PI);
            ctx.fillStyle = centerStyle.fill;
            ctx.fill();
            ctx.strokeStyle = centerStyle.stroke;
            ctx.lineWidth = 3;
            ctx.stroke();

            const isCenterHovered = this._hoveredNodeId === centerNode.id;
            this.drawLabel(
                ctx,
                centerNode,
                centerNode.label,
                centerX,
                centerY,
                centerStyle.fill,
                centerStyle.text,
                centerStyle.stroke,
                'bold 15px sans-serif',
                isCenterHovered,
                true
            );
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

        const iconRowHeight = node.type === 'file' ? 26 : 0;
        const totalHeight = textHeight + iconRowHeight;

        const textWidth = metrics.width + paddingX * 2;

        const rectX = x - textWidth / 2;
        const rectY = y - totalHeight / 2;

        /* ---------- Shadow ---------- */
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.19)';
        ctx.shadowBlur = isHovered ? 16 : 8;
        ctx.shadowOffsetX = isHovered ? 1 : 0;
        ctx.shadowOffsetY = isHovered ? 3 : 2;

        /* ---------- Gradient ---------- */
        const grad = ctx.createRadialGradient(x, y, rectRadius, x, y, textWidth);
        grad.addColorStop(0, bgColor);
        grad.addColorStop(
            1,
            isHovered
                ? this._brightenColor(bgColor, 0.15)
                : this._brightenColor(bgColor, 0.75)
        );

        /* ---------- Rounded Rect ---------- */
        ctx.beginPath();
        ctx.moveTo(rectX + rectRadius, rectY);
        ctx.lineTo(rectX + textWidth - rectRadius, rectY);
        ctx.quadraticCurveTo(rectX + textWidth, rectY, rectX + textWidth, rectY + rectRadius);
        ctx.lineTo(rectX + textWidth, rectY + totalHeight - rectRadius);
        ctx.quadraticCurveTo(
            rectX + textWidth,
            rectY + totalHeight,
            rectX + textWidth - rectRadius,
            rectY + totalHeight
        );
        ctx.lineTo(rectX + rectRadius, rectY + totalHeight);
        ctx.quadraticCurveTo(rectX, rectY + totalHeight, rectX, rectY + totalHeight - rectRadius);
        ctx.lineTo(rectX, rectY + rectRadius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + rectRadius, rectY);
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.restore();

        /* ---------- Text ---------- */
        ctx.fillStyle = textColor;
        const textCenterY = rectY + textHeight / 2;

        if (isHovered) {
            ctx.fillText(text, x - 2, textCenterY - 2);
        } else {
            ctx.fillText(text, x, textCenterY);
        }

        /* ---------- Buttons (only text nodes) ---------- */
        let buttons: {
            navigate: { x: number; y: number; w: number; h: number };
        } | undefined;

        if (node.type === 'file') {
            const btnSize = 18;

            const buttonsY =
                rectY + textHeight + (iconRowHeight - btnSize) / 2;

            // 🔥 botão único centralizado
            const navigateBtn = {
                x: x - btnSize / 2,
                y: buttonsY,
                w: btnSize,
                h: btnSize
            };

            this.drawIconButton(ctx, navigateBtn, '➜');

            buttons = {
                navigate: navigateBtn
            };
        }

        /* ---------- Hit map ---------- */
        this._nodePositions.push({
            node,
            rect: {
                x: rectX,
                y: rectY,
                w: textWidth,
                h: totalHeight
            },
            buttons,
            isCenter: center
        });
    }

    private drawIconButton(
        ctx: CanvasRenderingContext2D,
        rect: { x: number, y: number, w: number, h: number },
        icon: string
    ) {
        ctx.save();

        ctx.fillStyle = '#2C3E50';
        ctx.strokeStyle = '#1B2631';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, rect.x + rect.w / 2, rect.y + rect.h / 2 + 0.5);

        ctx.restore();
    }

    private async openDefs(node: MindMapNode) {

        let name = node.label.startsWith('/') ? mls.l2.getPath(node.label.replace('/', '')) : mls.l2.getPath(node.label);
        if (node.label.indexOf('-') > 0) {
            name = convertTagToFileName(node.label) as any;
        }

        const start = name.shortName.indexOf('.');
        if (start > 0) {
            name.shortName = name.shortName.substring(0, start);
        }

        if (name.folder.indexOf('/l2') >= 0) name.folder = name.folder.replace('/l2', '');

        const key = mls.stor.getKeyToFile({ ...name, extension: '.ts', level: 2 });
        if (!mls.stor.files[key]) return;
        this.mapState = await getMindMapByStorFile(mls.stor.files[key]);
        this.configureMindMap();
        //this.fireEvents(mls.stor.files[key])

    }

    private _closeDescription() {

        const index = this.breadcrumb.length - 1;
        this.breadcrumb = this.breadcrumb.slice(0, index);
        setMindMapVariable(this.breadcrumb);
        this.activeDescription = undefined;

        // O CSS cuidará do efeito de deslize de volta
    }

    private async fireEvents(file: mls.stor.IFileInfo) {

        try {
            let name = `_${file.project}_/l2/${file.folder ? file.folder + '/' : ''}${file.shortName}`;
            const options = {
                shortName: undefined,
                project: undefined,
                htmlText: '<plugin-view-mind-map-100554 autoPrepare="true" page="' + name + '" inNavigate="true"></plugin-view-mind-map-100554>'
            }
            mls.events.fire(
                mls.actualLevel as any,
                'PluginDetails' as any,
                JSON.stringify(options),
                0
            );

        } catch (err: any) {

            console.info(err.message || '[fireEvents]: erro open');
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

        const fileKey = node.meta.fileKey;

        const index = this.breadcrumb.findIndex(
            b => b.id === node.id && b.meta.fileKey === fileKey
        );

        let newBreadcrumb: MindMapNode[];

        if (index !== -1) {
            newBreadcrumb = this.breadcrumb.slice(0, index + 1);
        } else {
            newBreadcrumb = [
                ...this.breadcrumb,
                node
            ];
        }

        this.breadcrumb = newBreadcrumb;
        setMindMapVariable(newBreadcrumb);
    }

    private _syncBreadcrumbWithCurrent() {
        if (!this.mapState) return;

        const currentId = this.mapState.current;

        const node = this.mapState.nodes.find(n => n.id === currentId);
        if (!node) return;


        const fileKey = node.meta.fileKey;

        const index = this.breadcrumb.findIndex(
            b => b.id === currentId && b.meta.fileKey === fileKey
        );

        let newBreadcrumb: MindMapNode[];

        if (index !== -1) {
            newBreadcrumb = this.breadcrumb.slice(0, index + 1);
        } else {

            newBreadcrumb = [
                ...this.breadcrumb,
                node
            ];
        }

        this.breadcrumb = newBreadcrumb;
        setMindMapVariable(newBreadcrumb);
    }

    private _popToBreadcrumb(index: number) {
        const entry = this.breadcrumb[index];
        if (!entry) return;

        const currentFile: MindMapNode | undefined = this.mapState ? (this.mapState.nodes || []).find((i) => i.id === (this.mapState || {}).current) : {} as MindMapNode;


        this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        setMindMapVariable(this.breadcrumb);

        if (currentFile && entry.meta.fileKey === currentFile.meta.fileKey) {
            this._navigateInsideCurrentFile(entry.id, index);
            return;
        }

        this.openFileAndNavigate(entry);
    }

    private async openFileAndNavigate(entry: MindMapNode) {
        this.mapState = await getMindMapByName(entry.meta.fileKey);
        this.configureMindMap();

        /*const options = {
            shortName: undefined,
            project: undefined,
            htmlText: `
            <plugin-view-mind-map-100554
                autoPrepare="true"
                page="${entry.meta.fileKey}"
                initialNode="${entry.id}"
                inNavigate="true">
            </plugin-view-mind-map-100554>
        `
        };

        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );*/
    }

    private _navigateInsideCurrentFile(nodeId: string, breadcrumbIndex: number) {
        if (!this.mapState) return;

        const canvas = this.renderRoot.querySelector(
            '#mindmap-canvas'
        ) as HTMLCanvasElement;
        if (!canvas) return;

        const animationMap = this.prepareAnimationMap(
            this.mapState.current,
            nodeId,
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

                // 🔹 atualiza nó atual
                this.mapState!.current = nodeId;

                // 🔹 atualiza descrição
                const node = this.mapState!.nodes.find(n => n.id === nodeId);
                this.activeDescription = node?.description;

                this.requestUpdate();
            }
        );
    }


}


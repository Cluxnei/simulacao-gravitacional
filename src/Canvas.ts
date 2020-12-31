import Constantes from './Constantes';
import Simulacao from "./Simulacao";

export default class Canvas {

    private readonly canvas: HTMLCanvasElement | HTMLElement;
    public ctx: CanvasRenderingContext2D | null;
    private iniciado: boolean = false;
    private simulacao: Simulacao | null;

    constructor(canvas: HTMLCanvasElement | HTMLElement) {
        this.canvas = canvas;
        this.ctx = 'getContext' in this.canvas ? this.canvas.getContext('2d') : null;
        this.iniciado = false;
        this.simulacao = null;
    }

    public iniciar() {
        if (this.iniciado) {
            return;
        }
        this.canvas.setAttribute('zoom', String(Constantes.canvas.zoomInicial));
        this.setPosicao(Constantes.canvas.origemX, Constantes.canvas.origemY);
        const resizeCanvas = () => {
            if ('width' in this.canvas) {
                this.canvas.width = global.window.innerWidth;
            }
            if ('height' in this.canvas) {
                this.canvas.height = global.window.innerHeight;
            }
        };
        global.window.addEventListener('resize', resizeCanvas, false);
        this.canvas.addEventListener('mousemove', (evt: MouseEvent) => {
            const arrastando = this.canvas.getAttribute('arrastando');
            if (arrastando === null || arrastando === 'false') {
                return;
            }
            const {x: posicaoX, y: posicaoY} = this.obterPosicao();
            this.setPosicao(posicaoX + evt.movementX, posicaoY + evt.movementY);
        });
        /*this.canvas.addEventListener('touchmove', (evt: TouchEvent) => {
            const arrastando = this.canvas.getAttribute('arrastando');
            if (arrastando === null || arrastando === 'false') {
                return;
            }
            const {x: posicaoX, y: posicaoY} = this.obterPosicao();
            const zoom = this.obterZoom();
            const toque = evt.changedTouches[0];
            const primeiroToque = toques.find((t) => t.identifier === toque.identifier);
            console.log(toque.pageX - primeiroToque.pageX, toque.pageY - primeiroToque.pageY)
            this.setPosicao(posicaoX - ((toque.pageX - primeiroToque.pageX) * zoom), posicaoY + ((toque.pageY - primeiroToque.pageY) * -zoom));
        });*/
        this.canvas.addEventListener('mousedown', () => {
            this.simulacao && this.simulacao.observarPlaneta(null);
            this.canvas.setAttribute('arrastando', String(true));
        });
        /*this.canvas.addEventListener('touchstart', (evt: TouchEvent) => {
            const {identifier, pageX, pageY} = evt.changedTouches[0];
            toques.push({identifier, pageX, pageY});
            this.simulacao && this.simulacao.observarPlaneta(null);
            this.canvas.setAttribute('arrastando', String(true));
        });*/
        this.canvas.addEventListener('mouseup', () => {
            this.canvas.setAttribute('arrastando', String(false));
        });
        /*this.canvas.addEventListener('touchcancel', (evt: TouchEvent) => {
            toques.splice(toques.findIndex((t) => t.identifier === evt.changedTouches[0].identifier), 1);
            this.canvas.setAttribute('arrastando', String(false));
        });
        this.canvas.addEventListener('touchend', (evt: TouchEvent) => {
            toques.splice(toques.findIndex((t) => t.identifier === evt.changedTouches[0].identifier), 1);
            this.canvas.setAttribute('arrastando', String(false));
        });*/
        this.canvas.addEventListener('wheel', (evt: WheelEvent) => {
            const zoom = this.obterZoom();
            this.canvas.setAttribute('zoom', String(zoom - (evt.deltaY / 1000 * zoom)));
        });
        resizeCanvas();
        this.iniciado = true;
    }

    atualizar() {
        const zoom = Number(this.canvas.getAttribute('zoom'));
        const {x, y} = this.obterPosicao();
        this.ctx.resetTransform();
        this.ctx.fillStyle = Constantes.canvas.corDeFundo;
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.ctx.translate(this.canvas.clientWidth / 2 + x, this.canvas.clientHeight / 2 + y);
        this.ctx.scale(zoom, zoom);
    }

    setPosicao(x: number, y: number) {
        this.canvas.setAttribute('positionX', String(x));
        this.canvas.setAttribute('positionY', String(y));
    }

    obterPosicao(): { x: number, y: number } {
        return {
            x: Number(this.canvas.getAttribute('positionX')) || 0,
            y: Number(this.canvas.getAttribute('positionY')) || 0,
        };
    }

    obterZoom(): number {
        return Number(this.canvas.getAttribute('zoom'));
    }

    setSimulacao(simulacao: Simulacao) {
        this.simulacao = simulacao;
    }

    desenharCirculo(x: number, y: number, raio: number, fillStyle?: string, strokeStyle?: string) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, raio, 0, 360);
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.stroke();
        }
        if (fillStyle) {
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
        }
    }

    desenharRetangulo(x:number, y:number, w:number, h:number, strokeStyle?: string) {
        strokeStyle && (this.ctx.strokeStyle = strokeStyle);
        this.ctx.strokeRect(x, y, w, h);
    }

    desenharLinha(deX: number, deY: number, paraX: number, paraY: number, strokeStyle?: string) {
        this.ctx.beginPath();
        this.ctx.moveTo(deX, deY);
        this.ctx.lineTo(paraX, paraY);
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
        }
        this.ctx.stroke();
    }
}
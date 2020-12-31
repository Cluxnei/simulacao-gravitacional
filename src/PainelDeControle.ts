import Estatisticas from './Estatisticas';
import Constantes from './Constantes';
import Vetor from './Vetor';
import Planeta from "./Planeta";
import Simulacao from "./Simulacao";

interface Elementos {
    pausar?: HTMLButtonElement,
    tempo?: HTMLSpanElement,
    numeroDePlanetas?: HTMLSpanElement,
    posicao?: HTMLSpanElement,
    planetas?: HTMLDivElement,
    zoom?: HTMLSpanElement,
    acelerar?: HTMLButtonElement,
    retardar?: HTMLButtonElement,
    diferencaDeTempo?: HTMLSpanElement,
}

interface Valores {
    pausado?: boolean,
    tempo?: number,
    numeroDePlanetas?: number,
    posicao?: Vetor,
    planetas?: Planeta[],
    zoom?: number,
    diferencaDeTempo?: number,
}

export default class PainelDeControle {

    private readonly estatisticas: Estatisticas;
    private readonly simulacao: Simulacao;
    private readonly elementos: Elementos;
    private valores: Valores;
    private iniciado: boolean = false;
    private ajustado: boolean = false;
    private contadorDeFrames: number;
    private pausar: () => void;
    private despausar: () => void;

    constructor(estatisticas: Estatisticas, simulacao: Simulacao) {
        this.estatisticas = estatisticas;
        this.simulacao = simulacao;
        this.iniciado = false;
        this.elementos = {};
        this.valores = {};
        this.contadorDeFrames = 0;
        this.ajustado = false;
    }

    iniciar(
        acelerar: HTMLButtonElement,
        retardar: HTMLButtonElement,
        pausar: HTMLButtonElement,
        diferencaDeTempo: HTMLSpanElement,
        tempo: HTMLSpanElement,
        numeroDePlanetas: HTMLSpanElement,
        posicao: HTMLSpanElement,
        planetas: HTMLDivElement,
        zoom: HTMLSpanElement
    ): void {
        if (this.iniciado) {
            return;
        }
        this.elementos.pausar = pausar;
        this.elementos.acelerar = acelerar;
        this.elementos.retardar = retardar;
        this.elementos.diferencaDeTempo = diferencaDeTempo;
        this.elementos.tempo = tempo;
        this.elementos.numeroDePlanetas = numeroDePlanetas;
        this.elementos.posicao = posicao;
        this.elementos.planetas = planetas;
        this.elementos.zoom = zoom;
        this.elementos.pausar.addEventListener('click', () => this.pausarDespausar());
        this.elementos.acelerar.addEventListener('click', () => this.acelerar());
        this.elementos.retardar.addEventListener('click', () => this.retardar());
        this.iniciado = true;
    }

    ajustar() {
        this.elementos.planetas.style.height = `${this.elementos.planetas.firstElementChild.clientHeight * 2}px`;
        this.ajustado = true;
    }

    atualizar(pausado: boolean): void {
        !pausado && this.contadorDeFrames++;
        this.valores.diferencaDeTempo = this.estatisticas.obterDiferencaDeTempo();
        this.valores.tempo = this.contadorDeFrames * this.valores.diferencaDeTempo;
        this.valores.numeroDePlanetas = this.estatisticas.obterNumeroDePlanetas();
        this.valores.posicao = this.estatisticas.obterPosicaoCanvas();
        this.valores.planetas = this.estatisticas.obterPlanetas();
        this.valores.zoom = this.estatisticas.obterZoom();
    }

    renderizar(pausado: boolean): void {
        this.elementos.diferencaDeTempo.innerText = this.valores.diferencaDeTempo.toFixed(10);
        !pausado && (this.elementos.tempo.innerText = this.valores.tempo.toFixed(2));
        !pausado && (this.elementos.numeroDePlanetas.innerText = this.valores.numeroDePlanetas.toString());
        this.elementos.posicao.innerText = this.valores.posicao.toString(1);
        this.elementos.zoom.innerText = this.valores.zoom.toString();
        this.renderizarPlanetas(pausado);
        if (!this.ajustado) {
            this.ajustar();
        }
    }

    renderizarPlanetas(pausado: boolean) {
        const ids = new Set();
        let ordem = 1;
        this.valores.planetas.forEach((planeta) => {
            ids.add(String(planeta.id));
            const elemento = global.document.querySelector(`div[data-id-planeta="${planeta.id}"]`);
            if (elemento === null) {
                const el = this.obterHTMLPlaneta(planeta);
                this.elementos.planetas.appendChild(el);
                const btn = global.document.querySelector(`div[data-id-planeta="${planeta.id}"] .observar-planeta`);
                const btn2 = global.document.querySelector(`div[data-id-planeta="${planeta.id}"] .mostrar-orbita`);
                btn.addEventListener('click', () => {
                    global.document.querySelectorAll('#planetas div[data-id-planeta]').forEach((e) => e.classList.remove('ativo'));
                    btn.parentElement.parentElement.classList.add('ativo');
                    const idPlaneta = btn.getAttribute('data-id-planeta');
                    this.observarPlaneta(Number(idPlaneta));
                });
                btn2.addEventListener('click', () => {
                    global.document.querySelectorAll('#planetas div[data-id-planeta]').forEach((e) => e.classList.remove('ativo'));
                    btn.parentElement.parentElement.classList.add('ativo');
                    const idPlaneta = btn.getAttribute('data-id-planeta');
                    this.observarOrbita(Number(idPlaneta));
                });
                return;
            }
            if (pausado) {
                return;
            }
            elemento.querySelector<HTMLSpanElement>('.posicao').innerText = `Posição: ${planeta.posicao.toString(2)}`;
            elemento.querySelector<HTMLSpanElement>('.velocidade').innerText = `Velocidade: ${planeta.velocidade.toString(2)}`;
            elemento.querySelector<HTMLSpanElement>('.aceleracao').innerText = `Aceleração: ${planeta.aceleracao.toString(2)}`;
            elemento.querySelector<HTMLSpanElement>('.forcas').innerText = `Força G resultante: ${planeta.forcas.toString(2)}`;
            elemento.querySelector<HTMLSpanElement>('.massa').innerText = `Massa: ${planeta.massa.toFixed(2)}`;
            elemento.querySelector<HTMLSpanElement>('.densidade').innerText = `Densidade: ${planeta.densidade.toFixed(2)}`;
            elemento.querySelector<HTMLSpanElement>('.volume').innerText = `Volume: ${planeta.volume.toFixed(2)}`;
            elemento.querySelector<HTMLSpanElement>('.raio').innerText = `Raio: ${planeta.raio.toFixed(2)}`;
        });
        global.document.querySelectorAll('#planetas div[data-id-planeta]').forEach((div: HTMLDivElement) => {
            const idPlaneta = div.getAttribute('data-id-planeta');
            if (!ids.has(idPlaneta)) {
                div.style.order = (ordem++).toString();
                div.querySelector<HTMLButtonElement>('.observar-planeta').setAttribute('disabled', 'disabled');
                div.querySelector<HTMLButtonElement>('.mostrar-orbita').setAttribute('disabled', 'disabled');
            }
        });
    }

    obterHTMLPlaneta(planeta: Planeta) {
        const div = global.document.createElement('div');
        div.innerHTML = `
                <div data-id-planeta="${planeta.id}">
                    <span class="posicao">Posição: ${planeta.posicao.toString(2)}</span>
                    <span class="velocidade">Velocidade: ${planeta.velocidade.toString(2)}</span>
                    <span class="aceleracao">Aceleração: ${planeta.aceleracao.toString(2)}</span>
                    <span class="forcas">Força G resultante: ${planeta.forcas.toString(2)}</span>
                    <span class="massa">Massa: ${planeta.massa.toFixed(2)}</span>
                    <span class="densidade">Densidade: ${planeta.densidade.toFixed(2)}</span>
                    <span class="volume">Volume: ${planeta.volume.toFixed(2)}</span>
                    <span class="raio">Raio: ${planeta.raio.toFixed(2)}</span>
                    <div class="botoes">
                        <button data-id-planeta="${planeta.id}" class="observar-planeta">observar</button>
                        <button data-id-planeta="${planeta.id}" class="mostrar-orbita">mostrar orbita</button>
                    </div>
                </div>
        `.trim();
        return div.firstChild;
    }

    setPausar(callback: () => void) {
        this.pausar = callback;
    }

    setDespausar(callback: () => void) {
        this.despausar = callback;
    }

    pausarDespausar(): void {
        const i = this.elementos.pausar.children[0];
        if (this.valores.pausado) {
            this.despausar();
            this.valores.pausado = false;
            i.classList.remove('fa-play');
            i.classList.add('fa-pause');
            return;
        }
        this.pausar();
        this.valores.pausado = true;
        i.classList.remove('fa-pause');
        i.classList.add('fa-play');
    }

    observarPlaneta(id: number) {
        this.simulacao.observarPlaneta(id);
    }

    observarOrbita(id: number) {
        this.simulacao.observarOrbita(id);
    }

    acelerar() {
        this.simulacao.acelerar();
    }

    retardar() {
        this.simulacao.retardar();
    }

}
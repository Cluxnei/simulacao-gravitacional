import Planeta from './Planeta';
import Constantes from './Constantes';
import Canvas from './Canvas';
import Vetor from './Vetor';
import Fisica from './Fisica';

export default class Simulacao {

    public planetas?: Planeta[];

    public canvas: Canvas;

    private observando: number|null;

    private observandoOrbita: number|null;

    public diferencaDeTempo: number;

    constructor(planetas: Planeta[] = [], diferencaDeTempo: number = Constantes.diferencaDeTempo) {
        this.planetas = [...planetas];
        this.planetas.sort((p1, p2) => p1.id - p2.id);
        if (this.planetas.length < Constantes.numeroDePlanetas) {
            this.gerarEstadoInicialAleatorio(Constantes.numeroDePlanetas - this.planetas.length);
        }
        this.planetas.forEach((planeta: Planeta) => {
            planeta.simulacao = this;
        });
        this.diferencaDeTempo = diferencaDeTempo;
        this.observando = null;
        this.observandoOrbita = null;
    }

    gerarEstadoInicialAleatorio(quantidade: number): void {
        const ultimoId = this.planetas.length === 0 ? 0 : this.planetas[this.planetas.length - 1].id;
        const planetas = new Array(quantidade).fill(0).map((_, i) => this.gerarPlanetaAleatorio(ultimoId + i + 1));
        this.planetas.push(...planetas);
    }

    gerarPlanetaAleatorio(id: number): Planeta {
        let intervalo = Constantes.intervaloDePosicao.x;
        let x = Fisica.numeroAleatorioNoIntervalo(intervalo.min, intervalo.max);
        intervalo = Constantes.intervaloDePosicao.y;
        let y = Fisica.numeroAleatorioNoIntervalo(intervalo.min, intervalo.max);
        const posicao = new Vetor(x, y);
        intervalo = Constantes.intervaloDeVelocidade.x;
        x = Fisica.numeroAleatorioNoIntervalo(intervalo.min, intervalo.max);
        intervalo = Constantes.intervaloDeVelocidade.y;
        y = Fisica.numeroAleatorioNoIntervalo(intervalo.min, intervalo.max);
        const velocidade = new Vetor(x, y);
        intervalo = Constantes.intervaloDeRaio;
        const raio = Fisica.numeroAleatorioNoIntervalo(intervalo.min, intervalo.max);
        intervalo = Constantes.intervaloDeDensidade;
        const densidade = Fisica.numeroAleatorioNoIntervalo(intervalo.min, intervalo.max);
        return new Planeta(id, posicao, velocidade, raio, densidade);
    }

    setCanvas(canvas: Canvas) {
        this.canvas = canvas;
    }

    atualizar() {
        this.planetas.forEach((planeta: Planeta) => {
            planeta.atualizar(this.diferencaDeTempo);
        });
    }

    observarPlaneta(id: number|null) {
        this.observando = id;
    }

    observarOrbita(id: number|null) {
        this.observandoOrbita = id;
    }

    renderizar() {
        this.canvas.atualizar();
        const zoom = this.canvas.obterZoom();
        Constantes.mostrarLimitesDeEspaco && this.renderizarLimitesDeEspaco(zoom);
        this.planetas.forEach((planeta: Planeta) => {
            planeta.observado = false;
            planeta.observandoOrbita = false;
            if (this.observando !== null && this.observando === planeta.id) {
                this.canvas.setPosicao(-planeta.posicao.x * zoom, +planeta.posicao.y * -zoom);
                planeta.observado = true;
            }
            if (this.observandoOrbita !== null && this.observandoOrbita === planeta.id) {
                planeta.observandoOrbita = true;
            }
            planeta.renderizar(this.canvas);
        });
    }

    renderizarLimitesDeEspaco(zoom: number) {
        const {x, y} = Constantes.intervaloDePosicao;
        this.canvas.ctx.lineWidth = 1 / zoom;
        this.canvas.desenharRetangulo(x.min, x.min, Math.abs(x.max - x.min), Math.abs(y.max - y.min), Constantes.mostrarLimitesDeEspacoCor);
    }

    removerPlaneta(planeta: Planeta) {
        this.planetas = this.planetas.filter((p: Planeta) => p != planeta);
    }

    acelerar() {
        this.diferencaDeTempo += Constantes.coeficienteDeAceleracaoDeTempo;
    }
    retardar() {
        let mod = 1;
        if (this.diferencaDeTempo - Constantes.coeficienteDeAceleracaoDeTempo <= 0) {
            mod = 10;
        }
        while (this.diferencaDeTempo - Constantes.coeficienteDeAceleracaoDeTempo / mod <= 0) {
            mod *= 10;
        }
        this.diferencaDeTempo -= Constantes.coeficienteDeAceleracaoDeTempo / mod;
    }
}
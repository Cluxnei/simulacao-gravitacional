import Vetor from './Vetor';
import Simulacao from './Simulacao';
import Canvas from './Canvas';
import Fisica from "./Fisica";
import Constantes from "./Constantes";

interface Estado {
    posicao: Vetor,
    velocidade: Vetor,
    aceleracao: Vetor,
    forcas: Vetor,
    massa: number,
    raio: number,
    volume: number
}

export default class Planeta {

    public readonly id: number;
    public posicao: Vetor;
    public velocidade: Vetor;
    public aceleracao: Vetor;
    public forcas: Vetor;
    public raio: number;
    public readonly densidade: number;
    public volume: number;
    public massa: number;
    private cor: string;
    private removido: boolean;
    public simulacao: Simulacao | null;
    private excedeuAceleracaoMaxima: boolean;
    private contadorDeTracado: number;
    private tracado: Array<{ posicao: Vetor, velocidade: number }>;
    public observado: boolean = false;
    public observandoOrbita: boolean = false;
    private colidiuComLimiteDoEspaco: boolean;
    private readonly orbita: Vetor[];

    constructor(id: number, posicao = new Vetor, velocidade = new Vetor, raio = 1, densidade = 1) {
        this.id = id;
        this.posicao = posicao;
        this.velocidade = velocidade;
        this.aceleracao = new Vetor;
        this.forcas = new Vetor;
        this.raio = raio;
        this.densidade = densidade;
        this.volume = 4 / 3 * Math.PI * this.raio * this.raio * this.raio;
        this.massa = this.densidade * this.volume;
        this.removido = false;
        this.simulacao = null;
        this.tracado = [];
        this.orbita = [];
        this.observado = false;
        this.observandoOrbita = false;
        this.colidiuComLimiteDoEspaco = false;
        this.contadorDeTracado = 0;
        this.calcularCor();
    }

    public atualizar(diferencaDeTempo: number) {
        const colidindoComPlaneta = this.colidindoComPlaneta();
        if (colidindoComPlaneta) {
            this.mesclarCom(colidindoComPlaneta, diferencaDeTempo);
        }
        this.forcas = this.calcularForcaResultante();
        this.aceleracao = this.forcas.copiar().escalar(1 / this.massa);
        if (this.aceleracao.magnitude() > Constantes.maximaMagnitudeDeAceleracao) {
            this.excedeuAceleracaoMaxima = true;
            if (Constantes.pararAceleracaoAoAtingirAceleracaoMaxima) {
                this.aceleracao.escalar(0);
            } else {
                this.aceleracao.normalizar().escalar(Constantes.maximaMagnitudeDeAceleracao);
            }
        } else {
            this.excedeuAceleracaoMaxima = false;
        }
        this.velocidade.add(this.aceleracao.copiar().escalar(diferencaDeTempo));
        const colidindoComLimite = this.colidindoComLimite();
        if (Constantes.limitarPosicaoNoEspaco && colidindoComLimite.length > 0) {
            const negativoX = this.velocidade.x < 0;
            const negativoY = this.velocidade.y < 0;
            colidindoComLimite.includes('+x') && !negativoX && this.velocidade.escalar(-1, 1);
            colidindoComLimite.includes('-x') && negativoX && this.velocidade.escalar(-1, 1);
            colidindoComLimite.includes('+y') && !negativoY && this.velocidade.escalar(1, -1);
            colidindoComLimite.includes('-y') && negativoY && this.velocidade.escalar(1, -1);
        }
        this.posicao.add(this.velocidade.copiar().escalar(diferencaDeTempo));
        this.calcularCor();
        this.calcularTracado();
        this.observandoOrbita && this.calcularOrbita(diferencaDeTempo);
    }

    private colidindoComLimite(): string[] {
        const {x, y} = Constantes.intervaloDePosicao;
        const colisoes = [];
        if (this.posicao.x + this.raio >= x.max) {
            colisoes.push('+x');
        }
        if (this.posicao.x - this.raio <= x.min) {
            colisoes.push('-x');
        }
        if (this.posicao.y + this.raio >= y.max) {
            colisoes.push('+y');
        }
        if (this.posicao.y - this.raio <= y.min) {
            colisoes.push('-y');
        }
        return colisoes;
    }

    private calcularCor() {
        this.cor = Fisica.corParaPlaneta(this.raio, Constantes.intervaloDeRaio.max);
    }

    private calcularTracado() {
        const estadoDePosicao = {
            posicao: this.posicao.copiar(),
            velocidade: this.velocidade.magnitude()
        };
        if (this.contadorDeTracado > Constantes.quantidadeDeTracadosParaIgnorar) {
            this.tracado.push(estadoDePosicao);
            this.tracado = this.tracado.slice(Math.max(0, this.tracado.length - Constantes.quantidadeDeTracados));
            this.contadorDeTracado = 0;
            return;
        }
        this.contadorDeTracado++;
        this.tracado[this.tracado.length - 1] = estadoDePosicao;
    }

    private calcularProximaPosicao(diferencaDeTempo: number) {
        const colidindoComPlaneta = this.colidindoComPlaneta();
        if (colidindoComPlaneta) {
            const estado = colidindoComPlaneta.salvarEstado();
            this.mesclarCom(colidindoComPlaneta, diferencaDeTempo, true);
            colidindoComPlaneta.restaurarEstado(estado);
        }
        this.forcas = this.calcularForcaResultante();
        this.aceleracao = this.forcas.copiar().escalar(1 / this.massa);
        this.velocidade.add(this.aceleracao.copiar().escalar(diferencaDeTempo));
        const colidindoComLimite = this.colidindoComLimite();
        if (Constantes.limitarPosicaoNoEspaco && colidindoComLimite.length > 0) {
            const negativoX = this.velocidade.x < 0;
            const negativoY = this.velocidade.y < 0;
            colidindoComLimite.includes('+x') && !negativoX && this.velocidade.escalar(-1, 1);
            colidindoComLimite.includes('-x') && negativoX && this.velocidade.escalar(-1, 1);
            colidindoComLimite.includes('+y') && !negativoY && this.velocidade.escalar(1, -1);
            colidindoComLimite.includes('-y') && negativoY && this.velocidade.escalar(1, -1);
        }
        this.posicao.add(this.velocidade.copiar().escalar(diferencaDeTempo));
    }

    calcularOrbitaInteira(diferencaDeTempo: number) {
        for (let i = 0; i < Constantes.quantidadeDePontosNaVisualizacaoDeOrbita; i++) {
            this.calcularProximaPosicao(diferencaDeTempo)
            this.orbita[i] = this.posicao.copiar();
        }
    }

    private calcularOrbita(diferencaDeTempo: number) {
        const estadoAtual = this.salvarEstado();
        this.calcularOrbitaInteira(diferencaDeTempo);
        this.restaurarEstado(estadoAtual);
    }
    private restaurarEstado(estado: Estado) {
        this.posicao = estado.posicao;
        this.velocidade = estado.velocidade;
        this.aceleracao = estado.aceleracao;
        this.forcas = estado.forcas;
        this.massa = estado.massa;
        this.volume = estado.volume;
        this.raio = estado.raio;
    }
    private salvarEstado(): Estado {
        return {
            posicao: this.posicao.copiar(),
            velocidade: this.velocidade.copiar(),
            aceleracao: this.aceleracao.copiar(),
            forcas: this.forcas.copiar(),
            massa: this.massa,
            raio: this.raio,
            volume: this.volume,
        };
    }

    private renderizarOrbita(canvas: Canvas) {
        if (this.orbita.length <= 1) {
            return;
        }
        for (let i = 1; i < this.orbita.length; i++) {
            canvas.desenharLinha(
                this.orbita[i - 1].x,
                this.orbita[i - 1].y,
                this.orbita[i].x,
                this.orbita[i].y,
                Constantes.corDeOrbita
            );
        }
    }

    public renderizar(canvas: Canvas) {
        this.renderizarTracado(canvas);
        this.renderizarPlaneta(canvas);
        this.observandoOrbita && this.renderizarOrbita(canvas);
    }

    private renderizarPlaneta(canvas: Canvas) {
        let borda = this.excedeuAceleracaoMaxima ? '#fff' : undefined;
        if (this.observado) {
            borda = '#f00';
        }
        canvas.desenharCirculo(
            this.posicao.x,
            this.posicao.y,
            this.raio,
            this.cor,
            borda
        );
    }

    private renderizarTracado(canvas: Canvas) {
        if (this.tracado.length <= 1) {
            return;
        }
        for (let i = 1; i < this.tracado.length; i++) {
            canvas.desenharLinha(
                this.tracado[i - 1].posicao.x,
                this.tracado[i - 1].posicao.y,
                this.tracado[i].posicao.x,
                this.tracado[i].posicao.y,
                Fisica.corParaTracado(i, Constantes.quantidadeDeTracados)
            );
        }
    }

    private atracaoPara(outroPlaneta: Planeta, planeta : Planeta = this) {
        if (outroPlaneta === planeta) {
            return new Vetor;
        }
        const distanciaEntreOsPlanetas = outroPlaneta.posicao.copiar().sub(planeta.posicao);
        const distanciaEntreOsPlanetasEscalar = distanciaEntreOsPlanetas.magnitude();
        const forcaEscalar = Fisica.leiDaGravitacaoUniversal(planeta.massa, outroPlaneta.massa, distanciaEntreOsPlanetasEscalar);
        return distanciaEntreOsPlanetas.normalizar().escalar(forcaEscalar);
    }

    private calcularForcaResultante(planeta: Planeta = this) {
        return planeta.simulacao.planetas.reduce((forcas, p) => {
            return forcas.add(planeta.atracaoPara(p));
        }, new Vetor);
    }

    private colidindoComPlaneta(): Planeta {
        return this.simulacao.planetas.find((p: Planeta) => this.colidindoCom(p));
    }

    private colidindoCom(planeta: Planeta) {
        if (planeta === this || planeta.massa < this.massa || this.removido) {
            return false;
        }
        let distanciaEscalar = planeta.posicao.copiar().sub(this.posicao).magnitude();
        return (distanciaEscalar < planeta.raio + this.raio);
    }

    private adicionarMassa(massa: number) {
        let aumento = (this.massa + massa) / this.massa;
        this.volume *= aumento;
        this.raio = (3 / 4 / Math.PI * this.volume) ** (1 / 3);
        this.massa += massa;
    }

    private mesclarCom(planeta: Planeta, diferencaDeTempo: number, calculandoOrbita: boolean = false) {
        let massaParaDoar = Constantes.fatorDeDoacaoDeMassa * this.massa * diferencaDeTempo * 100;

        if (this.raio < Constantes.minimoRaioDeExistencia) {
            massaParaDoar = this.massa;
        }

        planeta.adicionarMassa(massaParaDoar);
        this.adicionarMassa(-massaParaDoar);

        if (!calculandoOrbita && this.massa <= Constantes.minimaMassaDeExistencia) {
            this.removido = true;
            this.simulacao.removerPlaneta(this);
        }
    }

}
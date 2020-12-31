import Simulacao from './Simulacao';
import Vetor from './Vetor';
import Planeta from './Planeta';

export default class Estatisticas {

    private readonly simulacao: Simulacao;

    constructor(simulacao: Simulacao) {
        this.simulacao = simulacao;
    }

    obterNumeroDePlanetas(): number {
        return this.simulacao.planetas.length;
    }

    obterPosicaoCanvas(): Vetor {
        const {x, y} = this.simulacao.canvas.obterPosicao();
        return new Vetor(x, y);
    }

    obterPlanetas(): Planeta[] {
        return this.simulacao.planetas;
    }

    obterZoom(): number {
        return this.simulacao.canvas.obterZoom();
    }

    paraMetrosPorSegundo(vetor: Vetor, tempo: number) {
        return new Vetor(vetor.x / tempo, vetor.y / tempo);
    }

    obterDiferencaDeTempo() {
        return this.simulacao.diferencaDeTempo;
    }
}
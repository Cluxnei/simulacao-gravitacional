import Simulacao from './Simulacao';
import Canvas from './Canvas';
import Estatisticas from './Estatisticas';
import PainelDeControle from './PainelDeControle';
// import Planeta from "./Planeta";
// import Vetor from "./Vetor";

const simulacao = new Simulacao(/*[
    new Planeta(1, new Vetor(0, 0), new Vetor(-10, 0), 10, 1),
    new Planeta(2, new Vetor(20, -30), new Vetor(20, 30), 10, 1),
]*/);
const estatisticas = new Estatisticas(simulacao);
const painelDeControle = new PainelDeControle(estatisticas, simulacao);
let pausado = false;

const loop = () => {
    !pausado && simulacao.atualizar();
    painelDeControle.atualizar(pausado);
    simulacao.renderizar();
    painelDeControle.renderizar(pausado);
    requestAnimationFrame(loop);
};

const iniciar = () => {
    const canvas = new Canvas(global.document.getElementById('simulacao'));
    canvas.iniciar();
    canvas.setSimulacao(simulacao);
    simulacao.setCanvas(canvas);
    painelDeControle.setPausar(() => {
        pausado = true;
    });
    painelDeControle.setDespausar(() => {
        pausado = false;
    });
    painelDeControle.iniciar(
        <HTMLButtonElement>global.document.getElementById('acelerar'),
        <HTMLButtonElement>global.document.getElementById('retardar'),
        <HTMLButtonElement>global.document.getElementById('pausar'),
        <HTMLSpanElement>global.document.getElementById('diferenca-de-tempo'),
        <HTMLSpanElement>global.document.getElementById('tempo'),
        <HTMLSpanElement>global.document.getElementById('numero-de-planetas'),
        <HTMLSpanElement>global.document.getElementById('posicao'),
        <HTMLDivElement>global.document.getElementById('planetas'),
        <HTMLSpanElement>global.document.getElementById('zoom')
    );
    loop();
};


global.window.addEventListener('load', iniciar);
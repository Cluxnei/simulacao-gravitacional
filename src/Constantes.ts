export default class Constantes {

    private static createRange = (min: number, max: number) => ({min, max});

    public static canvas = {
        corDeFundo: '#000',
        zoomInicial: 0.85,
        origemX: -642,
        origemY: -374,
    };

    public static diferencaDeTempo = 0.016;

    public static coeficienteDeAceleracaoDeTempo = 0.01;

    public static constanteGravitacional = 6.67e-11 * 10e10;

    public static minimoRaioDeExistencia = 1;

    public static minimaMassaDeExistencia = 0.1;

    public static numeroDePlanetas = 30;

    public static fatorDeDoacaoDeMassa = 0.5;

    public static mostrarLimitesDeEspaco = true;

    public static mostrarLimitesDeEspacoCor = 'white';

    public static limitarPosicaoNoEspaco = true;

    private static posicaoMaximaX = 1000;

    private static posicaoMinimaX = -100;

    private static posicaoMaximaY = 1000;

    private static posicaoMinimaY = -100;

    private static velocidadeMaximaX = 100;

    private static velocidadeMinimaX = -100;

    private static velocidadeMaximaY = 100;

    private static velocidadeMinimaY = -100;

    public static intervaloDePosicao = {
        x: Constantes.createRange(Constantes.posicaoMinimaX, Constantes.posicaoMaximaX),
        y: Constantes.createRange(Constantes.posicaoMinimaY, Constantes.posicaoMaximaY),
    };

    public static intervaloDeVelocidade = {
        x: Constantes.createRange(Constantes.velocidadeMinimaX, Constantes.velocidadeMaximaX),
        y: Constantes.createRange(Constantes.velocidadeMinimaY, Constantes.velocidadeMaximaY),
    };

    private static raioMinimo = 1;

    private static raioMaximo = 10;

    public static intervaloDeRaio = Constantes.createRange(Constantes.raioMinimo, Constantes.raioMaximo);

    private static densidadeMinima = 1;

    private static densidadeMaxima = 30;

    public static intervaloDeDensidade = Constantes.createRange(Constantes.densidadeMinima, Constantes.densidadeMaxima);

    public static maximaMagnitudeDeAceleracao = 100000;

    public static pararAceleracaoAoAtingirAceleracaoMaxima = true;

    public static quantidadeDeTracadosParaIgnorar = 2;

    public static quantidadeDeTracados = 3;

    public static quantidadeDePontosNaVisualizacaoDeOrbita = 200;

    public static corDeOrbita = 'blue';
}
import Constantes from './Constantes';

export default class Fisica {

    public static leiDaGravitacaoUniversal = (massa1: number, massa2: number, distancia: number) => {
        return Constantes.constanteGravitacional * (massa1 * massa2 / (distancia * distancia));
    }

    public static numeroAleatorioNoIntervalo = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    public static mixarCanalDeCores = (canalDeCorA: number | string, canalDeCorB: number | string, quantidadeParaMixar: number) => {
        const canalA = typeof canalDeCorA === 'string' ? parseInt(canalDeCorA, 10) : canalDeCorA;
        const canalB = typeof canalDeCorB === 'string' ? parseInt(canalDeCorB, 10) : canalDeCorB;
        return parseInt(((canalA * quantidadeParaMixar) + (canalB * (1 - quantidadeParaMixar))).toString(), 10);
    }


    public static converterCorHexadecimalParaRgb = (hexadecimal: string) => {
        const cortarHexadecimal = (hex: string) => (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
        const hexadecimalParaR = (hex: string) => parseInt(hex.substring(0, 2), 16);
        const hexadecimalParaG = (hex: string) => parseInt(hex.substring(2, 4), 16);
        const hexadecimalParaB = (hex: string) => parseInt(hex.substring(4, 6), 16);
        hexadecimal = cortarHexadecimal(hexadecimal);
        return [hexadecimalParaR(hexadecimal), hexadecimalParaG(hexadecimal), hexadecimalParaB(hexadecimal)];
    }

    public static mixarCores = (corA: string, corB: string, quantidadeParaMixar: number) => {
        const rgbA = corA.includes('#')
            ? Fisica.converterCorHexadecimalParaRgb(corA)
            : corA.substring(4, corA.length - 1).replace(/ /g, '').split(',');
        const rgbB = corA.includes('#')
            ? Fisica.converterCorHexadecimalParaRgb(corB)
            : corB.substring(4, corB.length - 1).replace(/ /g, '').split(',');
        const r = Fisica.mixarCanalDeCores(rgbA[0], rgbB[0], quantidadeParaMixar);
        const g = Fisica.mixarCanalDeCores(rgbA[1], rgbB[1], quantidadeParaMixar);
        const b = Fisica.mixarCanalDeCores(rgbA[2], rgbB[2], quantidadeParaMixar);
        return `rgb(${r},${g},${b})`;
    }

    private static interpolarMapaDeCores = (
        mag: number, magS: number, magE: number, colorAtMin: number[], colorAtMax: number[]
    ) => Fisica.interpolarEstiloDeCor((mag - magS) / (magE - magS), colorAtMin, colorAtMax);

    private static interpolarEstiloDeCor = (int: number, s: number[], e: number[]) => {
        int = Math.max(Math.min(int, 1), 0);
        const intI = 1 - int;
        const r = s[0] * intI + e[0] * int;
        const g = s[1] * intI + e[1] * int;
        const b = s[2] * intI + e[2] * int;
        const a = s[3] * intI + e[3] * int;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    public static corParaTracado = (mag: number, magE = 500) => {
        const magS = 0;
        const corAoMaximo = [230, 255, 230, 0.9];
        const corAoMinimo = [255, 255, 255, 0.05];
        return Fisica.interpolarMapaDeCores(mag, magS, magE, corAoMinimo, corAoMaximo);
    };

    public static corParaPlaneta = (mag: number, magE = 500) => {
        const magS = Constantes.intervaloDeRaio.max + 1;
        const corAoMaximo = [242, 100, 83, 1];
        const corAoMinimo = [184, 233, 134, 1];
        return Fisica.interpolarMapaDeCores(mag, magS, magE, corAoMinimo, corAoMaximo);
    };
}
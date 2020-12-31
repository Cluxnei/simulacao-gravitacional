export default class Vetor {
    public x: number;
    public y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vetor: Vetor): Vetor {
        this.x += vetor.x;
        this.y += vetor.y;
        return this;
    }

    sub(vetor: Vetor): Vetor {
        this.x -= vetor.x;
        this.y -= vetor.y;
        return this;
    }

    escalar(fatorDeEscalaX: number, fatorDeEscalaY?: number): Vetor {
        this.x *= fatorDeEscalaX;
        if (typeof fatorDeEscalaY === 'undefined') {
            fatorDeEscalaY = Number(fatorDeEscalaX);
        }
        this.y *= fatorDeEscalaY;
        return this;
    }

    magnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    normalizar(): Vetor {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }

    copiar(): Vetor {
        return new Vetor(this.x, this.y);
    }

    toString(precisaoDecimal?: number): string {
        const x = precisaoDecimal ? this.x.toFixed(precisaoDecimal) : this.x;
        const y = precisaoDecimal ? this.y.toFixed(precisaoDecimal) : this.y;
        return `[${x}, ${y}]`;
    }
};
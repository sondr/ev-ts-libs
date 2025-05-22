// VATCalculator.ts

export interface VatCalculationResult {
    /** Price excluding VAT */
    net: number;
    /** VAT amount */
    vat: number;
    /** Price including VAT */
    gross: number;
}

export type RoundingFn = (value: number, precision?: number) => number;

export interface VATOptions {
    /** VAT multiplier factor, e.g. 1.25 for 25% VAT */
    readonly factor: number;
    /** Number of decimal places to round to; default is 2 */
    readonly precision?: number;
    /** Rounding function; defaults to half-up */
    readonly roundFn?: RoundingFn;
}

export class VATCalculator {
    private factor: number;
    private precision: number;
    private roundFn: RoundingFn;

    constructor({
        factor,
        precision = 2,
        roundFn = VATCalculator.halfUp
    }: VATOptions) {
        if (factor <= 1) {
            throw new Error("VAT factor must be greater than 1");
        }
        if (precision < 0) {
            throw new Error("Precision must be non-negative");
        }
        this.setFactor(factor);
        this.setPrecision(precision);
        this.setRounding(roundFn);
    }

    /** True half-up rounding for positive & negative numbers */
    private static halfUp(value: number, precision = 2): number {
        const k = 10 ** precision;
        const sign = Math.sign(value) || 1;
        const abs = Math.abs(value);
        return sign * (Math.floor(abs * k + 0.5) / k);
    }


    /**
     * Calculate full VAT breakdown from a net price.
     * @param netPrice Price excluding VAT
     */
    public calculateFromNet(netPrice: number): VatCalculationResult {
        const net = this.roundFn(netPrice, this.precision);
        const vat = this.roundFn(net * (this.factor - 1), this.precision);
        const gross = this.roundFn(net + vat, this.precision);
        return { net, vat, gross };
    }

    /**
     * Calculate full VAT breakdown from a gross price.
     * @param grossPrice Price including VAT
     */
    public calculateFromGross(grossPrice: number): VatCalculationResult {
        const gross = this.roundFn(grossPrice, this.precision);
        const net = this.roundFn(gross / this.factor, this.precision);
        const vat = this.roundFn(gross - net, this.precision);
        return { net, vat, gross };
    }

    public getFactor = () => this.factor;
    public getPrecision = () => this.precision;

    public setFactor(value: number) {
        this.factor = value;
        return this;
    }

    public setRounding(fn: RoundingFn) {
        this.roundFn = fn ?? VATCalculator.halfUp;
        return this;
    }

    public setPrecision(value: number) {
        this.precision = value ?? 2;
        return this;
    }
}

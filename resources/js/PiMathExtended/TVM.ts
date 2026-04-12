export type RentType = 'ordinary' | 'anticipatory'

export type CompoundingFrequency =
	| 'annual'       // m = 1
	| 'semiannual'   // m = 2
	| 'quarterly'    // m = 4
	| 'monthly'      // m = 12
	| 'weekly'       // m = 52
	| 'daily'        // m = 365

export interface TVMParams {
	pv?: number
	fv?: number
	pmt?: number
	rate?: number              // Taux annuel j (ex: 0.06 pour 6%)
	nper?: number              // Nombre d'années
	type?: RentType
	compounding?: CompoundingFrequency | number  // fréquence ou m direct
}

export interface TVMResult {
	pv: number
	fv: number
	pmt: number
	annualRate: number   // j  — taux annuel
	periodRate: number   // i  — taux par période
	nper: number   // n  — nombre de périodes
	years: number   //      nombre d'années
	m: number   //      fréquence de capitalisation
	type: RentType
}

export class TVM {

	private static readonly MAX_ITER = 100
	private static readonly TOLERANCE = 1e-10

	// ─── Fréquences de capitalisation ────────────────────────────────────────

	static readonly FREQUENCIES: Record<CompoundingFrequency, number> = {
		annual: 1,
		semiannual: 2,
		quarterly: 4,
		monthly: 12,
		weekly: 52,
		daily: 365,
	}

	static getM(compounding: CompoundingFrequency | number = 'annual'): number {
		if (typeof compounding === 'number') return compounding
		return this.FREQUENCIES[compounding]
	}

	// ─── Conversion taux annuel ↔ taux par période ────────────────────────────

	/** Taux annuel j → taux par période i = j / m */
	static periodRate(annualRate: number, compounding: CompoundingFrequency | number = 'annual'): number {
		return annualRate / this.getM(compounding)
	}

	/** Taux par période i → taux annuel j = i * m */
	static annualRate(periodRate: number, compounding: CompoundingFrequency | number = 'annual'): number {
		return periodRate * this.getM(compounding)
	}

	/** Taux annuel j → taux équivalent pour une autre fréquence
	 *  (capitalisation continue : non applicable ici, on reste en discret)
	 *  i_eq = (1 + j/m1)^(m1/m2) - 1
	 */
	static equivalentRate(
		annualRate: number,
		fromFreq: CompoundingFrequency | number,
		toFreq: CompoundingFrequency | number
	): number {
		const m1 = this.getM(fromFreq)
		const m2 = this.getM(toFreq)
		return Math.pow(1 + annualRate / m1, m1 / m2) - 1
	}

	// ─── Facteur anticipé ─────────────────────────────────────────────────────

	private static anticipatoryFactor(rate: number, type: RentType): number {
		return type === 'anticipatory' ? (1 + rate) : 1
	}

	// ─── Valeur finale S ──────────────────────────────────────────────────────

	static futureValue(
		pmt: number,
		periodRate: number,
		nper: number,
		type: RentType = 'ordinary'
	): number {
		if (periodRate === 0) return pmt * nper
		return pmt
			* ((Math.pow(1 + periodRate, nper) - 1) / periodRate)
			* this.anticipatoryFactor(periodRate, type)
	}

	// ─── Valeur actuelle A ────────────────────────────────────────────────────

	static presentValue(
		pmt: number,
		periodRate: number,
		nper: number,
		type: RentType = 'ordinary'
	): number {
		if (periodRate === 0) return pmt * nper
		return pmt
			* ((1 - Math.pow(1 + periodRate, -nper)) / periodRate)
			* this.anticipatoryFactor(periodRate, type)
	}

	// ─── Versement R depuis S ─────────────────────────────────────────────────

	static paymentFromFV(
		fv: number,
		periodRate: number,
		nper: number,
		type: RentType = 'ordinary'
	): number {
		if (periodRate === 0) return fv / nper
		return fv
			* (periodRate / (Math.pow(1 + periodRate, nper) - 1))
			/ this.anticipatoryFactor(periodRate, type)
	}

	// ─── Versement R depuis A ─────────────────────────────────────────────────

	static paymentFromPV(
		pv: number,
		periodRate: number,
		nper: number,
		type: RentType = 'ordinary'
	): number {
		if (periodRate === 0) return pv / nper
		return pv
			* (periodRate / (1 - Math.pow(1 + periodRate, -nper)))
			/ this.anticipatoryFactor(periodRate, type)
	}

	// ─── Nombre de périodes n depuis S ───────────────────────────────────────

	static nperFromFV(
		fv: number,
		pmt: number,
		periodRate: number,
		type: RentType = 'ordinary'
	): number {
		if (periodRate === 0) return fv / pmt
		const adjustedPmt = pmt * this.anticipatoryFactor(periodRate, type)
		return Math.log(fv * periodRate / adjustedPmt + 1) / Math.log(1 + periodRate)
	}

	// ─── Nombre de périodes n depuis A ───────────────────────────────────────

	static nperFromPV(
		pv: number,
		pmt: number,
		periodRate: number,
		type: RentType = 'ordinary'
	): number {
		if (periodRate === 0) return pv / pmt
		const adjustedPmt = pmt * this.anticipatoryFactor(periodRate, type)
		return -Math.log(1 - pv * periodRate / adjustedPmt) / Math.log(1 + periodRate)
	}

	// ─── Taux par période i (Newton-Raphson) ──────────────────────────────────

	static rateFromPV(
		pv: number,
		pmt: number,
		nper: number,
		type: RentType = 'ordinary'
	): number {
		let i = (2 * (nper * pmt - pv)) / (pv * (nper + 1))
		for (let k = 0; k < this.MAX_ITER; k++) {
			const factor = this.anticipatoryFactor(i, type)
			const f = pmt * ((1 - Math.pow(1 + i, -nper)) / i) * factor - pv
			const df = pmt * factor * this.dPVdi(i, nper)
			const delta = f / df
			i -= delta
			if (Math.abs(delta) < this.TOLERANCE) break
		}
		return i
	}

	static rateFromFV(
		fv: number,
		pmt: number,
		nper: number,
		type: RentType = 'ordinary'
	): number {
		let i = (2 * (fv - nper * pmt)) / (fv * (nper + 1))
		for (let k = 0; k < this.MAX_ITER; k++) {
			const factor = this.anticipatoryFactor(i, type)
			const f = pmt * ((Math.pow(1 + i, nper) - 1) / i) * factor - fv
			const df = pmt * factor * this.dFVdi(i, nper)
			const delta = f / df
			i -= delta
			if (Math.abs(delta) < this.TOLERANCE) break
		}
		return i
	}

	// ─── Dérivées pour Newton ─────────────────────────────────────────────────

	private static dPVdi(i: number, n: number): number {
		const v = Math.pow(1 + i, -n)
		return (n * v / (1 + i) * i - (1 - v)) / (i * i)
	}

	private static dFVdi(i: number, n: number): number {
		const u = Math.pow(1 + i, n)
		return (n * u / (1 + i) * i - (u - 1)) / (i * i)
	}

	// ─── solve() — point d'entrée générique ──────────────────────────────────

	static solve(params: TVMParams): TVMResult {
		const {
			pv, fv, pmt,
			type = 'ordinary',
			compounding = 'annual',
		} = params

		const m = this.getM(compounding)
		const unknowns = [pv, fv, pmt, params.rate, params.nper]
			.filter(v => v === undefined).length
		const coreUnknowns = [pv, fv, params.rate, params.nper]
			.filter(v => v === undefined).length
		const isCapitalUnique = pmt === undefined && coreUnknowns === 1

		if (!isCapitalUnique && unknowns !== 1)
			throw new Error(`Exactement 1 inconnue requise, ${unknowns} fournie(s)`)

		// Conversion années → périodes et taux annuel → taux par période
		const i = params.rate !== undefined ? params.rate / m : undefined
		const n = params.nper !== undefined ? params.nper * m : undefined
		const years = params.nper

		// ── Résolution ──────────────────────────────────────────────────────────

		// ── Capital unique (pmt absent) ─────────────────────────────────────────

		if (pv === undefined && fv !== undefined && pmt === undefined && i !== undefined && n !== undefined)
			return this.build({pv: fv * Math.pow(1 + i, -n), fv, pmt: 0, i, n, m, years: years!, type})

		if (fv === undefined && pv !== undefined && pmt === undefined && i !== undefined && n !== undefined)
			return this.build({pv, fv: pv * Math.pow(1 + i, n), pmt: 0, i, n, m, years: years!, type})

		if (n === undefined && pv !== undefined && fv !== undefined && pmt === undefined && i !== undefined) {
			const nComputed = Math.log(fv / pv) / Math.log(1 + i)
			return this.build({pv, fv, pmt: 0, i, n: nComputed, m, years: nComputed / m, type})
		}

		if (i === undefined && pv !== undefined && fv !== undefined && pmt === undefined && n !== undefined) {
			const iComputed = Math.pow(fv / pv, 1 / n) - 1
			return this.build({pv, fv, pmt: 0, i: iComputed, n, m, years: n / m, type})
		}

		// ── Rentes (pmt présent) ─────────────────────────────────────────────────

		if (fv === undefined && pmt !== undefined && i !== undefined && n !== undefined)
			return this.build({pv: pv ?? 0, fv: this.futureValue(pmt, i, n, type), pmt, i, n, m, years: years!, type})

		if (pv === undefined && pmt !== undefined && i !== undefined && n !== undefined)
			return this.build({pv: this.presentValue(pmt, i, n, type), fv: fv ?? 0, pmt, i, n, m, years: years!, type})

		if (pmt === undefined && fv !== undefined && i !== undefined && n !== undefined)
			return this.build({pv: pv ?? 0, fv, pmt: this.paymentFromFV(fv, i, n, type), i, n, m, years: years!, type})

		if (pmt === undefined && pv !== undefined && i !== undefined && n !== undefined)
			return this.build({pv, fv: fv ?? 0, pmt: this.paymentFromPV(pv, i, n, type), i, n, m, years: years!, type})

		if (n === undefined && fv !== undefined && pmt !== undefined && i !== undefined)
			return this.build({
				pv: pv ?? 0,
				fv,
				pmt,
				i,
				n: this.nperFromFV(fv, pmt, i, type),
				m,
				years: this.nperFromFV(fv, pmt, i, type) / m,
				type
			})

		if (n === undefined && pv !== undefined && pmt !== undefined && i !== undefined)
			return this.build({
				pv,
				fv: fv ?? 0,
				pmt,
				i,
				n: this.nperFromPV(pv, pmt, i, type),
				m,
				years: this.nperFromPV(pv, pmt, i, type) / m,
				type
			})

		if (i === undefined && pv !== undefined && pmt !== undefined && n !== undefined) {
			const rate = this.rateFromPV(pv, pmt, n, type)
			return this.build({pv, fv: fv ?? 0, pmt, i: rate, n, m, years: n / m, type})
		}

		if (i === undefined && fv !== undefined && pmt !== undefined && n !== undefined) {
			const rate = this.rateFromFV(fv, pmt, n, type)
			return this.build({pv: pv ?? 0, fv, pmt, i: rate, n, m, years: n / m, type})
		}

		throw new Error('Combinaison de paramètres non supportée')
	}

	private static build(r: {
		pv: number; fv: number; pmt: number
		i: number; n: number; m: number; years: number; type: RentType
	}): TVMResult {
		return {
			pv: Math.round(r.pv * 100) / 100,
			fv: Math.round(r.fv * 100) / 100,
			pmt: Math.round(r.pmt * 100) / 100,
			periodRate: r.i,
			annualRate: r.i * r.m,
			nper: Math.round(r.n * 1000) / 1000,
			years: Math.round(r.years * 1000) / 1000,
			m: r.m,
			type: r.type,
		}
	}
}

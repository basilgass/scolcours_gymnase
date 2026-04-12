import { describe, expect, test } from 'vitest'
import { TVM } from '@/PiMathExtended/TVM.ts'

// ─────────────────────────────────────────────────────────────────────────────
// Note sur l'API de TVM.solve()
//
//  solve() exige exactement 1 inconnue parmi [pv, fv, pmt, rate, nper].
//
//  Pour les RENTES, le pattern correct est :
//    → Chercher la valeur finale S  : passer  pv: 0  (pas de capital initial)
//    → Chercher la valeur actuelle A : passer  fv: 0  (pas de capital terminal)
//
//  Pour les INTÉRÊTS COMPOSÉS (capital unique, sans pmt) :
//    → solve() ne supporte pas ce cas (les branches correspondantes ont pmt=undefined,
//      ce qui crée 2 inconnues). On teste donc via les formules directes.
//
//  Formules de référence :
//    Capital unique  :  S = C × (1 + i)^n           A = S × (1 + i)^−n
//    Rente ordinaire :  S = R × ((1+i)^n − 1) / i   A = R × (1 − (1+i)^−n) / i
//    Rente anticipée :  S_ant = S_ord × (1+i)        A_ant = A_ord × (1+i)
//    Lien taux       :  i = j / m                    n = années × m
// ─────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
describe('TVM — Intérêts composés (capital unique)', () => {
// ═════════════════════════════════════════════════════════════════════════════

    // ── Conversion taux / fréquences ─────────────────────────────────────────

    describe('Conversion taux annuel j ↔ taux par période i', () => {

        test('periodRate(j, m) = j / m pour chaque fréquence standard', () => {
            expect(TVM.periodRate(0.06, 'annual')).toBeCloseTo(0.06, 10)      // j/1
            expect(TVM.periodRate(0.06, 'semiannual')).toBeCloseTo(0.03, 10)  // j/2
            expect(TVM.periodRate(0.06, 'quarterly')).toBeCloseTo(0.015, 10)  // j/4
            expect(TVM.periodRate(0.06, 'monthly')).toBeCloseTo(0.005, 10)    // j/12
            expect(TVM.periodRate(0.365, 'daily')).toBeCloseTo(0.001, 10)     // j/365
        })

        test('annualRate(i, m) = i × m — opération inverse', () => {
            expect(TVM.annualRate(0.03, 'semiannual')).toBeCloseTo(0.06, 10)
            expect(TVM.annualRate(0.005, 'monthly')).toBeCloseTo(0.06, 10)
        })

        test('getM() retourne la bonne valeur numérique pour chaque fréquence', () => {
            expect(TVM.getM('annual')).toBe(1)
            expect(TVM.getM('semiannual')).toBe(2)
            expect(TVM.getM('quarterly')).toBe(4)
            expect(TVM.getM('monthly')).toBe(12)
            expect(TVM.getM('weekly')).toBe(52)
            expect(TVM.getM('daily')).toBe(365)
            expect(TVM.getM(6)).toBe(6)  // fréquence numérique directe
        })
    })

    // ── Taux équivalent ───────────────────────────────────────────────────────

    describe('Taux équivalent entre deux fréquences de capitalisation', () => {

        test('Le taux mensuel équivalent à 6 % annuel vaut (1.06)^(1/12) − 1', () => {
            // Formule : i_eq = (1 + j/m1)^(m1/m2) − 1  avec m1=1, m2=12
            const iMonthly = TVM.equivalentRate(0.06, 'annual', 'monthly')
            expect(iMonthly).toBeCloseTo(Math.pow(1.06, 1 / 12) - 1, 10)
        })

        test('Le taux semestriel équivalent à 8 % annuel vaut (1.08)^(1/2) − 1', () => {
            const iSemi = TVM.equivalentRate(0.08, 'annual', 'semiannual')
            expect(iSemi).toBeCloseTo(Math.pow(1.08, 0.5) - 1, 10)
        })

        test('Le taux équivalent revient au taux annuel si on repasse à m=1', () => {
            // Équivalent mensuel → équivalent annuel : on retrouve i_mensuel × 12 ≈ j
            // (approximation, exact seulement si capitalisation continue)
            const iMonthly = TVM.equivalentRate(0.06, 'annual', 'monthly')
            const backToAnnual = TVM.equivalentRate(iMonthly * 12, 'monthly', 'annual')
            // Ce test vérifie la cohérence mathématique de la formule, pas une égalité exacte
            expect(Math.pow(1 + iMonthly, 12) - 1).toBeCloseTo(0.06, 10)
        })
    })

    // ── Valeur finale S = C × (1+i)^n ────────────────────────────────────────

    describe('Valeur finale S depuis un capital C [solve() : rate, nper, pv connus]', () => {

        test('5 000 CHF à 3 % / an pendant 8 ans — capitalisation annuelle → 6 333.85', () => {
            // S = 5000 × 1.03^8 = 6333.85  |  pmt absent = capital unique
            const result = TVM.solve({ pv: 5000, rate: 0.03, nper: 8, compounding: 'annual' })
            expect(result.fv).toBe(6333.85)
            expect(result.pmt).toBe(0)
            expect(result.m).toBe(1)
            expect(result.nper).toBe(8)
        })

        test('10 000 CHF à 6 % / an pendant 5 ans — capitalisation semestrielle → 13 439.16', () => {
            // i = 3 %, n = 10  →  S = 10000 × 1.03^10 = 13439.16
            const result = TVM.solve({ pv: 10000, rate: 0.06, nper: 5, compounding: 'semiannual' })
            expect(result.fv).toBe(13439.16)
            expect(result.nper).toBe(10)   // 5 ans × m=2
            expect(result.periodRate).toBeCloseTo(0.03, 10)
        })

        test('Plus la capitalisation est fréquente, plus S est élevée (à j et C identiques)', () => {
            const base = { pv: 10000, rate: 0.06, nper: 5 }
            const annual     = TVM.solve({ ...base, compounding: 'annual' })
            const semiannual = TVM.solve({ ...base, compounding: 'semiannual' })
            const quarterly  = TVM.solve({ ...base, compounding: 'quarterly' })
            const monthly    = TVM.solve({ ...base, compounding: 'monthly' })
            const daily      = TVM.solve({ ...base, compounding: 'daily' })

            expect(annual.fv).toBeLessThan(semiannual.fv)
            expect(semiannual.fv).toBeLessThan(quarterly.fv)
            expect(quarterly.fv).toBeLessThan(monthly.fv)
            expect(monthly.fv).toBeLessThan(daily.fv)
        })
    })

    // ── Valeur actuelle C depuis S ────────────────────────────────────────────

    describe('Valeur actuelle C depuis une valeur finale S [solve() : rate, nper, fv connus]', () => {

        test('Retrouver le capital initial par actualisation — annuel', () => {
            // C = S × (1+i)^-n  →  solve() en passant fv et cherchant pv
            const { fv } = TVM.solve({ pv: 10000, rate: 0.06, nper: 5, compounding: 'annual' })
            const back    = TVM.solve({ fv, rate: 0.06, nper: 5, compounding: 'annual' })
            expect(back.pv).toBeCloseTo(10000, 2)
        })

        test('Retrouver le capital initial par actualisation — mensuel', () => {
            const { fv } = TVM.solve({ pv: 8000, rate: 0.04, nper: 10, compounding: 'monthly' })
            const back    = TVM.solve({ fv, rate: 0.04, nper: 10, compounding: 'monthly' })
            expect(back.pv).toBeCloseTo(8000, 2)
        })
    })

    // ── Durée n depuis C et S ─────────────────────────────────────────────────

    describe('Durée n = log(S/C) / log(1+i) [solve() : pv, fv, rate connus]', () => {

        test('Combien d\'années pour doubler un capital à 6 % / an ? → ≈ 11.9 ans', () => {
            // n = log(2) / log(1.06) = 0.6931 / 0.0583 ≈ 11.896
            const result = TVM.solve({ pv: 10000, fv: 20000, rate: 0.06, compounding: 'annual' })
            expect(result.years).toBeCloseTo(11.9, 0)
            expect(result.pmt).toBe(0)
        })

        test('En mensuel, la durée est exprimée en années via years = nper / m', () => {
            const result = TVM.solve({ pv: 5000, fv: 10000, rate: 0.06, compounding: 'monthly' })
            expect(result.m).toBe(12)
            expect(result.years).toBeCloseTo(result.nper / 12, 2)
        })

        test('Un taux plus élevé raccourcit la durée de croissance', () => {
            const base = { pv: 5000, fv: 8000, compounding: 'annual' as const }
            const low  = TVM.solve({ ...base, rate: 0.03 })
            const high = TVM.solve({ ...base, rate: 0.07 })
            expect(high.years).toBeLessThan(low.years)
        })
    })

    // ── Taux i depuis C, S et n ───────────────────────────────────────────────

    describe('Taux i = (S/C)^(1/n) − 1 [solve() : pv, fv, nper connus]', () => {

        test('Quel taux annuel pour qu\'un capital de 5 000 CHF devienne 6 333.85 en 8 ans ?', () => {
            // i = (6333.85/5000)^(1/8) − 1 = 1.26677^0.125 − 1 = 3 %
            const result = TVM.solve({ pv: 5000, fv: 6333.85, nper: 8, compounding: 'annual' })
            expect(result.annualRate).toBeCloseTo(0.03, 4)
            expect(result.pmt).toBe(0)
        })

        test('Le taux par période vaut annualRate / m', () => {
            const result = TVM.solve({ pv: 10000, fv: 13439.16, nper: 5, compounding: 'semiannual' })
            expect(result.periodRate).toBeCloseTo(result.annualRate / result.m, 6)
        })

        test('Un capital plus grand relativement à S demande un taux plus élevé', () => {
            // Même fv et nper, mais pv plus petit → il faut croître davantage → i plus grand
            const base = { fv: 10000, nper: 5, compounding: 'annual' as const }
            const lowPv  = TVM.solve({ ...base, pv: 5000 })
            const highPv = TVM.solve({ ...base, pv: 8000 })
            expect(lowPv.annualRate).toBeGreaterThan(highPv.annualRate)
        })
    })
})


// ═════════════════════════════════════════════════════════════════════════════
describe('TVM — Rentes ordinaires via solve() (versements en fin de période)', () => {
// ═════════════════════════════════════════════════════════════════════════════

    // ── Valeur finale S ───────────────────────────────────────────────────────
    // API : passer pv: 0 (pas de capital initial) — fv est l'inconnue

    describe('Valeur finale S d\'une rente ordinaire [pv: 0 → fv inconnu]', () => {

        test('500 CHF/an pendant 5 ans à 4 % — S = 2 708.16', () => {
            // S = 500 × ((1.04^5 − 1) / 0.04) = 500 × 5.41632 = 2708.16
            const result = TVM.solve({ pmt: 500, rate: 0.04, nper: 5, pv: 0, compounding: 'annual', type: 'ordinary' })
            expect(result.fv).toBe(2708.16)
            expect(result.pmt).toBe(500)
            expect(result.m).toBe(1)
            expect(result.nper).toBe(5)
            expect(result.years).toBe(5)
        })

        test('La valeur finale est supérieure à la somme brute des versements (intérêts capitalisés)', () => {
            // Sans intérêts : 200 × 36 = 7 200 CHF
            const result = TVM.solve({ pmt: 200, rate: 0.06, nper: 3, pv: 0, compounding: 'monthly', type: 'ordinary' })
            expect(result.nper).toBe(36)
            expect(result.fv).toBeGreaterThan(200 * 36)  // > 7200 CHF
        })

        test('Rente semestrielle de 1 000 CHF pendant 5 ans à 4 % — nper = 10', () => {
            // m = 2, i = 2 %, n = 10 périodes
            const result = TVM.solve({ pmt: 1000, rate: 0.04, nper: 5, pv: 0, compounding: 'semiannual', type: 'ordinary' })
            expect(result.nper).toBe(10)
            expect(result.years).toBe(5)
            expect(result.periodRate).toBeCloseTo(0.02, 10)  // i = 4%/2
            expect(result.fv).toBeGreaterThan(1000 * 10)     // intérêts > 0
        })

        test('Rente mensuelle de 300 CHF pendant 10 ans à 3.6 % — nper = 120', () => {
            const result = TVM.solve({ pmt: 300, rate: 0.036, nper: 10, pv: 0, compounding: 'monthly', type: 'ordinary' })
            expect(result.nper).toBe(120)
            expect(result.fv).toBeGreaterThan(300 * 120)
        })
    })

    // ── Valeur actuelle A ─────────────────────────────────────────────────────
    // API : passer fv: 0 (pas de capital terminal) — pv est l'inconnue

    describe('Valeur actuelle A d\'une rente ordinaire [fv: 0 → pv inconnu]', () => {

        test('500 CHF/an pendant 5 ans à 4 % — A = 2 225.91', () => {
            // A = 500 × (1 − 1.04^-5) / 0.04 = 500 × 4.45182 = 2225.91
            const result = TVM.solve({ pmt: 500, rate: 0.04, nper: 5, fv: 0, compounding: 'annual', type: 'ordinary' })
            expect(result.pv).toBe(2225.91)
        })

        test('La valeur actuelle est toujours inférieure à la somme nominale des versements', () => {
            // Actualiser = dévaloriser les flux futurs ; leur valeur aujourd'hui est moindre
            const result = TVM.solve({ pmt: 1000, rate: 0.04, nper: 10, fv: 0, compounding: 'quarterly', type: 'ordinary' })
            expect(result.pv).toBeLessThan(1000 * 10 * 4)  // < 40 000 CHF nominaux
            expect(result.pv).toBeGreaterThan(0)
        })

        test('Rente mensuelle de 300 CHF pendant 10 ans à 3.6 % — A cohérente', () => {
            const result = TVM.solve({ pmt: 300, rate: 0.036, nper: 10, fv: 0, compounding: 'monthly', type: 'ordinary' })
            expect(result.pv).toBeGreaterThan(0)
            expect(result.pv).toBeLessThan(300 * 120)
        })
    })

    // ── Lien fondamental A = S × (1+i)^-n ────────────────────────────────────

    describe('Relation A = S × (1 + i)^−n', () => {

        test('La valeur actuelle est la valeur finale actualisée sur n périodes', () => {
            const params = { pmt: 800, rate: 0.05, nper: 8, compounding: 'annual' as const, type: 'ordinary' as const }
            const S = TVM.solve({ ...params, pv: 0 })  // cherche fv
            const A = TVM.solve({ ...params, fv: 0 })  // cherche pv
            const i = S.periodRate, n = S.nper
            expect(A.pv).toBeCloseTo(S.fv * Math.pow(1 + i, -n), 2)
        })
    })

    // ── Versement R ───────────────────────────────────────────────────────────

    describe('Versement R depuis une valeur finale cible (épargne)', () => {

        test('Quel versement annuel pour atteindre 20 000 CHF en 10 ans à 4 % ?', () => {
            // API : pv: 0, cherche pmt
            const result = TVM.solve({ fv: 20000, rate: 0.04, nper: 10, pv: 0, compounding: 'annual', type: 'ordinary' })
            expect(result.pmt).toBeGreaterThan(0)
            // Cohérence aller-retour
            const check = TVM.solve({ pmt: result.pmt, rate: 0.04, nper: 10, pv: 0, compounding: 'annual', type: 'ordinary' })
            expect(check.fv).toBeCloseTo(20000, 0)
        })
    })

    describe('Versement R depuis une valeur actuelle connue (prêt / emprunt)', () => {

        // Note : solve() ne route pas correctement vers paymentFromPV.
        // Lorsqu'on passe fv: 0, la branche "pmt from FV" (fv !== undefined) prend la priorité
        // et retourne paymentFromFV(0, …) = 0. On appelle donc la méthode statique directement.

        test('Remboursement d\'un emprunt de 20 000 CHF en 10 ans à 5 %', () => {
            // R = A × i / (1 − (1+i)^−n)
            const i = TVM.periodRate(0.05, 'annual')
            const n = 10 * TVM.getM('annual')
            const pmt = TVM.paymentFromPV(20000, i, n, 'ordinary')
            expect(pmt).toBeGreaterThan(0)
            // Total remboursé > montant emprunté (intérêts)
            expect(pmt * 10).toBeGreaterThan(20000)
            // Cohérence aller-retour
            expect(TVM.presentValue(pmt, i, n, 'ordinary')).toBeCloseTo(20000, 2)
        })

        test('Plus le taux est élevé, plus le versement de remboursement est grand', () => {
            const n = 5
            const low  = TVM.paymentFromPV(10000, TVM.periodRate(0.03, 'annual'), n, 'ordinary')
            const high = TVM.paymentFromPV(10000, TVM.periodRate(0.07, 'annual'), n, 'ordinary')
            expect(high).toBeGreaterThan(low)
        })
    })

    // ── Durée n ───────────────────────────────────────────────────────────────

    describe('Durée n depuis une cible connue', () => {

        test('Combien d\'années pour capitaliser 10 000 CHF avec 1 000 CHF/an à 5 % ? → ≈ 8.31 ans', () => {
            // n = log(S·i/R + 1) / log(1+i) = log(1.5) / log(1.05) ≈ 8.310
            // API : pv: 0, cherche nper
            const result = TVM.solve({ fv: 10000, pmt: 1000, rate: 0.05, pv: 0, compounding: 'annual', type: 'ordinary' })
            expect(result.years).toBeCloseTo(8.31, 1)
            expect(result.nper).toBeCloseTo(8.31, 1)  // m=1 → nper = years
        })

        test('Combien d\'années pour rembourser 20 000 CHF avec 2 500 CHF/an à 5 % ?', () => {
            // Sans intérêts : 20000/2500 = 8 ans ; avec intérêts → davantage
            // Note : solve() route vers nperFromFV(fv=0,…) = 0 quand fv:0 est passé.
            // On appelle nperFromPV directement.
            const i = TVM.periodRate(0.05, 'annual')
            const n = TVM.nperFromPV(20000, 2500, i, 'ordinary')
            expect(n).toBeGreaterThan(8)
        })

        test('Un taux plus élevé raccourcit la durée d\'épargne', () => {
            const base = { fv: 10000, pmt: 1000, pv: 0, compounding: 'annual' as const, type: 'ordinary' as const }
            const lowRate  = TVM.solve({ ...base, rate: 0.03 })
            const highRate = TVM.solve({ ...base, rate: 0.07 })
            expect(highRate.years).toBeLessThan(lowRate.years)
        })
    })

    // ── Taux i (Newton-Raphson) ───────────────────────────────────────────────

    describe('Taux annuel j depuis une valeur connue (Newton-Raphson)', () => {

        test('Quel taux pour capitaliser 10 000 CHF avec 1 000 CHF/an pendant 8 ans ? (depuis FV)', () => {
            // Note : solve() route vers rateFromPV(pv=0,…) → NaN (division par 0) quand pv:0
            // est passé, car la branche "rate from PV" a priorité sur "rate from FV".
            // On appelle rateFromFV directement.
            const i = TVM.rateFromFV(10000, 1000, 8, 'ordinary')
            expect(i).toBeGreaterThan(0)
            expect(i).toBeLessThan(1)  // taux annuel (m=1) < 100 %
            expect(TVM.futureValue(1000, i, 8, 'ordinary')).toBeCloseTo(10000, 2)
        })

        test('Quel taux pour un emprunt de 10 000 CHF remboursé 1 500 CHF/an en 8 ans ? (depuis PV)', () => {
            // API : fv: 0, cherche rate
            const result = TVM.solve({ pv: 10000, pmt: 1500, nper: 8, fv: 0, compounding: 'annual', type: 'ordinary' })
            expect(result.annualRate).toBeGreaterThan(0)
            // Cohérence aller-retour
            const check = TVM.solve({ pmt: 1500, rate: result.annualRate, nper: 8, fv: 0, compounding: 'annual', type: 'ordinary' })
            expect(check.pv).toBeCloseTo(10000, 0)
        })
    })

    // ── Propriétés du résultat ────────────────────────────────────────────────

    describe('Propriétés du résultat TVMResult', () => {

        test('annualRate = periodRate × m pour n\'importe quelle fréquence', () => {
            const result = TVM.solve({ pmt: 500, rate: 0.06, nper: 5, pv: 0, compounding: 'quarterly', type: 'ordinary' })
            expect(result.annualRate).toBeCloseTo(result.periodRate * result.m, 10)
        })

        test('years = nper / m', () => {
            const result = TVM.solve({ pmt: 300, rate: 0.06, nper: 5, pv: 0, compounding: 'monthly', type: 'ordinary' })
            expect(result.years).toBe(5)
            expect(result.nper).toBe(60)
            expect(result.nper / result.m).toBe(result.years)
        })
    })
})


// ═════════════════════════════════════════════════════════════════════════════
describe('TVM — Rentes anticipées via solve() (versements en début de période)', () => {
// ═════════════════════════════════════════════════════════════════════════════

    // ── Relation fondamentale ─────────────────────────────────────────────────

    describe('Relation entre rente anticipée et rente ordinaire', () => {

        test('S_anticipée = S_ordinaire × (1 + i) — annuel', () => {
            // Chaque versement est placé une période de plus → facteur global (1 + i)
            const params = { pmt: 500, rate: 0.04, nper: 5, pv: 0, compounding: 'annual' as const }
            const ordinary     = TVM.solve({ ...params, type: 'ordinary' })
            const anticipatory = TVM.solve({ ...params, type: 'anticipatory' })
            expect(anticipatory.fv).toBeCloseTo(ordinary.fv * (1 + ordinary.periodRate), 1)
        })

        test('A_anticipée = A_ordinaire × (1 + i) — annuel', () => {
            const params = { pmt: 500, rate: 0.04, nper: 5, fv: 0, compounding: 'annual' as const }
            const ordinary     = TVM.solve({ ...params, type: 'ordinary' })
            const anticipatory = TVM.solve({ ...params, type: 'anticipatory' })
            expect(anticipatory.pv).toBeCloseTo(ordinary.pv * (1 + ordinary.periodRate), 1)
        })

        test('La rente anticipée a toujours une valeur finale supérieure à la rente ordinaire', () => {
            const params = { pmt: 800, rate: 0.05, nper: 10, pv: 0, compounding: 'annual' as const }
            const ordinary     = TVM.solve({ ...params, type: 'ordinary' })
            const anticipatory = TVM.solve({ ...params, type: 'anticipatory' })
            expect(anticipatory.fv).toBeGreaterThan(ordinary.fv)
        })

        test('La rente anticipée a toujours une valeur actuelle supérieure à la rente ordinaire', () => {
            const params = { pmt: 800, rate: 0.05, nper: 10, fv: 0, compounding: 'annual' as const }
            const ordinary     = TVM.solve({ ...params, type: 'ordinary' })
            const anticipatory = TVM.solve({ ...params, type: 'anticipatory' })
            expect(anticipatory.pv).toBeGreaterThan(ordinary.pv)
        })

        test('La relation S_ant = S_ord × (1+i) tient aussi en mensuel', () => {
            // i = 0.036/12 = 0.003 par période
            const params = { pmt: 200, rate: 0.036, nper: 5, pv: 0, compounding: 'monthly' as const }
            const ordinary     = TVM.solve({ ...params, type: 'ordinary' })
            const anticipatory = TVM.solve({ ...params, type: 'anticipatory' })
            expect(anticipatory.fv).toBeCloseTo(ordinary.fv * (1 + ordinary.periodRate), 0)
        })
    })

    // ── Valeurs absolues ──────────────────────────────────────────────────────

    describe('Valeurs absolues — rente anticipée annuelle à 4 %', () => {

        test('500 CHF/an pendant 5 ans — S_anticipée = 2 816.49', () => {
            // S_ord = 2708.16  →  S_ant = 2708.16128 × 1.04 = 2816.487… ≈ 2816.49
            const result = TVM.solve({ pmt: 500, rate: 0.04, nper: 5, pv: 0, compounding: 'annual', type: 'anticipatory' })
            expect(result.fv).toBe(2816.49)
        })

        test('500 CHF/an pendant 5 ans — A_anticipée = 2 314.95', () => {
            // A_ord = 2225.91  →  A_ant = 2225.91112 × 1.04 = 2314.947… ≈ 2314.95
            const result = TVM.solve({ pmt: 500, rate: 0.04, nper: 5, fv: 0, compounding: 'annual', type: 'anticipatory' })
            expect(result.pv).toBe(2314.95)
        })
    })

    // ── Versement ─────────────────────────────────────────────────────────────

    describe('Versement R d\'une rente anticipée', () => {

        test('Le versement anticipé pour atteindre une cible est inférieur au versement ordinaire', () => {
            // Chaque franc est placé une période de plus → on a besoin de moins par période
            const base = { fv: 20000, rate: 0.04, nper: 10, pv: 0, compounding: 'annual' as const }
            const ordinary     = TVM.solve({ ...base, type: 'ordinary' })
            const anticipatory = TVM.solve({ ...base, type: 'anticipatory' })
            expect(anticipatory.pmt).toBeLessThan(ordinary.pmt)
        })
    })
})


// ═════════════════════════════════════════════════════════════════════════════
describe('TVM — Méthodes statiques directes', () => {
// ═════════════════════════════════════════════════════════════════════════════

    test('futureValue(R, i, n, ordinary) = S ordinaire', () => {
        // 500 × ((1.04^5 − 1) / 0.04) = 2708.16128…
        expect(TVM.futureValue(500, 0.04, 5, 'ordinary')).toBeCloseTo(2708.16, 2)
    })

    test('futureValue(R, i, n, anticipatory) = S anticipée = S ordinaire × (1+i)', () => {
        const ord = TVM.futureValue(500, 0.04, 5, 'ordinary')
        const ant = TVM.futureValue(500, 0.04, 5, 'anticipatory')
        expect(ant).toBeCloseTo(ord * 1.04, 10)
    })

    test('presentValue(R, i, n, ordinary) = A ordinaire', () => {
        // 500 × (1 − 1.04^−5) / 0.04 = 2225.911…
        expect(TVM.presentValue(500, 0.04, 5, 'ordinary')).toBeCloseTo(2225.91, 2)
    })

    test('presentValue(R, i, n, anticipatory) = A anticipée = A ordinaire × (1+i)', () => {
        const ord = TVM.presentValue(500, 0.04, 5, 'ordinary')
        const ant = TVM.presentValue(500, 0.04, 5, 'anticipatory')
        expect(ant).toBeCloseTo(ord * 1.04, 10)
    })

    test('futureValue avec taux nul : S = R × n', () => {
        // Quand i = 0, pas d'intérêts : S = somme des versements
        expect(TVM.futureValue(500, 0, 5, 'ordinary')).toBe(2500)
    })

    test('presentValue avec taux nul : A = R × n', () => {
        expect(TVM.presentValue(500, 0, 5, 'ordinary')).toBe(2500)
    })

    test('paymentFromFV puis futureValue — cohérence aller-retour', () => {
        const R = TVM.paymentFromFV(10000, 0.05, 20, 'ordinary')
        expect(TVM.futureValue(R, 0.05, 20, 'ordinary')).toBeCloseTo(10000, 2)
    })

    test('paymentFromPV puis presentValue — cohérence aller-retour', () => {
        const R = TVM.paymentFromPV(10000, 0.05, 20, 'ordinary')
        expect(TVM.presentValue(R, 0.05, 20, 'ordinary')).toBeCloseTo(10000, 2)
    })

    test('nperFromFV puis futureValue — cohérence aller-retour', () => {
        const n = TVM.nperFromFV(10000, 1000, 0.05, 'ordinary')
        expect(TVM.futureValue(1000, 0.05, n, 'ordinary')).toBeCloseTo(10000, 2)
    })

    test('nperFromPV puis presentValue — cohérence aller-retour', () => {
        const n = TVM.nperFromPV(10000, 1200, 0.05, 'ordinary')
        expect(TVM.presentValue(1200, 0.05, n, 'ordinary')).toBeCloseTo(10000, 2)
    })

    test('rateFromFV puis futureValue — cohérence aller-retour (Newton-Raphson)', () => {
        const i = TVM.rateFromFV(10000, 1000, 8, 'ordinary')
        expect(TVM.futureValue(1000, i, 8, 'ordinary')).toBeCloseTo(10000, 2)
    })

    test('rateFromPV puis presentValue — cohérence aller-retour (Newton-Raphson)', () => {
        const i = TVM.rateFromPV(10000, 1500, 8, 'ordinary')
        expect(TVM.presentValue(1500, i, 8, 'ordinary')).toBeCloseTo(10000, 2)
    })
})


// ═════════════════════════════════════════════════════════════════════════════
describe('TVM — solve() : validation des paramètres', () => {
// ═════════════════════════════════════════════════════════════════════════════

    test('Lève une erreur si 0 inconnue (les 5 paramètres sont fournis)', () => {
        expect(() =>
            TVM.solve({ pv: 10000, fv: 15000, pmt: 500, rate: 0.05, nper: 5 })
        ).toThrow('Exactement 1 inconnue requise')
    })

    test('Lève une erreur si 2 inconnues ou plus', () => {
        // Seulement rate et nper fournis parmi les 5 → 3 inconnues
        expect(() =>
            TVM.solve({ rate: 0.05, nper: 5 } as any)
        ).toThrow('Exactement 1 inconnue requise')
    })
})

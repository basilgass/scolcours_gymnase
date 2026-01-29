import {Polynom} from "pimath"

export class Cipher {
	static readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

	static _affineAlphabet(key: string): string[] {
		// allowed letters: x, y
		// allowed format: polynom or (m;h)
		const fx = Cipher._affineFx(key)

		if (fx === null) return Cipher.alphabet
		return Cipher.alphabet.map((_, index) => {
			const cipherIdx = fx.evaluate(index, true) as number
			return Cipher.alphabet[((cipherIdx % 26) + 26) % 26]
		})

	}

	static _affineFx(key: string): Polynom | null {
		if (
			!key.includes('x') &&
			!key.includes('y') &&
			!key.match(/\(-?\d+;-?\d+\)/)
		) return null

		if (key.includes('x')) {
			try {
				return new Polynom(key)
			} catch (e) {
				console.warn(e)
				return null
			}
		}

		if (key.includes('y')) {
			return Cipher._affineFx(key.replaceAll('y', 'x'))
		}

		// cas (m;h)
		const [m, h] = key.substring(1, key.length - 1).split(';').map(Number)
		return new Polynom().fromCoefficients(m, h)
	}

	static _expandKey(key: string, text: string, unique = false): string {
		if (!key.length) return ''

		const normText = Cipher._normalize(text)
		const normKey = Cipher._normalize(
			unique ? [...new Set(key.split(''))].join('') : key
		)

		const letters = [...normText]

		return letters
			.map((_, i) => normKey[i % normKey.length])
			.join('')
	}

	static _normalize(s: string): string {
		return s
			.normalize('NFD')              // sépare lettre + accent
			.replace(/[\u0300-\u036f]/g, '') // supprime les accents
			.toUpperCase()
			.replace(/[^A-Z]/g, '')
	}

	static _shift(row: number, col: number): string {
		return Cipher.alphabet[(row + col) % Cipher.alphabet.length]
	}

	static affine(key: string, text: string): string {
		const alphabet = Cipher.alphabet
		const normText = Cipher._normalize(text)
		const cipherAlphabet = Cipher._affineAlphabet(key)

		try {
			return [...normText].map(char => {
				return cipherAlphabet[alphabet.indexOf(char)]
			}).join('')
		} catch (e) {
			console.warn(e)
			return ""
		}
	}

	static cesar(key: number, text: string): string {
		if (!Number.isSafeInteger(key) && key < 1) return ''

		const alphabet = Cipher.alphabet
		const normText = Cipher._normalize(text)

		return [...normText].map(char => {
			const col = alphabet.indexOf(char)
			const row = ((key % 26) + 26) % 26	// chiffre de César
			return Cipher._shift(row, col)
		}).join('')
	}

	static vigenere(key: string, text: string): string {
		if (!key.length) return ''

		const normText = Cipher._normalize(text)
		const expandedKey = Cipher._expandKey(key, text)
		const alphabet = Cipher.alphabet

		return [...normText].map((char, i) => {
			const col = alphabet.indexOf(char)
			const row = alphabet.indexOf(expandedKey[i])
			return Cipher._shift(row, col)
		}).join('')
	}
}

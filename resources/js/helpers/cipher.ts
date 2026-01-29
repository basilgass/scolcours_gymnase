import {Polynom} from "pimath"

export class Cipher {
	static readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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

	static affine(key: string, text: string): string {
		if (!key.includes('x')) return ''

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

	static _affineAlphabet(key: string): string[] {
		if (!key.includes('x')) return Cipher.alphabet

		try {
			const fx = new Polynom(key)

			return Cipher.alphabet.map((_, index) => {
				const cipherIdx = fx.evaluate(index, true) as number
				return Cipher.alphabet[((cipherIdx % 26) + 26) % 26]
			})

		} catch (e) {
			console.warn(e)
			return Cipher.alphabet
		}

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

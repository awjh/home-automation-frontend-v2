const fractions = [
    { value: 1 / 8, symbol: '⅛', terminating: true },
    { value: 1 / 4, symbol: '¼', terminating: true },
    { value: 1 / 3, symbol: '⅓', terminating: false },
    { value: 3 / 8, symbol: '⅜', terminating: true },
    { value: 1 / 2, symbol: '½', terminating: true },
    { value: 5 / 8, symbol: '⅝', terminating: true },
    { value: 2 / 3, symbol: '⅔', terminating: false },
    { value: 3 / 4, symbol: '¾', terminating: true },
    { value: 7 / 8, symbol: '⅞', terminating: true },
]

function matchesFraction(decimals: string, fraction: (typeof fractions)[number]) {
    const remainder = Number(`0.${decimals}`)

    if (Math.abs(remainder - fraction.value) < 1e-9) {
        return true
    }

    // Recurring fractions (thirds) are stored cut short, so accept them rounded or truncated
    // to at least 2 decimal places e.g. 0.33, 0.333, 0.67, 0.666
    if (fraction.terminating || decimals.length < 2) {
        return false
    }

    const scale = 10 ** decimals.length
    const scaledRemainder = Math.round(remainder * scale)

    return (
        scaledRemainder === Math.round(fraction.value * scale) ||
        scaledRemainder === Math.floor(fraction.value * scale)
    )
}

// Renders quantities like 1.5 as 1½ and 0.333 as ⅓, leaving anything else as a plain number
export default function formatQuantity(quantity: number): string {
    const [whole, decimals] = `${quantity}`.split('.')

    if (!decimals) {
        return whole
    }

    const fraction = fractions.find((candidate) => matchesFraction(decimals, candidate))

    if (!fraction) {
        return `${quantity}`
    }

    return whole === '0' ? fraction.symbol : `${whole}${fraction.symbol}`
}

export interface QuantityParts {
    whole?: string
    fraction?: { numerator: number; denominator: number }
}

const fractions = [
    { numerator: 1, denominator: 8 },
    { numerator: 1, denominator: 4 },
    { numerator: 1, denominator: 3 },
    { numerator: 3, denominator: 8 },
    { numerator: 1, denominator: 2 },
    { numerator: 5, denominator: 8 },
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 7, denominator: 8 },
].map((fraction) => ({
    ...fraction,
    value: fraction.numerator / fraction.denominator,
    // Only thirds recur, everything else has an exact decimal
    terminating: fraction.denominator !== 3,
}))

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

// Splits quantities like 1.5 into 1 and 1/2 and 0.333 into 1/3, leaving anything else whole
export default function formatQuantity(quantity: number): QuantityParts {
    const [whole, decimals] = `${quantity}`.split('.')

    if (!decimals) {
        return { whole }
    }

    const fraction = fractions.find((candidate) => matchesFraction(decimals, candidate))

    if (!fraction) {
        return { whole: `${quantity}` }
    }

    return {
        whole: whole === '0' ? undefined : whole,
        fraction: { numerator: fraction.numerator, denominator: fraction.denominator },
    }
}

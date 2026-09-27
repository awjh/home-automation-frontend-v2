import { chakra } from '@chakra-ui/react'
import formatQuantity from '@utils/formatQuantity'

export interface QuantityProps {
    quantity: number
    measure?: string
}

// Fractions are drawn from plain digits rather than characters like ⅓, as the web fonts
// don't include those glyphs and the browser would fall back to a serif font
export default function Quantity({ quantity, measure }: QuantityProps) {
    const { whole, fraction } = formatQuantity(quantity)

    return (
        <chakra.span data-testid={'quantity'}>
            {whole}
            {fraction && (
                <chakra.span ml={whole ? '0.1em' : undefined} whiteSpace={'nowrap'}>
                    <chakra.sup fontSize={'0.7em'}>{fraction.numerator}</chakra.sup>/
                    <chakra.sub fontSize={'0.7em'}>{fraction.denominator}</chakra.sub>
                </chakra.span>
            )}
            {measure && ` ${measure}`}
        </chakra.span>
    )
}

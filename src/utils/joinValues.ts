export default function joinValues(
    firstPart: string | number,
    secondPart?: string,
    spaceChar: string = '',
) {
    return secondPart ? `${firstPart}${spaceChar} ${secondPart}` : firstPart
}

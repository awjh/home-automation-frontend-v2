export default function splitCamelCaseToWords(camelCaseString: string): string {
    return camelCaseString.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

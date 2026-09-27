import CamelRegex from '@cdk/constants/CamelRegex'

/**
 * Creates a name and ID for an AWS resource appending the suffix as required.
 * Ensures that all our names and IDs follow the same format and we are consitant
 * across our components
 * @param pascalCaseName The ID you want for the resource
 * @param suffix An optional suffix that will be appended to the ID and name
 * @returns Resource ID in PascalCase and name in kebab case
 */
export default function generateResourceIdAndName(
    pascalCaseName: string,
    suffix?: string,
): {
    resourceId: string
    resourceName: string
} {
    if (!CamelRegex.test(pascalCaseName)) {
        throw new Error(`Provided name is not pascal case: ${pascalCaseName}`)
    }

    let kebabCaseName = pascalCaseName.replace(/^[a-z]|[A-Z]/g, (selectedValue, index) => {
        return index === 0 ? selectedValue.toLowerCase() : `-${selectedValue.toLowerCase()}`
    })

    if (suffix) {
        kebabCaseName += `-${suffix}`
    }

    const resourceId =
        kebabCaseName.charAt(0).toUpperCase() +
        kebabCaseName.slice(1).replace(/-./g, (x) => x[1].toUpperCase())

    return {
        resourceName: kebabCaseName,
        resourceId,
    }
}

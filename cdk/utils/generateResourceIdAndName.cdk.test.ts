import generateResourceIdAndName from './generateResourceIdAndName'
import { describe, expect, it } from 'vitest'

describe('generateResourceIdAndName', () => {
    it('should error when the value passed is not pascal case (kebab case)', () => {
        const badFileName = 'not-pascal-case'

        expect(() => generateResourceIdAndName(badFileName)).toThrow(
            `Provided name is not pascal case: ${badFileName}`,
        )
    })

    it('should error when the value passed is not pascal case (camel case)', () => {
        const badFileName = 'notPascalCase'

        expect(() => generateResourceIdAndName(badFileName)).toThrow(
            `Provided name is not pascal case: ${badFileName}`,
        )
    })

    it('return the resource name and id when the name is passed with no suffix', () => {
        const { resourceId, resourceName } = generateResourceIdAndName('MyLambda')

        expect(resourceId).toEqual('MyLambda')
        expect(resourceName).toEqual('my-lambda')
    })

    it('return the resource name and id when the name is passed a suffix', () => {
        const { resourceId, resourceName } = generateResourceIdAndName('MyLambda', 'abc123')

        expect(resourceId).toEqual('MyLambdaAbc123')
        expect(resourceName).toEqual('my-lambda-abc123')
    })

    it('accepts sequential pascal case names with numeric suffixes', () => {
        expect(generateResourceIdAndName('HomeAutomationBackendStackV2').resourceId).toEqual(
            'HomeAutomationBackendStackV2',
        )
        expect(generateResourceIdAndName('HomeAutomationReadStoreV2').resourceId).toEqual(
            'HomeAutomationReadStoreV2',
        )
    })
})

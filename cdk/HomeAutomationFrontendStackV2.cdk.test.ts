import HomeAutomationFrontendStackV2 from '@cdk/HomeAutomationFrontendStackV2'
import Stage from '@cdk/defs/Stage'
import createTestHomeAutomationFrontendStackV2 from '@test/cdk/createTestHomeAutomationFrontendStackV2'
import { describe, expect, it } from 'vitest'

describe.each(Object.values(Stage).map((stage) => [stage]))(
    'HomeAutomationFrontendStackV2 (%s)',
    (stage: Stage) => {
        it('uses the stack ID without a suffix', () => {
            const { stack } = createTestHomeAutomationFrontendStackV2(stage)

            expect(stack.stackName).toEqual(HomeAutomationFrontendStackV2.StackId)
        })

        it('creates a single CloudFront distribution', () => {
            const { template } = createTestHomeAutomationFrontendStackV2(stage)

            template.resourceCountIs('AWS::CloudFront::Distribution', 1)
        })
    },
)

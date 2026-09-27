import HomeAutomationFrontendStackV2 from '@cdk/HomeAutomationFrontendStackV2'
import Stage from '@cdk/defs/Stage'
import { App } from 'aws-cdk-lib/core'
import { Template } from 'aws-cdk-lib/assertions'
import TestApiKey from './constants/TestApiKey'
import TestOpenNextPath from './constants/TestOpenNextPath'
import TestStytchProjectId from './constants/TestStytchProjectId'
import TestStytchSecret from './constants/TestStytchSecret'

export default function createTestHomeAutomationFrontendStackV2(stage: Stage, app = new App()) {
    const stack = new HomeAutomationFrontendStackV2(app, {
        apiKey: TestApiKey,
        env: { account: '123456789012', region: 'eu-west-1' },
        openNextPath: TestOpenNextPath,
        stage,
        stytchProjectId: TestStytchProjectId,
        stytchSecret: TestStytchSecret,
    })

    return {
        stack,
        template: Template.fromStack(stack),
    }
}

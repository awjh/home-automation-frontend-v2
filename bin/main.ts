import BinEnvVars from '@cdk/defs/BinEnvVars'
import Stage from '@cdk/defs/Stage'
import HomeAutomationFrontendStackV2, {
    HomeAutomationFrontendStackV2Props,
} from '@cdk/HomeAutomationFrontendStackV2'
import getEnvVar from '@cdk/utils/getEnvVar'
import { App } from 'aws-cdk-lib/core'
import { existsSync } from 'fs'
import path from 'path'

function main() {
    const suffix = getEnvVar<BinEnvVars>('STACK_SUFFIX', false)

    const app = new App()

    const stage = app.node.tryGetContext('stage')

    if (!stage) {
        throw new Error(
            'Stage is required. Pass it in via cdk context with the key "stage". For example: cdk deploy -c stage=prod',
        )
    }
    if (!Object.values(Stage).includes(stage)) {
        throw new Error(
            `Invalid stage: ${stage}. Valid stages are: ${Object.values(Stage).join(', ')}`,
        )
    }

    const stackProps = app.node.tryGetContext('stackProps')

    if (!stackProps) {
        throw new Error('Stack props are required. Pass them in via cdk.json')
    }

    if (!stackProps[stage]) {
        throw new Error(
            `Stack props for stage ${stage} are required. Make sure your cdk.json has a "stackProps" key with the appropriate stage configuration. For example: "stackProps": { "prod": { /* prod props */ } }`,
        )
    }

    const appConfig = stackProps[stage]

    const openNextPath = path.join(__dirname, '..', '.open-next')

    if (!existsSync(path.join(openNextPath, 'open-next.output.json'))) {
        throw new Error(
            `No OpenNext build found at ${openNextPath}. Run "yarn build:open-next" before synthesising.`,
        )
    }

    const explicitStackProps = {
        apiKey: getEnvVar<BinEnvVars>('API_KEY'),
        openNextPath,
        stage,
        stytchProjectId: getEnvVar<BinEnvVars>('STYTCH_PROJECT_ID'),
        stytchSecret: getEnvVar<BinEnvVars>('STYTCH_SECRET'),
        suffix,
    } satisfies HomeAutomationFrontendStackV2Props

    new HomeAutomationFrontendStackV2(app, {
        ...appConfig,
        ...explicitStackProps,
    })
}

main()

import ApiBaseUrls from '@cdk/constants/ApiBaseUrls'
import CertificateArns from '@cdk/constants/CertificateArns'
import DomainNames from '@cdk/constants/DomainNames'
import NextjsSite from '@cdk/constructs/NextjsSite'
import Stage from '@cdk/defs/Stage'
import generateResourceIdAndName from '@cdk/utils/generateResourceIdAndName'
import { Stack, StackProps } from 'aws-cdk-lib/core'
import { Construct } from 'constructs'

export interface HomeAutomationFrontendStackV2Props extends StackProps {
    apiKey: string
    openNextPath: string
    stage: Stage
    stytchProjectId: string
    stytchSecret: string
    suffix?: string
}

export default class HomeAutomationFrontendStackV2 extends Stack {
    public static readonly StackId = 'HomeAutomationFrontendStackV2'

    constructor(scope: Construct, props: HomeAutomationFrontendStackV2Props) {
        const { resourceId: stackId } = generateResourceIdAndName(
            HomeAutomationFrontendStackV2.StackId,
            props.suffix,
        )

        super(scope, stackId, props)

        new NextjsSite(this, {
            openNextPath: props.openNextPath,
            domainName: DomainNames[props.stage],
            certificateArn: CertificateArns[props.stage],
            environment: {
                API_BASE_URL: ApiBaseUrls[props.stage],
                API_KEY: props.apiKey,
                STYTCH_PROJECT_ID: props.stytchProjectId,
                STYTCH_SECRET: props.stytchSecret,
            },
            stage: props.stage,
            suffix: props.suffix,
        })
    }
}

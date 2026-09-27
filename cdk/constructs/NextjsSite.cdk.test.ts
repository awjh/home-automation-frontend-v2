import ApiBaseUrls from '@cdk/constants/ApiBaseUrls'
import CertificateArns from '@cdk/constants/CertificateArns'
import DomainNames from '@cdk/constants/DomainNames'
import NextjsSite from '@cdk/constructs/NextjsSite'
import Stage from '@cdk/defs/Stage'
import generateResourceIdAndName from '@cdk/utils/generateResourceIdAndName'
import createTestHomeAutomationFrontendStackV2 from '@test/cdk/createTestHomeAutomationFrontendStackV2'
import TestApiKey from '@test/cdk/constants/TestApiKey'
import TestStytchProjectId from '@test/cdk/constants/TestStytchProjectId'
import TestStytchSecret from '@test/cdk/constants/TestStytchSecret'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { beforeAll, describe, expect, it } from 'vitest'

describe.each(Object.values(Stage).map((stage) => [stage]))('NextjsSite (%s)', (stage: Stage) => {
    let template: Template

    const { resourceName: bucketName } = generateResourceIdAndName(NextjsSite.AssetsBucketId)
    const { resourceName: serverLambdaName } = generateResourceIdAndName(NextjsSite.ServerLambdaId)
    const { resourceName: serverLambdaLogsName } = generateResourceIdAndName(
        NextjsSite.ServerLambdaLogsId,
    )
    const { resourceName: imageLambdaName } = generateResourceIdAndName(
        NextjsSite.ImageOptimizationLambdaId,
    )
    const { resourceName: imageLambdaLogsName } = generateResourceIdAndName(
        NextjsSite.ImageOptimizationLambdaLogsId,
    )
    const { resourceName: serverCachePolicyName } = generateResourceIdAndName(
        NextjsSite.ServerCachePolicyId,
    )

    beforeAll(() => {
        template = createTestHomeAutomationFrontendStackV2(stage).template
    })

    it('creates a private assets bucket', () => {
        template.hasResourceProperties('AWS::S3::Bucket', {
            BucketName: bucketName,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: true,
                BlockPublicPolicy: true,
                IgnorePublicAcls: true,
                RestrictPublicBuckets: true,
            },
        })
    })

    it('creates the server lambda with app and cache env vars', () => {
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            LogGroupName: serverLambdaLogsName,
            RetentionInDays: 14,
        })

        template.hasResourceProperties('AWS::Lambda::Function', {
            FunctionName: serverLambdaName,
            Runtime: 'nodejs24.x',
            Handler: 'index.handler',
            Architectures: ['arm64'],
            Environment: {
                Variables: {
                    API_BASE_URL: ApiBaseUrls[stage],
                    API_KEY: TestApiKey,
                    STYTCH_PROJECT_ID: TestStytchProjectId,
                    STYTCH_SECRET: TestStytchSecret,
                    CACHE_BUCKET_NAME: Match.anyValue(),
                    CACHE_BUCKET_KEY_PREFIX: '_cache',
                    CACHE_BUCKET_REGION: 'eu-west-1',
                },
            },
        })
    })

    it('creates the image optimization lambda reading from the assets prefix', () => {
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            LogGroupName: imageLambdaLogsName,
            RetentionInDays: 14,
        })

        template.hasResourceProperties('AWS::Lambda::Function', {
            FunctionName: imageLambdaName,
            Runtime: 'nodejs24.x',
            Architectures: ['arm64'],
            Environment: {
                Variables: {
                    BUCKET_NAME: Match.anyValue(),
                    BUCKET_KEY_PREFIX: '_assets',
                },
            },
        })
    })

    it('exposes both lambdas via public function URLs', () => {
        template.resourcePropertiesCountIs(
            'AWS::Lambda::Url',
            { AuthType: 'NONE', InvokeMode: Match.absent() },
            2,
        )
    })

    it('includes Next.js routing headers and all cookies in the server cache key', () => {
        template.hasResourceProperties('AWS::CloudFront::CachePolicy', {
            CachePolicyConfig: {
                Name: serverCachePolicyName,
                DefaultTTL: 0,
                ParametersInCacheKeyAndForwardedToOrigin: {
                    CookiesConfig: { CookieBehavior: 'all' },
                    QueryStringsConfig: { QueryStringBehavior: 'all' },
                    HeadersConfig: {
                        HeaderBehavior: 'whitelist',
                        Headers: Match.arrayWith(['rsc', 'next-router-state-tree', 'next-url']),
                    },
                },
            },
        })
    })

    it('forwards the viewer host to the lambdas', () => {
        template.hasResourceProperties('AWS::CloudFront::Function', {
            FunctionCode: Match.stringLikeRegexp("headers\\['x-forwarded-host'\\]"),
        })
    })

    it('serves the site on the custom domain with the us-east-1 certificate', () => {
        template.hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Aliases: [DomainNames[stage]],
                ViewerCertificate: {
                    AcmCertificateArn: CertificateArns[stage],
                    SslSupportMethod: 'sni-only',
                },
                DefaultCacheBehavior: {
                    AllowedMethods: Match.arrayWith(['POST']),
                    ViewerProtocolPolicy: 'redirect-to-https',
                },
            },
        })

        expect(CertificateArns[stage]).toMatch(/^arn:aws:acm:us-east-1:/)
    })

    it('routes behaviours from the OpenNext manifest in order', () => {
        const [distribution] = Object.values(
            template.findResources('AWS::CloudFront::Distribution'),
        )

        const patterns = distribution.Properties.DistributionConfig.CacheBehaviors.map(
            ({ PathPattern }: { PathPattern: string }) => PathPattern,
        )

        expect(patterns).toEqual([
            '_next/image*',
            '_next/data/*',
            'BUILD_ID',
            '_next/*',
            'favicon.ico',
        ])
    })

    it('uploads hashed assets as immutable and invalidates the distribution on deploy', () => {
        template.hasResourceProperties('Custom::CDKBucketDeployment', {
            DestinationBucketKeyPrefix: '_assets/_next',
            Prune: false,
            SystemMetadata: { 'cache-control': 'public,max-age=31536000,immutable' },
        })

        template.hasResourceProperties('Custom::CDKBucketDeployment', {
            DestinationBucketKeyPrefix: '_cache',
        })

        template.hasResourceProperties('Custom::CDKBucketDeployment', {
            DestinationBucketKeyPrefix: '_assets',
            DistributionId: Match.anyValue(),
            DistributionPaths: ['/*'],
        })
    })

    it('outputs the distribution domain for the CNAME record', () => {
        template.hasOutput('*', {
            Description: `CNAME target for ${DomainNames[stage]}`,
        })
    })
})

import Stage from '@cdk/defs/Stage'
import OpenNextOutput from '@cdk/defs/OpenNextOutput'
import ServerFunctionEnvVars from '@cdk/defs/ServerFunctionEnvVars'
import generateResourceIdAndName from '@cdk/utils/generateResourceIdAndName'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import {
    AllowedMethods,
    BehaviorOptions,
    CacheCookieBehavior,
    CacheHeaderBehavior,
    CachePolicy,
    CacheQueryStringBehavior,
    Distribution,
    Function as CloudFrontFunction,
    FunctionCode,
    FunctionEventType,
    FunctionRuntime,
    HttpVersion,
    OriginRequestPolicy,
    PriceClass,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { FunctionUrlOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Architecture, Code, Function, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import { readFileSync } from 'fs'
import path from 'path'

export interface NextjsSiteProps {
    /** Absolute path to the .open-next directory produced by `open-next build` */
    openNextPath: string
    domainName: string
    certificateArn: string
    environment: ServerFunctionEnvVars
    stage: Stage
    suffix?: string
}

// Headers Next.js varies its responses on (RSC payloads, prefetches, server actions)
const NextCacheKeyHeaders = [
    'accept',
    'rsc',
    'next-router-prefetch',
    'next-router-state-tree',
    'next-url',
    'x-prerender-revalidate',
]

// Lambda function URLs reject requests whose Host header isn't their own, so the viewer host is
// forwarded separately. OpenNext uses it to rebuild request URLs (redirects, server action origin checks)
const ForwardHostFunctionCode = `function handler(event) {
    var request = event.request;
    request.headers['x-forwarded-host'] = request.headers.host;
    return request;
}`

export default class NextjsSite extends Construct {
    public static readonly ConstructId = 'NextjsSite'

    public static readonly AssetsBucketId = 'HomeAutomationFrontendV2Assets'

    public static readonly ServerLambdaId = 'HomeAutomationFrontendV2Server'

    public static readonly ServerLambdaLogsId = `${NextjsSite.ServerLambdaId}Logs`

    public static readonly ImageOptimizationLambdaId = 'HomeAutomationFrontendV2ImageOptimization'

    public static readonly ImageOptimizationLambdaLogsId = `${NextjsSite.ImageOptimizationLambdaId}Logs`

    public static readonly ForwardHostFunctionId = 'HomeAutomationFrontendV2ForwardHost'

    public static readonly ServerCachePolicyId = 'HomeAutomationFrontendV2ServerCachePolicy'

    public static readonly ImageCachePolicyId = 'HomeAutomationFrontendV2ImageCachePolicy'

    public static readonly CertificateId = 'HomeAutomationFrontendV2Certificate'

    public static readonly DistributionId = 'HomeAutomationFrontendV2Distribution'

    public static readonly StaticAssetsDeploymentId =
        'HomeAutomationFrontendV2StaticAssetsDeployment'

    public static readonly VersionedAssetsDeploymentId =
        'HomeAutomationFrontendV2VersionedAssetsDeployment'

    public static readonly CacheDeploymentId = 'HomeAutomationFrontendV2CacheDeployment'

    public static readonly DistributionDomainNameOutput =
        'HomeAutomationFrontendV2DistributionDomainNameOutput'

    public static readonly DistributionIdOutput = 'HomeAutomationFrontendV2DistributionIdOutput'

    public readonly distribution: Distribution

    constructor(scope: Construct, props: NextjsSiteProps) {
        super(scope, NextjsSite.ConstructId)

        const output: OpenNextOutput = JSON.parse(
            readFileSync(path.join(props.openNextPath, 'open-next.output.json'), 'utf8'),
        )

        // Manifest paths are relative to the project root (e.g. ".open-next/assets")
        const resolveOutputPath = (outputPath: string) =>
            path.join(props.openNextPath, path.relative('.open-next', outputPath))

        const { resourceId: bucketId, resourceName: bucketName } = generateResourceIdAndName(
            NextjsSite.AssetsBucketId,
            props.suffix,
        )

        const bucket = new Bucket(this, bucketId, {
            bucketName,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            encryption: BucketEncryption.S3_MANAGED,
            enforceSSL: true,
            // Contents are fully reproducible from a build
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        })

        const cacheCopy = output.origins.s3.copy.find(({ cached }) => !cached)!
        const assetsCopy = output.origins.s3.copy.find(({ cached }) => cached)!

        const serverFunction = this.createFunction(
            NextjsSite.ServerLambdaId,
            NextjsSite.ServerLambdaLogsId,
            resolveOutputPath(output.origins.default.bundle),
            output.origins.default.handler,
            {
                ...props.environment,
                CACHE_BUCKET_NAME: bucket.bucketName,
                CACHE_BUCKET_KEY_PREFIX: cacheCopy.to,
                CACHE_BUCKET_REGION: bucket.stack.region,
            },
            props,
        )

        bucket.grantReadWrite(serverFunction)

        const imageOptimizationFunction = this.createFunction(
            NextjsSite.ImageOptimizationLambdaId,
            NextjsSite.ImageOptimizationLambdaLogsId,
            resolveOutputPath(output.origins.imageOptimizer.bundle),
            output.origins.imageOptimizer.handler,
            {
                BUCKET_NAME: bucket.bucketName,
                BUCKET_KEY_PREFIX: output.origins.s3.originPath,
            },
            props,
        )

        bucket.grantRead(imageOptimizationFunction)

        const { resourceId: forwardHostFunctionId, resourceName: forwardHostFunctionName } =
            generateResourceIdAndName(NextjsSite.ForwardHostFunctionId, props.suffix)

        const forwardHostFunction = new CloudFrontFunction(this, forwardHostFunctionId, {
            functionName: forwardHostFunctionName,
            runtime: FunctionRuntime.JS_2_0,
            code: FunctionCode.fromInline(ForwardHostFunctionCode),
        })

        const functionAssociations = [
            {
                function: forwardHostFunction,
                eventType: FunctionEventType.VIEWER_REQUEST,
            },
        ]

        const { resourceId: serverCachePolicyId, resourceName: serverCachePolicyName } =
            generateResourceIdAndName(NextjsSite.ServerCachePolicyId, props.suffix)

        // Only responses Next.js marks cacheable (e.g. prerendered pages) are held at the edge
        const serverCachePolicy = new CachePolicy(this, serverCachePolicyId, {
            cachePolicyName: serverCachePolicyName,
            defaultTtl: Duration.seconds(0),
            minTtl: Duration.seconds(0),
            maxTtl: Duration.days(365),
            headerBehavior: CacheHeaderBehavior.allowList(...NextCacheKeyHeaders),
            cookieBehavior: CacheCookieBehavior.all(),
            queryStringBehavior: CacheQueryStringBehavior.all(),
            enableAcceptEncodingGzip: true,
            enableAcceptEncodingBrotli: true,
        })

        const { resourceId: imageCachePolicyId, resourceName: imageCachePolicyName } =
            generateResourceIdAndName(NextjsSite.ImageCachePolicyId, props.suffix)

        const imageCachePolicy = new CachePolicy(this, imageCachePolicyId, {
            cachePolicyName: imageCachePolicyName,
            defaultTtl: Duration.days(1),
            minTtl: Duration.seconds(0),
            maxTtl: Duration.days(365),
            headerBehavior: CacheHeaderBehavior.allowList('accept'),
            cookieBehavior: CacheCookieBehavior.none(),
            queryStringBehavior: CacheQueryStringBehavior.all(),
        })

        const serverBehavior: BehaviorOptions = {
            origin: new FunctionUrlOrigin(
                serverFunction.addFunctionUrl({ authType: FunctionUrlAuthType.NONE }),
            ),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachePolicy: serverCachePolicy,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
            compress: true,
            functionAssociations,
        }

        const imageBehavior: BehaviorOptions = {
            origin: new FunctionUrlOrigin(
                imageOptimizationFunction.addFunctionUrl({ authType: FunctionUrlAuthType.NONE }),
            ),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachePolicy: imageCachePolicy,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
            functionAssociations,
        }

        const staticBehavior: BehaviorOptions = {
            origin: S3BucketOrigin.withOriginAccessControl(bucket, {
                originPath: `/${output.origins.s3.originPath}`,
            }),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachePolicy: CachePolicy.CACHING_OPTIMIZED,
            compress: true,
        }

        const behaviorsByOrigin: Record<
            OpenNextOutput['behaviors'][number]['origin'],
            BehaviorOptions
        > = {
            default: serverBehavior,
            imageOptimizer: imageBehavior,
            s3: staticBehavior,
        }

        const additionalBehaviors = Object.fromEntries(
            output.behaviors
                .filter(({ pattern }) => pattern !== '*')
                .map(({ pattern, origin }) => [pattern, behaviorsByOrigin[origin]]),
        )

        const { resourceId: distributionId } = generateResourceIdAndName(
            NextjsSite.DistributionId,
            props.suffix,
        )

        this.distribution = new Distribution(this, distributionId, {
            comment: `Home automation frontend v2 (${props.stage})`,
            domainNames: [props.domainName],
            certificate: Certificate.fromCertificateArn(
                this,
                NextjsSite.CertificateId,
                props.certificateArn,
            ),
            priceClass: PriceClass.PRICE_CLASS_100,
            httpVersion: HttpVersion.HTTP2_AND_3,
            defaultBehavior: serverBehavior,
            additionalBehaviors,
        })

        const assetsPath = resolveOutputPath(assetsCopy.from)
        const versionedSubDir = assetsCopy.versionedSubDir!

        // Hashed build output never changes for a given key so browsers can cache it forever
        new BucketDeployment(this, NextjsSite.VersionedAssetsDeploymentId, {
            destinationBucket: bucket,
            destinationKeyPrefix: `${assetsCopy.to}/${versionedSubDir}`,
            sources: [Source.asset(path.join(assetsPath, versionedSubDir))],
            cacheControl: [CacheControl.fromString('public,max-age=31536000,immutable')],
            // Keep previous builds' chunks for clients still running an older version
            prune: false,
        })

        new BucketDeployment(this, NextjsSite.CacheDeploymentId, {
            destinationBucket: bucket,
            destinationKeyPrefix: cacheCopy.to,
            sources: [Source.asset(resolveOutputPath(cacheCopy.from))],
        })

        const staticAssetsDeployment = new BucketDeployment(
            this,
            NextjsSite.StaticAssetsDeploymentId,
            {
                destinationBucket: bucket,
                destinationKeyPrefix: assetsCopy.to,
                sources: [Source.asset(assetsPath, { exclude: [`${versionedSubDir}/*`] })],
                cacheControl: [
                    CacheControl.fromString('public,max-age=0,s-maxage=31536000,must-revalidate'),
                ],
                prune: false,
                // Clear edge-cached pages and public files once the new server code is live
                distribution: this.distribution,
                distributionPaths: ['/*'],
            },
        )

        staticAssetsDeployment.node.addDependency(serverFunction)

        new CfnOutput(this, NextjsSite.DistributionDomainNameOutput, {
            value: this.distribution.distributionDomainName,
            description: `CNAME target for ${props.domainName}`,
        })

        new CfnOutput(this, NextjsSite.DistributionIdOutput, {
            value: this.distribution.distributionId,
        })
    }

    private createFunction(
        pascalCaseId: string,
        pascalCaseLogsId: string,
        bundlePath: string,
        handler: string,
        environment: Record<string, string>,
        props: NextjsSiteProps,
    ) {
        const { resourceId: logsId, resourceName: logsName } = generateResourceIdAndName(
            pascalCaseLogsId,
            props.suffix,
        )

        const logGroup = new LogGroup(this, logsId, {
            logGroupName: logsName,
            retention: RetentionDays.TWO_WEEKS,
            removalPolicy: RemovalPolicy.DESTROY,
        })

        const { resourceId: lambdaId, resourceName: lambdaName } = generateResourceIdAndName(
            pascalCaseId,
            props.suffix,
        )

        return new Function(this, lambdaId, {
            functionName: lambdaName,
            // Next copies local .env files into the bundle; runtime config comes from `environment`
            code: Code.fromAsset(bundlePath, { exclude: ['.env*'] }),
            handler,
            // OpenNext bundles sharp for linux arm64
            architecture: Architecture.ARM_64,
            runtime: Runtime.NODEJS_24_X,
            memorySize: 1024,
            timeout: Duration.seconds(30),
            logGroup,
            environment,
        })
    }
}
